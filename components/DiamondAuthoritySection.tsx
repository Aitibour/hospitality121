import Link from 'next/link'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export default function DiamondAuthoritySection() {
  return (
    <aside className="lg:sticky lg:top-20 h-fit rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <span className="text-[11px] font-bold tracking-widest text-gold uppercase">Authority Network</span>
        <h2 className="font-serif text-xl font-bold leading-tight mt-1 text-gray-900">
          Hospitality Authority Map
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Pillars and GEO pages connected to the latest Hospitality121 coverage.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {DIAMOND_PILLARS.slice(0, 6).map(pillar => (
          <Link
            key={pillar.slug}
            href={pillar.href}
            className="group py-3"
          >
            <p className="text-[10px] font-bold tracking-widest text-gold uppercase">{pillar.eyebrow}</p>
            <h3 className="mt-1 text-sm font-bold text-gray-900 group-hover:text-gold transition-colors">
              {pillar.title}
            </h3>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2">GEO Pages</p>
        <div className="flex flex-wrap gap-2">
          {GEO_AUTHORITY_PAGES.slice(0, 5).map(page => (
            <Link
              key={page.slug}
              href={page.href}
              className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:border-gold hover:text-gold transition-colors"
            >
              {page.title.replace('Hospitality ', '').replace('Hotel Technology ', 'Tech ')}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/hospitality-trends" className="mt-5 inline-flex text-xs font-bold text-gold hover:underline">
        Explore trends
      </Link>
    </aside>
  )
}
