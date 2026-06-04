import { getAiContentIndex, SITE_URL } from '@/lib/ai-discovery'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'
import { getAllAuthors } from '@/lib/authors'

export const dynamic = 'force-static'

export function GET() {
  return Response.json({
    publisher: {
      name: 'Hospitality121',
      alternateName: 'Hospitality One 2 One',
      url: SITE_URL,
      description: 'Independent hospitality media platform based in New York, covering hospitality technology, AI, leadership, operations, guest experience, recruitment, sustainability, luxury hospitality, news, podcasts, and events.',
      editorialStandards: `${SITE_URL}/editorial-standards`,
      about: `${SITE_URL}/about`,
      location: 'New York, NY, United States',
    },
    discovery: {
      llms: `${SITE_URL}/llms.txt`,
      llmsFull: `${SITE_URL}/llms-full.txt`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      newsSitemap: `${SITE_URL}/news-sitemap.xml`,
      rss: `${SITE_URL}/feed.xml`,
      searchIndex: `${SITE_URL}/search-index.json`,
      diamondNetwork: `${SITE_URL}/seo-diamond.json`,
    },
    authorityPillars: DIAMOND_PILLARS.map(pillar => ({
      name: pillar.title,
      url: pillar.canonical,
      description: pillar.description,
      keywords: pillar.keywords.split(',').map(keyword => keyword.trim()),
      clusters: pillar.clusters,
    })),
    geoAuthorityPages: GEO_AUTHORITY_PAGES.map(page => ({
      name: page.title,
      url: page.canonical,
      region: page.region,
      description: page.description,
    })),
    authors: getAllAuthors().map(author => ({
      name: author.name,
      role: author.title,
      url: `${SITE_URL}/author/${author.slug}`,
      bio: author.bio,
      linkedin: author.linkedin || null,
    })),
    content: getAiContentIndex(),
  })
}
