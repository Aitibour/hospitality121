import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

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
