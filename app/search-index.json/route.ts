import { getAllContent } from '@/lib/content'
import { getContentSummary } from '@/lib/ai-discovery'
import type { ContentItem } from '@/types/content'

export const dynamic = 'force-static'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com').replace(/\/$/, '')

function getAuthor(item: ContentItem): string {
  if (item.type === 'article' || item.type === 'news' || item.type === 'blog') return item.author
  if (item.type === 'podcast') return item.guest
  if (item.type === 'event') return item.organizer
  return ''
}

function getTimeLabel(item: ContentItem): string {
  if (item.type === 'podcast') return item.duration
  if (item.type === 'event') return item.eventDate
  return item.readTime
}

export function GET() {
  const items = getAllContent().map(item => ({
    slug: item.slug,
    url: `${BASE}/content/${item.slug}`,
    title: item.title,
    category: item.category,
    type: item.type,
    date: item.date,
    summary: getContentSummary(item, 240),
    timeLabel: getTimeLabel(item),
    image: item.image,
    author: getAuthor(item),
    featured: item.featured,
  }))

  return Response.json(items)
}
