import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('RSS and Google News routes expose static XML feeds', () => {
  const rss = fs.readFileSync('app/feed.xml/route.ts', 'utf8')
  const news = fs.readFileSync('app/news-sitemap.xml/route.ts', 'utf8')
  const helper = fs.readFileSync('lib/syndication.ts', 'utf8')

  assert.match(rss, /buildRssFeed/)
  assert.match(rss, /application\/rss\+xml/)
  assert.match(news, /buildGoogleNewsSitemap/)
  assert.match(news, /application\/xml/)
  assert.match(helper, /<rss version="2\.0"/)
  assert.match(helper, /xmlns:news="http:\/\/www\.google\.com\/schemas\/sitemap-news\/0\.9"/)
  assert.match(helper, /48 \* 60 \* 60 \* 1000/)
  assert.match(helper, /item\.type === 'news'/)
})

test('site discovery exposes RSS and Google News sitemap', () => {
  const layout = fs.readFileSync('app/layout.tsx', 'utf8')
  const robots = fs.readFileSync('app/robots.ts', 'utf8')
  const aiIndex = fs.readFileSync('app/ai-index.json/route.ts', 'utf8')
  const llms = fs.readFileSync('public/llms.txt', 'utf8')

  assert.match(layout, /type="application\/rss\+xml" href="\/feed\.xml"/)
  assert.match(robots, /news-sitemap\.xml/)
  assert.match(aiIndex, /newsSitemap:/)
  assert.match(aiIndex, /rss:/)
  assert.match(llms, /Google News sitemap/)
  assert.match(llms, /RSS feed/)
})

test('article source provenance remains in schema without the removed banner', () => {
  const source = fs.readFileSync('app/content/[slug]/page.tsx', 'utf8')

  assert.doesNotMatch(source, /Source reporting:/)
  assert.doesNotMatch(source, /<figcaption/)
  assert.doesNotMatch(source, /<a href=\{sourceUrl\}/)
  assert.match(source, /citation: item.sourceUrl/)
})
