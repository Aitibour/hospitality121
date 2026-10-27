'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export default function SubscribePage() {
  const [status, setStatus] = useState<Status>('idle')
  const newsletterAvailable = !!process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const honeypot = String(data.get('bot-field') || '')
    if (honeypot) {
      setStatus('success')
      return
    }
    const email = String(data.get('email') || '').trim().slice(0, 254)
    const firstName = String(data.get('firstName') || '').trim().slice(0, 80)
    const company = String(data.get('company') || '').trim().slice(0, 160)
    if (!isValidEmail(email) || firstName.length < 1) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      const pubId = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID
      if (!pubId) throw new Error('Newsletter provider is not configured')
      const params = new URLSearchParams({ email, publication_id: pubId, utm_source: 'subscribe_page' })
      if (firstName) params.set('custom_fields[first_name]', firstName)
      if (company) params.set('custom_fields[company]', company)
      await fetch('https://embeds.beehiiv.com/v2/subscribe', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-gold mb-4">Request sent</h1>
        <p className="text-muted">Check your inbox for confirmation from our newsletter provider. We cannot confirm your subscription from this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Newsletter</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
          Hospitality121 Weekly
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          The essential weekly briefing for hospitality technology leaders — AI, digital transformation,
          guest experience innovation, and executive insights delivered every week.
        </p>
      </div>

      <div className="bg-surface rounded-xl p-6 mb-10">
        <p className="text-sm font-semibold text-gray-800 mb-4 tracking-wide">EVERY ISSUE INCLUDES</p>
        <ul className="flex flex-col gap-3">
          {[
            'Weekly Hospitality Tech News',
            'AI in Hospitality Spotlight',
            'Featured Executive Insight',
            'Industry Quote of the Week',
            'Latest Podcast Highlight',
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-sm text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <form
        name="newsletter"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="form-name" value="newsletter" />
        <p className="hidden" aria-hidden="true">
          <input name="bot-field" tabIndex={-1} />
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              maxLength={80}
              autoComplete="given-name"
              className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-sm font-medium">
            Company <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={160}
            autoComplete="organization"
            className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting' || !newsletterAvailable}
          className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {status === 'submitting' ? 'Subscribing…' : 'SUBSCRIBE FREE'}
        </button>
        {!newsletterAvailable && <p role="status" className="text-sm text-muted">Online subscriptions are currently unavailable. Please <a href="/contact" className="text-gold underline">contact us</a> for newsletter information.</p>}

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center" role="alert">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-muted text-xs text-center">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  )
}
