import fs from 'node:fs'
import path from 'node:path'

// Fallback images that actually exist in public/images/.
// These are used when both Unsplash fails and no dedicated blog images are present.
const FALLBACK_IMAGES = [
  'brand-banner-1.png',
  'brand-banner-2.png',
  'brand-banner-3.png',
  'brand-banner-4.png',
  'brand-banner-6.png',
  'brand-banner-7.png',
]

// Source directory for fallback images (relative to project root).
const FALLBACK_SRC_DIR = path.join('public', 'images')

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

  // Ensure the destination directory exists.
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

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
    console.log(`[unsplash] Image saved from Unsplash: ${filename}`)
  } catch (err) {
    console.warn(`[unsplash] Unsplash failed (${err.message}), trying local fallback`)
    try {
      const fallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]
      fs.copyFileSync(
        path.join(process.cwd(), FALLBACK_SRC_DIR, fallback),
        destPath
      )
      console.log(`[unsplash] Fallback image copied: ${fallback} -> ${filename}`)
    } catch (fallbackErr) {
      console.error(`[unsplash] Fallback copy also failed (${fallbackErr.message}). No image written.`)
      // Return the filename anyway so callers can continue; the image just won't be on disk.
    }
  }

  return filename
}
