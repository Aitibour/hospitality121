import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function BlogPage() {
  const items = getAllContent().filter(item => item.type === 'blog')
  return (
    <>
      <SectionHeader
        title="BLOG"
        description="In-depth perspectives, practical guides, and original thinking from the Hospitality121 team."
        count={items.length}
        noun="post"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
