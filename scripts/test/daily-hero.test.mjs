import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { classifyHeroTopic, selectHeroArticles, toHeroItems, secondsUntilTomorrow, TOPIC_IMAGES } from '../lib/daily-hero.mjs'
import handler from '../../netlify/functions/daily-hero.mjs'
import { fetchAllArticles } from '../lib/rss.mjs'

const now = new Date('2026-10-26T12:00:00Z')
const article = (title, hours = 1, url = `https://example.com/${encodeURIComponent(title)}`) => ({ title, excerpt: 'Hotel hospitality news', url, pubDate: new Date(+now - hours * 3600000), source: 'example.com' })

test('daily hero filters old, future, unsafe and unrelated stories', () => {
  const selected = selectHeroArticles([
    article('Hotel AI operations'), article('Hotel cybersecurity', 200), article('Hotel PMS software', -1),
    article('Hotel celebrates its anniversary'), article('Hotel AI payments', 1, 'javascript:alert(1)'),
    { ...article('Airline AI pilot'), excerpt: 'Aviation technology' },
  ], now)
  assert.deepEqual(selected.map(item => item.title), ['Hotel AI operations'])
})

test('tracking URLs and syndicated headlines do not repeat', () => {
  const selected = selectHeroArticles([
    article('Hotel AI transforms guest service with new tools', 1, 'https://example.com/story?utm_source=rss'),
    article('Hotel AI transforms guest service with new tools today', 2, 'https://other.com/repost'),
    article('Different headline hotel AI service', 3, 'https://example.com/story'),
  ], now)
  assert.equal(selected.length, 1)
})

test('available AI, cybersecurity, operations and technology get representation', () => {
  const articles = [
    ...Array.from({ length: 12 }, (_, i) => article(`Hotel AI ${['concierge', 'pricing', 'analytics', 'marketing', 'chatbot', 'robots', 'forecasting', 'search', 'booking', 'agents', 'strategy', 'training'][i]}`, i + 1)),
    article('Hotel ransomware response and cyber resilience', 48),
    article('Hotel PMS simplifies front desk check-in', 49), article('Hotel connectivity and software integrations', 50),
  ]
  const selected = selectHeroArticles(articles, now)
  assert.equal(selected.length, 8)
  assert.equal(new Set(selected.map(item => item.topic)).size, 4)
  assert.equal(selected[0].title, 'Hotel AI concierge')
})

test('hero images are distinct, real assets and match the selected topic', () => {
  const articles = [article('Hotel AI concierge'), article('Hotel AI pricing', 2), article('Hotel ransomware protection', 3), article('Hotel PMS guest messaging', 4)]
  const items = toHeroItems(selectHeroArticles(articles, now))
  assert.equal(new Set(items.map(item => item.image)).size, items.length)
  const hashes = items.map(item => createHash('sha256').update(fs.readFileSync(`public${item.image}`)).digest('hex'))
  assert.equal(new Set(hashes).size, hashes.length)
  for (const item of items) assert.ok(TOPIC_IMAGES[item.category].some(name => item.image.includes(name)))
  assert.ok(items.every(item => item.href.startsWith('https://') && item.rss))
})

test('all curated topic photos are distinct by their actual bytes', () => {
  const hashes = Object.values(TOPIC_IMAGES).flat().map(name => createHash('sha256').update(fs.readFileSync(`public/images/content/${name}.jpg`)).digest('hex'))
  assert.equal(new Set(hashes).size, hashes.length)
})

test('topics match whole AI words and daily cache expires at UTC midnight', () => {
  assert.equal(classifyHeroTopic('Airlines gain market share'), null)
  assert.equal(secondsUntilTomorrow(now), 43200)
  assert.equal(secondsUntilTomorrow(new Date('2026-10-26T23:59:59Z')), 1)
})

test('daily RSS endpoint rejects writes', async () => {
  assert.equal((await handler(new Request('https://example.com', { method: 'POST' }))).status, 405)
})

test('all external sources failing yields an empty feed rather than a page error', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => { throw new Error('Upstream unavailable') })
  const warning = mock.method(console, 'warn', () => {})
  try {
    assert.deepEqual(await fetchAllArticles({ feeds: [{ url: 'https://example.com/feed', source: 'Example' }] }), [])
  } finally { fetchMock.mock.restore(); warning.mock.restore() }
})
