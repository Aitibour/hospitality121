import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { selectPublishedHeroItems } from '../lib/published-hero.mjs'
import handler from '../../netlify/functions/daily-hero.mjs'

const now = new Date('2026-10-27T23:30:00Z')
const item = (slug, image = `/images/${slug}.webp`) => ({ slug, image, imageType: 'photograph', imageCredit: 'Photographer', imageLicense: 'Pexels License', imageSource: 'https://www.pexels.com/photo/example/', title: `Hotel AI ${slug}`, category: 'TECHNOLOGY', type: 'news', date: '2026-10-27', href: 'https://publisher.example/news' })

test('hero excludes generated images and photographs without recorded reuse provenance', () => {
  const result = selectPublishedHeroItems([item('verified'), { ...item('generated'), imageType: 'illustration' }, { ...item('unknown'), imageLicense: '' }, { ...item('uncredited'), imageCredit: '' }, { ...item('unsourced'), imageSource: '' }], now)
  assert.deepEqual(result.map(row => row.slug), ['verified'])
})

test('published hero replaces upstream destinations with actual internal slugs', () => {
  const result = selectPublishedHeroItems([item('information'), item('pilot'), { ...item('future'), date: '2099-01-01' }, item('../escape')], now)
  assert.deepEqual(result.map(row => row.href), ['/content/information', '/content/pilot'])
  assert.ok(result.every(row => row.rss === false))
})

test('published hero suppresses duplicate slugs and featured images', () => {
  assert.equal(selectPublishedHeroItems([item('one'), item('one'), item('two', '/images/one.webp')], now).length, 1)
})

test('legacy function filters out external destinations from the published feed', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => Response.json({ updatedAt: now.toISOString(), items: [
    { ...item('local'), href: '/content/local' }, item('external'),
  ] }))
  try {
    const response = await handler(new Request('https://hospitality121.com/.netlify/functions/daily-hero'))
    assert.equal(response.status, 200)
    assert.equal((await response.json()).items.length, 1)
  } finally { fetchMock.mock.restore() }
})

test('legacy endpoint fails closed when the internal feed is unavailable', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => { throw new Error('Offline') })
  try {
    const response = await handler(new Request('https://hospitality121.com/.netlify/functions/daily-hero'))
    assert.equal(response.status, 503)
    assert.deepEqual((await response.json()).items, [])
  } finally { fetchMock.mock.restore() }
})
