import fs from 'node:fs'
import path from 'node:path'

const files = fs.readdirSync('out', { recursive: true }).filter(f => f.endsWith('.html'))
const issues = [], titles = new Map()
let links = 0, images = 0
const exists = pathname => [pathname, `${pathname}.html`, `${pathname}/index.html`].some(file => fs.existsSync(path.join('out', file)))
for (const file of files) {
  const html = fs.readFileSync(path.join('out', file), 'utf8')
  if (file === '404.html' || file.startsWith('_not-found')) continue
  const route = '/' + file.replace(/(?:\/index)?\.html$/, '').replace(/^index$/, '')
  const h1 = [...html.matchAll(/<h1\b/g)].length
  if (h1 !== 1) issues.push({ route, issue: `Expected one H1, found ${h1}` })
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1]
  if (!canonical?.startsWith('https://hospitality121.com')) issues.push({ route, issue: 'Missing or non-public canonical', canonical })
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]
  if (!title) issues.push({ route, issue: 'Missing title' })
  if (titles.has(title)) issues.push({ route, issue: 'Duplicate page title', other: titles.get(title) })
  titles.set(title, route)
  if (!/<meta name="description" content="[^"]+"/.test(html)) issues.push({ route, issue: 'Missing description' })
  for (const [, raw] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    links++
    const url = new URL(raw.replaceAll('&amp;', '&'), `https://hospitality121.com${route}`)
    if (url.origin === 'https://hospitality121.com' && !exists(decodeURIComponent(url.pathname))) issues.push({ route, issue: 'Broken internal link', href: raw })
  }
  for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    images++
    if (src.startsWith('/') && !exists(src.split('?')[0])) issues.push({ route, issue: 'Missing local image', src })
  }
}
const summary = { htmlFiles: files.length, links, images, issues: issues.length }
fs.writeFileSync('reports/editorial-audit/export-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), method: 'All exported HTML: H1, title, description, canonical origin, internal anchor targets and local image paths. External links, fragments and browser behaviour require separate checks.', summary, issues }, null, 2))
console.log(JSON.stringify(summary, null, 2))
if (issues.length) console.log(JSON.stringify(issues.slice(0, 20), null, 2))
if (issues.some(issue => /Broken internal link|Missing local image|Missing title|Missing description|non-public canonical/.test(issue.issue))) process.exitCode = 1
