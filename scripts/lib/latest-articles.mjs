/** Date-led homepage coverage: never silently fill fresh sections with the archive. */
export function newestArticleFirst(a, b) {
  return Date.parse(b.date) - Date.parse(a.date)
    || (Date.parse(b.cloudPublishedAt) || 0) - (Date.parse(a.cloudPublishedAt) || 0)
}

export function selectLatestArticles(items, now = new Date()) {
  const cutoff = +now - 7 * 86400000
  const slugs = new Set(), images = new Set()
  return [...items].sort(newestArticleFirst).filter(item => {
    const date = Date.parse(item.date)
    if (!['news', 'article', 'blog'].includes(item.type) || date < cutoff || date > +now || !Number.isFinite(date)) return false
    if (slugs.has(item.slug) || images.has(item.image)) return false
    slugs.add(item.slug); images.add(item.image)
    return true
  })
}
