'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

function fieldValue(form: HTMLFormElement, name: string, maxLength: number) {
  const value = String(new FormData(form).get(name) || '').trim()
  return value.slice(0, maxLength)
}

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const honeypot = String(data.get('bot-field') || '')
    if (honeypot) {
      setStatus('success')
      return
    }

    const email = fieldValue(form, 'email', 254)
    const name = fieldValue(form, 'name', 120)
    const message = fieldValue(form, 'message', 2000)
    const enquiry = fieldValue(form, 'enquiry', 80)
    if (!isValidEmail(email) || name.length < 2 || message.length < 10 || !enquiry) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    const params = new URLSearchParams()
    data.forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value)
    })
    try {
      const res = await fetch('/', {
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
        <h1 autoFocus className="font-serif text-3xl font-bold text-gold mb-4">Thanks!</h1>
        <p className="text-muted">We&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-3">GET IN TOUCH</h1>
      <p className="text-muted mb-10">
        Have a story to share? Want to collaborate or advertise? We&apos;d love to hear from you.
      </p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden" aria-hidden="true">
          <input name="bot-field" tabIndex={-1} />
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="enquiry" className="text-sm font-medium">Type of enquiry</label>
          <select
            id="enquiry"
            name="enquiry"
            required
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy transition-colors"
          >
            <option value="">Select…</option>
            <option value="advertising">Advertising or sponsorship</option>
            <option value="content-partnership">Content partnership</option>
            <option value="podcast-guest">Podcast guest pitch</option>
            <option value="press">Press or media enquiry</option>
            <option value="story-tip">Story tip or news tip</option>
            <option value="general">General enquiry</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={2000}
            rows={5}
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {status === 'submitting' ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
