'use client'
import { useEffect } from 'react'

type Zone = 'hero-banner' | 'mid-grid' | 'footer-banner'

const ADSENSE_SLOTS: Record<Zone, string> = {
  'hero-banner': 'XXXXXXXXXXXXXXX',
  'mid-grid': 'XXXXXXXXXXXXXXX',
  'footer-banner': 'XXXXXXXXXXXXXXX',
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

type Props = {
  zone: Zone
  className?: string
}

export default function AdSlot({ zone, className = '' }: Props) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return
    try {
      window.adsbygoogle.push({})
    } catch {}
  }, [])

  if (!ADSENSE_CLIENT) return null

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
