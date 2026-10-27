import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import type { ContentItem } from '@/types/content'

/** Share one selector across homepage sections to avoid repeating stories or identical image bytes. */
export function createHomeSelection() {
  const seenSlugs = new Set<string>()
  const seenImages = new Set<string>()
  const hashes = new Map<string, string>()
  return function select<T extends ContentItem>(items: T[], limit: number): T[] {
    const selected: T[] = []
    for (const item of items) {
      let imageKey = hashes.get(item.image)
      if (!imageKey) {
        const file = path.join(process.cwd(), 'public', item.image)
        imageKey = item.image.startsWith('/images/') && fs.existsSync(file)
          ? createHash('sha256').update(fs.readFileSync(file)).digest('hex') : item.image.split('?')[0]
        hashes.set(item.image, imageKey)
      }
      if (seenSlugs.has(item.slug) || seenImages.has(imageKey)) continue
      selected.push(item)
      seenSlugs.add(item.slug)
      seenImages.add(imageKey)
      if (selected.length >= limit) break
    }
    return selected
  }
}
