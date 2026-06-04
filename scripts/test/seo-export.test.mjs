import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('sitemap export normalizes and deduplicates crawl URLs', () => {
  const source = fs.readFileSync('app/sitemap.ts', 'utf8')

  assert.match(source, /replace\(\/\\\/\$\/, ''\)/)
  assert.match(source, /function dedupeRoutes/)
  assert.match(source, /const seen = new Set<string>\(\)/)
  assert.match(source, /return dedupeRoutes\(\[/)
  assert.match(source, /GEO_AUTHORITY_PAGES\.map/)
  assert.match(source, /TECH_TOPICS\.map/)
  assert.match(source, /SUSTAINABILITY_TOPICS\.map/)
})

test('robots export declares sitemap and canonical host', () => {
  const source = fs.readFileSync('app/robots.ts', 'utf8')

  assert.match(source, /replace\(\/\\\/\$\/, ''\)/)
  assert.match(source, /sitemap: \[`\$\{BASE\}\/sitemap\.xml`, `\$\{BASE\}\/news-sitemap\.xml`\]/)
  assert.match(source, /host: BASE/)
  assert.match(source, /Googlebot/)
  assert.match(source, /GPTBot/)
})

test('search index exports canonical metadata for every content item', () => {
  const source = fs.readFileSync('app/search-index.json/route.ts', 'utf8')

  assert.match(source, /const BASE = /)
  assert.match(source, /url: `\$\{BASE\}\/content\/\$\{item\.slug\}`/)
  assert.match(source, /summary: getSummary\(item\)/)
  assert.match(source, /timeLabel: getTimeLabel\(item\)/)
  assert.match(source, /featured: item\.featured/)
  assert.match(source, /item\.type === 'podcast'/)
  assert.match(source, /item\.type === 'event'/)
})
