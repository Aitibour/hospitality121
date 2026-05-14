'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
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
        <h1 className="font-serif text-3xl font-bold text-gold mb-4">Thanks!</h1>
        <p className="text-muted">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-3">GET IN TOUCH</h1>
      <p className="text-muted mb-10">
        Have a story to share? Want to collaborate or advertise? We'd love to hear from you.
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
        <p className="hidden">
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="bg-surface border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
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
