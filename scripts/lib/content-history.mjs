import fs from 'node:fs'
import path from 'node:path'

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---/

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function loadSeen(trackerPath) {
  if (!fs.existsSync(trackerPath)) return []
  const parsed = JSON.parse(fs.readFileSync(trackerPath, 'utf8'))
  return Array.isArray(parsed) ? parsed : []
}

export function saveSeen(trackerPath, urls) {
  fs.writeFileSync(trackerPath, JSON.stringify([...new Set(urls)], null, 2))
}

export function collectExistingSourceUrls(rootDir = process.cwd()) {
  const urls = new Set()
  for (const dir of ['blog', 'news']) {
    for (const meta of readContentMeta(path.join(rootDir, 'content', dir))) {
      if (meta.sourceUrl) urls.add(meta.sourceUrl)
    }
  }
  return urls
}

export function collectExistingTitles(rootDir = process.cwd()) {
  const titles = []
  for (const dir of ['blog', 'news', 'articles']) {
    for (const meta of readContentMeta(path.join(rootDir, 'content', dir))) {
      if (meta.title) titles.push(meta.title)
    }
  }
  return titles
}

export function collectExistingKeywordSets(rootDir = process.cwd()) {
  const sets = []
  for (const dir of ['blog', 'news', 'articles']) {
    for (const meta of readContentMeta(path.join(rootDir, 'content', dir))) {
      if (meta.keywords) sets.push(meta.keywords)
      if (meta.primaryKeyword) sets.push(meta.primaryKeyword)
    }
  }
  return sets
}

export function countGeneratedToday(type, rootDir = process.cwd(), date = todayIso()) {
  return readContentMeta(path.join(rootDir, 'content', type))
    .filter(meta => meta.date === date && meta.sourceUrl)
    .length
}

function readContentMeta(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8')))
}

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return {}

  const meta = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    const [, key, value] = kv
    meta[key] = value.trim().replace(/^["']|["']$/g, '')
  }
  return meta
}
