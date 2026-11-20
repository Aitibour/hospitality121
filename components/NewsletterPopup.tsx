'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

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
        className="fixed inset-0 bg-black/65 z-50 backdrop-blur-md"
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
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-5xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-gold/25 bg-[#101c2d] text-[#f7f2e8] shadow-2xl md:grid md:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="relative hidden min-h-[640px] md:block">
          <Image src="/images/content/hotel-design-digital-journey-photo.webp" alt="Warm lighting and a gold-accented hotel reception desk" fill sizes="(min-width: 768px) 48vw, 0px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08111f] via-[#08111f]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-9">
            <p className="text-xs uppercase tracking-[0.22em] text-[#dfbf7d] mb-3">Real leaders. Real conversations.</p>
            <p className="font-serif text-4xl leading-tight text-white">A closer look at<br />hospitality.</p>
            <p className="mt-5 text-xs text-white/70">Photo: Mikhail Nilov / Pexels</p>
          </div>
        </div>
        <div className="relative px-7 py-12 sm:px-12 md:py-14">
          <button
            ref={closeButtonRef}
            onClick={dismiss}
            aria-label="Close newsletter popup"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/20 text-[#f7f2e8] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="mb-8 text-center" aria-label="Hospitality One2One">
            <p className="font-serif text-3xl tracking-wide text-[#dfbf7d]">Hospitality <span className="text-[#f7f2e8]">One2One</span></p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#c9c6bf]">The hospitality briefing</p>
          </div>
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8922E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 id="newsletter-title" className="font-serif text-3xl text-[#f7f2e8] mb-3">Request sent</h2>
              <p id="newsletter-description" role="status" className="text-[#c9c6bf] text-base">Check your inbox for confirmation. We cannot confirm your subscription from this page.</p>
            </div>
          ) : (
            <>
              <div className="mb-7 text-center">
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-[#dfbf7d]">
                  <span className="h-px flex-1 bg-gold/40" />Stay in the know<span className="h-px flex-1 bg-gold/40" />
                </div>
                <h2 id="newsletter-title" className="font-serif text-5xl sm:text-6xl leading-[0.95] tracking-tight mt-5 mb-5 text-[#f7f2e8]">
                  Hospitality.<br /><span className="text-[#dfbf7d]">One step ahead.</span>
                </h2>
                <p id="newsletter-description" className="text-[#c9c6bf] text-base leading-relaxed">
                  Hotel technology, leadership, and ideas shaping the guest experience. Get the Hospitality121 briefing in your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="hidden" name="form-name" value="newsletter" />
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input
                  type="text"
                  name="name"
                  aria-label="First name"
                  placeholder="First name (optional)"
                  maxLength={80}
                  autoComplete="given-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="border border-[#e5d7bc] rounded-lg px-4 py-3.5 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#dfbf7d] placeholder:text-gray-500 bg-[#f7f2e8]"
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
                  className="border border-[#e5d7bc] rounded-lg px-4 py-3.5 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#dfbf7d] placeholder:text-gray-500 bg-[#f7f2e8]"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-gradient-to-r from-[#b99554] via-[#e2c589] to-[#b99554] text-[#101c2d] font-bold py-4 rounded-lg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold transition disabled:opacity-50 text-sm tracking-wider"
                >
                  {status === 'submitting' ? 'Subscribing...' : 'JOIN THE BRIEFING'}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-red-200" role="alert">
                    We could not complete your subscription. Please try again.
                  </p>
                )}
              </form>

              <p className="text-[#b9b9b5] text-xs text-center mt-5 leading-relaxed">
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
