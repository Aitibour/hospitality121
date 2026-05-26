'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false })
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
const NewsletterPopup = dynamic(() => import('./NewsletterPopup'), { ssr: false })

export default function DeferredClientWidgets() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const schedule = window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(callback, 1800))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const id = schedule(() => setReady(true), { timeout: 3500 })
    return () => cancel(id)
  }, [])

  if (!ready) return null

  return (
    <>
      <GoogleAnalytics />
      <NewsletterPopup />
      <CookieBanner />
    </>
  )
}
