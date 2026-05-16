import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/content'
import { CATEGORIES } from '@/lib/categories'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/news`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/insights`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/podcasts`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/events`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/interviews`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/subscribe`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map(slug => ({
    url: `${BASE}/category/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const contentRoutes: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${BASE}/content/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...contentRoutes]
}
