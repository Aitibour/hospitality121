# Auto-Blog Pipeline Design

**Date:** 2026-05-19  
**Status:** Approved  
**Author:** H1H / Claude Code

---

## Goal

Automatically publish 2 bilingual (EN/FR) blog posts per day on Hospitality121 by pulling real hospitality news from RSS feeds, rewriting them via Groq AI, illustrating with Unsplash images, and deploying via Netlify's existing auto-deploy on push — with no manual intervention ever.

---

## Architecture Overview

Three layers:

1. **GitHub Actions scheduler** — cron fires twice daily, runs the pipeline script, commits results, pushes to main
2. **Node.js pipeline script** — `scripts/auto-blog.mjs` — handles the full RSS → AI → MDX → IndexNow chain
3. **JSON tracking file** — `scripts/seen-articles.json` — deduplicates across all past runs

Netlify's existing auto-deploy-on-push wires layer 1 to production automatically. No new infrastructure required.

---

## RSS Sources

| Site | Feed URL |
|---|---|
| Hotel Management | `https://hotelmanagement.net/feed` |
| Hospitality Net | `https://www.hospitalitynet.org/rss/news.xml` |
| Skift | `https://skift.com/feed/` |

All three are fetched in parallel each run. Items are filtered to the last 48 hours to avoid stale content.

---

## Pipeline Script — `scripts/auto-blog.mjs`

Runs as a plain Node.js ESM script (no build step needed). Steps in order:

1. **Fetch RSS** — fetch all 3 feeds in parallel using native `fetch`; parse XML with a lightweight parser (`fast-xml-parser`)
2. **Deduplicate** — load `scripts/seen-articles.json`; discard any item whose URL is already present
3. **Pick article** — take the first remaining unseen item (chronologically newest)
4. **Early exit** — if zero unseen items, log and exit 0 (no commit, no noise)
5. **Generate content via Groq** — call `llama-3.3-70b-versatile` with a structured prompt that returns JSON: `{ slug, titleEn, titleFr, excerptEn, excerptFr, category, bodyEn, bodyFr, keywords }`
6. **Fetch image via Unsplash** — search using `keywords[0]`; download the first result's `regular` URL; save to `public/images/content/auto-[slug].jpg`
7. **Compute readTime** — count words in `bodyEn`; divide by 200; round up; format as `"N min read"`
8. **Write MDX** — write to `content/blog/[slug].mdx` using the bilingual format (see below)
9. **Update tracker** — append the source article URL to `scripts/seen-articles.json`
10. **Git commit & push** — `git add content/blog/[slug].mdx public/images/content/auto-[slug].jpg scripts/seen-articles.json` → commit `"feat(blog): auto-post [slug]"` → push origin main → Netlify deploys
11. **Ping IndexNow** — POST to `https://api.indexnow.org/indexnow` with the new post URL; also POST to `https://www.bing.com/indexnow`

---

## Bilingual MDX Format

### Frontmatter

```mdx
---
title: "English title here"
titleFr: "French title here"
excerpt: "English excerpt (≤160 chars)"
excerptFr: "French excerpt (≤160 chars)"
category: "CATEGORY"
author: "H1H Newsfeed"
authorAvatar: "/images/Logo.png"
date: "YYYY-MM-DD"
readTime: "N min read"
image: "/images/content/auto-[slug].jpg"
featured: false
type: "blog"
source: "sitename.com"
sourceUrl: "https://original-article-url"
---
```

### Body

```mdx
[Full English body — multiple paragraphs, markdown formatting]

<!-- FR -->

[Full French body — complete translation, same structure]
```

The `<!-- FR -->` sentinel is the split point. The page component splits on this string and renders the half matching the active language from `LanguageContext`.

---

## Content Page Changes — `app/content/[slug]/page.tsx`

Two additions:

1. **Body language split** — after fetching body content, split on `\n<!-- FR -->\n`. Index 0 = EN body, index 1 = FR body. Pass both to the render component; use `LanguageContext` to select which to display.
2. **Bilingual metadata** — read `titleFr` and `excerptFr` from frontmatter. When active language is FR, use these for `<title>` and `<meta name="description">`.

Existing posts (no `<!-- FR -->` sentinel) continue to work unchanged — the split returns a single-element array and falls back to EN.

---

## Type System Changes — `types/content.ts`

Extend `BlogPost` type:

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

All new fields are optional — no impact on existing MDX files.

---

## GitHub Actions Workflow — `.github/workflows/auto-blog.yml`

```yaml
name: Auto Blog Post
on:
  schedule:
    - cron: '0 8,20 * * *'   # 8am and 8pm UTC
  workflow_dispatch:           # allows manual trigger for testing

jobs:
  auto-blog:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/auto-blog.mjs
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
          SITE_URL: https://hospitality121.com
```

`workflow_dispatch` allows a one-click manual test run from the GitHub Actions UI before the first scheduled run fires.

---

## IndexNow Setup

- **Key:** a UUID generated once and stored as `INDEXNOW_KEY` GitHub secret
- **Verification file:** `public/[key].txt` containing only the key string — created once, committed, never changes
- **Ping endpoint:** `https://api.indexnow.org/indexnow` (routes to both Bing and Yandex)
- **Payload:** `{ host, key, keyLocation, urlList: [newPostUrl] }`

---

## GitHub Secrets Required

| Secret | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key (rotate before adding) |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key (rotate before adding) |
| `INDEXNOW_KEY` | Self-generated UUID — I'll create this |

`GITHUB_TOKEN` is provided automatically by Actions — no setup needed.

---

## New Dependencies

Added to `package.json` (devDependencies, script-only):

| Package | Purpose |
|---|---|
| `fast-xml-parser` | Parse RSS XML feeds |
| `groq-sdk` | Groq API client |

No new runtime dependencies (Unsplash uses plain `fetch`; IndexNow pings use plain `fetch`).

---

## Files Changed / Created

| Path | Action |
|---|---|
| `.github/workflows/auto-blog.yml` | Create — Actions workflow |
| `scripts/auto-blog.mjs` | Create — pipeline script |
| `scripts/seen-articles.json` | Create — tracking file (starts as `[]`) |
| `public/[indexnow-key].txt` | Create — IndexNow verification |
| `types/content.ts` | Extend BlogPost with optional bilingual fields |
| `app/content/[slug]/page.tsx` | Extend to handle `<!-- FR -->` body split |
| `package.json` | Add `fast-xml-parser`, `groq-sdk` |

---

## Error Handling

- **RSS fetch fails** — catch per-feed, continue with remaining feeds; if all 3 fail, exit 0 (no commit)
- **No unseen articles** — exit 0 silently
- **Groq returns malformed JSON** — retry once; if still malformed, exit 1 (Actions marks run as failed, sends email notification)
- **Unsplash returns no results** — fall back to a curated set of 5 static hospitality images already in `public/images/`
- **Git push fails** — exit 1; next scheduled run will retry with a fresh checkout
- **IndexNow ping fails** — log warning but do not fail the run (post is already live)

---

## Groq Prompt Design

System prompt instructs the model to act as a senior hospitality industry journalist. User prompt provides:
- The source article title, URL, and excerpt
- Required output format (JSON with specific keys)
- EN body requirements: 400–600 words, 4–6 paragraphs, no fluff, industry-appropriate tone
- FR body requirements: full translation, natural French (not literal), same structure
- Category must be one of: `TRENDS | TECHNOLOGY | SUSTAINABILITY | WELLNESS | OPERATIONS | LUXURY | F&B`
- Slug: kebab-case, max 60 chars, derived from EN title

---

## Constraints & Assumptions

- Netlify auto-deploy on push to `main` is already enabled (confirmed by existing workflow)
- The site domain for IndexNow pings is `hospitality121.com` — update `SITE_URL` in the workflow if different
- Unsplash free tier allows 50 requests/hour — well within 2 requests/day
- Groq free tier is sufficient for 2 requests/day at this prompt length
- GitHub Actions free tier: 2000 minutes/month; each run takes ~2 minutes = 120 minutes/month, well within limits
