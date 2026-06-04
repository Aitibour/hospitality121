import { getAllContent, getContentBySlug } from '@/lib/content'
import { getMatchingPillar } from '@/lib/diamond-seo'
import type { ContentItem } from '@/types/content'

export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com').replace(/\/$/, '')

export function getContentAuthor(item: ContentItem): string {
  if (item.type === 'article' || item.type === 'news' || item.type === 'blog') return item.author
  if (item.type === 'podcast') return item.guest
  return item.organizer
}

export function cleanMarkdown(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_|>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getContentSummary(item: ContentItem, maxLength = 280): string {
  const result = getContentBySlug(item.slug)
  if (!result) return ''

  const englishBody = result.body.split('\n<!-- FR -->\n')[0]
  const frontmatterSummary = item.type === 'blog' ? item.excerpt : ''
  const summary = cleanMarkdown(frontmatterSummary || englishBody)
  if (summary.length <= maxLength) return summary
  return `${summary.slice(0, maxLength - 3).trimEnd()}...`
}

export function getAiContentIndex() {
  return getAllContent().map(item => {
    const summary = getContentSummary(item)
    const pillar = getMatchingPillar(`${item.title} ${item.category} ${summary}`)

    return {
      title: item.title,
      canonicalUrl: `${SITE_URL}/content/${item.slug}`,
      type: item.type,
      category: item.category,
      datePublished: item.date,
      author: getContentAuthor(item),
      summary,
      authorityPillar: {
        name: pillar.title,
        url: pillar.canonical,
      },
      image: item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`,
      sourceUrl: 'sourceUrl' in item ? item.sourceUrl || null : null,
    }
  })
}
