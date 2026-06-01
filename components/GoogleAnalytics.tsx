'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const COOKIE_KEY = 'h1h_cookie_consent'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function loadGA() {
  if (!GA_ID || typeof window === 'undefined') return
  if (document.getElementById('ga-script')) return
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => { window.dataLayer.push(args) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
  const s = document.createElement('script')
  s.id = 'ga-script'
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  s.async = true
  document.head.appendChild(s)
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (localStorage.getItem(COOKIE_KEY) === 'accepted') loadGA()
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === 'accepted') loadGA()
    }
    window.addEventListener('cookie-consent', handler)
    return () => window.removeEventListener('cookie-consent', handler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return
    if (localStorage.getItem(COOKIE_KEY) !== 'accepted') return
    window.gtag('event', 'page_view', { page_path: pathname })
  }, [pathname])

  return null
}
