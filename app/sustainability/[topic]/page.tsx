import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SUSTAINABILITY_TOPICS, getSustainabilityTopicBySlug } from '@/lib/sustainability-topics'
import { getAllContent } from '@/lib/content'

export const dynamic = 'force-static'

const SECTION_STYLES = [
  'border-emerald-200 bg-emerald-50 hover:border-emerald-400',
  'border-gold/30 bg-gold/10 hover:border-gold',
  'border-blue-200 bg-blue-50 hover:border-blue-400',
  'border-gray-200 bg-gray-50 hover:border-gray-400',
]

export async function generateStaticParams() {
  return SUSTAINABILITY_TOPICS.map(t => ({ topic: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params
  const t = getSustainabilityTopicBySlug(topic)
  if (!t) return {}
  return {
    title: t.title,
    description: t.description.slice(0, 155),
    alternates: { canonical: `https://hospitality121.com/sustainability/${topic}` },
    keywords: t.keywords,
    openGraph: {
      title: `${t.title} | Hospitality121`,
      description: t.description.slice(0, 155),
      images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function SustainabilityTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const t = getSustainabilityTopicBySlug(topic)
  if (!t) notFound()

  const all = getAllContent()
  const related = all.filter(item =>
    t.filterTerms.some(term => item.category.toUpperCase().includes(term))
  ).slice(0, 9)

  const featured = related.slice(0, 3)
  const rest = related.slice(3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span>/</span>
        <Link href="/sustainability" className="hover:text-gold transition-colors">Sustainability</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">{t.title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-14 max-w-3xl">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Sustainability</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4">
          {t.title}
        </h1>
        <p className="text-muted text-sm font-semibold uppercase tracking-widest mb-6">{t.subtitle}</p>
        <div className="flex flex-col gap-4">
          {t.intro.map((para, i) => (
            <p key={i} className="text-gray-700 text-base leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* Editorial sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {t.sections.map((section, i) => (
          <Link
            key={section.heading}
            href={`/search?q=${encodeURIComponent(section.heading)}`}
            className={`group relative overflow-hidden rounded-lg border p-6 transition hover:-translate-y-0.5 hover:shadow-sm ${SECTION_STYLES[i % SECTION_STYLES.length]}`}
          >
            <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-xs font-bold text-gray-900 ring-1 ring-black/5">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="font-serif text-xl font-bold mb-3 text-gray-900 group-hover:text-gold transition-colors">{section.heading}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            <span className="mt-5 inline-flex text-xs font-bold tracking-widest text-gray-800 group-hover:text-gold transition-colors">
              Explore related coverage
            </span>
          </Link>
        ))}
      </div>

      {/* Related content */}
      {featured.length > 0 && (
        <div className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-6">Related Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(item => (
              <Link
                key={item.slug}
                href={`/content/${item.slug}`}
                className="group bg-surface rounded-xl overflow-hidden hover:ring-1 hover:ring-gold/40 transition"
              >
                <div className="relative h-48">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-gold tracking-widest mb-2">{item.category}</p>
                  <h3 className="font-serif font-semibold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="mb-14">
          <div className="flex flex-col gap-4">
            {rest.map(item => (
              <Link
                key={item.slug}
                href={`/content/${item.slug}`}
                className="flex gap-4 group bg-surface rounded-lg p-4 hover:ring-1 hover:ring-gold/40 transition"
              >
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

      {/* All topics nav */}
      <div className="border-t border-gray-200 pt-10">
        <p className="text-xs font-bold tracking-widest text-muted uppercase mb-4">Explore All Sustainability Topics</p>
        <div className="flex flex-wrap gap-3">
          {SUSTAINABILITY_TOPICS.map(other => (
            <Link
              key={other.slug}
              href={`/sustainability/${other.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                other.slug === topic
                  ? 'bg-gold text-gray-900 border-gold'
                  : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
              }`}
            >
              {other.title}
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
