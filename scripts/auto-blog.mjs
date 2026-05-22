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
import { collectExistingSourceUrls, countGeneratedToday, loadSeen, saveSeen, todayIso } from './lib/content-history.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRACKER_PATH = path.join(__dirname, 'seen-articles.json')

async function main() {
  console.log('Auto-blog pipeline starting...')

  if (countGeneratedToday('blog') >= 1) {
    console.log('Blog daily quota reached (1 post). Exiting cleanly.')
    process.exit(0)
  }

  // 1. Fetch all RSS feeds from the last 24 hours.
  const articles = await fetchAllArticles()
  console.log(`Fetched ${articles.length} recent articles from feeds`)

  // 2. Skip already-processed articles across both Blog and News.
  const seen = loadSeen(TRACKER_PATH)
  const existingSources = collectExistingSourceUrls()
  const unseen = articles.filter(a => !seen.includes(a.url) && !existingSources.has(a.url))
  if (unseen.length === 0) {
    console.log('No new articles found. Exiting cleanly.')
    process.exit(0)
  }
  const article = unseen[0]
  console.log(`Picked: "${article.title}" from ${article.source}`)

  // 3. Generate bilingual content via Groq (one retry on failure).
  let post
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      post = await generatePost(article)
      console.log(`Groq generated: "${post.titleEn}"`)
      break
    } catch (err) {
      console.error(`Groq attempt ${attempt} failed: ${err.message}`)
      if (attempt === 2) process.exit(1)
    }
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
  const imageFile = await fetchImage(post.keywords, slug)

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
