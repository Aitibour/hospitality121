import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'

type ContentType = ContentItem['type']

const DIR_MAP: Record<string, ContentType> = {
  articles: 'article',
  podcasts: 'podcast',
  news: 'news',
  events: 'event',
  blog: 'blog',
}

export function getContentBySlug(slug: string): { item: ContentItem; body: string } | null {
  for (const [dir, type] of Object.entries(DIR_MAP)) {
    const filePath = path.join(process.cwd(), 'content', dir, `${slug}.mdx`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      return { item: { ...data, slug, type } as ContentItem, body: content }
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
      for (const f of files) slugs.push({ slug: f.replace('.mdx', '') })
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
      if (!data.title || !data.date) {
        throw new Error(`Missing required frontmatter (title, date) in content/${dir}/${filename}`)
      }
      return { ...data, slug, type } as ContentItem
    })
}

export function getAllContent(): ContentItem[] {
  const articles = readDir('articles', 'article')
  const podcasts = readDir('podcasts', 'podcast')
  const news     = readDir('news', 'news')
  const events   = readDir('events', 'event')
  const blog     = readDir('blog', 'blog')
  return [...articles, ...podcasts, ...news, ...events, ...blog].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getFeaturedContent(): ContentItem[] {
  return getAllContent().filter(item => item.featured)
}
