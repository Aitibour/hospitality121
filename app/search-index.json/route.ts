import { getAllContent } from '@/lib/content'
import type { ContentItem } from '@/types/content'

export const dynamic = 'force-static'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com').replace(/\/$/, '')

function getAuthor(item: ContentItem): string {
  if (item.type === 'article' || item.type === 'news' || item.type === 'blog') return item.author
  if (item.type === 'podcast') return item.guest
  if (item.type === 'event') return item.organizer
  return ''
}

function getSummary(item: ContentItem): string {
  if (item.type === 'blog') return item.excerpt || ''
  if (item.type === 'podcast') return item.showNotes || item.guestBio || ''
  if (item.type === 'event') return item.location
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
    summary: getSummary(item),
    timeLabel: getTimeLabel(item),
    image: item.image,
    author: getAuthor(item),
    featured: item.featured,
  }))

  return Response.json(items)
}
