# Section Pages, Contact & Light Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/insights` and `/podcasts` listing pages, a `/contact` page with Netlify Forms, and a light/dark mode toggle to the Hospitality121 site.

**Architecture:** Listing pages are server components that filter `getAllContent()` by type and reuse the existing `ContentGrid` component. Light mode is implemented via `next-themes` with a `ThemeProvider` client wrapper and a `ThemeToggle` island in the Navbar. Contact page is a client component that submits to Netlify Forms via `fetch`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, `next-themes`, Netlify Forms

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Install | `package.json` | Add `next-themes` |
| Modify | `app/globals.css` | Light mode token overrides + body text |
| Create | `components/ThemeProvider.tsx` | `'use client'` next-themes provider wrapper |
| Modify | `app/layout.tsx` | Wrap body in ThemeProvider, add `suppressHydrationWarning` to `<html>` |
| Create | `components/ThemeToggle.tsx` | Sun/moon toggle button using `useTheme()` |
| Modify | `components/Navbar.tsx` | Add ThemeToggle + Contact nav link |
| Create | `components/SectionHeader.tsx` | Reusable page header (title, description, count) |
| Create | `app/insights/page.tsx` | All articles listing, ISR 1h |
| Create | `app/podcasts/page.tsx` | All podcasts listing, ISR 1h |
| Create | `app/contact/page.tsx` | Contact form with Netlify Forms integration |

---

## Task 1: Install next-themes

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install next-themes
```

- [ ] **Step 2: Verify it appears in dependencies**

```bash
cat package.json | grep next-themes
```

Expected output:
```
"next-themes": "^0.4.x"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install next-themes for light/dark mode"
```

---

## Task 2: Add light mode CSS tokens

**Files:**
- Modify: `app/globals.css`

Current `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-navy: #0A0E1A;
  --color-surface: #111827;
  --color-gold: #C9A84C;
  --color-muted: #9CA3AF;
  --font-serif: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
}

body {
  background-color: #0A0E1A;
  color: #ffffff;
}
```

- [ ] **Step 1: Replace `globals.css` with light mode support**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  --color-navy: #0A0E1A;
  --color-surface: #111827;
  --color-gold: #C9A84C;
  --color-muted: #9CA3AF;
  --font-serif: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
}

body {
  background-color: var(--color-navy);
  color: #ffffff;
}

/* Light mode token overrides — applied when next-themes sets class="light" on <html> */
.light {
  --color-navy: #FFFFFF;
  --color-surface: #F3F4F6;
  --color-gold: #B8922E;
  --color-muted: #6B7280;
}

.light body {
  color: #0A0E1A;
}

/* Override hardcoded text-white utilities in light mode */
.light .text-white {
  color: #0A0E1A;
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add light mode CSS token overrides"
```

---

## Task 3: Create ThemeProvider + update root layout

**Files:**
- Create: `components/ThemeProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `components/ThemeProvider.tsx`**

```tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 2: Update `app/layout.tsx`**

Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Hospitality One 2 One',
  description: 'Real Leaders. Real Conversations. Real Impact.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-navy font-sans">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Key changes:
- Added `suppressHydrationWarning` to `<html>` (required by next-themes to avoid React hydration mismatch)
- Removed `text-white` from `<body>` className (text color now handled in CSS)
- Wrapped Navbar/main/Footer in `<ThemeProvider>`

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ThemeProvider.tsx app/layout.tsx
git commit -m "feat: add ThemeProvider and suppress hydration warning for next-themes"
```

---

## Task 4: Create ThemeToggle + add to Navbar

**Files:**
- Create: `components/ThemeToggle.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Create `components/ThemeToggle.tsx`**

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Render a placeholder before mount to avoid layout shift
  if (!mounted) return <div className="w-8 h-8" aria-hidden="true" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-white hover:text-gold transition-colors p-1 rounded"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
```

- [ ] **Step 2: Update `components/Navbar.tsx`**

Replace the entire file with:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  return (
    <nav aria-label="Main" className="bg-navy border-b border-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Hospitality121" width={40} height={40} />
          <div className="leading-tight">
            <span className="block text-white font-serif font-bold text-sm tracking-wide">HOSPITALITY</span>
            <span className="block text-gold font-serif font-bold text-sm tracking-widest">ONE 2 ONE</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['PODCASTS', 'INSIGHTS', 'CONTACT'].map(link => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-white text-sm font-medium tracking-wider hover:text-gold transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/subscribe"
            className="bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

Changes:
- Nav links updated to `['PODCASTS', 'INSIGHTS', 'CONTACT']` (removed EVENTS/ABOUT, added CONTACT)
- Subscribe button wrapped in a flex group alongside `ThemeToggle`

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ThemeToggle.tsx components/Navbar.tsx
git commit -m "feat: add ThemeToggle and Contact link to Navbar"
```

---

## Task 5: Create SectionHeader component

**Files:**
- Create: `components/SectionHeader.tsx`

- [ ] **Step 1: Create `components/SectionHeader.tsx`**

```tsx
type Props = {
  title: string
  description: string
  count: number
  noun: string
}

export default function SectionHeader({ title, description, count, noun }: Props) {
  return (
    <div className="bg-surface border-b border-muted/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-muted max-w-xl text-base">{description}</p>
        <p className="text-gold text-sm font-medium mt-4">
          {count} {noun}{count !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/SectionHeader.tsx
git commit -m "feat: add SectionHeader component for listing pages"
```

---

## Task 6: Create Insights listing page

**Files:**
- Create: `app/insights/page.tsx`

- [ ] **Step 1: Create `app/insights/page.tsx`**

```tsx
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function InsightsPage() {
  const items = getAllContent().filter(item => item.type === 'article')
  return (
    <>
      <SectionHeader
        title="INSIGHTS"
        description="Expert perspectives, industry analysis, and thought leadership from hospitality's brightest minds."
        count={items.length}
        noun="article"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
```

- [ ] **Step 2: Verify build passes and route is registered**

```bash
npm run build
```

Expected output includes:
```
○ /insights
```

- [ ] **Step 3: Commit**

```bash
git add app/insights/page.tsx
git commit -m "feat: add /insights listing page"
```

---

## Task 7: Create Podcasts listing page

**Files:**
- Create: `app/podcasts/page.tsx`

- [ ] **Step 1: Create `app/podcasts/page.tsx`**

```tsx
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function PodcastsPage() {
  const items = getAllContent().filter(item => item.type === 'podcast')
  return (
    <>
      <SectionHeader
        title="PODCASTS"
        description="Real conversations with the leaders shaping the future of hospitality."
        count={items.length}
        noun="episode"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ContentGrid items={items} />
      </div>
      <AdSlot zone="mid-grid" />
    </>
  )
}
```

- [ ] **Step 2: Verify build passes and route is registered**

```bash
npm run build
```

Expected output includes:
```
○ /podcasts
```

- [ ] **Step 3: Commit**

```bash
git add app/podcasts/page.tsx
git commit -m "feat: add /podcasts listing page"
```

---

## Task 8: Create Contact page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create `app/contact/page.tsx`**

```tsx
'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const params = new URLSearchParams()
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value)
    })
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-gold mb-4">Thanks!</h1>
        <p className="text-muted">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-3">GET IN TOUCH</h1>
      <p className="text-muted mb-10">
        Have a story to share? Want to collaborate or advertise? We'd love to hear from you.
      </p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {status === 'submitting' ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes and route is registered**

```bash
npm run build
```

Expected output includes:
```
○ /contact
```

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: add /contact page with Netlify Forms"
```

---

## Task 9: Final build verification + deploy

- [ ] **Step 1: Run final clean build**

```bash
npm run build
```

Expected: all routes listed with no TypeScript or build errors:
```
○ /
○ /insights
○ /podcasts
○ /contact
```

- [ ] **Step 2: Commit any remaining changes**

```bash
git status
```

If clean, nothing to commit. If not:
```bash
git add -A
git commit -m "chore: final cleanup before deploy"
```

- [ ] **Step 3: Deploy to Netlify**

```bash
npx -y @netlify/mcp@latest --site-id 7b971775-1cad-43b5-9172-701405749ba8 --proxy-path "<use deploy-site MCP tool to get fresh proxy URL>"
```

Use the `netlify-deploy-services-updater` MCP tool with `deploy-site` to get the deploy command, then run it.
