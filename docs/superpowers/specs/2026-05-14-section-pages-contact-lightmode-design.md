# Design: Section Listing Pages, Contact Page & Light Mode

**Date:** 2026-05-14
**Project:** Hospitality121

## Overview

Three additions to the v1 homepage-only site:
1. Listing pages for `/insights` (all articles) and `/podcasts` (all podcasts)
2. A `/contact` page with a Netlify-powered contact form
3. Light mode with a Navbar toggle, implemented via `next-themes`

---

## 1. Routes & Architecture

| Route | File | Type |
|---|---|---|
| `/insights` | `app/insights/page.tsx` | Server component, ISR 1h |
| `/podcasts` | `app/podcasts/page.tsx` | Server component, ISR 1h |
| `/contact` | `app/contact/page.tsx` | Client component (form state) |

- Both listing pages call `getAllContent()` and filter by `type`.
- Navbar links to `/podcasts` and `/insights` already exist — no route changes needed.
- A new `ThemeToggle` client component is added to the Navbar.
- `/articles` route is **not** created. Insights = all articles.

---

## 2. Listing Pages (`/insights` & `/podcasts`)

### Structure

1. **Page header** — full-width banner with section title in Playfair Display serif, one-line description, item count.
2. **Content grid** — same card pattern as homepage `ContentGrid`. Responsive: 1 col → 2 col → 3 col. All items shown (no pagination).
3. **Ad slot** — one `AdSlot` below the grid.

### Data

```ts
// app/insights/page.tsx
const items = getAllContent().filter(item => item.type === 'article')

// app/podcasts/page.tsx
const items = getAllContent().filter(item => item.type === 'podcast')
```

### Cards

Reuse the same card markup already in `ContentGrid`:
- Cover image (Next.js `<Image>`)
- `CategoryLabel`
- Title (Playfair serif)
- `AuthorLine` (author/guest + formatted date)

---

## 3. Contact Page (`/contact`)

### Structure

Single centered column (`max-w-lg mx-auto`), page header + form.

**Page header:**
- "GET IN TOUCH" — Playfair Display
- Tagline: "Have a story to share? Want to collaborate or advertise? We'd love to hear from you."

**Form fields (all required):**
- Name (text input)
- Email (email input)
- Message (textarea, min 4 rows)

**Netlify Forms integration:**
- `<form data-netlify="true" name="contact" method="POST">`
- Hidden `<input type="hidden" name="form-name" value="contact" />`
- Honeypot: `<input name="bot-field" className="hidden" />`

**Submission:**
- Client component — `fetch` POST to same URL with `application/x-www-form-urlencoded`
- On success: replace form with thank-you message ("Thanks! We'll be in touch soon.")
- No hard page redirect

**Submit button:** Gold, full-width on mobile, matches Subscribe style.

---

## 4. Light Mode

### Package

`next-themes` — SSR-safe theme switching for Next.js App Router.

### ThemeProvider

Wrap children in root layout with:
```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```

### Color Tokens (`globals.css`)

```css
/* Dark mode (default) */
@theme {
  --color-navy: #0A0E1A;
  --color-surface: #111827;
  --color-gold: #C9A84C;
  --color-muted: #9CA3AF;
}

/* Light mode override */
.light {
  --color-navy: #FFFFFF;
  --color-surface: #F3F4F6;
  --color-gold: #B8922E;
  --color-muted: #6B7280;
}

/* Body text */
body { background-color: var(--color-navy); color: #0A0E1A; }
.dark body { color: #FFFFFF; }
.light body { color: #0A0E1A; }
```

### ThemeToggle Component

New `components/ThemeToggle.tsx` — `'use client'` component using `useTheme()`:
- Sun icon when in dark mode (click to switch to light)
- Moon icon when in light mode (click to switch to dark)
- Placed in Navbar to the right of the nav links, left of the Subscribe button
- Icon-only button with `aria-label="Toggle theme"`

### Navbar change

Split Navbar: the link list stays a server component. The ThemeToggle is imported as a client island — this is the existing pattern (similar to how AdSlot is client-only).

---

## Out of Scope

- Individual article/podcast detail pages (no MDX body content exists yet)
- Pagination on listing pages
- Search or filtering by category
- `/events` or `/about` pages
