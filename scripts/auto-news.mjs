import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchAllArticles } from './lib/rss.mjs'
import { generateNewsItem } from './lib/groq.mjs'
import { fetchImage } from './lib/unsplash.mjs'
import { calcReadTime, generateSlug, renderNewsMdx } from './lib/mdx.mjs'
import { commitAndPush, pingIndexNow } from './lib/publish.mjs'
import { publishToLinkedIn } from './lib/linkedin.mjs'
import { buildSeoLinks } from './lib/seo-links.mjs'
import { collectExistingSourceUrls, countGeneratedToday, loadSeen, saveSeen, todayIso } from './lib/content-history.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRACKER_PATH = path.join(__dirname, 'seen-articles.json')
const DAILY_LIMIT = 2

async function main() {
  console.log('Auto-news pipeline starting...')

  if (countGeneratedToday('news') >= DAILY_LIMIT) {
    console.log(`News daily quota reached (${DAILY_LIMIT} posts). Exiting cleanly.`)
    process.exit(0)
  }

  const articles = await fetchAllArticles()
  console.log(`Fetched ${articles.length} recent articles from feeds`)

  const seen = loadSeen(TRACKER_PATH)
  const existingSources = collectExistingSourceUrls()
  const unseen = articles.filter(article => !seen.includes(article.url) && !existingSources.has(article.url))
  if (unseen.length === 0) {
    console.log('No new news articles found. Exiting cleanly.')
    process.exit(0)
  }

  const article = unseen[0]
  console.log(`Picked: "${article.title}" from ${article.source}`)

  let post
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      post = await generateNewsItem(article)
      console.log(`Groq generated: "${post.title}"`)
      break
    } catch (err) {
      console.error(`Groq attempt ${attempt} failed: ${err.message}`)
      if (attempt === 2) process.exit(1)
    }
  }

  let slug = post.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '') || generateSlug(post.title)

  if (fs.existsSync(path.join(process.cwd(), 'content', 'news', `${slug}.mdx`))) {
    slug = `${slug}-${Date.now()}`
  }

  const imageFile = await fetchImage(post.keywords, slug)
  const mdxContent = renderNewsMdx({
    title: post.title,
    description: post.description.slice(0, 155),
    category: post.category,
    date: todayIso(),
    readTime: calcReadTime(post.body),
    imageFile,
    sourceDomain: article.source,
    sourceUrl: article.url,
    body: post.body,
    seoLinks: buildSeoLinks({
      contentType: 'news',
      title: post.title,
      category: post.category,
      keywords: post.keywords,
    }),
  })

  fs.writeFileSync(
    path.join(process.cwd(), 'content', 'news', `${slug}.mdx`),
    mdxContent
  )
  console.log(`MDX written: content/news/${slug}.mdx`)

  seen.push(article.url)
  saveSeen(TRACKER_PATH, seen)

  commitAndPush({ slug, imageFile, contentType: 'news' })
  await pingIndexNow(slug)

  // Publish to LinkedIn company page (non-fatal).
  await publishToLinkedIn({
    slug,
    titleEn: post.title,
    excerptEn: post.description,
    category: post.category,
    imageFile,
    contentType: 'news',
  })

  console.log(`Done! News item live at /news/${slug}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
