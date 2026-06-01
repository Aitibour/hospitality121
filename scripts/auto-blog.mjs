import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchAllArticles } from './lib/rss.mjs'
import { generatePost } from './lib/groq.mjs'
import { fetchImage } from './lib/unsplash.mjs'
import { calcReadTime, generateSlug, renderMdx } from './lib/mdx.mjs'
import { commitAndPush, pingIndexNow } from './lib/publish.mjs'
import { publishToLinkedIn } from './lib/linkedin.mjs'
import { buildSeoLinks } from './lib/seo-links.mjs'
import { collectExistingKeywordSets, collectExistingSourceUrls, collectExistingTitles, countGeneratedToday, loadSeen, saveSeen, todayIso } from './lib/content-history.mjs'
import { isHospitalitySource, validateHumanizedPost } from './lib/content-quality.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRACKER_PATH = path.join(__dirname, 'seen-articles.json')
const DAILY_BLOG_LIMIT = 1
const EDITORIAL_FORMATS = [
  'articles-and-editorials',
  'hospitality-news-analysis',
  'events-and-conferences',
  'podcast-style-insight',
  'executive-interview-angle',
  'leadership',
  'hotel-operations',
  'recruitment-and-workforce',
  'guest-experience',
  'luxury-hospitality',
  'sustainability',
  'hospitality-technology',
]

async function main() {
  console.log('Auto-blog pipeline starting...')

  if (countGeneratedToday('blog') >= DAILY_BLOG_LIMIT) {
    console.log(`Blog daily quota reached (${DAILY_BLOG_LIMIT} posts). Exiting cleanly.`)
    process.exit(0)
  }

  // 1. Fetch all RSS feeds from the last 24 hours.
  const articles = await fetchAllArticles()
  console.log(`Fetched ${articles.length} recent articles from feeds`)

  // 2. Skip already-processed articles across both Blog and News.
  const seen = loadSeen(TRACKER_PATH)
  const existingSources = collectExistingSourceUrls()
  const unseen = articles
    .filter(a => !seen.includes(a.url) && !existingSources.has(a.url))
    .filter(isHospitalitySource)

  if (unseen.length === 0) {
    console.log('No new hospitality articles found. Exiting cleanly.')
    process.exit(0)
  }

  const existingTitles = collectExistingTitles()
  const existingKeywordSets = collectExistingKeywordSets()
  const targetFormat = EDITORIAL_FORMATS[(new Date().getHours() + countGeneratedToday('blog')) % EDITORIAL_FORMATS.length]
  let post
  let article

  const shuffled = unseen.sort(() => Math.random() - 0.5)
  for (const candidate of shuffled.slice(0, 8)) {
    console.log(`Evaluating: "${candidate.title}" from ${candidate.source}`)

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        post = await generatePost(candidate, { existingTitles, existingKeywordSets, targetFormat })
        const issues = validateHumanizedPost(post, existingTitles, existingKeywordSets)
        if (issues.length > 0) {
          throw new Error(`quality gate failed: ${issues.join('; ')}`)
        }
        article = candidate
        console.log(`Groq generated: "${post.titleEn}"`)
        break
      } catch (err) {
        console.error(`Groq attempt ${attempt} failed: ${err.message}`)
        if (attempt === 2) seen.push(candidate.url)
      }
    }

    if (post && article) break
  }

  if (!post || !article) {
    saveSeen(TRACKER_PATH, seen)
    console.log('No article passed uniqueness and quality gates. Exiting cleanly.')
    process.exit(0)
  }

  // 4. Sanitize slug from Groq output, check for collision.
  let slug = post.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '') || generateSlug(post.titleEn)

  if (fs.existsSync(path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`))) {
    slug = `${slug}-${Date.now()}`
  }

  // 5. Download hero image.
  const imageFile = await fetchImage([post.imageConcept, post.primaryKeyword, ...post.keywords], slug)

  // 6. Render and write MDX file.
  const mdxContent = renderMdx({
    titleEn: post.titleEn,
    titleFr: post.titleFr,
    excerptEn: post.excerptEn.slice(0, 155),
    excerptFr: post.excerptFr.slice(0, 155),
    category: post.category,
    date: todayIso(),
    readTime: calcReadTime(post.bodyEn),
    imageFile,
    sourceDomain: article.source,
    sourceUrl: article.url,
    bodyEn: post.bodyEn,
    bodyFr: post.bodyFr,
    primaryKeyword: post.primaryKeyword,
    keywords: post.keywords,
    imageConcept: post.imageConcept,
    editorialFormat: post.editorialFormat || targetFormat,
    linkedinCaption: post.linkedinCaption,
    facebookCaption: post.facebookCaption,
    xCaption: post.xCaption,
    newsletterTeaser: post.newsletterTeaser,
    seoLinks: buildSeoLinks({
      contentType: 'blog',
      title: post.titleEn,
      category: post.category,
      keywords: post.keywords,
    }),
  })

  fs.writeFileSync(
    path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`),
    mdxContent
  )
  console.log(`MDX written: content/blog/${slug}.mdx`)

  // 7. Mark article as seen.
  seen.push(article.url)
  saveSeen(TRACKER_PATH, seen)

  // 8. Commit and push, which triggers Netlify auto-deploy.
  commitAndPush({ slug, imageFile, contentType: 'blog' })

  // 9. Ping IndexNow (non-fatal).
  await pingIndexNow(slug)

  // 10. Publish to LinkedIn company page (non-fatal).
  await publishToLinkedIn({
    slug,
    titleEn: post.titleEn,
    excerptEn: post.excerptEn,
    category: post.category,
    imageFile,
    contentType: 'blog',
  })

  console.log(`Done! Post live at /blog/${slug}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
