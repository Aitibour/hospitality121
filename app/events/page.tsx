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

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isEventCoverage(item: ContentItem) {
  const haystack = `${item.title} ${item.category} ${'excerpt' in item ? item.excerpt ?? '' : ''}`.toLowerCase()
  return ['event', 'conference', 'summit', 'forum', 'expo', 'hitec', 'trade show'].some(term => haystack.includes(term))
}

export default function EventsPage() {
  const today = startOfToday()
  const maxDate = addDays(today, 31)
  const all = getAllContent()

  const upcoming = all
    .filter(item => item.type === 'event')
    .filter(item => {
      const eventDate = new Date(item.eventDate || item.date)
      return eventDate >= today && eventDate <= maxDate
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

  const eventCoverage = all
    .filter(item => item.type !== 'event')
    .filter(isEventCoverage)
    .slice(0, 8)

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Recent Event Desk</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Hospitality Events This Month
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Near-term hospitality, hotel technology, leadership, investment, and operations events worldwide. The page stays focused on the next month and recent RSS-driven event coverage.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-gold uppercase">Next 31 Days</p>
              <h2 className="font-serif text-2xl font-bold text-gray-900">Upcoming Hospitality Events</h2>
            </div>
            <span className="text-xs font-bold tracking-widest text-muted uppercase">{upcoming.length} recent events</span>
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
              No listed hospitality events fall within the next month. Recent event coverage from the RSS desk appears below.
            </div>
          )}
        </section>

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
