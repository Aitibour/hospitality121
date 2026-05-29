'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'h1h_newsletter_dismissed'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    const timer = setTimeout(() => setVisible(true), 12000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)
    if (String(data.get('website') || '')) {
      dismiss()
      return
    }
    const cleanEmail = email.trim().slice(0, 254)
    const cleanName = name.trim().slice(0, 80)
    if (!isValidEmail(cleanEmail)) return
    setStatus('submitting')
    try {
      const pubId = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID
      if (pubId) {
        const params = new URLSearchParams({ email: cleanEmail, publication_id: pubId, utm_source: 'website_popup' })
        if (cleanName) params.set('custom_fields[first_name]', cleanName)
        await fetch('https://embeds.beehiiv.com/v2/subscribe', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
      }
    } catch { /* silent fail, don't block success state */ }
    setStatus('success')
    setTimeout(dismiss, 3000)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Gold accent bar */}
        <div className="h-1 bg-gold w-full" />

        <div className="p-8">
          <button
            onClick={dismiss}
            aria-label="Close newsletter popup"
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8922E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-serif text-2xl font-bold text-gray-900 mb-2">Welcome aboard.</p>
              <p className="text-gray-500 text-sm">Your first issue of Hospitality121 is on its way.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-gold uppercase">Free Newsletter</span>
                <h2 id="newsletter-title" className="font-serif text-2xl font-bold text-gray-900 mt-2 mb-2">
                  The hospitality intelligence briefing.
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Join 4,000+ hotel leaders. Get the sharpest insights on technology, sustainability, and leadership every week.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="hidden" name="form-name" value="newsletter" />
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input
                  type="text"
                  name="name"
                  placeholder="First name"
                  maxLength={80}
                  autoComplete="given-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-gray-400 bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work email address"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-gray-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-gold text-gray-900 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm tracking-wider"
                >
                  {status === 'submitting' ? 'Subscribing...' : 'GET THE BRIEFING FREE'}
                </button>
              </form>

              <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
                By subscribing you agree to our{' '}
                <a href="/privacy" className="underline hover:text-gold transition-colors">Privacy Policy</a>
                . We use your data solely to send the newsletter. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
