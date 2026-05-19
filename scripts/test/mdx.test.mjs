import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateSlug, calcReadTime, renderMdx } from '../lib/mdx.mjs'

test('generateSlug converts title to kebab case', () => {
  assert.equal(generateSlug('Hello World'), 'hello-world')
})

test('generateSlug strips special characters', () => {
  assert.equal(generateSlug('AI & Hotel Tech: 2026'), 'ai-hotel-tech-2026')
})

test('generateSlug truncates to 60 chars', () => {
  assert.ok(generateSlug('a'.repeat(80)).length <= 60)
})

test('generateSlug does not end with a dash', () => {
  // 31 single-letter words → slug is 61 chars → slice(0,60) ends with '-'
  const title = Array(31).fill('a').join(' ')
  assert.ok(!generateSlug(title).endsWith('-'))
})

test('calcReadTime returns 1 min read for short text', () => {
  const text = Array(100).fill('word').join(' ')
  assert.equal(calcReadTime(text), '1 min read')
})

test('calcReadTime rounds up to next minute', () => {
  const text = Array(201).fill('word').join(' ')
  assert.equal(calcReadTime(text), '2 min read')
})

test('renderMdx produces valid MDX with frontmatter and bilingual body', () => {
  const result = renderMdx({
    titleEn: 'Test Post',
    titleFr: 'Article Test',
    excerptEn: 'An excerpt.',
    excerptFr: 'Un extrait.',
    category: 'TRENDS',
    date: '2026-05-19',
    readTime: '3 min read',
    imageFile: 'auto-test-post.jpg',
    sourceDomain: 'example.com',
    sourceUrl: 'https://example.com/article',
    bodyEn: 'English body.',
    bodyFr: 'French body.',
  })
  assert.ok(result.startsWith('---\n'))
  assert.ok(result.includes('type: "blog"'))
  assert.ok(result.includes('author: "H1H Newsfeed"'))
  assert.ok(result.includes('<!-- FR -->'))
  assert.ok(result.includes('English body.'))
  assert.ok(result.includes('French body.'))
})

test('renderMdx escapes double quotes in titles', () => {
  const result = renderMdx({
    titleEn: 'The "Smart" Hotel',
    titleFr: 'L\'hôtel "intelligent"',
    excerptEn: 'Excerpt',
    excerptFr: 'Extrait',
    category: 'TECHNOLOGY',
    date: '2026-05-19',
    readTime: '4 min read',
    imageFile: 'auto-smart-hotel.jpg',
    sourceDomain: 'example.com',
    sourceUrl: 'https://example.com/article',
    bodyEn: 'Body.',
    bodyFr: 'Corps.',
  })
  assert.ok(result.includes('\\"Smart\\"'))
})
