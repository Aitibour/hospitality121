import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllContent } from '@/lib/content'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Hotel Industry Events & Conferences 2026',
  alternates: { canonical: 'https://hospitality121.com/events' },
  description: 'Hospitality industry summits, conferences, and forums — including HITEC, hotel technology events, and leadership forums where the industry connects.',
  keywords: 'hospitality events, hotel technology conference, HITEC, hospitality summit, hotel investment conference USA Canada',
  openGraph: {
    title: 'Hospitality Events | Hospitality121',
    description: 'Hospitality industry summits, forums, and expos from the Americas to Europe and Asia — where senior leaders connect and deals get done.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
}

export const revalidate = 3600

const NA_KEYWORDS = ['USA', 'Canada', ', CA,', ', ON,', ', BC,', ', AB,', ', NY,', ', GA,', ', TN,', ', IN,', ', TX,', 'New York', 'Los Angeles', 'Atlanta', 'Nashville', 'Indianapolis', 'Toronto', 'Ottawa', 'Vancouver', 'Montreal']

function isNorthAmerica(location: string) {
  return NA_KEYWORDS.some(k => location.includes(k))
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getMonthYear(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

const CATEGORY_COLORS: Record<string, string> = {
  SUMMIT: 'bg-blue-50 text-blue-700',
  FORUM: 'bg-purple-50 text-purple-700',
  EXPO: 'bg-amber-50 text-amber-700',
  FAIR: 'bg-emerald-50 text-emerald-700',
  CONFERENCE: 'bg-red-50 text-red-700',
}

export default function EventsPage() {
  const today = new Date('2026-05-17')

  const allEvents = getAllContent()
    .filter(item => item.type === 'event')
    .sort((a, b) => {
      const da = new Date((a as any).eventDate || a.date)
      const db = new Date((b as any).eventDate || b.date)
      const naA = isNorthAmerica((a as any).location || '')
      const naB = isNorthAmerica((b as any).location || '')
      // Within same date: NA first
      if (da.getTime() === db.getTime()) return naA === naB ? 0 : naA ? -1 : 1
      return da.getTime() - db.getTime()
    })

  const upcoming = allEvents.filter(item => new Date((item as any).eventDate || item.date) >= today)
  const past = allEvents.filter(item => new Date((item as any).eventDate || item.date) < today)

  // Group upcoming by month, NA events float to top within each month
  const upcomingByMonth: Record<string, typeof upcoming> = {}
  for (const item of upcoming) {
    const key = getMonthYear((item as any).eventDate || item.date)
    if (!upcomingByMonth[key]) upcomingByMonth[key] = []
    upcomingByMonth[key].push(item)
  }
  // Sort within each month: NA first, then by date
  for (const key of Object.keys(upcomingByMonth)) {
    upcomingByMonth[key].sort((a, b) => {
      const naA = isNorthAmerica((a as any).location || '')
      const naB = isNorthAmerica((b as any).location || '')
      if (naA !== naB) return naA ? -1 : 1
      return new Date((a as any).eventDate).getTime() - new Date((b as any).eventDate).getTime()
    })
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Industry Calendar</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-3">Events</h1>
          <p className="text-muted text-lg max-w-xl">
            Summits, forums, and expos where hospitality leaders connect, learn, and shape the industry — across North America, Europe, and Asia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">

        {/* Upcoming events timeline */}
        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <span className="text-xs font-bold tracking-widest text-muted uppercase ml-1">{upcoming.length} events</span>
            </div>

            <div className="space-y-10">
              {Object.entries(upcomingByMonth).map(([month, events]) => (
                <div key={month}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-xs font-bold tracking-widest text-gold uppercase">{month}</div>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-4">
                    {events.map(item => {
                      const ev = item as any
                      const catColor = CATEGORY_COLORS[ev.category] || 'bg-gray-50 text-gray-600'
                      const isNA = isNorthAmerica(ev.location || '')
                      return (
                        <div
                          key={item.slug}
                          className="group flex gap-4 bg-white rounded-xl border border-gray-100 hover:border-gold/40 hover:shadow-sm transition-all overflow-hidden"
                        >
                          {/* Date block */}
                          <div className="shrink-0 w-20 bg-gold/5 flex flex-col items-center justify-center py-4 border-r border-gray-100 group-hover:bg-gold/10 transition-colors">
                            <span className="text-2xl font-bold text-gold leading-none">
                              {new Date(ev.eventDate).getDate()}
                            </span>
                            <span className="text-xs font-bold text-muted uppercase tracking-wide mt-0.5">
                              {new Date(ev.eventDate).toLocaleDateString('en-GB', { month: 'short' })}
                            </span>
                          </div>

                          {/* Image */}
                          {item.image && (
                            <div className="shrink-0 w-28 h-24 relative hidden sm:block self-center">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 py-4 pr-4 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${catColor}`}>{ev.category}</span>
                              {isNA && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gold/10 text-gold">🌎 Americas</span>
                              )}
                              <span className="text-xs text-muted flex items-center gap-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                {ev.location}
                              </span>
                            </div>
                            <Link href={`/content/${item.slug}`} className="hover:text-gold transition-colors">
                              <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-gold transition-colors line-clamp-2">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted mt-1">{formatEventDate(ev.eventDate)}</p>
                          </div>

                          {/* Register CTA */}
                          {ev.registrationUrl && (
                            <div className="shrink-0 flex items-center pr-5">
                              <a
                                href={ev.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold tracking-wider text-gold border border-gold/40 rounded-lg px-4 py-2 hover:bg-gold hover:text-white transition-colors whitespace-nowrap"
                              >
                                Register →
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <AdSlot zone="mid-grid" />

        {/* Past events */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
              <h2 className="font-serif text-2xl font-bold text-gray-400">Past Events</h2>
              <span className="text-xs font-bold tracking-widest text-muted uppercase ml-1">{past.length} events</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map(item => {
                const ev = item as any
                const catColor = CATEGORY_COLORS[ev.category] || 'bg-gray-50 text-gray-600'
                return (
                  <Link
                    key={item.slug}
                    href={`/content/${item.slug}`}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-300 transition-all opacity-70 hover:opacity-100"
                  >
                    {item.image && (
                      <div className="relative h-36 w-full grayscale group-hover:grayscale-0 transition-all">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <span className="text-xs text-gray-50 font-medium">{formatEventDate(ev.eventDate)}</span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${catColor} mb-2 inline-block`}>{ev.category}</span>
                      <h3 className="font-serif text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted mt-1 flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {ev.location}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
