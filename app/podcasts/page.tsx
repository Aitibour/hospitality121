import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Hospitality Podcast - Hotel Tech & Leadership Interviews',
  description: 'Conversations with hotel CIOs, startup founders, luxury executives, and guest experience pioneers at the intersection of hospitality and technology.',
  alternates: { canonical: 'https://hospitality121.com/podcasts' },
  keywords: 'hospitality podcast, hotel technology podcast, AI hospitality podcast, hospitality leadership',
  openGraph: {
    title: 'Hospitality Podcast - Hotel Tech & Leadership Interviews | Hospitality121',
    description: 'Conversations with hotel CIOs, startup founders, luxury executives, and guest experience pioneers at the intersection of hospitality and technology.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
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
