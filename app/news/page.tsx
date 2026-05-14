import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function NewsPage() {
  const items = getAllContent().filter(item => item.type === 'news')
  return (
    <>
      <SectionHeader
        title="NEWS"
        description="Breaking news, industry updates, and the stories shaping the future of global hospitality."
        count={items.length}
        noun="story"
        pluralNoun="stories"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
