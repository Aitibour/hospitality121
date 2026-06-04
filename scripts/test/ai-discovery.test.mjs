import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('AI discovery endpoints expose publisher and canonical content data', () => {
  const aiIndex = fs.readFileSync('app/ai-index.json/route.ts', 'utf8')
  const llmsFull = fs.readFileSync('app/llms-full.txt/route.ts', 'utf8')
  const helper = fs.readFileSync('lib/ai-discovery.ts', 'utf8')

  assert.match(aiIndex, /publisher:/)
  assert.match(aiIndex, /authorityPillars:/)
  assert.match(aiIndex, /geoAuthorityPages:/)
  assert.match(aiIndex, /authors:/)
  assert.match(aiIndex, /content: getAiContentIndex\(\)/)
  assert.match(llmsFull, /Canonical URL:/)
  assert.match(llmsFull, /Authority pillar:/)
  assert.match(llmsFull, /Primary source:/)
  assert.match(helper, /canonicalUrl:/)
  assert.match(helper, /sourceUrl:/)
})

test('short llms file points answer engines to full discovery resources', () => {
  const source = fs.readFileSync('public/llms.txt', 'utf8')

  assert.match(source, /llms-full\.txt/)
  assert.match(source, /ai-index\.json/)
  assert.match(source, /seo-diamond\.json/)
  assert.match(source, /editorial-standards/)
  assert.match(source, /Citation Guidance/)
})

test('content pages expose answer-engine citation schema', () => {
  const source = fs.readFileSync('app/content/[slug]/page.tsx', 'utf8')

  assert.match(source, /NewsArticle/)
  assert.match(source, /BlogPosting/)
  assert.match(source, /SpeakableSpecification/)
  assert.match(source, /citation: item\.sourceUrl/)
  assert.match(source, /isBasedOn: item\.sourceUrl/)
  assert.match(source, /articleSection: item\.category/)
  assert.match(source, /isAccessibleForFree: true/)
})

test('robots and sitemap advertise AI discovery access', () => {
  const robots = fs.readFileSync('app/robots.ts', 'utf8')
  const sitemap = fs.readFileSync('app/sitemap.ts', 'utf8')
  const layout = fs.readFileSync('app/layout.tsx', 'utf8')

  for (const crawler of ['OAI-SearchBot', 'Claude-SearchBot', 'Perplexity-User', 'Applebot-Extended']) {
    assert.match(robots, new RegExp(crawler))
  }
  assert.match(sitemap, /ai-index\.json/)
  assert.match(sitemap, /llms-full\.txt/)
  assert.match(sitemap, /llms\.txt/)
  assert.match(layout, /type="application\/json" href="\/ai-index\.json"/)
  assert.match(layout, /type="text\/plain" href="\/llms-full\.txt"/)
})
