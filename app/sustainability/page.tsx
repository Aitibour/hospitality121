import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Sustainable Hospitality',
  alternates: { canonical: 'https://hospitality121.com/sustainability' },
  description: 'Sustainable hotel operations, green technologies, smart building systems, ESG strategies, and eco-friendly guest experience for the hospitality industry.',
  keywords: 'sustainable hospitality, green hotels, eco-friendly hotel operations, hospitality ESG, hotel sustainability, smart building hotel',
  openGraph: {
    title: 'Sustainable Hospitality | Hospitality121',
    description: 'Sustainable hotel operations, green technologies, and ESG strategies for the hospitality industry.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const PILLARS = [
  { label: 'Sustainable Operations', href: '/sustainability/sustainable-operations', description: 'Eco-friendly hotel operations and certifications' },
  { label: 'Smart Operations',       href: '/sustainability/smart-operations',       description: 'Energy optimisation and resource management' },
  { label: 'Green Technologies',     href: '/sustainability/green-technologies',     description: 'Sustainable tech solutions for hotels' },
  { label: 'ESG & Future Travel',    href: '/sustainability/esg-reporting',          description: 'ESG reporting, compliance, and strategy' },
]

const STATS = [
  { value: '40%', label: 'of hotel guests actively seek eco-certified properties' },
  { value: '£2.3B', label: 'invested in sustainable hospitality tech in 2025' },
  { value: '67%', label: 'of hotel operators have published ESG commitments' },
  { value: '2030', label: 'target year for net-zero pledges across major chains' },
]

export default function SustainabilityPage() {
  const all = getAllContent()
  const items = all.filter(item =>
    ['SUSTAINABILITY', 'WELLNESS', 'TRENDS', 'GUEST EXPERIENCE'].includes(item.category.toUpperCase())
  ).slice(0, 10)

  const featured = items.slice(0, 3)
  const rest = items.slice(3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-14">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Sustainability</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4 max-w-3xl">
          The Future of Sustainable Hospitality
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl">
          Covering sustainable hotel operations, smart building technologies, green certifications, ESG strategy, and the eco-friendly innovations reshaping the guest experience.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {STATS.map(s => (
          <div key={s.value} className="bg-surface rounded-xl p-5 text-center">
            <p className="font-serif text-3xl font-bold text-gold mb-1">{s.value}</p>
            <p className="text-xs text-muted leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {PILLARS.map(p => (
          <Link key={p.label} href={p.href} className="bg-surface rounded-xl p-5 hover:ring-1 hover:ring-gold/40 transition group">
            <p className="text-sm font-bold text-gray-800 group-hover:text-gold transition-colors mb-1">{p.label}</p>
            <p className="text-xs text-muted">{p.description}</p>
          </Link>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-6">Featured Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(item => (
              <Link key={item.slug} href={`/content/${item.slug}`} className="group bg-surface rounded-xl overflow-hidden hover:ring-1 hover:ring-gold/40 transition">
                <div className="relative h-48">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-gold tracking-widest mb-2">{item.category}</p>
                  <h3 className="font-serif font-semibold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-gold transition-colors">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Latest Coverage</h2>
          <div className="flex flex-col gap-4">
            {rest.map(item => (
              <Link key={item.slug} href={`/content/${item.slug}`} className="flex gap-4 group bg-surface rounded-lg p-4 hover:ring-1 hover:ring-gold/40 transition">
                <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gold tracking-widest">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors line-clamp-2">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
