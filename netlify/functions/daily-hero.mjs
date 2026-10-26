import { loadDailyHero, secondsUntilTomorrow } from '../../scripts/lib/daily-hero.mjs'

export default async function handler(request) {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } })
  const now = new Date()
  const feed = await loadDailyHero(now)
  const available = feed.items.length > 0
  return Response.json(feed, {
    status: available ? 200 : 503,
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': available ? `public, durable, max-age=${secondsUntilTomorrow(now)}` : 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
