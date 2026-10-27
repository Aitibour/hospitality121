import { test } from 'node:test'
import assert from 'node:assert/strict'
import matter from 'gray-matter'
import { isPublishedContent } from '../../lib/editorial-policy.mjs'
import { renderArticleMarkdown, articleDescription } from '../../lib/article-markdown.mjs'
import { renderNewsMdx } from '../lib/mdx.mjs'
import { publicContentSlug, contentFileSlug } from '../../lib/content-routing.mjs'
import { buildSearchText } from '../../lib/search-text.mjs'
import Fuse from 'fuse.js'

test('article subjects beyond the summary remain searchable', () => {
  const searchText = buildSearchText('Hotel operations. '.repeat(100) + '\n\n## Cybersecurity\n\nReview guest data access.')
  const results = new Fuse([{ title: 'Hotel operations', searchText }], { keys: ['title', 'searchText'], ignoreLocation: true, threshold: 0.35 }).search('cybersecurity')
  assert.equal(results.length, 1)
})

test('duplicate legacy file names retain the established news URL and expose the blog separately', () => {
  assert.equal(publicContentSlug('news', 'summer-travel-trends'), 'summer-travel-trends')
  assert.equal(publicContentSlug('blog', 'summer-travel-trends'), 'summer-travel-trends-blog')
  assert.equal(contentFileSlug('blog', 'summer-travel-trends-blog'), 'summer-travel-trends')
})

test('legacy URLs stay published while drafts and unreviewed AI content are excluded', () => {
  assert.equal(isPublishedContent({ title: 'Legacy' }), true)
  for (const status of ['draft', 'review']) assert.equal(isPublishedContent({ status }), false)
  assert.equal(isPublishedContent({ status: 'published', aiGenerated: true }), false)
  const editorialReview = { reviewedBy: 'Editor', reviewedAt: '2026-01-01', factCheck: 'approved', imageRights: 'approved', seo: 'approved' }
  const article = { title: 'Reviewed hotel systems story', date: '2026-01-01', description: 'Summary', sourceUrl: 'https://example.com/story', image: '/images/content/test.jpg', imageAlt: 'A hotel system', imageCredit: 'Photographer', imageLicense: 'Licensed', imageSource: 'https://example.com/photo', status: 'published', aiGenerated: true, editorialReview }
  assert.equal(isPublishedContent(article), true)
  assert.equal(isPublishedContent({ ...article, sourceUrl: 'https://localhost/private' }), false)
  assert.equal(isPublishedContent({ ...article, date: '2099-01-01' }), false)
  assert.equal(isPublishedContent({ status: 'published', aiGenerated: true, editorialReview: { ...editorialReview, imageRights: 'pending' } }), false)
})

test('generated frontmatter cannot escape quoted YAML and always starts in review', () => {
  const { data } = matter(renderNewsMdx({ title: 'Title\nstatus: published', description: 'Summary', category: 'TECHNOLOGY', date: '2026-01-01', readTime: '2 min', imageFile: 'test.jpg', sourceDomain: 'Publisher"\nfeatured: true', sourceUrl: 'https://example.com/', body: 'Body' }))
  assert.equal(data.status, 'review')
  assert.equal(data.featured, false)
  assert.equal(data.aiGenerated, true)
  assert.equal(isPublishedContent(data), false)
})

test('Markdown supports real headings, emphasis, lists and tables without executing HTML', () => {
  const html = renderArticleMarkdown('## Heading\nA **useful** point.\n\n1. First\n2. Second\n\n| Risk | Action |\n| --- | --- |\n| Access | Review |\n\n<script>alert(1)</script><img src=x onerror=alert(1)>[bad](javascript:alert(1))')
  assert.match(html, /<h2>Heading<\/h2>/)
  assert.match(html, /<strong>useful<\/strong>/)
  assert.match(html, /<ol>/)
  assert.match(html, /<table>/)
  assert.doesNotMatch(html, /<script|<img|onerror|href="javascript:/i)
})

test('descriptions use editorial summaries and strip Markdown link syntax', () => {
  assert.equal(articleDescription({ description: 'Editorial summary' }, 'Other'), 'Editorial summary')
  assert.equal(articleDescription({}, '## Heading\n\nAn article about [hotel systems](https://example.com) and the operational decisions facing property teams.'), 'An article about hotel systems and the operational decisions facing property teams.')
})
