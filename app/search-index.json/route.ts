import { getAllContent } from '@/lib/content'
import type { ContentItem } from '@/types/content'

export const dynamic = 'force-static'

function getAuthor(item: ContentItem): string {
  if (item.type === 'article' || item.type === 'news' || item.type === 'blog') return item.author
  if (item.type === 'podcast') return item.guest
  if (item.type === 'event') return item.organizer
  return ''
}

export function GET() {
  const items = getAllContent().map(item => ({
    slug: item.slug,
    title: item.title,
    category: item.category,
    type: item.type,
    date: item.date,
    image: item.image,
    author: getAuthor(item),
  }))

  return Response.json(items)
}
