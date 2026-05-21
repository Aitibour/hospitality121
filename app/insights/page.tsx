import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Hotel Industry Insights & Analysis 2026',
  description: 'Expert perspectives and thought leadership on AI in hospitality, hotel technology trends, guest experience innovation, and digital transformation.',
  alternates: { canonical: 'https://hospitality121.com/insights' },
  keywords: 'hospitality insights, AI in hospitality, hotel technology trends, guest experience innovation, hospitality digital transformation',
  openGraph: {
    title: 'Hotel Industry Insights & Analysis 2026 | Hospitality121',
    description: 'Expert perspectives and thought leadership on AI in hospitality, hotel technology trends, guest experience innovation, and digital transformation.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
}

export const revalidate = 3600

export default function InsightsPage() {
  const items = getAllContent().filter(item => item.type === 'article')
  return (
    <>
      <SectionHeader sectionKey="insights" count={items.length} />
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
