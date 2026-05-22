import { NextResponse } from 'next/server'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'

export function GET() {
  return NextResponse.json({
    core: {
      label: 'Hospitality121 Core Hub',
      url: BASE,
      positioning: 'A global authority platform covering hospitality leadership, hotel operations, hotel technology, AI, guest experience, recruitment, and hospitality innovation.',
    },
    pillars: DIAMOND_PILLARS.map(pillar => ({
      label: pillar.title,
      url: `${BASE}${pillar.href}`,
      clusters: pillar.clusters.map(cluster => cluster.title),
    })),
    geo: GEO_AUTHORITY_PAGES.map(page => ({
      label: page.title,
      url: `${BASE}${page.href}`,
      region: page.region,
    })),
    workflow: {
      blog: {
        cadence: '1 post per day',
        source: 'daily recent RSS',
        output: 'content/blog/*.mdx',
      },
      news: {
        cadence: '2 posts per day',
        source: 'daily recent RSS',
        output: 'content/news/*.mdx',
      },
      linksPerAutopost: ['core hub', 'section pillar', 'semantic cluster', 'GEO authority page'],
    },
  })
}
