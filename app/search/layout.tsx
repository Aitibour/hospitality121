import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'Search',
  description: 'Search Hospitality121 for articles, interviews, podcasts, news, and events covering the latest in hotel technology, AI, and hospitality strategy.',
  path: '/search',
})

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
