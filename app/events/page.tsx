import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function EventsPage() {
  const items = getAllContent().filter(item => item.type === 'event')
  return (
    <>
      <SectionHeader
        title="EVENTS"
        description="Summits, conferences, and forums where hospitality's leaders connect, learn, and shape the industry."
        count={items.length}
        noun="event"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
