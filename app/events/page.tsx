import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllContent } from '@/lib/content'
import AdSlot from '@/components/AdSlot'
import type { ContentItem } from '@/types/content'

export const metadata: Metadata = {
  title: 'Recent Hospitality Events & Technology Conferences',
  alternates: { canonical: 'https://hospitality121.com/events' },
  description: 'Recent and near-term hospitality events, hotel technology conferences, summits, forums, and event coverage from Hospitality121.',
  keywords: 'hospitality events, hotel technology conference, hospitality summit, hospitality technology events, HITEC, hotel industry events',
  openGraph: {
    title: 'Recent Hospitality Events | Hospitality121',
    description: 'Near-term hospitality and hotel technology events, plus event coverage from the global hospitality RSS desk.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
}

export const revalidate = 3600

const CATEGORY_COLORS: Record<string, string> = {
  SUMMIT: 'bg-blue-50 text-blue-700',
  FORUM: 'bg-purple-50 text-purple-700',
  EXPO: 'bg-amber-50 text-amber-700',
  FAIR: 'bg-emerald-50 text-emerald-700',
  CONFERENCE: 'bg-red-50 text-red-700',
}

const TARGET_EVENT_REGIONS = [
  'usa',
  'united states',
  'new york',
  'los angeles',
  'atlanta',
  'nashville',
  'indianapolis',
  'canada',
  'toronto',
  'vancouver',
  'montreal',
  'ottawa',
  'europe',
  'london',
  'paris',
  'milan',
  'berlin',
  'amsterdam',
  'barcelona',
  'lisbon',
]

const PAST_EVENT_ARCHIVE = [
  {
    title: 'Hospitality Tech Expo London 2025',
    category: 'EXPO',
    date: '2025-09-30',
    location: 'London, UK',
    image: '/images/content/hitec-2026.jpg',
    summary: 'Hotel technology vendors, operators, and digital guest experience teams met in London to compare automation, payments, PMS, and AI tools.',
  },
  {
    title: 'The Lodging Conference 2025',
    category: 'CONFERENCE',
    date: '2025-09-15',
    location: 'Phoenix, AZ, USA',
    image: '/images/content/alis-los-angeles-2026.jpg',
    summary: "Owners, investors, brands, and lenders gathered for one of North America's most active hotel deal-making forums.",
  },
  {
    title: 'HITEC Indianapolis 2025',
    category: 'EXPO',
    date: '2025-06-16',
    location: 'Indianapolis, IN, USA',
    image: '/images/content/hitec-2026.jpg',
    summary: 'The hospitality technology market focused on AI operations, cybersecurity, integration strategy, and connected guest platforms.',
  },
  {
    title: 'International Hospitality Investment Forum 2025',
    category: 'FORUM',
    date: '2025-04-01',
    location: 'Berlin, Germany',
    image: '/images/content/hospitality-industry-summit-london.jpg',
    summary: 'European hotel investment leaders tracked capital markets, brand growth, luxury conversion, and mixed-use hospitality development.',
  },
  {
    title: 'Restaurants Canada Show 2025',
    category: 'FAIR',
    date: '2025-04-07',
    location: 'Toronto, Canada',
    image: '/images/content/restaurants-canada-show-2026.jpg',
    summary: 'Foodservice operators and hospitality suppliers examined workforce pressure, margins, delivery technology, and sustainable sourcing.',
  },
  {
    title: 'ALIS 2025',
    category: 'CONFERENCE',
    date: '2025-01-27',
    location: 'Los Angeles, CA, USA',
    image: '/images/content/alis-los-angeles-2026.jpg',
    summary: 'Hotel executives and investors opened the year with discussions on capital flows, conversion opportunities, and brand strategy.',
  },
  {
    title: 'Independent Lodging Congress 2024',
    category: 'CONFERENCE',
    date: '2024-10-23',
    location: 'New York, NY, USA',
    image: '/images/content/independent-lodging-congress-2026.jpg',
    summary: 'Independent hospitality leaders focused on boutique positioning, local partnerships, design, and owner-led innovation.',
  },
  {
    title: 'Hotel360 Expo 2024',
    category: 'EXPO',
    date: '2024-09-10',
    location: 'London, UK',
    image: '/images/content/luxury-travel-fair-london.jpg',
    summary: 'The UK hotel market compared technology, revenue, guest experience, marketing, and operational supplier solutions.',
  },
  {
    title: 'HITEC Toronto 2023',
    category: 'EXPO',
    date: '2023-06-26',
    location: 'Toronto, Canada',
    image: '/images/content/hitec-2026.jpg',
    summary: 'The hospitality technology community gathered in Canada as AI, mobile guest journeys, and cloud PMS adoption accelerated.',
  },
  {
    title: 'NYU International Hospitality Industry Investment Conference 2023',
    category: 'CONFERENCE',
    date: '2023-06-04',
    location: 'New York, NY, USA',
    image: '/images/content/nyu-hospitality-conference-2026.jpg',
    summary: 'Senior leaders discussed hotel investment, luxury demand, labor, lending conditions, and the future of brand growth.',
  },
]

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isEventCoverage(item: ContentItem) {
  const haystack = `${item.title} ${item.category} ${'excerpt' in item ? item.excerpt ?? '' : ''}`.toLowerCase()
  return ['event', 'conference', 'summit', 'forum', 'expo', 'hitec', 'trade show'].some(term => haystack.includes(term))
}

function isTargetEventRegion(location: string) {
  const normalized = location.toLowerCase()
  return TARGET_EVENT_REGIONS.some(region => normalized.includes(region))
}

export default function EventsPage() {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
  const all = getAllContent()

  const upcoming = all
    .filter(item => item.type === 'event')
    .filter(item => {
      const eventDate = new Date(item.eventDate || item.date)
      return eventDate >= today && isTargetEventRegion(item.location)
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 6)

  const pastEvents = PAST_EVENT_ARCHIVE
    .filter(item => {
      const eventDate = new Date(item.date)
      return eventDate >= new Date('2023-01-01') && eventDate <= lastMonth
    })
    .slice(0, 10)

  const eventCoverage = all
    .filter(item => item.type !== 'event')
    .filter(isEventCoverage)
    .slice(0, 8)

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Recent Event Desk</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-3">Hospitality Events</h1>
          <p className="text-muted text-lg max-w-2xl">
            Top upcoming hospitality, hotel technology, leadership, investment, and operations events across Canada, the United States, and Europe, plus a focused archive of major events since 2023.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-gold uppercase">Top 6 Upcoming</p>
              <h2 className="font-serif text-2xl font-bold text-gray-900">Canada, USA, and Europe</h2>
            </div>
            <span className="text-xs font-bold tracking-widest text-muted uppercase">{upcoming.length} events</span>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {upcoming.map(item => {
                const catColor = CATEGORY_COLORS[item.category] || 'bg-gray-50 text-gray-600'
                return (
                  <Link
                    key={item.slug}
                    href={`/content/${item.slug}`}
                    className="group grid sm:grid-cols-[160px_1fr] overflow-hidden rounded-lg bg-white border border-gray-100 hover:border-gold/40 hover:shadow-sm transition"
                  >
                    <div className="relative h-48 sm:h-full min-h-40">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${catColor}`}>{item.category}</span>
                        <span className="text-xs text-muted">{formatEventDate(item.eventDate)}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold leading-snug text-gray-900 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted">{item.location}</p>
                      {item.registrationUrl && (
                        <span className="mt-5 inline-flex text-xs font-bold tracking-wider text-gold">
                          Event details
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 p-8 text-sm text-muted">
              No listed Canada, USA, or Europe hospitality events are currently upcoming. Recent event coverage appears below.
            </div>
          )}
        </section>

        {pastEvents.length > 0 && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-gold uppercase">Past Event Archive</p>
                <h2 className="font-serif text-2xl font-bold text-gray-900">10 Major Events Since 2023</h2>
              </div>
              <span className="text-xs font-bold tracking-widest text-muted uppercase">through last month</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {pastEvents.map(item => {
                const catColor = CATEGORY_COLORS[item.category] || 'bg-gray-50 text-gray-600'
                return (
                  <article key={item.title} className="overflow-hidden rounded-lg bg-surface">
                    <div className="relative h-36">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale" />
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${catColor}`}>{item.category}</span>
                        <span className="text-xs text-muted">{formatEventDate(item.date)}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold leading-snug text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-xs font-semibold text-gold">{item.location}</p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">{item.summary}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        <AdSlot zone="mid-grid" />

        {eventCoverage.length > 0 && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-gold uppercase">RSS Event Coverage</p>
                <h2 className="font-serif text-2xl font-bold text-gray-900">Recent Conference and Event Signals</h2>
              </div>
              <Link href="/news" className="text-sm font-bold text-gold hover:underline">More news</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {eventCoverage.map(item => (
                <Link key={item.slug} href={`/content/${item.slug}`} className="group rounded-lg bg-surface overflow-hidden hover:ring-1 hover:ring-gold/40 transition">
                  <div className="relative h-40">
                    <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold tracking-widest text-gold mb-2">{item.category}</p>
                    <h3 className="font-serif text-base font-semibold leading-snug text-gray-900 line-clamp-3 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
