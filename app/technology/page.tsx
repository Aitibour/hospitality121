import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllContent } from '@/lib/content'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const metadata: Metadata = {
  title: 'Hotel Technology News & Analysis',
  alternates: { canonical: 'https://hospitality121.com/technology' },
  description: 'Hotel technology news, AI in hospitality, PMS solutions, cybersecurity, IT infrastructure, and the tools shaping the future of hotel operations.',
  keywords: 'hospitality technology, hotel AI, PMS systems, hotel cybersecurity, hospitality IT, smart hotels, hotel digital transformation',
  openGraph: {
    title: 'Hospitality Technology | Hospitality121',
    description: 'The authority on hotel technology, AI, PMS, cybersecurity, and digital transformation in hospitality.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const PILLARS = [
  { label: 'Hospitality AI',     href: '/technology/ai',           description: 'Machine learning, predictive analytics, and AI-powered guest experience' },
  { label: 'PMS & POS Systems',  href: '/technology/pms-pos',      description: 'Property management, point of sale, mobile ordering, and payments' },
  { label: 'Key & Mobile Key',   href: '/technology/key-systems',  description: 'RFID locks, mobile key, NFC access, and access control' },
  { label: 'IPTV & Signage',     href: '/technology/iptv-signage', description: 'In-room entertainment, casting, and digital property displays' },
  { label: 'Cybersecurity',      href: '/technology/cybersecurity',description: 'Data protection, PCI compliance, and guest privacy' },
]

export default function TechnologyPage() {
  const all = getAllContent()
  const techItems = all.filter(item =>
    ['TECH', 'TECHNOLOGY', 'AI', 'INNOVATION', 'DIGITAL', 'CYBERSECURITY', 'SECURITY'].includes(item.category.toUpperCase())
  ).slice(0, 12)

  const featured = techItems.slice(0, 3)
  const rest = techItems.slice(3, 12)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-14">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Technology</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4 max-w-3xl">
          The Authority on Hospitality Technology
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl">
          Hotel AI, PMS solutions, cybersecurity, IT infrastructure, and the tools driving digital transformation across the global hospitality industry.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-14">
        {PILLARS.map(p => (
          <Link
            key={p.label}
            href={p.href}
            className="bg-surface rounded-xl p-4 hover:ring-1 hover:ring-gold/40 transition group"
          >
            <p className="text-sm font-bold text-gray-800 group-hover:text-gold transition-colors mb-1">{p.label}</p>
            <p className="text-xs text-muted leading-snug">{p.description}</p>
          </Link>
        ))}
      </div>

      <section className="bg-surface rounded-xl p-6 mb-14">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Diamond Authority Links</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hospitality121 Core Hub</Link>
          {DIAMOND_PILLARS.filter(pillar => pillar.href !== '/technology').map(pillar => (
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
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-6">Featured</h2>
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

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Latest in Technology</h2>
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
