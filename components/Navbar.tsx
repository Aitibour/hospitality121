'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

const NAV_LINKS = ['PODCASTS', 'INSIGHTS', 'CONTACT']

export default function Navbar() {
  const [open, setOpen] = useState(false)

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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
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
            className="hidden sm:inline-block bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Subscribe
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-white hover:text-gold transition-colors"
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
        <div className="md:hidden bg-navy border-t border-surface px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-white text-sm font-medium tracking-wider hover:text-gold transition-colors py-1"
            >
              {link}
            </Link>
          ))}
          <Link
            href="/subscribe"
            onClick={() => setOpen(false)}
            className="bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity text-center mt-1"
          >
            Subscribe
          </Link>
        </div>
      )}
    </nav>
  )
}
