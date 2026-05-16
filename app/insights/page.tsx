import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Expert perspectives, deep analysis, and thought leadership on AI in hospitality, hotel technology trends, guest experience innovation, and digital transformation.',
  keywords: 'hospitality insights, AI in hospitality, hotel technology trends, guest experience innovation, hospitality digital transformation',
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
