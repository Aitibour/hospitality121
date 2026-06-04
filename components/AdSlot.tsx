'use client'
import { useEffect, useSyncExternalStore } from 'react'

type Zone = 'hero-banner' | 'mid-grid' | 'footer-banner'

const ADSENSE_SLOTS: Record<Zone, string> = {
  'hero-banner': 'XXXXXXXXXXXXXXX',
  'mid-grid': 'XXXXXXXXXXXXXXX',
  'footer-banner': 'XXXXXXXXXXXXXXX',
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const COOKIE_KEY = 'h1h_cookie_consent'

function subscribeToConsent(callback: () => void) {
  window.addEventListener('cookie-consent', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('cookie-consent', callback)
    window.removeEventListener('storage', callback)
  }
}

function getConsentSnapshot() {
  return localStorage.getItem(COOKIE_KEY) === 'accepted'
}

type Props = {
  zone: Zone
  className?: string
}

export default function AdSlot({ zone, className = '' }: Props) {
  const consented = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => false)

  useEffect(() => {
    if (!ADSENSE_CLIENT || !consented) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [consented])

  if (!ADSENSE_CLIENT || !consented) return null

  return (
    <div className={`flex justify-center my-4 ${className}`}>
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
