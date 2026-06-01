import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync('lib/technology-topics.ts', 'utf8')

test('technology topics include product and solution SEO blocks', () => {
  const topicCount = [...source.matchAll(/slug: '/g)].length
  const solutionBlocks = [...source.matchAll(/solutions: \[/g)].length
  const solutionCards = [...source.matchAll(/buyer: '/g)].length

  assert.ok(topicCount >= 10)
  assert.equal(solutionBlocks, topicCount)
  assert.equal(solutionCards, topicCount * 4)
  assert.match(source, /hospitality technology solutions/)
  assert.match(source, /hotel property management system/)
  assert.match(source, /hotel cybersecurity/)
})

test('technology pages expose solution structured data', () => {
  const pageSource = fs.readFileSync('app/technology/[topic]/page.tsx', 'utf8')

  assert.match(pageSource, /CollectionPage/)
  assert.match(pageSource, /ItemList/)
  assert.match(pageSource, /Service/)
  assert.match(pageSource, /buildTechnologySolutionJsonLd/)
  assert.match(pageSource, /#solution-\$\{index \+ 1\}/)
  assert.match(pageSource, /Product and solution grid/)
  assert.doesNotMatch(pageSource, /t\.sections\.map/)
  assert.doesNotMatch(pageSource, /Editorial sections/)
  assert.doesNotMatch(pageSource, /Related Coverage/)
  assert.doesNotMatch(pageSource, /getAllContent/)
})

test('diamond feed and sitemap surface technology solution pages', () => {
  const diamondRoute = fs.readFileSync('app/seo-diamond.json/route.ts', 'utf8')
  const sitemapSource = fs.readFileSync('app/sitemap.ts', 'utf8')

  assert.match(diamondRoute, /technologySolutions/)
  assert.match(diamondRoute, /topic\.solutions/)
  assert.match(diamondRoute, /#solution-\$\{index \+ 1\}/)
  assert.match(sitemapSource, /TECH_TOPICS\.map/)
  assert.match(sitemapSource, /changeFrequency: 'weekly'/)
  assert.match(sitemapSource, /priority: t\.slug === 'ai'/)
})

test('technology hub links to topic solution anchors', () => {
  const hubSource = fs.readFileSync('app/technology/page.tsx', 'utf8')

  assert.match(hubSource, /TECH_TOPICS\.map/)
  assert.match(hubSource, /topic\.solutions\.map/)
  assert.match(hubSource, /\/technology\/\$\{topic\.slug\}#solution-\$\{index \+ 1\}/)
  assert.match(hubSource, /View diamond feed/)
})

test('navbar exposes all technology solution topic pages', () => {
  const navbarSource = fs.readFileSync('components/Navbar.tsx', 'utf8')
  const requiredRoutes = [
    '/technology/ai',
    '/technology/pms-pos',
    '/technology/key-systems',
    '/technology/iptv-signage',
    '/technology/cybersecurity',
    '/technology/smart-hotels',
    '/technology/revenue-management',
    '/technology/companies',
    '/technology/events',
    '/technology/careers',
  ]

  for (const route of requiredRoutes) {
    assert.match(navbarSource, new RegExp(route.replace('/', '\\/')))
  }
})
