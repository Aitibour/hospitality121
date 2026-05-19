# Auto-Blog Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically publish 2 bilingual EN/FR blog posts per day by pulling hospitality RSS feeds, generating content via Groq, fetching Unsplash images, committing MDX files, and pinging IndexNow — all triggered by GitHub Actions cron with no human involvement.

**Architecture:** GitHub Actions fires twice daily → `scripts/auto-blog.mjs` orchestrates the pipeline → new MDX file committed to `content/blog/` → Netlify auto-deploys on push. A `scripts/seen-articles.json` tracking file deduplicates across all runs forever.

**Tech Stack:** Node.js 20 ESM scripts, `fast-xml-parser` for RSS, `groq-sdk` for AI generation, Unsplash REST API, GitHub Actions cron, Next.js 16 `BilingualContent` client component.

---

## File Map

| Path | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add fast-xml-parser, groq-sdk to devDependencies |
| `scripts/seen-articles.json` | Create | Tracks processed article URLs (starts as `[]`) |
| `scripts/lib/mdx.mjs` | Create | Pure utils: `generateSlug`, `calcReadTime`, `renderMdx` |
| `scripts/lib/rss.mjs` | Create | `fetchAllArticles`, `parseFeed` — RSS fetching and parsing |
| `scripts/lib/groq.mjs` | Create | `generatePost` — Groq AI bilingual content generation |
| `scripts/lib/unsplash.mjs` | Create | `fetchImage` — Unsplash image download with fallback |
| `scripts/lib/publish.mjs` | Create | `commitAndPush`, `pingIndexNow` — git + IndexNow |
| `scripts/auto-blog.mjs` | Create | Main orchestrator — runs the full pipeline |
| `scripts/test/mdx.test.mjs` | Create | Unit tests for mdx.mjs pure functions |
| `scripts/test/rss.test.mjs` | Create | Unit tests for rss.mjs parseFeed |
| `types/content.ts` | Modify | Add optional `titleFr`, `excerptFr`, `source`, `sourceUrl` to BlogPost |
| `components/BilingualContent.tsx` | Create | Client component: switches title + body by language |
| `app/content/[slug]/page.tsx` | Modify | Split body on `<!-- FR -->`, use BilingualContent |
| `.github/workflows/auto-blog.yml` | Create | Cron workflow: 8am + 8pm UTC |
| `public/h121blog-f4a8b2c6d9e13705.txt` | Create | IndexNow key verification file |

---

## Task 1: Install Dependencies and Scaffold Tracking File

**Files:**
- Modify: `package.json`
- Create: `scripts/seen-articles.json`

- [ ] **Step 1: Add devDependencies to package.json**

In `package.json`, add to `"devDependencies"`:
```json
"fast-xml-parser": "^4.4.1",
"groq-sdk": "^0.9.1"
```

The full `"devDependencies"` block becomes:
```json
"devDependencies": {
  "@netlify/plugin-nextjs": "^5.15.11",
  "@tailwindcss/postcss": "^4",
  "@types/dompurify": "^3.0.5",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.2.6",
  "fast-xml-parser": "^4.4.1",
  "groq-sdk": "^0.9.1",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

- [ ] **Step 2: Install packages**

```bash
npm install
```

Expected: lock file updated, no errors.

- [ ] **Step 3: Create the tracking file and directory structure**

Create `scripts/seen-articles.json`:
```json
[]
```

Create directories:
```bash
mkdir -p scripts/lib scripts/test
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json scripts/seen-articles.json
git commit -m "chore: add fast-xml-parser, groq-sdk, scaffold tracking file"
```

---

## Task 2: Extend BlogPost TypeScript Type

**Files:**
- Modify: `types/content.ts`

- [ ] **Step 1: Add optional fields to BlogPost**

In `types/content.ts`, replace the `BlogPost` type:

```ts
export type BlogPost = {
  type: 'blog'
  slug: string
  title: string
  titleFr?: string
  excerpt?: string
  excerptFr?: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
  source?: string
  sourceUrl?: string
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/content.ts
git commit -m "feat(types): extend BlogPost with bilingual and source fields"
```

---

## Task 3: Create BilingualContent Client Component

**Files:**
- Create: `components/BilingualContent.tsx`

- [ ] **Step 1: Create the component**

Create `components/BilingualContent.tsx`:
```tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'

type Props = {
  titleEn: string
  titleFr?: string
  bodyEn: string
  bodyFr?: string
}

export default function BilingualContent({ titleEn, titleFr, bodyEn, bodyFr }: Props) {
  const { locale } = useLanguage()
  const isFr = locale === 'fr' && !!titleFr

  const title = isFr ? titleFr! : titleEn
  const body = isFr && bodyFr ? bodyFr : bodyEn

  const paragraphs = body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <>
      <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">{title}</h1>
      {paragraphs.length > 0 ? (
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-5 text-base leading-relaxed text-white/85">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted italic">Full article coming soon.</p>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/BilingualContent.tsx
git commit -m "feat(components): add BilingualContent client component"
```

---

## Task 4: Wire BilingualContent into the Content Page

**Files:**
- Modify: `app/content/[slug]/page.tsx`

- [ ] **Step 1: Add BilingualContent import**

At the top of `app/content/[slug]/page.tsx`, after the existing imports, add:
```tsx
import BilingualContent from '@/components/BilingualContent'
```

- [ ] **Step 2: Fix generateMetadata to use English-only body for description**

In `generateMetadata`, replace:
```tsx
const description = body
  .split('\n')
  .map(l => l.trim())
  .find(l => l.length > 60)
  ?.slice(0, 160) ?? ''
```

With:
```tsx
const bodyEn = body.split('\n<!-- FR -->\n')[0]
const description = bodyEn
  .split('\n')
  .map(l => l.trim())
  .find(l => l.length > 60)
  ?.slice(0, 160) ?? ''
```

- [ ] **Step 3: Fix buildJsonLd to use English-only body**

In `buildJsonLd`, replace:
```tsx
const description = body.split('\n').map(l => l.trim()).find(l => l.length > 60)?.slice(0, 160) ?? ''
```

With:
```tsx
const description = body.split('\n<!-- FR -->\n')[0].split('\n').map(l => l.trim()).find(l => l.length > 60)?.slice(0, 160) ?? ''
```

- [ ] **Step 4: Replace paragraphs variable with bilingual body parts**

In `ContentDetailPage`, replace:
```tsx
const paragraphs = body
  .split(/\n{2,}/)
  .map(p => p.trim())
  .filter(Boolean)
```

With:
```tsx
const [bodyEn, bodyFr] = body.split('\n<!-- FR -->\n')
const titleFr = 'titleFr' in item ? (item as { titleFr?: string }).titleFr : undefined
```

- [ ] **Step 5: Replace the h1 and body section with BilingualContent**

Find the `{/* Title */}` comment and h1 tag:
```tsx
{/* Title */}
<h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">{item.title}</h1>
```

And the `{/* Body content */}` section:
```tsx
{/* Body content */}
{paragraphs.length > 0 ? (
  <div className="prose prose-lg max-w-none">
    {paragraphs.map((para, i) => (
      <p key={i} className="mb-5 text-base leading-relaxed text-white/85">
        {para}
      </p>
    ))}
  </div>
) : (
  <p className="text-muted italic">Full article coming soon.</p>
)}
```

Replace both with:
```tsx
{/* Title + Body (bilingual for auto-generated posts, EN-only for existing posts) */}
<BilingualContent
  titleEn={item.title}
  titleFr={titleFr}
  bodyEn={bodyEn}
  bodyFr={bodyFr}
/>
```

- [ ] **Step 6: Verify TypeScript and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add app/content/[slug]/page.tsx
git commit -m "feat(content): add bilingual body + title support via BilingualContent"
```

---

## Task 5: Create MDX Utilities with Tests

**Files:**
- Create: `scripts/lib/mdx.mjs`
- Create: `scripts/test/mdx.test.mjs`

- [ ] **Step 1: Write the failing tests first**

Create `scripts/test/mdx.test.mjs`:
```js
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
node --test scripts/test/mdx.test.mjs
```

Expected: `Cannot find module '../lib/mdx.mjs'`

- [ ] **Step 3: Create scripts/lib/mdx.mjs**

Create `scripts/lib/mdx.mjs`:
```js
/**
 * Converts a title to URL-safe kebab-case (max 60 chars).
 * @param {string} title
 * @returns {string}
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '')
}

/**
 * Calculates reading time at 200 words per minute.
 * @param {string} text
 * @returns {string} e.g. "5 min read"
 */
export function calcReadTime(text) {
  const words = text.trim().split(/\s+/).length
  return `${Math.ceil(words / 200)} min read`
}

/**
 * Renders a complete bilingual MDX file string.
 * @param {{ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, bodyEn, bodyFr }} params
 * @returns {string}
 */
export function renderMdx({ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, bodyEn, bodyFr }) {
  const esc = s => s.replace(/"/g, '\\"')
  return `---
title: "${esc(titleEn)}"
titleFr: "${esc(titleFr)}"
excerpt: "${esc(excerptEn)}"
excerptFr: "${esc(excerptFr)}"
category: "${category}"
author: "H1H Newsfeed"
authorAvatar: "/images/Logo.png"
date: "${date}"
readTime: "${readTime}"
image: "/images/content/${imageFile}"
featured: false
type: "blog"
source: "${sourceDomain}"
sourceUrl: "${sourceUrl}"
---

${bodyEn}

<!-- FR -->

${bodyFr}
`
}
```

- [ ] **Step 4: Run tests — expect all 8 pass**

```bash
node --test scripts/test/mdx.test.mjs
```

Expected:
```
✔ generateSlug converts title to kebab case
✔ generateSlug strips special characters
✔ generateSlug truncates to 60 chars
✔ generateSlug does not end with a dash
✔ calcReadTime returns 1 min read for short text
✔ calcReadTime rounds up to next minute
✔ renderMdx produces valid MDX with frontmatter and bilingual body
✔ renderMdx escapes double quotes in titles
ℹ tests 8, pass 8
```

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/mdx.mjs scripts/test/mdx.test.mjs
git commit -m "feat(scripts): add MDX utilities with tests"
```

---

## Task 6: Create RSS Fetcher with Tests

**Files:**
- Create: `scripts/lib/rss.mjs`
- Create: `scripts/test/rss.test.mjs`

- [ ] **Step 1: Write failing tests first**

Create `scripts/test/rss.test.mjs`:
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFeed } from '../lib/rss.mjs'

const RECENT = new Date(Date.now() - 24 * 60 * 60 * 1000).toUTCString()

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

test('parseFeed returns only articles within 48 hours', () => {
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
node --test scripts/test/rss.test.mjs
```

Expected: `Cannot find module '../lib/rss.mjs'`

- [ ] **Step 3: Create scripts/lib/rss.mjs**

Create `scripts/lib/rss.mjs`:
```js
import { XMLParser } from 'fast-xml-parser'

const FEEDS = [
  { url: 'https://hotelmanagement.net/feed', source: 'hotelmanagement.net' },
  { url: 'https://www.hospitalitynet.org/rss/news.xml', source: 'hospitalitynet.org' },
  { url: 'https://skift.com/feed/', source: 'skift.com' },
]

/**
 * Fetches all 3 RSS feeds in parallel, returns flat date-sorted article array.
 * Feeds that fail are skipped; logs a warning if all 3 fail.
 * @returns {Promise<Array<{title, url, excerpt, pubDate, source}>>}
 */
export async function fetchAllArticles() {
  const results = await Promise.allSettled(
    FEEDS.map(({ url, source }) => fetchFeed(url, source))
  )

  const succeeded = results.filter(r => r.status === 'fulfilled')
  if (succeeded.length === 0) {
    results.forEach((r, i) => console.warn(`⚠ Feed failed: ${FEEDS[i].url} — ${r.reason?.message}`))
  }

  return succeeded
    .flatMap(r => r.value)
    .sort((a, b) => b.pubDate - a.pubDate)
}

async function fetchFeed(feedUrl, source) {
  const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parseFeed(await res.text(), source)
}

/**
 * Parses RSS XML into article objects, filtered to the last 48 hours.
 * Exported for unit testing.
 * @param {string} xml
 * @param {string} source
 * @returns {Array<{title, url, excerpt, pubDate, source}>}
 */
export function parseFeed(xml, source) {
  const parser = new XMLParser({ ignoreAttributes: false })
  const doc = parser.parse(xml)
  const rawItems = doc?.rss?.channel?.item ?? []
  const items = Array.isArray(rawItems) ? rawItems : [rawItems]
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)

  return items
    .map(item => ({
      title: String(item.title ?? '').trim(),
      url: String(item.link ?? item.guid ?? '').trim(),
      excerpt: stripHtml(String(item.description ?? '')).slice(0, 400),
      pubDate: new Date(item.pubDate ?? item['dc:date'] ?? 0),
      source,
    }))
    .filter(a => a.title && a.url && a.pubDate > cutoff)
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
```

- [ ] **Step 4: Run tests — expect all 6 pass**

```bash
node --test scripts/test/rss.test.mjs
```

Expected:
```
✔ parseFeed returns only articles within 48 hours
✔ parseFeed sets correct url from link element
✔ parseFeed strips HTML tags from excerpt
✔ parseFeed tags articles with source domain
✔ parseFeed handles single item (XML gives object not array)
✔ parseFeed returns empty array for feed with no items
ℹ tests 6, pass 6
```

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/rss.mjs scripts/test/rss.test.mjs
git commit -m "feat(scripts): add RSS fetcher with tests"
```

---

## Task 7: Create Groq Content Generator

**Files:**
- Create: `scripts/lib/groq.mjs`

No unit tests — requires live API key. Validated end-to-end in Task 13.

- [ ] **Step 1: Create scripts/lib/groq.mjs**

Create `scripts/lib/groq.mjs`:
```js
import Groq from 'groq-sdk'

const VALID_CATEGORIES = ['TRENDS', 'TECHNOLOGY', 'SUSTAINABILITY', 'WELLNESS', 'OPERATIONS', 'LUXURY', 'F&B']

/**
 * Calls Groq to generate a bilingual EN/FR blog post from a source article.
 * @param {{ title: string, url: string, excerpt: string, source: string }} article
 * @returns {Promise<{ slug, titleEn, titleFr, excerptEn, excerptFr, category, bodyEn, bodyFr, keywords }>}
 * @throws if Groq returns malformed JSON or is missing required fields
 */
export async function generatePost(article) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const systemPrompt = `You are a senior hospitality industry journalist writing for Hospitality121, a bilingual EN/FR professional media brand read by hotel owners, operators, and investors. Write with authority and insight. Avoid jargon and fluff. Respond with valid JSON only — no markdown, no code fences, no extra text.`

  const userPrompt = `Source article:
Title: ${article.title}
URL: ${article.url}
Excerpt: ${article.excerpt}
Source: ${article.source}

Write an original commentary post inspired by this article. Return ONLY a JSON object with exactly these keys:
{
  "slug": "kebab-case-max-60-chars",
  "titleEn": "Engaging English title, max 60 chars",
  "titleFr": "Titre en français accrocheur, max 60 chars",
  "excerptEn": "One sentence English summary, max 155 chars",
  "excerptFr": "Résumé en une phrase en français, max 155 chars",
  "category": "exactly one of: TRENDS, TECHNOLOGY, SUSTAINABILITY, WELLNESS, OPERATIONS, LUXURY, F&B",
  "bodyEn": "400-600 words. 4-6 paragraphs separated by double newlines. Use **bold** for key terms. No headers. Industry tone. Do NOT mention the source URL.",
  "bodyFr": "Full French translation of bodyEn. Same structure, natural French (not literal), same word count.",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 4000,
  })

  const parsed = JSON.parse(response.choices[0].message.content)

  const required = ['slug', 'titleEn', 'titleFr', 'excerptEn', 'excerptFr', 'category', 'bodyEn', 'bodyFr', 'keywords']
  for (const key of required) {
    if (!parsed[key]) throw new Error(`Groq response missing field: ${key}`)
  }

  if (!VALID_CATEGORIES.includes(parsed.category)) {
    parsed.category = 'TRENDS'
  }

  return parsed
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/groq.mjs
git commit -m "feat(scripts): add Groq bilingual content generator"
```

---

## Task 8: Create Unsplash Image Fetcher

**Files:**
- Create: `scripts/lib/unsplash.mjs`

- [ ] **Step 1: Create scripts/lib/unsplash.mjs**

Create `scripts/lib/unsplash.mjs`:
```js
import fs from 'node:fs'
import path from 'node:path'

const FALLBACK_IMAGES = [
  'five-trends-reshaping-hospitality.jpg',
  'future-of-hotel-loyalty.jpg',
  'what-guests-want-2026.jpg',
  'revenue-beyond-rooms.jpg',
  'how-to-build-hotel-culture.jpg',
]

/**
 * Downloads a relevant image from Unsplash and saves to public/images/content/.
 * Falls back to copying an existing image if Unsplash is unavailable.
 * Always returns filename "auto-[slug].jpg" and always writes the file.
 * @param {string[]} keywords
 * @param {string} slug
 * @returns {Promise<string>} filename like "auto-[slug].jpg"
 */
export async function fetchImage(keywords, slug) {
  const filename = `auto-${slug}.jpg`
  const destPath = path.join(process.cwd(), 'public', 'images', 'content', filename)

  try {
    const query = encodeURIComponent(keywords[0] ?? 'luxury hotel')
    const apiRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!apiRes.ok) throw new Error(`Unsplash API ${apiRes.status}`)

    const data = await apiRes.json()
    const imageUrl = data?.urls?.regular
    if (!imageUrl) throw new Error('No image URL in Unsplash response')

    const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) })
    if (!imgRes.ok) throw new Error(`Image download ${imgRes.status}`)

    fs.writeFileSync(destPath, Buffer.from(await imgRes.arrayBuffer()))
    console.log(`✓ Image saved from Unsplash: ${filename}`)
  } catch (err) {
    console.warn(`⚠ Unsplash failed (${err.message}), using fallback`)
    const fallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]
    fs.copyFileSync(
      path.join(process.cwd(), 'public', 'images', 'content', fallback),
      destPath
    )
    console.log(`✓ Fallback image copied: ${fallback} → ${filename}`)
  }

  return filename
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/unsplash.mjs
git commit -m "feat(scripts): add Unsplash image fetcher with fallback"
```

---

## Task 9: Create Git + IndexNow Publisher

**Files:**
- Create: `scripts/lib/publish.mjs`

- [ ] **Step 1: Create scripts/lib/publish.mjs**

Uses `execFileSync` with argument arrays (not string interpolation) to prevent any shell injection risk.

Create `scripts/lib/publish.mjs`:
```js
import { execFileSync } from 'node:child_process'

/**
 * Commits the new MDX, image, and tracking file, then pushes to origin main.
 * Uses execFileSync with argument arrays — no shell interpolation.
 * @param {{ slug: string, imageFile: string }} params
 */
export function commitAndPush({ slug, imageFile }) {
  const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })

  run('git', ['config', 'user.email', 'action@github.com'])
  run('git', ['config', 'user.name', 'H1H Auto Blog'])
  run('git', ['add',
    `content/blog/${slug}.mdx`,
    `public/images/content/${imageFile}`,
    'scripts/seen-articles.json',
  ])
  run('git', ['commit', '-m', `feat(blog): auto-post ${slug}`])
  run('git', ['push', 'origin', 'HEAD:main'])

  console.log(`✓ Pushed: ${slug}`)
}

/**
 * Pings IndexNow to fast-index the new post on Bing and Yandex.
 * Non-fatal: logs a warning if it fails, never throws.
 * @param {string} slug
 */
export async function pingIndexNow(slug) {
  const siteUrl = process.env.SITE_URL ?? 'https://hospitality121.com'
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.warn('⚠ INDEXNOW_KEY not set, skipping IndexNow ping')
    return
  }

  const host = new URL(siteUrl).hostname
  const payload = {
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList: [`${siteUrl}/content/${slug}`],
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
    console.log(`✓ IndexNow ping: ${res.status}`)
  } catch (err) {
    console.warn(`⚠ IndexNow ping failed: ${err.message}`)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/publish.mjs
git commit -m "feat(scripts): add git commit and IndexNow publisher"
```

---

## Task 10: Create Main Orchestrator

**Files:**
- Create: `scripts/auto-blog.mjs`

- [ ] **Step 1: Create scripts/auto-blog.mjs**

Create `scripts/auto-blog.mjs`:
```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchAllArticles } from './lib/rss.mjs'
import { generatePost } from './lib/groq.mjs'
import { fetchImage } from './lib/unsplash.mjs'
import { calcReadTime, generateSlug, renderMdx } from './lib/mdx.mjs'
import { commitAndPush, pingIndexNow } from './lib/publish.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRACKER_PATH = path.join(__dirname, 'seen-articles.json')

function loadSeen() {
  if (!fs.existsSync(TRACKER_PATH)) return []
  return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'))
}

function saveSeen(urls) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(urls, null, 2))
}

async function main() {
  console.log('🚀 Auto-blog pipeline starting...')

  // 1. Fetch all RSS feeds
  const articles = await fetchAllArticles()
  console.log(`ℹ Fetched ${articles.length} recent articles from feeds`)

  // 2. Skip already-processed articles
  const seen = loadSeen()
  const unseen = articles.filter(a => !seen.includes(a.url))
  if (unseen.length === 0) {
    console.log('✓ No new articles found. Exiting cleanly.')
    process.exit(0)
  }
  const article = unseen[0]
  console.log(`📰 Picked: "${article.title}" from ${article.source}`)

  // 3. Generate bilingual content via Groq (one retry on failure)
  let post
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      post = await generatePost(article)
      console.log(`✓ Groq generated: "${post.titleEn}"`)
      break
    } catch (err) {
      console.error(`✗ Groq attempt ${attempt} failed: ${err.message}`)
      if (attempt === 2) process.exit(1)
    }
  }

  // 4. Sanitize slug from Groq output, check for collision
  let slug = post.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '') || generateSlug(post.titleEn)

  if (fs.existsSync(path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`))) {
    slug = `${slug}-${Date.now()}`
  }

  // 5. Download hero image
  const imageFile = await fetchImage(post.keywords, slug)

  // 6. Render and write MDX file
  const date = new Date().toISOString().slice(0, 10)
  const mdxContent = renderMdx({
    titleEn: post.titleEn,
    titleFr: post.titleFr,
    excerptEn: post.excerptEn.slice(0, 155),
    excerptFr: post.excerptFr.slice(0, 155),
    category: post.category,
    date,
    readTime: calcReadTime(post.bodyEn),
    imageFile,
    sourceDomain: article.source,
    sourceUrl: article.url,
    bodyEn: post.bodyEn,
    bodyFr: post.bodyFr,
  })

  fs.writeFileSync(
    path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`),
    mdxContent
  )
  console.log(`✓ MDX written: content/blog/${slug}.mdx`)

  // 7. Mark article as seen
  seen.push(article.url)
  saveSeen(seen)

  // 8. Commit and push → triggers Netlify auto-deploy
  commitAndPush({ slug, imageFile })

  // 9. Ping IndexNow (non-fatal)
  await pingIndexNow(slug)

  console.log(`🎉 Done! Post live at /content/${slug}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Commit**

```bash
git add scripts/auto-blog.mjs
git commit -m "feat(scripts): add auto-blog orchestrator"
```

---

## Task 11: Create IndexNow Key Verification File

**Files:**
- Create: `public/h121blog-f4a8b2c6d9e13705.txt`

The IndexNow key is `h121blog-f4a8b2c6d9e13705`. This exact string goes into the `INDEXNOW_KEY` GitHub secret.

- [ ] **Step 1: Create the verification file**

Create `public/h121blog-f4a8b2c6d9e13705.txt` with exactly this content:
```
h121blog-f4a8b2c6d9e13705
```

After deploy, this file will be served at `https://hospitality121.com/h121blog-f4a8b2c6d9e13705.txt` — which is the `keyLocation` URL sent to IndexNow.

- [ ] **Step 2: Commit**

```bash
git add "public/h121blog-f4a8b2c6d9e13705.txt"
git commit -m "chore: add IndexNow key verification file"
```

---

## Task 12: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/auto-blog.yml`

- [ ] **Step 1: Create .github/workflows/auto-blog.yml**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/auto-blog.yml`:
```yaml
name: Auto Blog Post

on:
  schedule:
    - cron: '0 8,20 * * *'   # 8:00 AM and 8:00 PM UTC — 2 posts per day
  workflow_dispatch:           # Manual trigger from GitHub Actions UI for testing

jobs:
  auto-blog:
    runs-on: ubuntu-latest
    permissions:
      contents: write          # Required to commit and push new MDX files

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 1

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run auto-blog pipeline
        run: node scripts/auto-blog.mjs
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
          SITE_URL: https://hospitality121.com
```

- [ ] **Step 2: Run all unit tests one final time**

```bash
node --test scripts/test/mdx.test.mjs scripts/test/rss.test.mjs
```

Expected: 14 tests, all passing.

- [ ] **Step 3: Commit and push everything**

```bash
git add .github/workflows/auto-blog.yml
git commit -m "feat(ci): add GitHub Actions auto-blog cron workflow"
git push
```

---

## Task 13: Add GitHub Secrets and Run End-to-End Test

Manual steps in GitHub UI — no files changed.

- [ ] **Step 1: Add the three secrets to GitHub**

Navigate to: `https://github.com/<your-org>/<your-repo>/settings/secrets/actions`

Click **New repository secret** for each:

| Secret name | Value |
|---|---|
| `GROQ_API_KEY` | Your rotated Groq API key |
| `UNSPLASH_ACCESS_KEY` | Your rotated Unsplash access key |
| `INDEXNOW_KEY` | `h121blog-f4a8b2c6d9e13705` |

- [ ] **Step 2: Trigger a manual test run**

Navigate to: `https://github.com/<your-org>/<your-repo>/actions/workflows/auto-blog.yml`

Click **Run workflow** → select branch `main` → click **Run workflow**.

- [ ] **Step 3: Verify the Actions log**

Watch the run. Expected output in the logs:
```
🚀 Auto-blog pipeline starting...
ℹ Fetched N recent articles from feeds
📰 Picked: "..." from hotelmanagement.net
✓ Groq generated: "..."
✓ Image saved from Unsplash: auto-[slug].jpg
✓ MDX written: content/blog/[slug].mdx
✓ Pushed: [slug]
✓ IndexNow ping: 200
🎉 Done! Post live at /content/[slug]
```

- [ ] **Step 4: Verify the Netlify deploy**

After the push, check the Netlify dashboard — a new deploy should start within 30 seconds. Once it completes, visit `https://hospitality121.com/blog` and confirm the new post appears.

- [ ] **Step 5: Verify bilingual toggle**

Open the new post URL. Toggle the language switcher to FR. Confirm the title and body switch to French. Toggle back to EN — confirm it returns to English.
