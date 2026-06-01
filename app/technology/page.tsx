import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllContent } from '@/lib/content'
import { DIAMOND_PILLARS, GEO_AUTHORITY_PAGES } from '@/lib/diamond-seo'
import { TECH_TOPICS } from '@/lib/technology-topics'

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

const FEATURED_TOPIC_SLUGS = ['ai', 'pms-pos', 'cybersecurity', 'smart-hotels', 'revenue-management', 'companies']
const featuredTopics = FEATURED_TOPIC_SLUGS
  .map(slug => TECH_TOPICS.find(topic => topic.slug === slug))
  .filter((topic): topic is (typeof TECH_TOPICS)[number] => Boolean(topic))

function getTopicSummary(topic: (typeof TECH_TOPICS)[number]) {
  return topic.description.length > 128 ? `${topic.description.slice(0, 125)}...` : topic.description
}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {featuredTopics.map(p => (
          <Link
            key={p.slug}
            href={`/technology/${p.slug}`}
            className="bg-surface rounded-xl p-5 hover:ring-1 hover:ring-gold/40 transition group"
          >
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">{p.subtitle}</p>
            <p className="text-base font-bold text-gray-800 group-hover:text-gold transition-colors mb-2">{p.title}</p>
            <p className="text-xs text-muted leading-relaxed">{getTopicSummary(p)}</p>
          </Link>
        ))}
      </div>

      <section className="mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
          <div>
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Solution Map</p>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Hospitality technology products and buying paths</h2>
          </div>
          <Link href="/seo-diamond.json" className="text-sm font-bold text-gold hover:underline">
            View diamond feed
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {TECH_TOPICS.map(topic => (
            <article key={topic.slug} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold uppercase">{topic.subtitle}</p>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mt-1">{topic.title}</h3>
                </div>
                <Link
                  href={`/technology/${topic.slug}`}
                  className="shrink-0 rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold hover:bg-gold hover:text-gray-900 transition-colors"
                >
                  Pillar
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {topic.solutions.map((solution, index) => (
                  <Link
                    key={solution.title}
                    href={`/technology/${topic.slug}#solution-${index + 1}`}
                    className="rounded-md bg-surface px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gold hover:ring-1 hover:ring-gold/40 transition"
                  >
                    {solution.title}
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
