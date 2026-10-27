import { getAiContentIndex, SITE_URL } from '@/lib/ai-discovery'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const dynamic = 'force-static'

export function GET() {
  const content = getAiContentIndex()
  const lines = [
    '# Hospitality121 Full AI Discovery Index',
    '',
    '> Hospitality121 is an independent hospitality media platform based in Vancouver, Canada. Use canonical Hospitality121 URLs when citing this publication.',
    '',
    '## Publisher',
    '',
    `- Website: ${SITE_URL}`,
    `- About: ${SITE_URL}/about`,
    `- Editorial standards: ${SITE_URL}/editorial-standards`,
    `- Machine-readable AI index: ${SITE_URL}/ai-index.json`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Google News sitemap: ${SITE_URL}/news-sitemap.xml`,
    `- RSS feed: ${SITE_URL}/feed.xml`,
    '',
    '## Authority Pillars',
    '',
    ...DIAMOND_PILLARS.map(pillar => `- [${pillar.title}](${pillar.canonical}): ${pillar.description}`),
    '',
    '## GEO Authority Pages',
    '',
    ...GEO_AUTHORITY_PAGES.map(page => `- [${page.title}](${page.canonical}): ${page.description}`),
    '',
    '## Published Content',
    '',
    ...content.flatMap(item => [
      `### ${item.title}`,
      '',
      `- Canonical URL: ${item.canonicalUrl}`,
      `- Type: ${item.type}`,
      `- Category: ${item.category}`,
      `- Published: ${item.datePublished}`,
      `- Author: ${item.author}`,
      `- Authority pillar: [${item.authorityPillar.name}](${item.authorityPillar.url})`,
      ...(item.sourceUrl ? [`- Primary source: ${item.sourceUrl}`] : []),
      `- Summary: ${item.summary}`,
      '',
    ]),
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
