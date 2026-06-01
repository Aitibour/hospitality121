import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { TECH_TOPICS, getTechTopicBySlug } from '@/lib/technology-topics'
import { getAllContent } from '@/lib/content'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const dynamic = 'force-static'

const SECTION_STYLES = [
  'border-gold/30 bg-gold/10 hover:border-gold',
  'border-blue-200 bg-blue-50 hover:border-blue-400',
  'border-emerald-200 bg-emerald-50 hover:border-emerald-400',
  'border-gray-200 bg-gray-50 hover:border-gray-400',
]

const SOLUTION_STYLES = [
  'border-l-gold bg-white',
  'border-l-blue-500 bg-blue-50/40',
  'border-l-emerald-500 bg-emerald-50/40',
  'border-l-slate-500 bg-slate-50',
]

export async function generateStaticParams() {
  return TECH_TOPICS.map(t => ({ topic: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params
  const t = getTechTopicBySlug(topic)
  if (!t) return {}
  return {
    title: t.title,
    description: t.description.slice(0, 155),
    alternates: { canonical: `https://hospitality121.com/technology/${topic}` },
    keywords: t.keywords,
    openGraph: {
      title: `${t.title} | Hospitality121`,
      description: t.description.slice(0, 155),
      images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function TechTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const t = getTechTopicBySlug(topic)
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
        <Link href="/technology" className="hover:text-gold transition-colors">Technology</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">{t.title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-14 max-w-3xl">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Technology</span>
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

      {/* Products and solutions */}
      <section className="mb-16">
        <div className="flex flex-col gap-2 mb-7">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Products & Solutions</span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">Hospitality technology solutions for this category</h2>
          <p className="text-sm text-muted max-w-3xl">
            A practical buyer map of product categories, operating use cases, and long-tail search themes connected back into the Hospitality121 diamond authority network.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {t.solutions.map((solution, i) => (
            <article
              key={solution.title}
              className={`rounded-lg border border-gray-100 border-l-4 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${SOLUTION_STYLES[i % SOLUTION_STYLES.length]}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold uppercase">Solution {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mt-1">{solution.title}</h3>
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(solution.title)}`}
                  className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 hover:border-gold hover:text-gold transition-colors"
                >
                  Research
                </Link>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Best fit</p>
              <p className="text-sm text-gray-700 mb-4">{solution.buyer}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hospitality use case</p>
              <p className="text-sm leading-relaxed text-gray-600 mb-5">{solution.useCase}</p>
              <div className="flex flex-wrap gap-2">
                {solution.seo.map(term => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200 hover:text-gold hover:ring-gold/50 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-xl p-6 mb-14">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Diamond Authority Links</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hospitality121 Core Hub</Link>
          <Link href="/technology" className="text-sm font-semibold text-gray-800 hover:text-gold transition-colors">Hotel Technology</Link>
          {DIAMOND_PILLARS.filter(pillar => pillar.href !== `/technology/${topic}`).map(pillar => (
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
        <p className="text-xs font-bold tracking-widest text-muted uppercase mb-4">Explore All Technology Topics</p>
        <div className="flex flex-wrap gap-3">
          {TECH_TOPICS.map(other => (
            <Link
              key={other.slug}
              href={`/technology/${other.slug}`}
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
