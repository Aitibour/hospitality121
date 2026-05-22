import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'
import Link from 'next/link'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

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
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-surface rounded-xl p-6">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Diamond Authority Links</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hospitality121 Core Hub</Link>
            {DIAMOND_PILLARS.slice(0, 6).map(pillar => (
              <Link key={pillar.slug} href={pillar.href} className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">
                {pillar.title}
              </Link>
            ))}
            {GEO_AUTHORITY_PAGES.map(page => (
              <Link key={page.slug} href={page.href} className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-10"><ContentGrid items={items} /></div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
