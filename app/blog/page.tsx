import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Hospitality Blog - Hotel Technology Guides 2026',
  alternates: { canonical: 'https://hospitality121.com/blog' },
  description: 'In-depth perspectives, practical guides, and original thinking on hospitality technology, smart hotels, innovation culture, and the future of guest experience.',
  keywords: 'hospitality blog, hotel technology blog, smart hotels, hospitality innovation',
  openGraph: {
    title: 'Hospitality Blog - Hotel Technology Guides 2026 | Hospitality121',
    description: 'In-depth perspectives, practical guides, and original thinking on hospitality technology, smart hotels, innovation culture, and the future of guest experience.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
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
