import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'

function readDir(dir: string, type: 'article' | 'podcast'): ContentItem[] {
  const fullDir = path.join(process.cwd(), 'content', dir)
  if (!fs.existsSync(fullDir)) return []
  return fs.readdirSync(fullDir)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(fullDir, filename), 'utf-8')
      const { data } = matter(raw)
      return { ...data, slug, type } as ContentItem
    })
}

export function getAllContent(): ContentItem[] {
  const articles = readDir('articles', 'article')
  const podcasts = readDir('podcasts', 'podcast')
  return [...articles, ...podcasts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getFeaturedContent(): ContentItem[] {
  return getAllContent().filter(item => item.featured)
}
