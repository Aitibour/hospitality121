import type { ContentItem } from '@/types/content'

function getAuthorKey(item: ContentItem): string {
  if (item.type === 'podcast') return item.guest || ''
  if (item.type === 'event') return item.organizer || ''
  return item.author || ''
}

export function limitByAuthor(items: ContentItem[], max = 2): ContentItem[] {
  const counts: Record<string, number> = {}
  return items.filter(item => {
    const key = getAuthorKey(item)
    if (!key) return true
    counts[key] = (counts[key] || 0) + 1
    return counts[key] <= max
  })
}

/** For Editor's Pick: prefer real named authors over editorial/logo entries */
export function pickEditorItems(items: ContentItem[], count = 5): ContentItem[] {
  const SKIP_AUTHORS = ['H1H Events', 'H1H Editorial', 'Hospitality121']
  const real = items.filter(item => {
    const author = getAuthorKey(item)
    return author && !SKIP_AUTHORS.includes(author)
  })
  const fallback = items.filter(item => {
    const author = getAuthorKey(item)
    return !author || SKIP_AUTHORS.includes(author)
  })
  const merged = [...real, ...fallback]
  return limitByAuthor(merged, 1).slice(0, count)
}
