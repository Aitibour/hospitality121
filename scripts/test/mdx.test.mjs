import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateSlug, calcReadTime, renderMdx, renderNewsMdx } from '../lib/mdx.mjs'

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
    primaryKeyword: 'hospitality technology trends',
    keywords: ['hospitality technology', 'hotel automation', 'AI in hospitality', 'hotel IT infrastructure'],
    imageConcept: 'A hotel operations team reviewing guest technology dashboards in a realistic luxury lobby.',
    editorialFormat: 'hotel-operations',
    linkedinCaption: 'Hospitality technology is moving closer to daily operations. This piece looks at what that means for hotel leaders.',
    facebookCaption: 'A practical look at how hospitality technology is changing hotel operations.',
    xCaption: 'Hospitality technology is becoming an operating discipline, not a side project.',
    newsletterTeaser: 'A concise look at the systems changing hotel operations this week.',
  })
  assert.ok(result.startsWith('---\n'))
  assert.ok(result.includes('type: "blog"'))
  assert.ok(result.includes('author: "H1H Newsfeed"'))
  assert.ok(result.includes('<!-- FR -->'))
  assert.ok(result.includes('English body.'))
  assert.ok(result.includes('French body.'))
  assert.ok(result.includes('primaryKeyword: "hospitality technology trends"'))
  assert.ok(result.includes('editorialFormat: "hotel-operations"'))
  assert.ok(result.includes('linkedinCaption: "Hospitality technology is moving closer'))
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

test('renderMdx includes pillar and cluster links when supplied', () => {
  const result = renderMdx({
    titleEn: 'Test Post',
    titleFr: 'Article Test',
    excerptEn: 'An excerpt.',
    excerptFr: 'Un extrait.',
    category: 'TECHNOLOGY',
    date: '2026-05-19',
    readTime: '3 min read',
    imageFile: 'auto-test-post.jpg',
    sourceDomain: 'example.com',
    sourceUrl: 'https://example.com/article',
    bodyEn: 'English body.',
    bodyFr: 'French body.',
    seoLinks: '## Related Hospitality121 Coverage\n\n- [Hospitality Blog](https://hospitality121.com/blog)\n',
  })
  assert.ok(result.includes('## Related Hospitality121 Coverage'))
  assert.ok(result.includes('https://hospitality121.com/blog'))
})

test('renderNewsMdx produces news frontmatter with source URL', () => {
  const result = renderNewsMdx({
    title: 'Hotel News',
    description: 'A concise news description.',
    category: 'TECHNOLOGY',
    date: '2026-05-19',
    readTime: '3 min read',
    imageFile: 'auto-hotel-news.jpg',
    sourceDomain: 'example.com',
    sourceUrl: 'https://example.com/news',
    body: 'News body.',
    seoLinks: '## Related Hospitality121 Coverage\n\n- [Hospitality News](https://hospitality121.com/news)\n',
  })
  assert.ok(result.includes('type: "news"'))
  assert.ok(result.includes('sourceUrl: "https://example.com/news"'))
  assert.ok(result.includes('https://hospitality121.com/news'))
})
