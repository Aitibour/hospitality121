import Image from 'next/image'
import Link from 'next/link'
import type { DiamondPillar } from '@/lib/diamond-seo'
import { GEO_AUTHORITY_PAGES, DIAMOND_PILLARS } from '@/lib/diamond-seo'
import type { ContentItem } from '@/types/content'

type Props = {
  pillar: DiamondPillar
  items: ContentItem[]
}

export default function DiamondPillarPage({ pillar, items }: Props) {
  const related = DIAMOND_PILLARS.filter(p => p.slug !== pillar.slug).slice(0, 4)
  const featured = items.slice(0, 3)
  const latest = items.slice(3, 10)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">{pillar.eyebrow}</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4 max-w-3xl">
          {pillar.title}
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl">{pillar.description}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          <Link href="/" className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
            Hospitality121 Core Hub
          </Link>
          <Link href="/hospitality-trends" className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
            Hospitality Trends
          </Link>
          <Link href="/technology" className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
            Hotel Technology
          </Link>
        </div>
      </div>

      <section className="mb-14">
        <h2 className="font-serif text-2xl font-bold mb-5">Cluster Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillar.clusters.map(cluster => (
            <article key={cluster.title} id={cluster.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')} className="bg-surface rounded-lg p-5">
              <h3 className="font-serif text-lg font-bold text-gray-900">{cluster.title}</h3>
              <p className="text-sm text-muted leading-relaxed mt-2">{cluster.description}</p>
              <p className="text-xs text-gold mt-4">{cluster.keywords.join(' / ')}</p>
              <div className="flex flex-col gap-1 mt-4">
                <Link href={pillar.href} className="text-xs font-semibold text-gray-700 hover:text-gold transition-colors">
                  {pillar.title} pillar
                </Link>
                <Link href="/" className="text-xs font-semibold text-gray-700 hover:text-gold transition-colors">
                  Hospitality121 Core Hub
                </Link>
                {GEO_AUTHORITY_PAGES.slice(0, 1).map(page => (
                  <Link key={page.slug} href={page.href} className="text-xs font-semibold text-gray-700 hover:text-gold transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-5">Featured Coverage</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map(item => (
              <Link key={item.slug} href={`/content/${item.slug}`} className="group bg-surface rounded-lg overflow-hidden hover:ring-1 hover:ring-gold/40 transition">
                <div className="relative h-44">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold tracking-widest text-gold mb-2">{item.category}</p>
                  <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-gold transition-colors">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-5">Latest Articles</h2>
          <div className="flex flex-col gap-4">
            {latest.map(item => (
              <Link key={item.slug} href={`/content/${item.slug}`} className="flex gap-4 bg-surface rounded-lg p-4 group hover:ring-1 hover:ring-gold/40 transition">
                <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold mb-1">{item.category}</p>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gold transition-colors">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="font-serif text-xl font-bold mb-3">Related Pillars</h2>
            <div className="flex flex-col gap-2">
              {related.map(p => (
                <Link key={p.slug} href={p.href} className="text-sm font-medium text-gray-700 hover:text-gold transition-colors">
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold mb-3">GEO Expansion</h2>
            <div className="flex flex-col gap-2">
              {GEO_AUTHORITY_PAGES.slice(0, 6).map(page => (
                <Link key={page.slug} href={page.href} className="text-sm font-medium text-gray-700 hover:text-gold transition-colors">
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
