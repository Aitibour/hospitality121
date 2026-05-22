'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const COOKIE_KEY = 'h1h_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(COOKIE_KEY)) return
    setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: 'accepted' }))
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, 'declined')
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: 'declined' }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">We use cookies</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            We use cookies to improve your experience and analyse site traffic. By clicking Accept, you agree to our use of cookies.{' '}
            <Link href="/privacy" className="underline hover:text-gold transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs font-bold bg-gold text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
