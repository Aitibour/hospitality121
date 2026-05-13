# Hospitality121 Homepage — Design Spec

**Date:** 2026-05-13  
**Project:** hospitality121.com  
**Scope:** Homepage (v1 launch)  
**Stack:** Next.js 14 App Router + MDX static content, deployed to Vercel

---

## 1. Brand Identity

| Token | Value |
|---|---|
| Background | `#0A0E1A` |
| Surface / cards | `#111827` |
| Gold accent | `#C9A84C` |
| Text primary | `#FFFFFF` |
| Text muted | `#9CA3AF` |
| Heading font | Playfair Display (serif) |
| Body font | Inter (sans-serif) |
| Logo | H1H medallion (existing PNG assets in `/public/images/`) |
| Tagline | "Real Leaders. Real Conversations. Real Impact." |

Category labels are rendered in gold, uppercase, small-caps. Content pillars: PODCASTS · INSIGHTS · EVENTS · INTERVIEWS.

---

## 2. Architecture

```
hospitality121/
├── app/
│   ├── layout.tsx            # Root layout — Navbar, Footer, AdSense script tag
│   └── page.tsx              # Homepage — composes all sections
├── components/
│   ├── Navbar.tsx            # Logo left, nav links center, Subscribe button right
│   ├── HeroCarousel.tsx      # Auto-rotating hero (6s), 4 most-recent items
│   ├── ContentGrid.tsx       # 4-card grid (items 5–8 chronologically)
│   ├── EditorsPick.tsx       # 3-column curated row — left stack, center feature, right stack
│   ├── AdSlot.tsx            # Reusable ad zone component
│   └── Footer.tsx            # Logo, tagline, nav links, social icons
├── content/
│   ├── articles/             # MDX files for articles/insights
│   └── podcasts/             # MDX files for podcast episodes
├── lib/
│   └── content.ts            # Reads MDX frontmatter, returns typed sorted arrays
└── public/
    └── images/               # Brand assets, author avatars, content thumbnails
```

---

## 3. Homepage Layout (top to bottom)

1. **Navbar** — dark bar, H1H logo left, `PODCASTS · INSIGHTS · EVENTS · ABOUT` center, gold `Subscribe` CTA right
2. **AdSlot `hero-banner`** — 728×90 leaderboard, above hero
3. **HeroCarousel** — full-width, large background image, category tag + author + timestamp overlaid, large Playfair Display headline, podcast/article type badge, dot indicators + prev/next controls, auto-rotates every 6 seconds
4. **ContentGrid** — 4 cards in a row (2-col on mobile), each showing: thumbnail, category label, headline, author avatar + name, time ago
5. **AdSlot `mid-grid`** — 300×250 rectangle, centered between grid and editor's pick
6. **EditorsPick** — "EDITOR'S PICK" heading + "SEE MORE →" link; 3-column layout: left column (2 stacked small cards), center column (1 large featured card with big image), right column (2 stacked small cards)
7. **AdSlot `footer-banner`** — 728×90 leaderboard, above footer
8. **Footer** — H1H logo, tagline, nav links, LinkedIn/Instagram/Spotify icons

---

## 4. Content Model

### Article MDX frontmatter
```yaml
---
title: string
category: string          # e.g. "INSIGHTS", "INTERVIEWS"
author: string
authorAvatar: string      # path to image in /public
date: string              # ISO 8601 — YYYY-MM-DD
readTime: string          # e.g. "8 minutes read"
image: string             # path to hero image in /public
featured: boolean         # true = eligible for Editor's Pick
type: "article"
---
```

### Podcast MDX frontmatter
```yaml
---
title: string
category: "PODCAST"
guest: string
guestAvatar: string
date: string
duration: string          # e.g. "42 min"
image: string
featured: boolean
type: "podcast"
embedUrl: string          # empty until hosting decided; renders placeholder player
---
```

`lib/content.ts` reads all MDX files from both directories, merges them into a single typed array sorted by `date` descending. Hero receives items [0–3], ContentGrid receives [4–7], EditorsPick receives all items where `featured: true`.

---

## 5. Ad System

| Zone prop | Size | Position |
|---|---|---|
| `hero-banner` | 728×90 leaderboard | Above hero carousel |
| `mid-grid` | 300×250 rectangle | Between content grid and editor's pick |
| `footer-banner` | 728×90 leaderboard | Above footer |

`AdSlot` component interface:
```tsx
<AdSlot zone="mid-grid" sponsorHtml="<a href=...><img .../></a>" />
```
- If `sponsorHtml` is provided → renders it directly (direct deal)
- If `sponsorHtml` is absent → renders the Google AdSense unit for that zone
- AdSense publisher script loaded once in `layout.tsx`

---

## 6. Responsive Behavior

- **Desktop (≥1024px):** Full 4-column ContentGrid, 3-column EditorsPick, leaderboard ads visible
- **Tablet (768–1023px):** 2-column ContentGrid, leaderboard ads collapse to 300×250
- **Mobile (<768px):** 1-column stack, hero full-screen, ads hidden or replaced with smaller units (320×50)

---

## 7. Seed Content

Ship with 8 placeholder content items (4 articles, 4 podcasts) using the existing brand photography from `/public/images/`. Enough to populate hero + grid + editor's pick without empty states.

---

## 8. Out of Scope (v1)

- Authentication / newsletter signup backend
- Podcast player with real audio (embedUrl left empty)
- Individual article/podcast pages (routes added in v2)
- Events page, About page
- Search functionality
- CMS or admin dashboard
