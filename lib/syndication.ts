import { getAllContent } from '@/lib/content'
import { getContentAuthor, getContentSummary, SITE_URL } from '@/lib/ai-discovery'

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildRssFeed(): string {
  const items = getAllContent()
    .filter(item => item.type !== 'event')
    .slice(0, 50)
    .map(item => {
      const url = `${SITE_URL}/content/${item.slug}`
      return [
        '<item>',
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${new Date(item.date).toUTCString()}</pubDate>`,
        `<dc:creator>${escapeXml(getContentAuthor(item))}</dc:creator>`,
        `<category>${escapeXml(item.category)}</category>`,
        `<description>${escapeXml(getContentSummary(item, 500))}</description>`,
        '</item>',
      ].join('')
    })
    .join('')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '<channel>',
    '<title>Hospitality121</title>',
    `<link>${SITE_URL}</link>`,
    '<description>Hospitality news, technology, AI, leadership, operations, guest experience, podcasts, and events.</description>',
    '<language>en-us</language>',
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    '</channel>',
    '</rss>',
  ].join('')
}

export function buildGoogleNewsSitemap(now = new Date()): string {
  const cutoff = now.getTime() - 48 * 60 * 60 * 1000
  const news = getAllContent()
    .filter(item => item.type === 'news' && new Date(item.date).getTime() >= cutoff)
    .slice(0, 1000)
    .map(item => [
      '<url>',
      `<loc>${escapeXml(`${SITE_URL}/content/${item.slug}`)}</loc>`,
      '<news:news>',
      '<news:publication>',
      '<news:name>Hospitality121</news:name>',
      '<news:language>en</news:language>',
      '</news:publication>',
      `<news:publication_date>${escapeXml(new Date(item.date).toISOString())}</news:publication_date>`,
      `<news:title>${escapeXml(item.title)}</news:title>`,
      '</news:news>',
      '</url>',
    ].join(''))
    .join('')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    news,
    '</urlset>',
  ].join('')
}
