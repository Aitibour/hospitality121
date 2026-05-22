import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Hospitality121 for articles, interviews, podcasts, news, and events covering the latest in hotel technology, AI, and hospitality strategy.',
  alternates: { canonical: 'https://hospitality121.com/search' },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
