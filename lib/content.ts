import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'
import { AUTHORS_BY_NAME } from '@/lib/authors'
import { isAllowedRegionalContent } from '@/lib/regional-filter'
import { isPublishedContent } from '@/lib/editorial-policy.mjs'
import { publicContentSlug, contentFileSlug } from '@/lib/content-routing.mjs'

type ContentType = ContentItem['type']

const DIR_MAP: Record<string, ContentType> = {
  articles: 'article',
  podcasts: 'podcast',
  news: 'news',
  events: 'event',
  blog: 'blog',
}

function buildContentItem(data: Record<string, unknown>, slug: string, type: ContentType): ContentItem {
  const authorName = String(data.author || data.guest || data.organizer || '')
  const authorRecord = AUTHORS_BY_NAME[authorName]
  const injectedAvatar = authorRecord ? authorRecord.photo : (data.authorAvatar || '/images/Logo.png')
  const item = { ...data, slug: publicContentSlug(type, slug), type } as unknown as ContentItem
  ;(item as Record<string, unknown>).authorAvatar = injectedAvatar
  ;(item as Record<string, unknown>).guestAvatar = data.guest ? injectedAvatar : (data.guestAvatar || '/images/Logo.png')
  ;(item as Record<string, unknown>).organizerAvatar = AUTHORS_BY_NAME[String(data.organizer)]?.photo || data.organizerAvatar || '/images/Logo.png'
  return item
}

export function getContentBySlug(slug: string): { item: ContentItem; body: string } | null {
  for (const [dir, type] of Object.entries(DIR_MAP)) {
    const fileSlug = contentFileSlug(type, slug)
    if (publicContentSlug(type, fileSlug) !== slug) continue
    const filePath = path.join(process.cwd(), 'content', dir, `${fileSlug}.mdx`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const item = buildContentItem(data, fileSlug, type)
      if (!isPublishedContent(data) || !isAllowedRegionalContent(item)) return null
      return { item, body: content }
    }
  }
  return null
}

export function getAllSlugs(): { slug: string }[] {
  const slugs: { slug: string }[] = []
  for (const dir of Object.keys(DIR_MAP)) {
    const fullDir = path.join(process.cwd(), 'content', dir)
    try {
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.mdx'))
      for (const f of files) {
        const slug = f.replace('.mdx', '')
        const raw = fs.readFileSync(path.join(fullDir, f), 'utf-8')
        const { data } = matter(raw)
        const item = buildContentItem(data, slug, DIR_MAP[dir])
        if (isPublishedContent(data) && isAllowedRegionalContent(item)) slugs.push({ slug: item.slug })
      }
    } catch { /* skip */ }
  }
  return slugs
}

function readDir(dir: string, type: ContentType): ContentItem[] {
  const fullDir = path.join(process.cwd(), 'content', dir)
  let files: string[]
  try {
    files = fs.readdirSync(fullDir)
  } catch {
    return []
  }
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(fullDir, filename), 'utf-8')
      const { data } = matter(raw)
      if (!isPublishedContent(data)) return null
      if (!data.title || !data.date) {
        throw new Error(`Missing required frontmatter (title, date) in content/${dir}/${filename}`)
      }
      return buildContentItem(data, slug, type)
    })
    .filter((item): item is ContentItem => item !== null)
}

let productionContent: ContentItem[] | undefined

export function getAllContent(): ContentItem[] {
  // Static builds reuse the same immutable frontmatter across hundreds of routes.
  // Development continues reading files so editorial changes are visible immediately.
  if (process.env.NODE_ENV === 'production' && productionContent) return [...productionContent]
  const articles = readDir('articles', 'article')
  const podcasts = readDir('podcasts', 'podcast')
  const news     = readDir('news', 'news')
  const events   = readDir('events', 'event')
  const blog     = readDir('blog', 'blog')
  const all = [...articles, ...podcasts, ...news, ...events, ...blog]
    .filter(isAllowedRegionalContent)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  if (process.env.NODE_ENV === 'production') productionContent = all
  return [...all]
}

export function getFeaturedContent(): ContentItem[] {
  return getAllContent().filter(item => item.featured)
}
