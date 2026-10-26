import { createHash } from 'node:crypto'
import { fetchAllArticles } from './rss.mjs'
import { isAllowedRegionalArticle } from './content-quality.mjs'

const DAY = 86400000
export const HERO_FEEDS = [
  { url: 'https://www.hospitalitynet.org/rss/news.xml', source: 'Hospitality Net' },
  { url: 'https://www.hoteltechnologynews.com/feed/', source: 'Hotel Technology News' },
  { url: 'https://rhisac.org/feed/', source: 'Retail & Hospitality ISAC' },
]
const TOPICS = [
  ['CYBERSECURITY', /\b(cyber\w*|ransomware|phishing|data breach|data privacy|data protection|ciso|pci dss|zero trust|certificate|revocation|compromise|vulnerabilit\w*|malware)\b/i],
  ['AI', /\b(ai|artificial intelligence|machine learning|agentic|chatbot\w*|robot\w*)\b/i],
  ['HOTEL OPERATIONS', /\b(pms|pos|property management system|cloudbeds|mews|check.in|guest messaging|housekeeping|front desk|payment\w*|phone dock|guest tablet|smart hotel)\b/i],
  ['HOSPITALITY TECHNOLOGY', /\b(technolog\w*|hotel tech|software|digital|automation|integration\w*|iot|mobile key|connectivity)\b/i],
]

// Topic-specific editorial photographs, never random branding banners.
export const TOPIC_IMAGES = {
  CYBERSECURITY: ['hero-cybersecurity', 'hotel-data-privacy-strategy'],
  AI: ['hero-ai-orchestration', 'auto-ai-powered-front-desk', 'ai-in-guest-experience'],
  'HOTEL OPERATIONS': ['hero-hotel-operations', 'contactless-checkin-standard', 'smart-room-technology-2026'],
  'HOSPITALITY TECHNOLOGY': ['hospitality-tech-funding-2026', 'hotel-tech-investment-2026'],
}

export function classifyHeroTopic(text) {
  return TOPICS.find(([, pattern]) => pattern.test(text))?.[0] ?? null
}

export function canonicalUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    url.hash = ''
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key)
    }
    return url.href.replace(/\/$/, '')
  } catch { return null }
}

function words(title) {
  return new Set(title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(word => word.length > 3))
}

export function similarStory(a, b) {
  const left = words(a)
  const right = words(b)
  const overlap = [...left].filter(word => right.has(word)).length
  return overlap / Math.max(1, Math.min(left.size, right.size)) >= 0.8
}

/** Select genuinely recent stories; reserve space for each available technology topic. */
export function selectHeroArticles(articles, now = new Date()) {
  const unique = []
  const urls = new Set()
  for (const article of [...articles].sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate))) {
    const date = +new Date(article.pubDate)
    const url = canonicalUrl(article.url)
    const topic = article.source === 'Retail & Hospitality ISAC' ? 'CYBERSECURITY' : classifyHeroTopic(`${article.title} ${article.excerpt || ''}`)
    if (!isAllowedRegionalArticle(article)) continue
    // Multi-story roundups obscure the technology subject in a one-line headline.
    if (article.title.length > 130) continue
    if (!url || !topic || !Number.isFinite(date) || date > +now || date < +now - 7 * DAY) continue
    if (!/\b(hotel\w*|hospitality|resort\w*|lodging|hotelier\w*)\b/i.test(`${article.title} ${article.excerpt || ''} ${article.source || ''}`)) continue
    if (urls.has(url) || unique.some(item => similarStory(item.title, article.title))) continue
    urls.add(url)
    unique.push({ ...article, url, topic })
  }
  const selected = TOPICS.flatMap(([topic]) => unique.find(item => item.topic === topic) || [])
  for (const item of unique) {
    if (selected.length >= 8) break
    if (!selected.includes(item)) selected.push(item)
  }
  return selected.sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate))
}

export function toHeroItems(articles) {
  const usedImages = new Set()
  return articles.flatMap(article => {
    // Prefer a publisher-supplied image; otherwise use a distinct topical editorial photo.
    const supplied = canonicalUrl(article.image || '')
    const contextual = /check.in|guest journey|front desk|guest messaging/i.test(article.title) ? '/images/content/hero-hotel-operations.jpg' : null
    const choices = [supplied, contextual, ...(TOPIC_IMAGES[article.topic] || []).map(name => `/images/content/${name}.jpg`)].filter(Boolean)
    const image = choices.find(candidate => !usedImages.has(candidate.split('?')[0]))
    if (!image) return []
    usedImages.add(image.split('?')[0])
    return [{
      type: /** @type {const} */ ('news'),
      slug: createHash('sha256').update(article.url).digest('hex').slice(0, 16),
      title: article.title, category: article.topic, date: new Date(article.pubDate).toISOString(),
      excerpt: article.excerpt,
      author: article.source, authorAvatar: '/images/Logo.png', image,
      imageAlt: `${article.topic.toLowerCase()} — editorial illustration`,
      featured: false, readTime: 'Read at source', href: article.url, rss: true,
    }]
  })
}

export async function loadDailyHero(now = new Date()) {
  const articles = await fetchAllArticles({ maxAgeHours: 168, feeds: HERO_FEEDS })
  return { updatedAt: now.toISOString(), items: toHeroItems(selectHeroArticles(articles, now)) }
}

export function secondsUntilTomorrow(now = new Date()) {
  return Math.max(1, Math.ceil((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - +now) / 1000))
}
