import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'News',
  description: 'Breaking hospitality industry news — hotel openings, brand expansions, technology announcements, and the stories shaping global hospitality.',
  keywords: 'hospitality news, hotel industry news, hospitality technology news',
}

export const revalidate = 3600

export default function NewsPage() {
  const items = getAllContent().filter(item => item.type === 'news')
  return (
    <>
      <SectionHeader sectionKey="news" count={items.length} />
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
