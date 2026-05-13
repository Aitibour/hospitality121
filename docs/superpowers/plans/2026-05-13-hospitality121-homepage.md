# Hospitality121 Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Hospitality121.com homepage — a VIBE.NEWS-style editorial site for hospitality podcasts and insights, with rotating hero, content grid, editor's pick section, and Google AdSense + direct ad slots.

**Architecture:** Next.js 14 App Router with static MDX content files. `lib/content.ts` reads all MDX frontmatter at build time and returns a typed, sorted content array. The homepage composes six section components, each receiving pre-fetched content as props. `AdSlot` renders either direct sponsor HTML (sanitized via DOMPurify) or an AdSense unit depending on props.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, gray-matter (MDX frontmatter parsing), isomorphic-dompurify (XSS sanitization), next/font (Playfair Display + Inter), next/image

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | Dependencies |
| `tailwind.config.ts` | Brand color tokens |
| `app/layout.tsx` | Root layout — fonts, AdSense script, Navbar, Footer |
| `app/page.tsx` | Homepage — fetches content, composes sections |
| `app/globals.css` | Base styles, Tailwind directives |
| `lib/content.ts` | Read + sort MDX frontmatter, return typed arrays |
| `lib/timeAgo.ts` | Format relative timestamps |
| `types/content.ts` | `Article`, `Podcast`, `ContentItem` types |
| `components/Navbar.tsx` | Top nav bar |
| `components/Footer.tsx` | Footer |
| `components/HeroCarousel.tsx` | Auto-rotating hero (client component) |
| `components/ContentGrid.tsx` | 4-card grid |
| `components/EditorsPick.tsx` | 3-column curated row |
| `components/AdSlot.tsx` | Reusable ad zone — DOMPurify-sanitized direct HTML or AdSense fallback |
| `components/CategoryLabel.tsx` | Gold uppercase category tag |
| `components/AuthorLine.tsx` | Avatar + name + time ago |
| `content/articles/*.mdx` | 4 seed articles |
| `content/podcasts/*.mdx` | 4 seed podcast episodes |
| `public/images/` | Brand assets (already exist in project folder) |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `next.config.ts`
- Create: `app/globals.css`

- [ ] **Step 1: Initialise the Next.js project**

Run from `c:\Users\Abdel\Documents\Claude Code\Hospitality121`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```
When prompted, accept all defaults.

- [ ] **Step 2: Install content + sanitization dependencies**

```bash
npm install gray-matter isomorphic-dompurify
npm install --save-dev @types/dompurify
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: `▲ Next.js 14.x.x` ready on `http://localhost:3000` with no errors.

- [ ] **Step 4: Configure Tailwind brand tokens**

Replace the contents of `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0E1A',
        surface: '#111827',
        gold: '#C9A84C',
        muted: '#9CA3AF',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Set global base styles**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0A0E1A;
  color: #ffffff;
}
```

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with brand tokens"
```

---

## Task 2: Types + Content Reader

**Files:**
- Create: `types/content.ts`
- Create: `lib/content.ts`
- Create: `lib/timeAgo.ts`

- [ ] **Step 1: Create content types**

Create `types/content.ts`:
```ts
export type Article = {
  type: 'article'
  slug: string
  title: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
}

export type Podcast = {
  type: 'podcast'
  slug: string
  title: string
  category: string
  guest: string
  guestAvatar: string
  date: string
  duration: string
  image: string
  featured: boolean
  embedUrl: string
}

export type ContentItem = Article | Podcast
```

- [ ] **Step 2: Create content reader**

Create `lib/content.ts`:
```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from '@/types/content'

function readDir(dir: string, type: 'article' | 'podcast'): ContentItem[] {
  const fullDir = path.join(process.cwd(), 'content', dir)
  if (!fs.existsSync(fullDir)) return []
  return fs.readdirSync(fullDir)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(fullDir, filename), 'utf-8')
      const { data } = matter(raw)
      return { ...data, slug, type } as ContentItem
    })
}

export function getAllContent(): ContentItem[] {
  const articles = readDir('articles', 'article')
  const podcasts = readDir('podcasts', 'podcast')
  return [...articles, ...podcasts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getFeaturedContent(): ContentItem[] {
  return getAllContent().filter(item => item.featured)
}
```

- [ ] **Step 3: Create timeAgo utility**

Create `lib/timeAgo.ts`:
```ts
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${mins} minute${mins > 1 ? 's' : ''} ago`
}
```

- [ ] **Step 4: Commit**

```bash
git add types/content.ts lib/content.ts lib/timeAgo.ts
git commit -m "feat: add content types, MDX reader, and timeAgo utility"
```

---

## Task 3: Seed Content (8 MDX files)

**Files:**
- Create: `content/articles/future-of-luxury-hospitality.mdx`
- Create: `content/articles/revenue-management-strategies.mdx`
- Create: `content/articles/sustainable-hotels-2026.mdx`
- Create: `content/articles/ai-in-guest-experience.mdx`
- Create: `content/podcasts/andre-merritt-hotel-brands.mdx`
- Create: `content/podcasts/samia-moore-events-industry.mdx`
- Create: `content/podcasts/jacob-mcleod-culture-art.mdx`
- Create: `content/podcasts/diana-lara-construction.mdx`

- [ ] **Step 1: Create article seed files**

```bash
mkdir -p content/articles content/podcasts
```

Create `content/articles/future-of-luxury-hospitality.mdx`:
```mdx
---
title: "The Future of Luxury Hospitality"
category: "INSIGHTS"
author: "Samia Moore"
authorAvatar: "/images/logo.png"
date: "2026-05-11"
readTime: "8 minutes read"
image: "/images/brand-banner-2.png"
featured: true
type: "article"
---
```

Create `content/articles/revenue-management-strategies.mdx`:
```mdx
---
title: "Revenue Management Strategies for Independent Hotels"
category: "BUSINESS"
author: "Jeremy Curry"
authorAvatar: "/images/logo.png"
date: "2026-05-09"
readTime: "6 minutes read"
image: "/images/brand-banner-3.png"
featured: false
type: "article"
---
```

Create `content/articles/sustainable-hotels-2026.mdx`:
```mdx
---
title: "Sustainable Hotels: Green Practices Reshaping the Industry"
category: "INSIGHTS"
author: "Diane Lara"
authorAvatar: "/images/logo.png"
date: "2026-05-08"
readTime: "5 minutes read"
image: "/images/brand-banner-4.png"
featured: false
type: "article"
---
```

Create `content/articles/ai-in-guest-experience.mdx`:
```mdx
---
title: "How AI is Transforming the Guest Experience"
category: "TECH"
author: "Sumaya Oneill"
authorAvatar: "/images/logo.png"
date: "2026-05-07"
readTime: "7 minutes read"
image: "/images/brand-banner-5.png"
featured: true
type: "article"
---
```

- [ ] **Step 2: Create podcast seed files**

Create `content/podcasts/andre-merritt-hotel-brands.mdx`:
```mdx
---
title: "André Merritt on Leading Global Hotel Brands"
category: "PODCAST"
guest: "André Merritt"
guestAvatar: "/images/logo.png"
date: "2026-05-12"
duration: "42 min"
image: "/images/brand-banner-1.png"
featured: true
type: "podcast"
embedUrl: ""
---
```

Create `content/podcasts/samia-moore-events-industry.mdx`:
```mdx
---
title: "Samia Moore: Reinventing Hospitality Events Post-Pandemic"
category: "EVENTS"
guest: "Samia Moore"
guestAvatar: "/images/logo.png"
date: "2026-05-10"
duration: "38 min"
image: "/images/brand-banner-6.png"
featured: false
type: "podcast"
embedUrl: ""
---
```

Create `content/podcasts/jacob-mcleod-culture-art.mdx`:
```mdx
---
title: "Jacob McLeod: Culture, Art and the Hospitality Space"
category: "CULTURE"
guest: "Jacob McLeod"
guestAvatar: "/images/logo.png"
date: "2026-05-06"
duration: "35 min"
image: "/images/brand-banner-7.png"
featured: false
type: "podcast"
embedUrl: ""
---
```

Create `content/podcasts/diana-lara-construction.mdx`:
```mdx
---
title: "Diana Lara on Building the Hospitality Properties of Tomorrow"
category: "BUSINESS"
guest: "Diana Lara"
guestAvatar: "/images/logo.png"
date: "2026-05-05"
duration: "44 min"
image: "/images/linkedin-banner.jpg"
featured: true
type: "podcast"
embedUrl: ""
---
```

- [ ] **Step 3: Commit**

```bash
git add content/
git commit -m "feat: add 8 seed content items (4 articles, 4 podcasts)"
```

---

## Task 4: Shared Primitive Components

**Files:**
- Create: `components/CategoryLabel.tsx`
- Create: `components/AuthorLine.tsx`

- [ ] **Step 1: Create CategoryLabel**

Create `components/CategoryLabel.tsx`:
```tsx
type Props = { label: string }

export default function CategoryLabel({ label }: Props) {
  return (
    <span className="text-gold text-xs font-bold uppercase tracking-widest">
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Create AuthorLine**

Create `components/AuthorLine.tsx`:
```tsx
import Image from 'next/image'

type Props = {
  name: string
  avatar: string
  timeAgo: string
}

export default function AuthorLine({ name, avatar, timeAgo }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={avatar}
        alt={name}
        width={28}
        height={28}
        className="rounded-full object-cover"
      />
      <span className="text-white text-sm font-medium">{name}</span>
      <span className="text-muted text-sm">· {timeAgo}</span>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CategoryLabel.tsx components/AuthorLine.tsx
git commit -m "feat: add CategoryLabel and AuthorLine primitives"
```

---

## Task 5: AdSlot Component

**Files:**
- Create: `components/AdSlot.tsx`

- [ ] **Step 1: Create AdSlot with DOMPurify sanitization**

Direct sponsor HTML is sanitized with `isomorphic-dompurify` before rendering, preventing XSS from untrusted sponsor markup.

Create `components/AdSlot.tsx`:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import DOMPurify from 'isomorphic-dompurify'

type Zone = 'hero-banner' | 'mid-grid' | 'footer-banner'

const ADSENSE_SLOTS: Record<Zone, string> = {
  'hero-banner': 'XXXXXXXXXXXXXXX',   // replace with real AdSense slot IDs
  'mid-grid': 'XXXXXXXXXXXXXXX',
  'footer-banner': 'XXXXXXXXXXXXXXX',
}

const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX' // replace with real publisher ID

type Props = {
  zone: Zone
  sponsorHtml?: string
  className?: string
}

export default function AdSlot({ zone, sponsorHtml, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sponsorHtml && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [sponsorHtml])

  if (sponsorHtml) {
    const clean = DOMPurify.sanitize(sponsorHtml, {
      ALLOWED_TAGS: ['a', 'img', 'picture', 'source', 'p', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class', 'style', 'width', 'height', 'srcset', 'media'],
    })
    return (
      <div
        className={`flex justify-center my-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    )
  }

  return (
    <div className={`flex justify-center my-4 ${className}`} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOTS[zone]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AdSlot.tsx
git commit -m "feat: add AdSlot with DOMPurify sanitization and AdSense fallback"
```

---

## Task 6: Navbar + Footer

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create Navbar**

Create `components/Navbar.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-navy border-b border-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Hospitality121" width={40} height={40} />
          <div className="leading-tight">
            <span className="block text-white font-serif font-bold text-sm tracking-wide">HOSPITALITY</span>
            <span className="block text-gold font-serif font-bold text-sm tracking-widest">ONE 2 ONE</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['PODCASTS', 'INSIGHTS', 'EVENTS', 'ABOUT'].map(link => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-white text-sm font-medium tracking-wider hover:text-gold transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        <Link
          href="/subscribe"
          className="bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:bg-yellow-400 transition-colors"
        >
          Subscribe
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create Footer**

Create `components/Footer.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-navy mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Hospitality121" width={48} height={48} />
          <div>
            <p className="text-white font-serif font-bold text-sm">HOSPITALITY ONE 2 ONE</p>
            <p className="text-muted text-xs">Real Leaders. Real Conversations. Real Impact.</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          {['Podcasts', 'Insights', 'Events', 'About', 'Contact'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-gold transition-colors">{l}</Link>
          ))}
        </div>
        <div className="flex gap-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">LinkedIn</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">Instagram</a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">Spotify</a>
        </div>
      </div>
      <p className="text-center text-muted text-xs pb-6">
        © {new Date().getFullYear()} Hospitality One 2 One. All rights reserved.
      </p>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx
git commit -m "feat: add Navbar and Footer components"
```

---

## Task 7: Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Wire up fonts, AdSense script, Navbar, Footer**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Hospitality One 2 One',
  description: 'Real Leaders. Real Conversations. Real Impact. Podcasts, insights and interviews shaping the future of hospitality.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-navy text-white font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire up root layout with fonts and AdSense"
```

---

## Task 8: HeroCarousel Component

**Files:**
- Create: `components/HeroCarousel.tsx`

- [ ] **Step 1: Create HeroCarousel (client component)**

Create `components/HeroCarousel.tsx`:
```tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { timeAgo } from '@/lib/timeAgo'

type Props = { items: ContentItem[] }

export default function HeroCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const item = items[current]
  const name = item.type === 'article' ? item.author : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta = item.type === 'article' ? item.readTime : item.duration

  return (
    <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <CategoryLabel label={item.category} />
          <span className="text-muted text-sm">·</span>
          <span className="text-muted text-sm">{timeAgo(item.date)}</span>
          <span className="ml-2 text-xs bg-surface text-gold border border-gold/30 px-2 py-0.5 rounded">
            {item.type === 'podcast' ? '🎙 PODCAST' : '📄 ARTICLE'}
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
          {item.title}
        </h1>
        <div className="flex items-center gap-4">
          <AuthorLine name={name} avatar={avatar} timeAgo={timeAgo(item.date)} />
          <span className="text-muted text-sm">{meta}</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        <button onClick={prev} aria-label="Previous" className="text-white/70 hover:text-white text-2xl leading-none">‹</button>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-white/30'}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next" className="text-white/70 hover:text-white text-2xl leading-none">›</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HeroCarousel.tsx
git commit -m "feat: add HeroCarousel with auto-rotation and controls"
```

---

## Task 9: ContentGrid Component

**Files:**
- Create: `components/ContentGrid.tsx`

- [ ] **Step 1: Create ContentGrid**

Create `components/ContentGrid.tsx`:
```tsx
import Image from 'next/image'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { timeAgo } from '@/lib/timeAgo'

type Props = { items: ContentItem[] }

export default function ContentGrid({ items }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => {
          const name = item.type === 'article' ? item.author : item.guest
          const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
          const meta = item.type === 'article' ? item.readTime : item.duration
          return (
            <article key={item.slug} className="bg-surface rounded-lg overflow-hidden hover:ring-1 hover:ring-gold/40 transition-all cursor-pointer">
              <div className="relative h-44">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <AuthorLine name={name} avatar={avatar} timeAgo={timeAgo(item.date)} />
                <CategoryLabel label={item.category} />
                <h3 className="font-serif text-white font-semibold text-base leading-snug line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-muted text-xs">{meta}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ContentGrid.tsx
git commit -m "feat: add ContentGrid 4-card component"
```

---

## Task 10: EditorsPick Component

**Files:**
- Create: `components/EditorsPick.tsx`

- [ ] **Step 1: Create EditorsPick**

Create `components/EditorsPick.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { timeAgo } from '@/lib/timeAgo'

type Props = { items: ContentItem[] }

function SmallCard({ item }: { item: ContentItem }) {
  const name = item.type === 'article' ? item.author : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta = item.type === 'article' ? item.readTime : item.duration
  return (
    <article className="flex gap-3 cursor-pointer group">
      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex flex-col gap-1">
        <AuthorLine name={name} avatar={avatar} timeAgo={timeAgo(item.date)} />
        <h4 className="font-serif text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-2">
          <CategoryLabel label={item.category} />
          <span className="text-muted text-xs">{meta}</span>
        </div>
      </div>
    </article>
  )
}

function LargeCard({ item }: { item: ContentItem }) {
  const name = item.type === 'article' ? item.author : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta = item.type === 'article' ? item.readTime : item.duration
  return (
    <article className="relative h-full min-h-[380px] rounded-lg overflow-hidden cursor-pointer group">
      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <AuthorLine name={name} avatar={avatar} timeAgo={timeAgo(item.date)} />
        <h3 className="font-serif text-white text-xl font-bold leading-snug mt-2 mb-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          <CategoryLabel label={item.category} />
          <span className="text-muted text-xs">{meta}</span>
        </div>
      </div>
    </article>
  )
}

export default function EditorsPick({ items }: Props) {
  if (items.length < 3) return null
  const center = items[0]
  const sides = items.slice(1, 5)
  const left = sides.slice(0, 2)
  const right = sides.slice(2, 4).length ? sides.slice(2, 4) : sides.slice(0, 2)

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-serif text-2xl font-bold tracking-wide">EDITOR'S PICK</h2>
        <Link href="/insights" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
          SEE MORE ↗
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          {left.map(item => <SmallCard key={item.slug} item={item} />)}
        </div>
        <LargeCard item={center} />
        <div className="flex flex-col gap-6">
          {right.map(item => <SmallCard key={item.slug} item={item} />)}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/EditorsPick.tsx
git commit -m "feat: add EditorsPick 3-column section"
```

---

## Task 11: Homepage Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Assemble homepage**

Replace `app/page.tsx`:
```tsx
import { getAllContent, getFeaturedContent } from '@/lib/content'
import HeroCarousel from '@/components/HeroCarousel'
import ContentGrid from '@/components/ContentGrid'
import EditorsPick from '@/components/EditorsPick'
import AdSlot from '@/components/AdSlot'

export default function HomePage() {
  const all = getAllContent()
  const heroItems = all.slice(0, 4)
  const gridItems = all.slice(4, 8)
  const featuredItems = getFeaturedContent()

  return (
    <>
      <AdSlot zone="hero-banner" />
      <HeroCarousel items={heroItems} />
      <ContentGrid items={gridItems} />
      <AdSlot zone="mid-grid" />
      <EditorsPick items={featuredItems} />
      <AdSlot zone="footer-banner" />
    </>
  )
}
```

- [ ] **Step 2: Run dev server and visually verify**

```bash
npm run dev
```
Open `http://localhost:3000` and confirm:
- Navbar renders with logo + links + Subscribe button
- Hero carousel shows first item, auto-rotates after 6s, prev/next and dot controls work
- 4-card content grid renders below hero
- Editor's Pick section shows 3-column layout with large center card
- Footer renders with links and tagline
- No console errors

- [ ] **Step 3: Run production build**

```bash
npm run build
```
Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage with all sections and ad slots"
```

---

## Task 12: Copy Brand Assets to Public

**Files:**
- Create: `public/images/` (populated from existing project assets)

- [ ] **Step 1: Create public/images directory and copy assets**

Run from `c:\Users\Abdel\Documents\Claude Code\Hospitality121`:
```powershell
New-Item -ItemType Directory -Force -Path "Hospitality121\public\images"
Copy-Item "ChatGPT Image May 11, 2026, 12_52_15 AM.png" "Hospitality121\public\images\brand-banner-1.png"
Copy-Item "ChatGPT Image May 11, 2026, 12_55_17 AM.png" "Hospitality121\public\images\brand-banner-6.png"
Copy-Item "ChatGPT Image May 11, 2026, 01_01_12 AM.png" "Hospitality121\public\images\brand-banner-5.png"
Copy-Item "ChatGPT Image May 11, 2026, 01_04_10 AM.png" "Hospitality121\public\images\brand-banner-3.png"
Copy-Item "ChatGPT Image May 11, 2026, 01_06_42 AM.png" "Hospitality121\public\images\brand-banner-4.png"
Copy-Item "ChatGPT Image May 11, 2026, 01_14_53 AM.png" "Hospitality121\public\images\brand-banner-2.png"
Copy-Item "ChatGPT Image May 11, 2026, 01_40_07 AM.png" "Hospitality121\public\images\brand-banner-7.png"
Copy-Item "logo (2).png" "Hospitality121\public\images\logo.png"
Copy-Item "Linkeidin 1.png" "Hospitality121\public\images\linkedin-banner.jpg"
```

- [ ] **Step 2: Final build + visual verify**

```bash
npm run build && npm run start
```
Open `http://localhost:3000` — confirm all images load, no broken placeholders, carousel rotates, gold accents match brand.

- [ ] **Step 3: Final commit**

```bash
git add public/images/
git commit -m "feat: add brand assets to public/images"
```
