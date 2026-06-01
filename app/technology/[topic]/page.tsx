import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TECH_TOPICS, getTechTopicBySlug } from '@/lib/technology-topics'
import type { TechTopic } from '@/lib/technology-topics'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'

export const dynamic = 'force-static'

const SOLUTION_STYLES = [
  'bg-white hover:border-gold/50',
  'bg-blue-50/40 hover:border-blue-300',
  'bg-emerald-50/40 hover:border-emerald-300',
  'bg-slate-50 hover:border-slate-300',
]

const BASE = 'https://hospitality121.com'

function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

function buildTechnologySolutionJsonLd(topic: TechTopic): string {
  const pageUrl = `${BASE}/technology/${topic.slug}`

  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.title,
    headline: `${topic.title} Products and Solutions`,
    description: topic.description,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: 'Hospitality121', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'Hospitality121',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/images/Logo.png` },
    },
    about: ['hospitality technology', 'hotel technology', ...topic.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean).slice(0, 8)],
    mainEntity: {
      '@type': 'ItemList',
      name: `${topic.title} hospitality technology solutions`,
      itemListElement: topic.solutions.map((solution, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: solution.title,
          serviceType: solution.seo[0],
          description: solution.useCase,
          url: `${pageUrl}#solution-${index + 1}`,
          provider: { '@type': 'Organization', name: 'Hospitality121', url: BASE },
          audience: { '@type': 'Audience', audienceType: solution.buyer },
          areaServed: 'Global hospitality industry',
          category: solution.seo,
        },
      })),
    },
  })
}

function buildTechnologyBreadcrumbJsonLd(topic: TechTopic): string {
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Technology', item: `${BASE}/technology` },
      { '@type': 'ListItem', position: 3, name: topic.title, item: `${BASE}/technology/${topic.slug}` },
    ],
  })
}

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

  const solutionJsonLd = buildTechnologySolutionJsonLd(t)
  const breadcrumbJsonLd = buildTechnologyBreadcrumbJsonLd(t)

  return (
    <>
      {/* JSON-LD: safeJsonLd() escapes <, >, &. Content is curated in lib/technology-topics.ts. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: solutionJsonLd }} /> {/* nosec */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} /> {/* nosec */}

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

      {/* Products and solutions */}
      <section className="mb-16">
        <div className="flex flex-col gap-2 mb-7">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Products & Solutions</span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">Product and solution grid</h2>
          <p className="text-sm text-muted max-w-3xl">
            Article-style cards for the product categories, operating use cases, and search themes that connect this topic back into the Hospitality121 diamond authority network.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {t.solutions.map((solution, i) => (
            <article
              key={solution.title}
              id={`solution-${i + 1}`}
              className={`group flex min-h-[360px] flex-col rounded-lg border border-gray-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${SOLUTION_STYLES[i % SOLUTION_STYLES.length]}`}
            >
              <p className="text-xs font-bold tracking-widest text-gold uppercase">Solution {String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-serif text-xl font-bold text-gray-900 mt-3 group-hover:text-gold transition-colors">{solution.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{solution.useCase}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-500">Best fit</p>
              <p className="mt-2 text-sm text-gray-700">{solution.buyer}</p>
              <div className="mt-auto pt-5 flex flex-wrap gap-2">
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
              <Link
                href={`/search?q=${encodeURIComponent(solution.title)}`}
                className="mt-5 inline-flex text-xs font-bold tracking-widest text-gray-800 group-hover:text-gold transition-colors"
              >
                Research solution
              </Link>
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
    </>
  )
}
