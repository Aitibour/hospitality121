import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllContent } from '@/lib/content'
import { GEO_AUTHORITY_PAGES, DIAMOND_PILLARS, getGeoPageBySlug } from '@/lib/diamond-seo'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return GEO_AUTHORITY_PAGES.map(page => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getGeoPageBySlug(slug)
  if (!page) return {}
  return {
    title: `${page.title} | Hospitality121`,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: `${page.title} | Hospitality121`,
      description: page.description,
      images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function GeoAuthorityPage({ params }: Props) {
  const { slug } = await params
  const page = getGeoPageBySlug(slug)
  if (!page) notFound()

  const all = getAllContent()
  const matched = all
    .filter(item => page.matchTerms.some(term => item.title.toUpperCase().includes(term) || item.category.toUpperCase().includes(term)))
    .slice(0, 6)
  const fallback = matched.length > 0 ? matched : all.filter(item => ['TECHNOLOGY', 'LUXURY', 'TRENDS', 'OPERATIONS'].includes(item.category.toUpperCase())).slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">{page.region}</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4 max-w-3xl">
          {page.title}
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl">{page.description}</p>
      </div>

      <section className="grid md:grid-cols-3 gap-4 mb-14">
        {DIAMOND_PILLARS.slice(0, 6).map(pillar => (
          <Link key={pillar.slug} href={pillar.href} className="bg-surface rounded-lg p-5 hover:ring-1 hover:ring-gold/40 transition group">
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">{pillar.eyebrow}</p>
            <h2 className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold transition-colors">{pillar.title}</h2>
            <p className="text-sm text-muted leading-relaxed mt-2">{pillar.description}</p>
          </Link>
        ))}
      </section>

      <section className="mb-14 bg-surface rounded-xl p-6">
        <h2 className="font-serif text-2xl font-bold mb-4">Diamond Authority Links</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hospitality121 Core Hub</Link>
          <Link href="/hospitality-trends" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hospitality Trends</Link>
          <Link href="/technology" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hotel Technology</Link>
          <Link href="/guest-experience" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Guest Experience</Link>
          {GEO_AUTHORITY_PAGES.filter(other => other.slug !== page.slug).slice(0, 6).map(other => (
            <Link key={other.slug} href={other.href} className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">
              {other.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold mb-5">Related Coverage</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {fallback.map(item => (
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
    </div>
  )
}
