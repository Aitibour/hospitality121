export function createViewsHandler({ openStore, slugs }) {
  const published = new Set(slugs)
  const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
  const count = async (store, slug) => (await store.list({ prefix: `${slug}/` })).blobs.length
  return async function handler(request) {
    if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed' }, 405)
    const url = new URL(request.url)
    try {
      if (request.method === 'GET') {
        const requested = [...new Set((url.searchParams.get('slugs') || '').split(',').filter(Boolean))]
        if (!requested.length || requested.length > 20 || requested.some(slug => !published.has(slug))) return json({ error: 'Invalid articles' }, 400)
        const store = openStore()
        const counts = Object.fromEntries(await Promise.all(requested.map(async slug => [slug, await count(store, slug)])))
        return json({ counts, metric: 'article sessions', since: '2026-10-29' })
      }
      const origin = request.headers.get('origin')
      if (origin !== url.origin) return json({ error: 'Same-origin request required' }, 403)
      if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'JSON required' }, 415)
      const body = await request.text()
      if (body.length > 512) return json({ error: 'Request too large' }, 413)
      let data
      try { data = JSON.parse(body) } catch { return json({ error: 'Invalid JSON' }, 400) }
      if (!published.has(data.slug) || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(data.session || '')) return json({ error: 'Invalid view' }, 400)
      const store = openStore()
      // One immutable entry per article/browser session avoids lost increments
      // under concurrency and prevents refreshes from inflating the counter.
      const result = await store.set(`${data.slug}/${data.session}`, '1', { onlyIfNew: true })
      return json({ counts: { [data.slug]: await count(store, data.slug) }, recorded: result.modified })
    } catch {
      // Missing metrics are never rendered as a fabricated zero.
      return json({ error: 'View counts temporarily unavailable' }, 503)
    }
  }
}
