import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'

type ContentType = ContentItem['type']

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
