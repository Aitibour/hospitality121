import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { optimizeImage } from './image-optimizer.mjs'

export function imageFingerprint(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

/** Download a relevant, unused photograph. Never substitute a copied brand banner. */
export async function fetchImage(keywords, slug) {
  if (!process.env.UNSPLASH_ACCESS_KEY) throw new Error('A unique topical image is required: configure UNSPLASH_ACCESS_KEY before publishing generated articles.')
  const filename = `auto-${slug}.jpg`
  const imageDir = path.join(process.cwd(), 'public', 'images', 'content')
  const destPath = path.join(imageDir, filename)
  const candidatePath = path.join(imageDir, `.candidate-${slug}.jpg`)
  fs.mkdirSync(imageDir, { recursive: true })
  if (fs.existsSync(destPath)) throw new Error(`Image already exists: ${filename}`)
  const used = new Set(fs.readdirSync(imageDir).filter(name => /\.(jpe?g|png|webp)$/i.test(name)).map(name => imageFingerprint(fs.readFileSync(path.join(imageDir, name)))))
  const queries = keywords.filter(Boolean).slice(0, 4)
  let lastError
  for (const query of queries) {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`, {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }, signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) throw new Error(`Unsplash API ${response.status}`)
      const photo = await response.json()
      if (!photo?.urls?.regular) throw new Error('Missing photograph URL')
      const download = await fetch(photo.urls.regular, { signal: AbortSignal.timeout(15000) })
      if (!download.ok || !download.headers.get('content-type')?.startsWith('image/')) throw new Error('Invalid image response')
      const buffer = Buffer.from(await download.arrayBuffer())
      if (used.has(imageFingerprint(buffer))) continue
      fs.writeFileSync(candidatePath, buffer)
      await optimizeImage(candidatePath, { minBytes: 0 })
      if (used.has(imageFingerprint(fs.readFileSync(candidatePath)))) {
        fs.unlinkSync(candidatePath)
        continue
      }
      fs.renameSync(candidatePath, destPath)
      console.log(`[image] Unique topical photograph saved: ${filename}`)
      return filename
    } catch (error) {
      lastError = error
      if (fs.existsSync(candidatePath)) fs.unlinkSync(candidatePath)
    }
  }
  throw new Error(`No unique topical image found; article was not published. ${lastError?.message || 'Photo candidates were duplicates.'}`)
}
