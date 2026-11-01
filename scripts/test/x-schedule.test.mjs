import { test } from 'node:test'
import assert from 'node:assert/strict'
import { vancouverSlot, postText } from '../../netlify/lib/x-publisher.mjs'

test('cloud X schedule follows Vancouver DST and skips other hours', () => {
  assert.equal(vancouverSlot(new Date('2026-10-31T16:00:00Z')).kind, 'news')
  assert.equal(vancouverSlot(new Date('2026-11-01T17:00:00Z')).kind, 'news')
  assert.equal(vancouverSlot(new Date('2026-11-01T21:00:00Z')).kind, 'article')
  assert.equal(vancouverSlot(new Date('2026-11-01T16:00:00Z')), null)
})

test('article post has three explanatory lines, canonical CTA and no Markdown bold', () => {
  const text = postText({ slug: 'hotel-loyalty-test', title: 'Hotel loyalty connects bookings and rewards', description: 'A hotel loyalty case study examines booking records and reliable reward delivery.' }, 'article')
  assert.equal(text.split('\n\n')[1].split('\n').length, 3)
  assert(text.includes('https://hospitality121.com/content/hotel-loyalty-test'))
  assert(!text.includes('**'))
})
