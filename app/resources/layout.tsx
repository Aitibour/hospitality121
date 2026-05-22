import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Hospitality121 resources: guides, reports, and tools for hotel operators and hospitality professionals navigating technology, AI, and industry change.',
  alternates: { canonical: 'https://hospitality121.com/resources' },
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
