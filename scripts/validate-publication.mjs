import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { isPublishedContent, publicationIssues } from '../lib/editorial-policy.mjs'
import { publicContentSlug } from '../lib/content-routing.mjs'

const errors = []
const slugs = new Set(), sources = new Map()
let total = 0
for (const directory of ['articles', 'news', 'blog', 'podcasts', 'events']) {
  for (const name of fs.readdirSync(`content/${directory}`).filter(f => f.endsWith('.mdx'))) {
    const file = `content/${directory}/${name}`
    const { data, content } = matter(fs.readFileSync(file, 'utf8'))
    total++
    for (const issue of publicationIssues(data)) errors.push(`${file}: ${issue}`)
    const contentType = { articles: 'article', news: 'news', blog: 'blog', podcasts: 'podcast', events: 'event' }[directory]
    const slug = publicContentSlug(contentType, name.slice(0, -4))
    if (slugs.has(slug)) errors.push(`${file}: duplicate public slug`)
    slugs.add(slug)
    if (!content.trim()) errors.push(`${file}: empty body`)
    if (data.status === 'published' && data.aiGenerated && !isPublishedContent(data)) errors.push(`${file}: recorded editorial checks incomplete`)
    if (data.image?.startsWith('/images/') && !fs.existsSync(path.join('public', data.image))) errors.push(`${file}: missing featured image`)
    if (data.sourceUrl) {
      try {
        const url = new URL(data.sourceUrl)
        url.hash = ''
        for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/.test(key)) url.searchParams.delete(key)
        const canonical = url.href.replace(/\/$/, '')
        if (sources.has(canonical)) errors.push(`${file}: source reused by ${sources.get(canonical)}`)
        sources.set(canonical, file)
      } catch { errors.push(`${file}: malformed source URL`) }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
else console.log(`Structural publication validation passed for ${total} content files. This does not independently verify factual accuracy or image rights.`)
