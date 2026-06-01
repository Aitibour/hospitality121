import { NextResponse } from 'next/server'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'
import { TECH_TOPICS } from '@/lib/technology-topics'

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
    technologySolutions: TECH_TOPICS.map(topic => ({
      label: topic.title,
      url: `${BASE}/technology/${topic.slug}`,
      keywords: topic.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean),
      products: topic.solutions.map((solution, index) => ({
        label: solution.title,
        url: `${BASE}/technology/${topic.slug}#solution-${index + 1}`,
        buyer: solution.buyer,
        useCase: solution.useCase,
        keywords: solution.seo,
        linksTo: [
          BASE,
          `${BASE}/technology`,
          `${BASE}/technology/${topic.slug}`,
        ],
      })),
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
