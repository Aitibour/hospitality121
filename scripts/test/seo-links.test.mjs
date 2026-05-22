import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSeoLinks } from '../lib/seo-links.mjs'

test('buildSeoLinks points blog items to the blog pillar', () => {
  const links = buildSeoLinks({
    contentType: 'blog',
    title: 'AI reshapes hotel operations',
    category: 'TECHNOLOGY',
    keywords: ['AI in hotels'],
  })
  assert.ok(links.includes('https://hospitality121.com/blog'))
  assert.ok(links.includes('https://hospitality121.com/technology/ai'))
  assert.ok(links.includes('https://hospitality121.com'))
  assert.ok(links.includes('https://hospitality121.com/geo/'))
})

test('buildSeoLinks points news items to the news pillar', () => {
  const links = buildSeoLinks({
    contentType: 'news',
    title: 'Hotel investors expand in Europe',
    category: 'INVESTMENT',
    keywords: ['hotel investment'],
  })
  assert.ok(links.includes('https://hospitality121.com/news'))
})
