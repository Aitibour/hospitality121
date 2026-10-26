'use client'

import { useEffect, useState } from 'react'
import HeroCarousel, { type HeroItem } from './HeroCarousel'

type Feed = { updatedAt: string; items: HeroItem[] }

export default function DailyHero({ initialFeed, fallbackItems }: { initialFeed: Feed; fallbackItems: HeroItem[] }) {
  const [feed, setFeed] = useState(initialFeed)
  useEffect(() => {
    const controller = new AbortController()
    let refreshTimer: ReturnType<typeof setTimeout>
    async function refresh() {
      try {
        const response = await fetch('/.netlify/functions/daily-hero', { signal: controller.signal })
        if (!response.ok) throw new Error('Feed unavailable')
        const next: Feed = await response.json()
        if (Array.isArray(next.items) && next.items.length > 0 && Number.isFinite(Date.parse(next.updatedAt))) setFeed(next)
      } catch {
        // Re-evaluate snapshot age even when upstream feeds fail.
        if (!controller.signal.aborted) setFeed(current => ({ ...current, updatedAt: new Date().toISOString() }))
      }
      if (!controller.signal.aborted) {
        const now = new Date()
        const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
        refreshTimer = setTimeout(refresh, Math.min(3600000, midnight - +now + 1000))
      }
    }
    void refresh()
    return () => { controller.abort(); clearTimeout(refreshTimer) }
  }, [])

  // Never label an old build-time snapshot as current news during an upstream outage.
  const recent = feed.items.filter(item => Date.parse(item.date) >= Date.parse(feed.updatedAt) - 7 * 86400000)
  const items = recent.length > 0 ? recent : fallbackItems
  return <HeroCarousel key={items.map(item => item.slug).join(',')} items={items} />
}
