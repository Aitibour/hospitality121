import type { MetadataRoute } from 'next'
import { getAllContent } from '@/lib/content'
import { CATEGORIES } from '@/lib/categories'
import { TECH_TOPICS } from '@/lib/technology-topics'
import { SUSTAINABILITY_TOPICS } from '@/lib/sustainability-topics'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const dynamic = 'force-static'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com').replace(/\/$/, '')

function dedupeRoutes(routes: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>()
  return routes.filter(route => {
    if (seen.has(route.url)) return false
    seen.add(route.url)
    return true
  })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const all = getAllContent()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          changeFrequency: 'daily',   priority: 1.0, lastModified: now },
    { url: `${BASE}/news`,                changeFrequency: 'daily',   priority: 0.9, lastModified: now },
    { url: `${BASE}/insights`,            changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/podcasts`,            changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/blog`,                changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/events`,              changeFrequency: 'weekly',  priority: 0.7, lastModified: now },
    { url: `${BASE}/interviews`,          changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/technology`,          changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/sustainability`,      changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${BASE}/collaborate`,         changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${BASE}/media`,              changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${BASE}/subscribe`,           changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/advertise`,           changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/resources`,           changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/about`,               changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${BASE}/contact`,             changeFrequency: 'monthly', priority: 0.4, lastModified: now },
    { url: `${BASE}/search`,              changeFrequency: 'monthly', priority: 0.4, lastModified: now },
    { url: `${BASE}/ai-index.json`,       changeFrequency: 'daily',   priority: 0.5, lastModified: now },
    { url: `${BASE}/llms-full.txt`,       changeFrequency: 'daily',   priority: 0.5, lastModified: now },
    { url: `${BASE}/llms.txt`,            changeFrequency: 'monthly', priority: 0.4, lastModified: now },
    { url: `${BASE}/seo-diamond.json`,     changeFrequency: 'weekly',  priority: 0.4, lastModified: now },
    { url: `${BASE}/privacy`,             changeFrequency: 'yearly',  priority: 0.3, lastModified: now },
    { url: `${BASE}/editorial-standards`, changeFrequency: 'yearly',  priority: 0.5, lastModified: now },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map(slug => ({
    url: `${BASE}/category/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
    lastModified: now,
  }))

  const contentRoutes: MetadataRoute.Sitemap = all.map(item => ({
    url: `${BASE}/content/${item.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: new Date(item.date),
  }))

  const authorSlugs = [...new Set(
    all
      .filter(i => i.type === 'article' || i.type === 'news' || i.type === 'blog')
      .map(i => ('author' in i ? i.author : ''))
      .filter(Boolean)
  )].map(name => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))

  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map(slug => ({
    url: `${BASE}/author/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified: now,
  }))

  const techTopicRoutes: MetadataRoute.Sitemap = TECH_TOPICS.map(t => ({
    url: `${BASE}/technology/${t.slug}`,
    changeFrequency: 'weekly',
    priority: t.slug === 'ai' || t.slug === 'pms-pos' || t.slug === 'cybersecurity' ? 0.85 : 0.8,
    lastModified: now,
  }))

  const sustainabilityTopicRoutes: MetadataRoute.Sitemap = SUSTAINABILITY_TOPICS.map(t => ({
    url: `${BASE}/sustainability/${t.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: now,
  }))

  const diamondPillarRoutes: MetadataRoute.Sitemap = DIAMOND_PILLARS
    .filter(p => !staticRoutes.some(route => route.url === `${BASE}${p.href}`) && !techTopicRoutes.some(route => route.url === `${BASE}${p.href}`))
    .map(p => ({
      url: `${BASE}${p.href}`,
      changeFrequency: 'weekly',
      priority: 0.85,
      lastModified: now,
    }))

  const geoRoutes: MetadataRoute.Sitemap = GEO_AUTHORITY_PAGES.map(page => ({
    url: `${BASE}${page.href}`,
    changeFrequency: 'monthly',
    priority: 0.65,
    lastModified: now,
  }))

  return dedupeRoutes([
    ...staticRoutes,
    ...categoryRoutes,
    ...contentRoutes,
    ...authorRoutes,
    ...techTopicRoutes,
    ...sustainabilityTopicRoutes,
    ...diamondPillarRoutes,
    ...geoRoutes,
  ])
}
