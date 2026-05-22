/**
 * Replace em dashes, en dashes, and double hyphens in MDX body text
 * with natural English phrasing. Only modifies content below the
 * closing frontmatter delimiter (second ---).
 *
 * Usage: node scripts/humanize-content.mjs
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'fs/promises'

const ROOT = path.join(process.cwd(), 'content')

function humanize(body) {
  return body
    // Em dash with spaces — most common case: replace with comma or colon
    .replace(/ — /g, ', ')
    // En dash with spaces
    .replace(/ – /g, ' to ')
    // En dash used as range (e.g. 2020–2026)
    .replace(/(\d)–(\d)/g, '$1 to $2')
    // Double hyphen
    .replace(/ -- /g, ', ')
    // Em dash directly adjacent to words (no spaces)
    .replace(/—/g, ', ')
    // En dash directly adjacent to words
    .replace(/–/g, ' to ')
}

async function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')

  // Split on frontmatter: find second --- delimiter
  const fmEnd = raw.indexOf('---', 3)
  if (fmEnd === -1) return false

  const frontmatter = raw.slice(0, fmEnd + 3)
  const body = raw.slice(fmEnd + 3)

  const newBody = humanize(body)
  if (newBody === body) return false

  fs.writeFileSync(filePath, frontmatter + newBody, 'utf8')
  return true
}

async function main() {
  // Collect all MDX files across content subdirectories
  const files = []
  for (const dir of ['articles', 'blog', 'events', 'news', 'podcasts']) {
    const dirPath = path.join(ROOT, dir)
    if (!fs.existsSync(dirPath)) continue
    for (const f of fs.readdirSync(dirPath)) {
      if (f.endsWith('.mdx')) files.push(path.join(dirPath, f))
    }
  }

  console.log(`Processing ${files.length} files...\n`)
  let changed = 0

  for (const file of files) {
    const wasChanged = await processFile(file)
    const label = path.relative(ROOT, file)
    console.log(`${wasChanged ? '✓' : '–'} ${label}`)
    if (wasChanged) changed++
  }

  console.log(`\nDone. ${changed}/${files.length} files updated.`)
}

main()
