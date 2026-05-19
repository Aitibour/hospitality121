import fs from 'node:fs'
import path from 'node:path'

const FALLBACK_IMAGES = [
  'five-trends-reshaping-hospitality.jpg',
  'future-of-hotel-loyalty.jpg',
  'what-guests-want-2026.jpg',
  'revenue-beyond-rooms.jpg',
  'how-to-build-hotel-culture.jpg',
]

/**
 * Downloads a relevant image from Unsplash and saves to public/images/content/.
 * Falls back to copying an existing image if Unsplash is unavailable.
 * Always returns filename "auto-[slug].jpg" and always writes the file.
 * @param {string[]} keywords
 * @param {string} slug
 * @returns {Promise<string>} filename like "auto-[slug].jpg"
 */
export async function fetchImage(keywords, slug) {
  const filename = `auto-${slug}.jpg`
  const destPath = path.join(process.cwd(), 'public', 'images', 'content', filename)

  try {
    const query = encodeURIComponent(keywords[0] ?? 'luxury hotel')
    const apiRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!apiRes.ok) throw new Error(`Unsplash API ${apiRes.status}`)

    const data = await apiRes.json()
    const imageUrl = data?.urls?.regular
    if (!imageUrl) throw new Error('No image URL in Unsplash response')

    const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) })
    if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`)

    fs.writeFileSync(destPath, Buffer.from(await imgRes.arrayBuffer()))
    console.log(`✓ Image saved from Unsplash: ${filename}`)
  } catch (err) {
    console.warn(`⚠ Unsplash failed (${err.message}), using fallback`)
    const fallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]
    fs.copyFileSync(
      path.join(process.cwd(), 'public', 'images', 'content', fallback),
      destPath
    )
    console.log(`✓ Fallback image copied: ${fallback} → ${filename}`)
  }

  return filename
}
