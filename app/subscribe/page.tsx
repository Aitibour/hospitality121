'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function SubscribePage() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const params = new URLSearchParams()
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value)
    })
    try {
      const res = await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 autoFocus className="font-serif text-3xl font-bold text-gold mb-4">You&apos;re in.</h1>
        <p className="text-muted">Welcome to the Hospitality121 community. Your first issue arrives shortly.</p>
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
        <p className="text-sm font-semibold text-white/90 mb-4 tracking-wide">EVERY ISSUE INCLUDES</p>
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
            className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {status === 'submitting' ? 'Subscribing…' : 'SUBSCRIBE FREE'}
        </button>

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
