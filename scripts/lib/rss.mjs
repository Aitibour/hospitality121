export const TOP_HOTEL_BRANDS = [
  'Marriott International',
  'Hilton',
  'Hyatt',
  'IHG Hotels & Resorts',
  'Wyndham Hotels & Resorts',
  'Choice Hotels',
  'Accor',
  'Radisson Hotels',
  'Best Western / BWH Hotels',
  'Four Seasons',
  'Mandarin Oriental',
  'Rosewood Hotels & Resorts',
  'Kempinski',
  'Minor Hotels',
  'Melia Hotels International',
  'NH Hotels',
  'Scandic Hotels',
  'Louvre Hotels Group',
  'citizenM',
  'Motel One',
]

const INDUSTRY_FEEDS = [
  { url: 'https://hotelmanagement.net/feed', source: 'hotelmanagement.net' },
  { url: 'https://www.hospitalitynet.org/rss/news.xml', source: 'hospitalitynet.org' },
  { url: 'https://skift.com/feed/', source: 'skift.com' },
]

const HOTEL_BRAND_FEEDS = [
  {
    url: 'https://marriott.gcs-web.com/rss/news-releases.xml',
    source: 'Marriott International',
  },
  {
    url: 'https://news.hiltonworldwide.com/index.cfm/newsroom/rss/topic/731',
    source: 'Hilton',
  },
  {
    url: 'https://newsroom.hyatt.com/news-releases?pagetemplate=rss',
    source: 'Hyatt',
  },
  {
    url: 'https://www.ihgplc.com/en/rss/rss-news/corporate-and-financial-news',
    source: 'IHG Hotels & Resorts',
  },
  {
    url: 'https://corporate.wyndhamhotels.com/feed/press-release/',
    source: 'Wyndham Hotels & Resorts',
  },
  {
    url: 'https://media.choicehotels.com/press-releases?pagetemplate=rss',
    source: 'Choice Hotels',
  },
  {
    url: 'https://press.mandarinoriental.com/feed/',
    source: 'Mandarin Oriental',
  },
  {
    url: 'https://press.accor.com/feed/?lang=eng',
    source: 'Accor',
  },
]

export const FEEDS = [...INDUSTRY_FEEDS, ...HOTEL_BRAND_FEEDS]

/**
 * Fetches industry and official hotel-brand RSS feeds in parallel, returns a flat date-sorted article array.
 * Feeds that fail are skipped; logs a warning if all feeds fail.
 * Defaults to articles published in the last 24 hours.
 * @returns {Promise<Array<{title, url, excerpt, pubDate, source}>>}
 */
export async function fetchAllArticles({ maxAgeHours = 24, feeds = FEEDS } = {}) {
  const results = await Promise.allSettled(
    feeds.map(({ url, source }) => fetchFeed(url, source, maxAgeHours))
  )

  const succeeded = results.filter(r => r.status === 'fulfilled')
  if (succeeded.length === 0) {
    results.forEach((r, i) => console.warn(`⚠ Feed failed: ${feeds[i].url} — ${r.reason?.message}`))
  }

  return succeeded
    .flatMap(r => r.value)
    .filter((article, index, articles) => articles.findIndex(candidate => candidate.url === article.url) === index)
    .sort((a, b) => b.pubDate - a.pubDate)
}

async function fetchFeed(feedUrl, source, maxAgeHours) {
  const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parseFeed(await res.text(), source, maxAgeHours)
}

/**
 * Parses RSS XML into article objects, filtered to the requested recent window.
 * Exported for unit testing.
 * @param {string} xml
 * @param {string} source
 * @returns {Array<{title, url, excerpt, pubDate, source}>}
 */
export function parseFeed(xml, source, maxAgeHours = 24) {
  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(match => match[1])
  const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)

  return items
    .map(item => ({
      title: decodeXml(readTag(item, 'title')).trim(),
      url: decodeXml(readTag(item, 'link') || readTag(item, 'guid')).trim(),
      excerpt: stripHtml(decodeXml(readTag(item, 'description'))).slice(0, 400),
      pubDate: new Date(readTag(item, 'pubDate') || readTag(item, 'dc:date') || 0),
      source,
      image: decodeXml(item.match(/<(?:media:content|media:thumbnail)\b[^>]*\burl=["']([^"']+)["']/i)?.[1]
        || decodeXml(`${readTag(item, 'description')} ${readTag(item, 'content:encoded')}`).match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] || ''),
    }))
    .filter(a => a.title && a.url && a.pubDate > cutoff)
}

function readTag(xml, tagName) {
  const escaped = tagName.replace(':', '\\:')
  const match = xml.match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i'))
  return match?.[1]?.replace(/^<!\[CDATA\[|\]\]>$/g, '') ?? ''
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeXml(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => { const point = Number(code); return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : '' })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => { const point = parseInt(code, 16); return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : '' })
}
