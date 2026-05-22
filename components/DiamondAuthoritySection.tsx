import Link from 'next/link'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export default function DiamondAuthoritySection() {
  return (
    <section className="bg-white py-14 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Authority Network</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mt-2 text-gray-900">
              Hospitality Leadership, Technology, AI, and Operations
            </h2>
          </div>
          <Link href="/hospitality-trends" className="text-sm font-bold text-gold hover:underline">
            Explore hospitality trends
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {DIAMOND_PILLARS.map(pillar => (
            <Link
              key={pillar.slug}
              href={pillar.href}
              className="border border-gray-100 rounded-lg p-5 hover:border-gold/50 hover:shadow-sm transition group"
            >
              <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">{pillar.eyebrow}</p>
              <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold transition-colors">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mt-2">{pillar.description}</p>
            </Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">GEO Hospitality Authority</p>
          <div className="flex flex-wrap gap-2">
            {GEO_AUTHORITY_PAGES.map(page => (
              <Link
                key={page.slug}
                href={page.href}
                className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:border-gold hover:text-gold transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
