import { XMLParser } from 'fast-xml-parser'

const FEEDS = [
  { url: 'https://hotelmanagement.net/feed', source: 'hotelmanagement.net' },
  { url: 'https://www.hospitalitynet.org/rss/news.xml', source: 'hospitalitynet.org' },
  { url: 'https://skift.com/feed/', source: 'skift.com' },
]

/**
 * Fetches all 3 RSS feeds in parallel, returns flat date-sorted article array.
 * Feeds that fail are skipped; logs a warning if all 3 fail.
 * @returns {Promise<Array<{title, url, excerpt, pubDate, source}>>}
 */
export async function fetchAllArticles() {
  const results = await Promise.allSettled(
    FEEDS.map(({ url, source }) => fetchFeed(url, source))
  )

  const succeeded = results.filter(r => r.status === 'fulfilled')
  if (succeeded.length === 0) {
    results.forEach((r, i) => console.warn(`⚠ Feed failed: ${FEEDS[i].url} — ${r.reason?.message}`))
  }

  return succeeded
    .flatMap(r => r.value)
    .sort((a, b) => b.pubDate - a.pubDate)
}

async function fetchFeed(feedUrl, source) {
  const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parseFeed(await res.text(), source)
}

/**
 * Parses RSS XML into article objects, filtered to the last 48 hours.
 * Exported for unit testing.
 * @param {string} xml
 * @param {string} source
 * @returns {Array<{title, url, excerpt, pubDate, source}>}
 */
export function parseFeed(xml, source) {
  const parser = new XMLParser({ ignoreAttributes: false })
  const doc = parser.parse(xml)
  const rawItems = doc?.rss?.channel?.item ?? []
  const items = Array.isArray(rawItems) ? rawItems : [rawItems]
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)

  return items
    .map(item => ({
      title: String(item.title ?? '').trim(),
      url: String(item.link ?? item.guid ?? '').trim(),
      excerpt: stripHtml(String(item.description ?? '')).slice(0, 400),
      pubDate: new Date(item.pubDate ?? item['dc:date'] ?? 0),
      source,
    }))
    .filter(a => a.title && a.url && a.pubDate > cutoff)
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
