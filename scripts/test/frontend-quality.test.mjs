import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('hero carousel respects interaction and reduced motion', () => {
  const source = fs.readFileSync('components/HeroCarousel.tsx', 'utf8')

  assert.match(source, /prefers-reduced-motion: reduce/)
  assert.match(source, /items\.length <= 1 \|\| paused/)
  assert.match(source, /setInterval\(next, 6000\)/)
  assert.match(source, /onMouseEnter=\{\(\) => setPaused\(true\)\}/)
  assert.match(source, /event\.key === 'ArrowLeft'/)
  assert.match(source, /event\.key === 'ArrowRight'/)
  assert.match(source, /aria-live=\{paused \? 'polite' : 'off'\}/)
})

test('shared images follow the Next 16 loading API', () => {
  const files = [
    'components/HeroCarousel.tsx',
    'components/EditorsPick.tsx',
    'app/content/[slug]/page.tsx',
  ]
  const combined = files.map(file => fs.readFileSync(file, 'utf8')).join('\n')

  assert.doesNotMatch(combined, /\bpriority(?:=\{[^}]+\})?\b/)
  assert.match(fs.readFileSync('components/HeroCarousel.tsx', 'utf8'), /fetchPriority="high"/)
  assert.match(fs.readFileSync('app/content/[slug]/page.tsx', 'utf8'), /\bpreload\b/)
})

test('newsletter modal supports keyboard dismissal and focus restoration', () => {
  const source = fs.readFileSync('components/NewsletterPopup.tsx', 'utf8')

  assert.match(source, /event\.key === 'Escape'/)
  assert.match(source, /closeButtonRef\.current\?\.focus\(\)/)
  assert.match(source, /previousFocus\?\.focus\(\)/)
  assert.match(source, /aria-modal="true"/)
  assert.match(source, /aria-describedby="newsletter-description"/)
  assert.match(source, /document\.body\.style\.overflow = 'hidden'/)
})

test('global navigation supports keyboard users', () => {
  const navbar = fs.readFileSync('components/Navbar.tsx', 'utf8')
  const layout = fs.readFileSync('app/layout.tsx', 'utf8')

  assert.match(navbar, /event\.key !== 'Escape'/)
  assert.match(navbar, /onFocus=\{\(\) => item\.dropdown && handleMouseEnter\(item\.key\)\}/)
  assert.match(navbar, /aria-expanded=\{item\.dropdown \? activeDropdown === item\.key : undefined\}/)
  assert.match(navbar, /aria-controls="mobile-navigation"/)
  assert.match(navbar, /aria-pressed=\{locale === 'en'\}/)
  assert.match(layout, /href="#main-content"/)
  assert.match(layout, /<main id="main-content" tabIndex=\{-1\}>/)
})

test('newsletter forms report provider failures honestly', () => {
  const subscribe = fs.readFileSync('app/subscribe/page.tsx', 'utf8')
  const popup = fs.readFileSync('components/NewsletterPopup.tsx', 'utf8')
  const resources = fs.readFileSync('app/resources/page.tsx', 'utf8')

  assert.match(subscribe, /if \(!pubId\) throw new Error/)
  assert.match(subscribe, /catch \{\s+setStatus\('error'\)/)
  assert.match(popup, /if \(!pubId\) throw new Error/)
  assert.match(popup, /role="alert"/)
  assert.match(resources, /aria-pressed=\{selected === r\.id\}/)
})

test('third-party scripts wait for cookie consent', () => {
  const layout = fs.readFileSync('app/layout.tsx', 'utf8')
  const analytics = fs.readFileSync('components/GoogleAnalytics.tsx', 'utf8')
  const adSlot = fs.readFileSync('components/AdSlot.tsx', 'utf8')

  assert.doesNotMatch(layout, /googletagmanager\.com/)
  assert.doesNotMatch(layout, /pagead2\.googlesyndication\.com/)
  assert.match(analytics, /function loadAdsense\(\)/)
  assert.match(analytics, /detail !== 'accepted'/)
  assert.match(analytics, /sendPageView\(\)/)
  assert.match(adSlot, /useSyncExternalStore\(subscribeToConsent, getConsentSnapshot, \(\) => false\)/)
  assert.match(adSlot, /if \(!ADSENSE_CLIENT \|\| !consented\) return null/)
})

test('newsletter modal traps keyboard focus', () => {
  const source = fs.readFileSync('components/NewsletterPopup.tsx', 'utf8')

  assert.match(source, /const dialogRef = useRef<HTMLDivElement>\(null\)/)
  assert.match(source, /if \(event\.key !== 'Tab'\) return/)
  assert.match(source, /event\.shiftKey && document\.activeElement === first/)
  assert.match(source, /ref=\{dialogRef\}/)
})
