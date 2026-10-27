import fs from 'node:fs'

const inventory = JSON.parse(fs.readFileSync('reports/editorial-audit/inventory.json', 'utf8'))
const urls = [...new Set(inventory.records.map(r => r.metadata.sourceUrl).filter(Boolean))]
const results = []
let cursor = 0
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++]
    try {
      const parsed = new URL(url)
      // Check known publication hosts only. Do not request arbitrary destinations from content.
      const allowed = ['hospitalitynet.org', 'hotelmanagement.net', 'skift.com', 'hoteltechnologynews.com', 'marriott.com', 'hilton.com', 'hyatt.com', 'ihgplc.com', 'wyndhamhotels.com', 'choicehotels.com', 'mandarinoriental.com', 'accor.com']
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password || !allowed.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) {
        results.push({ url, status: 'not checked: outside trusted publisher hosts' }); continue
      }
      const response = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(12000) })
      results.push({ url, status: response.status, redirect: response.headers.get('location'), meaning: response.ok ? 'Reachable; claims NOT verified' : response.status === 403 ? 'Access denied; not evidence of a broken link' : 'Needs manual review' })
      await response.body?.cancel()
    } catch (error) { results.push({ url, status: 'network error', reason: error.name }) }
  }
}))
results.sort((a, b) => a.url.localeCompare(b.url))
fs.writeFileSync('reports/editorial-audit/source-link-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), method: 'HEAD only, no redirects followed; reachability is not factual verification', results }, null, 2))
console.log(JSON.stringify({ sources: urls.length, statuses: results.reduce((counts, r) => ({ ...counts, [r.status]: (counts[r.status] || 0) + 1 }), {}) }, null, 2))
