'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type DropdownItem = { label: string; href: string; description?: string }
type NavItem = { key: string; label: string; href: string; dropdown?: DropdownItem[] }

const NAV: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
  },
  {
    key: 'insights',
    label: 'Insights',
    href: '/insights',
    dropdown: [
      { label: 'Hospitality News',       href: '/news',       description: 'Latest hotel industry updates' },
      { label: 'Articles & Editorials',  href: '/insights',   description: 'In-depth editorial coverage' },
      { label: 'Events & Conferences',   href: '/events',     description: 'Industry summits and forums' },
      { label: 'Industry Insights',      href: '/blog',       description: 'Perspectives and analysis' },
      { label: 'Interviews',             href: '/interviews', description: 'Executive conversations' },
      { label: 'Hospitality Trends',     href: '/hospitality-trends', description: 'Market signals and trend analysis' },
    ],
  },
  {
    key: 'authority',
    label: 'Authority',
    href: '/hospitality-trends',
    dropdown: [
      { label: 'Leadership', href: '/hospitality-leadership', description: 'Hotel leaders, executives, and strategy' },
      { label: 'Operations', href: '/hotel-operations', description: 'Hotel operations and management systems' },
      { label: 'Recruitment', href: '/hospitality-recruitment', description: 'Careers, hiring, and talent retention' },
      { label: 'Guest Experience', href: '/guest-experience', description: 'Digital journeys and personalization' },
      { label: 'Luxury Hospitality', href: '/luxury-hospitality', description: 'Luxury hotels, wellness, and design' },
    ],
  },
  {
    key: 'technology',
    label: 'Technology',
    href: '/technology',
    dropdown: [
      { label: 'Hospitality AI',       href: '/technology/ai',          description: 'AI and machine learning in hotels' },
      { label: 'PMS & POS Systems',   href: '/technology/pms-pos',     description: 'Property management and point of sale' },
      { label: 'Key & Mobile Key',    href: '/technology/key-systems',  description: 'RFID locks, mobile key and access' },
      { label: 'IPTV & Signage',      href: '/technology/iptv-signage', description: 'In-room entertainment and displays' },
      { label: 'Cybersecurity',       href: '/technology/cybersecurity',description: 'Data protection and guest privacy' },
    ],
  },
  {
    key: 'sustainability',
    label: 'Sustainability',
    href: '/sustainability',
    dropdown: [
      { label: 'Sustainable Operations', href: '/sustainability/sustainable-operations', description: 'Eco-friendly hotel operations' },
      { label: 'Smart Operations',       href: '/sustainability/smart-operations',       description: 'Energy and resource optimisation' },
      { label: 'Green Technologies',     href: '/sustainability/green-technologies',     description: 'Sustainable tech solutions' },
      { label: 'ESG & Future Travel',    href: '/sustainability/esg-reporting',          description: 'ESG strategies and reporting' },
    ],
  },
  {
    key: 'podcasts',
    label: 'Podcasts',
    href: '/podcasts',
    dropdown: [
      { label: 'All Episodes',         href: '/podcasts',   description: 'Full episode library' },
      { label: 'Executive Interviews', href: '/podcasts',   description: 'C-suite conversations' },
      { label: 'Hospitality Leaders',  href: '/podcasts',   description: 'General managers and operators' },
      { label: 'Tech Conversations',   href: '/podcasts',   description: 'CIOs, CTOs, and founders' },
      { label: 'Media & Social',       href: '/media',      description: 'YouTube, TikTok, Spotify and more' },
    ],
  },
  {
    key: 'collaborate',
    label: 'Collaborate',
    href: '/collaborate',
    dropdown: [
      { label: 'Become a Guest',      href: '/collaborate#guest',       description: 'Apply to join the podcast' },
      { label: 'Submit an Article',   href: '/collaborate#article',     description: 'Contribute editorial content' },
      { label: 'Sponsorships',        href: '/advertise',               description: 'Reach hospitality leaders' },
      { label: 'Partnerships',        href: '/advertise',               description: 'Media and brand collaborations' },
    ],
  },
  { key: 'contact', label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const { locale, setLocale } = useLanguage()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(key)
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }

  return (
    <nav aria-label="Main" className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/Logo.png" alt="Hospitality121" width={44} height={44} className="rounded-full" />
          <div className="leading-tight hidden sm:block">
            <span className="block font-serif font-bold text-sm tracking-wide text-gray-900">HOSPITALITY</span>
            <span className="block font-serif font-bold text-xs tracking-widest text-gold">ONE 2 ONE</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV.map(item => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.key)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded transition-colors ${
                  activeDropdown === item.key ? 'text-gold' : 'text-gray-700 hover:text-gold'
                }`}
              >
                {item.label}
                {item.dropdown && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${activeDropdown === item.key ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </Link>

              {item.dropdown && activeDropdown === item.key && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50"
                  onMouseEnter={() => handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown.map(sub => (
                    <Link
                      key={sub.href + sub.label}
                      href={sub.href}
                      className="flex flex-col px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors">{sub.label}</span>
                      {sub.description && <span className="text-xs text-gray-400 mt-0.5">{sub.description}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Social icons */}
          <div className="hidden lg:flex items-center gap-1">
            <a href="https://linkedin.com/company/hospitality121" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/hospitality121" target="_blank" rel="noopener noreferrer" aria-label="X" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com/hospitality121" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://tiktok.com/@hospitality121" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-4 bg-gray-200" />

          {/* Search */}
          <Link href="/search" aria-label="Search" className="p-1.5 text-gray-400 hover:text-gold transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          {/* EN/FR */}
          <div className="hidden sm:flex items-center text-xs font-bold tracking-wider border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 transition-colors ${locale === 'en' ? 'bg-gold text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
              aria-label="Switch to English"
            >EN</button>
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 transition-colors ${locale === 'fr' ? 'bg-gold text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
              aria-label="Passer en français"
            >FR</button>
          </div>

          <Link
            href="/subscribe"
            className="hidden sm:inline-block bg-gold text-gray-900 text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Subscribe
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 text-gray-600 hover:text-gold transition-colors"
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
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {NAV.map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-800 hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                    className="p-2 text-gray-400 hover:text-gold transition-colors"
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${mobileExpanded === item.key ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}
              </div>
              {item.dropdown && mobileExpanded === item.key && (
                <div className="pl-4 pb-2 flex flex-col gap-0.5">
                  {item.dropdown.map(sub => (
                    <Link
                      key={sub.href + sub.label}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      className="py-2 text-sm text-gray-500 hover:text-gold transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-1">
            <div className="flex items-center text-xs font-bold tracking-wider border border-gray-200 rounded overflow-hidden">
              <button onClick={() => setLocale('en')} className={`px-2 py-1 ${locale === 'en' ? 'bg-gold text-gray-900' : 'text-gray-500'}`}>EN</button>
              <button onClick={() => setLocale('fr')} className={`px-2 py-1 ${locale === 'fr' ? 'bg-gold text-gray-900' : 'text-gray-500'}`}>FR</button>
            </div>
            <Link href="/subscribe" onClick={() => setOpen(false)} className="bg-gold text-gray-900 text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90">
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
