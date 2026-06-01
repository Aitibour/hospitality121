import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULT_MIN_BYTES = 120_000
const DEFAULT_MAX_WIDTH = 1400
const DEFAULT_JPEG_QUALITY = 78
const DEFAULT_PNG_QUALITY = 82

export async function optimizeImage(filePath, options = {}) {
  const {
    minBytes = DEFAULT_MIN_BYTES,
    maxWidth = DEFAULT_MAX_WIDTH,
    jpegQuality = DEFAULT_JPEG_QUALITY,
    pngQuality = DEFAULT_PNG_QUALITY,
  } = options

  if (!/\.(jpe?g|png)$/i.test(filePath)) return { changed: false, before: 0, after: 0 }
  if (!fs.existsSync(filePath)) return { changed: false, before: 0, after: 0 }

  const before = fs.statSync(filePath).size
  if (before < minBytes) return { changed: false, before, after: before }

  const ext = path.extname(filePath).toLowerCase()
  const tempPath = `${filePath}.tmp-${process.pid}`
  const image = sharp(filePath, { failOn: 'none' }).rotate()
  const metadata = await image.metadata()
  const pipeline = metadata.width && metadata.width > maxWidth
    ? image.resize({ width: maxWidth, withoutEnlargement: true })
    : image

  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9, quality: pngQuality, palette: true }).toFile(tempPath)
  } else {
    await pipeline.jpeg({ quality: jpegQuality, progressive: true, mozjpeg: true }).toFile(tempPath)
  }

  const after = fs.statSync(tempPath).size
  if (after < before * 0.96) {
    fs.renameSync(tempPath, filePath)
    return { changed: true, before, after }
  }

  fs.unlinkSync(tempPath)
  return { changed: false, before, after: before }
}

export async function optimizeImageDirectory(dirPath, options = {}) {
  if (!fs.existsSync(dirPath)) return []

  const results = []
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const filePath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      results.push(...await optimizeImageDirectory(filePath, options))
    } else if (entry.isFile()) {
      const result = await optimizeImage(filePath, options)
      if (result.before > 0) results.push({ filePath, ...result })
    }
  }
  return results
}
