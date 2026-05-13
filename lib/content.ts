import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'

function readDir(dir: string, type: 'article' | 'podcast'): ContentItem[] {
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
      // slug and type intentionally override any same-named frontmatter fields
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
