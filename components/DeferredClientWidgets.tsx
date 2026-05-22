'use client'

import dynamic from 'next/dynamic'

const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false })
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false })
const NewsletterPopup = dynamic(() => import('./NewsletterPopup'), { ssr: false })

export default function DeferredClientWidgets() {
  return (
    <>
      <GoogleAnalytics />
      <NewsletterPopup />
      <CookieBanner />
    </>
  )
}
