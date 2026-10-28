import { classifyHeroTopic, similarStory } from './daily-hero.mjs'

/** Only locally published articles can become hero destinations. RSS is discovery, not a destination. */
export function selectPublishedHeroItems(content, now = new Date()) {
  const selected = [], images = new Set(), slugs = new Set()
  for (const item of [...content].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    const topic = classifyHeroTopic(`${item.title} ${item.category} ${item.description || ''}`)
    if (!topic || !['news', 'blog', 'article'].includes(item.type)) continue
    if (!/^[a-z0-9-]+$/.test(item.slug) || !item.image?.startsWith('/images/')) continue
    if (!Number.isFinite(Date.parse(item.date)) || Date.parse(item.date) > +now) continue
    if (slugs.has(item.slug) || images.has(item.image) || selected.some(other => similarStory(other.title, item.title))) continue
    slugs.add(item.slug)
    images.add(item.image)
    selected.push({ ...item, href: `/content/${item.slug}`, rss: false })
    if (selected.length === 8) break
  }
  return selected
}
