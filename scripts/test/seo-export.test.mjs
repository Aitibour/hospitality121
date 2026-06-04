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
  assert.doesNotMatch(source, /`\$\{BASE\}\/search`/)
  assert.doesNotMatch(source, /`\$\{BASE\}\/ai-index\.json`/)
  assert.doesNotMatch(source, /`\$\{BASE\}\/llms/)
  assert.doesNotMatch(source, /lastModified: now/)
})

test('internal search is accessible and excluded from search indexing', () => {
  const layout = fs.readFileSync('app/search/layout.tsx', 'utf8')
  const page = fs.readFileSync('app/search/page.tsx', 'utf8')

  assert.match(layout, /robots: \{ index: false, follow: true \}/)
  assert.match(page, /<label htmlFor="site-search"/)
  assert.match(page, /id="site-search"/)
  assert.match(page, /role="status"/)
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
  assert.match(source, /summary: getContentSummary\(item, 240\)/)
  assert.match(source, /timeLabel: getTimeLabel\(item\)/)
  assert.match(source, /featured: item\.featured/)
  assert.match(source, /item\.type === 'podcast'/)
  assert.match(source, /item\.type === 'event'/)
})

test('search honors shareable query URLs and searches content summaries', () => {
  const source = fs.readFileSync('app/search/page.tsx', 'utf8')
  const headers = fs.readFileSync('netlify.toml', 'utf8')

  assert.match(source, /new URLSearchParams\(window\.location\.search\)\.get\('q'\)/)
  assert.match(source, /url\.searchParams\.set\('q', nextQuery\)/)
  assert.match(source, /\{ name: 'summary', weight: 0\.25 \}/)
  assert.match(source, /href=\{item\.url\}/)
  assert.match(source, /role="alert"/)
  assert.match(headers, /for = "\/search-index\.json"/)
})
