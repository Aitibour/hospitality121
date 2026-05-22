import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFeed } from '../lib/rss.mjs'

const RECENT = new Date(Date.now() - 12 * 60 * 60 * 1000).toUTCString()

const SAMPLE_RSS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Test Article</title>
      <link>https://example.com/article-1</link>
      <description>&lt;p&gt;This is the excerpt.&lt;/p&gt;</description>
      <pubDate>${RECENT}</pubDate>
    </item>
    <item>
      <title>Old Article</title>
      <link>https://example.com/old-article</link>
      <description>Old content</description>
      <pubDate>Mon, 01 Jan 2024 10:00:00 +0000</pubDate>
    </item>
  </channel>
</rss>`

const SINGLE_ITEM_RSS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Single Item</title>
      <link>https://example.com/single</link>
      <description>Single desc</description>
      <pubDate>${RECENT}</pubDate>
    </item>
  </channel>
</rss>`

const EMPTY_RSS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel><title>Empty</title></channel>
</rss>`

test('parseFeed returns only articles within the recent window', () => {
  const articles = parseFeed(SAMPLE_RSS, 'example.com')
  assert.equal(articles.length, 1)
  assert.equal(articles[0].title, 'Test Article')
})

test('parseFeed sets correct url from link element', () => {
  const articles = parseFeed(SAMPLE_RSS, 'example.com')
  assert.equal(articles[0].url, 'https://example.com/article-1')
})

test('parseFeed strips HTML tags from excerpt', () => {
  const articles = parseFeed(SAMPLE_RSS, 'example.com')
  assert.equal(articles[0].excerpt, 'This is the excerpt.')
})

test('parseFeed tags articles with source domain', () => {
  const articles = parseFeed(SAMPLE_RSS, 'example.com')
  assert.equal(articles[0].source, 'example.com')
})

test('parseFeed handles single item (XML gives object not array)', () => {
  const articles = parseFeed(SINGLE_ITEM_RSS, 'example.com')
  assert.equal(articles.length, 1)
  assert.equal(articles[0].title, 'Single Item')
})

test('parseFeed returns empty array for feed with no items', () => {
  const articles = parseFeed(EMPTY_RSS, 'example.com')
  assert.equal(articles.length, 0)
})
