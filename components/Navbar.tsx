'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { useLanguage } from '@/context/LanguageContext'

type NavKey = 'home' | 'news' | 'podcasts' | 'insights' | 'events' | 'blog' | 'contact'
const NAV_KEYS: NavKey[] = ['home', 'news', 'podcasts', 'insights', 'events', 'blog', 'contact']
const NAV_HREF: Record<NavKey, string> = {
  home: '/', news: '/news', podcasts: '/podcasts', insights: '/insights',
  events: '/events', blog: '/blog', contact: '/contact',
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()

  return (
    <nav aria-label="Main" className="bg-navy border-b border-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/Logo.png" alt="Hospitality121" width={40} height={40} />
          <div className="leading-tight">
            <span className="block text-white font-serif font-bold text-sm tracking-wide">HOSPITALITY</span>
            <span className="block text-gold font-serif font-bold text-sm tracking-widest">ONE 2 ONE</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_KEYS.map(key => (
            <Link
              key={key}
              href={NAV_HREF[key]}
              className="text-white text-xs font-medium tracking-wider hover:text-gold transition-colors"
            >
              {t.nav[key]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* EN / FR toggle */}
          <div className="flex items-center text-xs font-bold tracking-wider border border-muted/30 rounded overflow-hidden">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 transition-colors ${locale === 'en' ? 'bg-gold text-navy' : 'text-muted hover:text-white'}`}
              aria-label="Switch to English"
            >EN</button>
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 transition-colors ${locale === 'fr' ? 'bg-gold text-navy' : 'text-muted hover:text-white'}`}
              aria-label="Passer en français"
            >FR</button>
          </div>

          <ThemeToggle />

          <Link
            href="/subscribe"
            className="hidden sm:inline-block bg-gold text-navy text-xs font-bold px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            {t.nav.subscribe}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1 text-white hover:text-gold transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy border-t border-surface px-4 py-4 flex flex-col gap-4">
          {NAV_KEYS.map(key => (
            <Link
              key={key}
              href={NAV_HREF[key]}
              onClick={() => setOpen(false)}
              className="text-white text-sm font-medium tracking-wider hover:text-gold transition-colors py-1"
            >
              {t.nav[key]}
            </Link>
          ))}
          <Link
            href="/subscribe"
            onClick={() => setOpen(false)}
            className="bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity text-center mt-1"
          >
            {t.nav.subscribe}
          </Link>
        </div>
      )}
    </nav>
  )
}
