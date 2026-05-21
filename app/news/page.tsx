import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Hotel Industry News & Updates 2026',
  description: 'Breaking hospitality industry news — hotel openings, brand expansions, technology announcements, and the stories shaping global hospitality.',
  alternates: { canonical: 'https://hospitality121.com/news' },
  keywords: 'hospitality news, hotel industry news, hospitality technology news',
  openGraph: {
    title: 'Hospitality News - Hotel Industry Updates 2026 | Hospitality121',
    description: 'Breaking hospitality industry news on hotel openings, brand expansions, technology announcements, and the stories shaping global hospitality.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
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
