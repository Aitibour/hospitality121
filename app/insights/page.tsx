import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function InsightsPage() {
  const items = getAllContent().filter(item => item.type === 'article')
  return (
    <>
      <SectionHeader
        title="INSIGHTS"
        description="Expert perspectives, industry analysis, and thought leadership from hospitality's brightest minds."
        count={items.length}
        noun="article"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
