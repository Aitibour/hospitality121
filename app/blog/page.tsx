import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'In-depth perspectives, practical guides, and original thinking on hospitality technology, smart hotels, innovation culture, and the future of guest experience.',
  keywords: 'hospitality blog, hotel technology blog, smart hotels, hospitality innovation',
}

export const revalidate = 3600

export default function BlogPage() {
  const items = getAllContent().filter(item => item.type === 'blog')
  return (
    <>
      <SectionHeader sectionKey="blog" count={items.length} />
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
