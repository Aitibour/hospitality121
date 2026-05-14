'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'h1h_newsletter_dismissed'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    // Submit to Netlify Forms
    const params = new URLSearchParams({ 'form-name': 'newsletter', email })
    await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() })
    setStatus('success')
    setTimeout(dismiss, 2500)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-surface rounded-xl p-8 shadow-2xl"
      >
        <button
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <p className="text-gold font-serif text-2xl font-bold mb-2">You&apos;re in.</p>
            <p className="text-muted text-sm">Welcome to the Hospitality121 community.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">Newsletter</p>
              <h2 id="newsletter-title" className="font-serif text-2xl font-bold mb-2">Stay in the know.</h2>
              <p className="text-muted text-sm leading-relaxed">
                The best hospitality insights, podcasts, and events — delivered to your inbox weekly.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="hidden" name="form-name" value="newsletter" />
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-navy border border-muted/30 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors placeholder:text-muted/50"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 text-sm tracking-wider"
              >
                {status === 'submitting' ? 'Subscribing…' : 'SUBSCRIBE FREE'}
              </button>
            </form>
            <p className="text-muted text-xs text-center mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </>
  )
}
