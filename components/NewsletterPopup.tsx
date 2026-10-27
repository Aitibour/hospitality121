'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'h1h_newsletter_dismissed'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID) return
    if (localStorage.getItem(STORAGE_KEY)) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    const timer = setTimeout(() => setVisible(true), 12000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [dismiss, visible])

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
      if (!pubId) throw new Error('Newsletter provider is not configured')
      const params = new URLSearchParams({ email: cleanEmail, publication_id: pubId, utm_source: 'website_popup' })
      if (cleanName) params.set('custom_fields[first_name]', cleanName)
      await fetch('https://embeds.beehiiv.com/v2/subscribe', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
    } catch {
      setStatus('error')
      return
    }
    setStatus('success')
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
        aria-describedby="newsletter-description"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Gold accent bar */}
        <div className="h-1 bg-gold w-full" />

        <div className="p-8">
          <button
            ref={closeButtonRef}
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
              <p className="font-serif text-2xl font-bold text-gray-900 mb-2">Request sent</p>
              <p className="text-gray-500 text-sm">Check your inbox for confirmation. We cannot confirm your subscription from this page.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-gold uppercase">Free Newsletter</span>
                <h2 id="newsletter-title" className="font-serif text-2xl font-bold text-gray-900 mt-2 mb-2">
                  The hospitality intelligence briefing.
                </h2>
                <p id="newsletter-description" className="text-gray-500 text-sm leading-relaxed">
                  Get practical insights on hotel technology, sustainability, and leadership.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="hidden" name="form-name" value="newsletter" />
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input
                  type="text"
                  name="name"
                  aria-label="First name"
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
                  aria-label="Work email address"
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
                {status === 'error' && (
                  <p className="text-sm text-red-600" role="alert">
                    We could not complete your subscription. Please try again.
                  </p>
                )}
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
