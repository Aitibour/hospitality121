export default async function handler(request) {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } })
  // Compatibility for old cached clients: never return publisher destinations.
  const origin = new URL(request.url).origin
  if (!/^https:\/\/(?:hospitality121\.com|[a-z0-9-]+\.netlify\.app)$/.test(origin)) return new Response(null, { status: 400 })
  let feed
  try {
    const response = await fetch(`${origin}/hero-feed.json`, { signal: AbortSignal.timeout(10000) })
    if (!response.ok) throw new Error('Published feed unavailable')
    feed = await response.json()
    feed.items = feed.items.filter(item => /^[a-z0-9-]+$/.test(item.slug) && item.href === `/content/${item.slug}`)
  } catch {
    feed = { updatedAt: new Date().toISOString(), items: [] }
  }
  const available = feed.items.length > 0
  return Response.json(feed, {
    status: available ? 200 : 503,
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': available ? 'public, durable, max-age=3600' : 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
