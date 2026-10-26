import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shortHeadline } from '../../lib/headlines.mjs'
import { fetchImage } from '../lib/unsplash.mjs'

test('display headlines stay compact and preserve meaningful words', () => {
  assert.equal(shortHeadline('AI Orchestration Framework for Hospitality: Practical Guide by AIHA'), 'AI Orchestration Framework for Hospitality')
  const headline = shortHeadline('From Long Lines to Warm Welcomes: How Mangia\'s Modernized the Guest Journey With Canary')
  assert.ok(headline.startsWith("Mangia's Modernized"))
  assert.ok(headline.length <= 48)
  assert.ok(shortHeadline('SuitePad Phone Dock Combines a 911-Ready Hotel Phone and Guest Tablet in One Nightstand Unit').length <= 48)
  assert.equal(shortHeadline('Hotel AI Explained'), 'Hotel AI Explained')
})

test('missing image credentials cannot silently publish a repeated brand banner', async () => {
  const previous = process.env.UNSPLASH_ACCESS_KEY
  delete process.env.UNSPLASH_ACCESS_KEY
  try {
    await assert.rejects(fetchImage(['hotel cybersecurity'], 'image-uniqueness-test'), /unique topical image is required/)
  } finally {
    if (previous === undefined) delete process.env.UNSPLASH_ACCESS_KEY
    else process.env.UNSPLASH_ACCESS_KEY = previous
  }
})
