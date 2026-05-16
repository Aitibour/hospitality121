import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Conversations at the intersection of hospitality, technology, and innovation — with hotel CIOs, startup founders, luxury executives, and guest experience pioneers.',
  keywords: 'hospitality podcast, hotel technology podcast, AI hospitality podcast, hospitality leadership',
}

export const revalidate = 3600

export default function PodcastsPage() {
  const items = getAllContent().filter(item => item.type === 'podcast')
  return (
    <>
      <SectionHeader sectionKey="podcasts" count={items.length} />
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
