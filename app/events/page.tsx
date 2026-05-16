import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Hospitality industry summits, conferences, and forums — including HITEC, hotel technology events, and leadership forums where the industry connects.',
  keywords: 'hospitality events, hotel technology conference, HITEC, hospitality summit',
}

export const revalidate = 3600

export default function EventsPage() {
  const items = getAllContent().filter(item => item.type === 'event')
  return (
    <>
      <SectionHeader sectionKey="events" count={items.length} />
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
