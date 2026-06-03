import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'Resources',
  description: 'Hospitality121 resources: guides, reports, and tools for hotel operators and hospitality professionals navigating technology, AI, and industry change.',
  path: '/resources',
})

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
