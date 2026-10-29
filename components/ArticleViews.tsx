'use client'

import { useEffect, useState } from 'react'
import { simulatedArticleViews, TEMPORARY_SIMULATED_VIEWS } from '@/lib/article-view-display'

const requests = new Map<string, Promise<number | null>>()
function readCount(slug: string) {
  if (!requests.has(slug)) {
    requests.set(slug, fetch(`/.netlify/functions/article-views?slugs=${encodeURIComponent(slug)}`)
      .then(async response => response.ok ? (await response.json()).counts[slug] as number : null)
      .catch(() => null))
  }
  return requests.get(slug)!
}

export default function ArticleViews({ slug, record = false }: { slug: string; record?: boolean }) {
  const [views, setViews] = useState<number | null>(null)
  useEffect(() => {
    let active = true
    void readCount(slug).then(count => { if (active) setViews(count) })
    const timer = record ? setTimeout(async () => {
      if (document.visibilityState !== 'visible' || /bot|crawler|spider/i.test(navigator.userAgent)) return
      const key = `h121-view:${slug}`
      let session: string
      try {
        session = sessionStorage.getItem(key) || crypto.randomUUID()
        sessionStorage.setItem(key, session)
      } catch { return }
      try {
        const response = await fetch('/.netlify/functions/article-views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, session }) })
        if (!response.ok) return
        const data = await response.json()
        requests.set(slug, Promise.resolve(data.counts[slug]))
        if (active) setViews(data.counts[slug])
      } catch { /* Keep the last real count on network failure. */ }
    }, 5000) : undefined
    return () => { active = false; clearTimeout(timer) }
  }, [slug, record])
  const displayedViews = TEMPORARY_SIMULATED_VIEWS ? simulatedArticleViews(slug) : views
  const description = TEMPORARY_SIMULATED_VIEWS
    ? 'Temporary simulated view count. Actual article sessions are tracked separately.'
    : 'Article views since 29 October 2026; counted once per browser session after five seconds. Views are not unique people or confirmed reads.'
  return <span className="text-xs" title={description}>{displayedViews === null ? 'Views unavailable' : `${displayedViews.toLocaleString('en-US')} ${displayedViews === 1 ? 'view' : 'views'}`}</span>
}
