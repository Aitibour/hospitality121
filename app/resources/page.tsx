'use client'
import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const REPORTS = [
  {
    id: 'state-of-hospitality-tech-2026',
    title: 'State of Hospitality Technology 2026',
    description: 'Our flagship annual report covering AI adoption, digital transformation benchmarks, guest experience technology investment, and the key priorities of senior hospitality leaders across 40 markets.',
    pages: '28 pages',
    topics: ['AI and machine learning adoption rates', 'Top technology investment priorities', 'Guest experience platform benchmarks', 'Revenue management technology trends', 'Cybersecurity and data governance'],
  },
  {
    id: 'luxury-guest-experience-guide',
    title: 'The Luxury Guest Experience Playbook',
    description: 'A practical guide to designing personalised, technology-enabled guest experiences at luxury properties. Covers pre-arrival, in-stay, and post-stay touchpoints with case study examples.',
    pages: '18 pages',
    topics: ['Pre-arrival personalisation frameworks', 'In-stay technology touchpoints', 'Loyalty programme design', 'Staff empowerment and service culture', 'Measuring guest experience ROI'],
  },
]

export default function ResourcesPage() {
  const [selected, setSelected] = useState(REPORTS[0].id)
  const [status, setStatus] = useState<Status>('idle')
  const [downloadedTitle, setDownloadedTitle] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const params = new URLSearchParams()
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value)
    })
    try {
      const res = await fetch('/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      if (res.ok) {
        const report = REPORTS.find(r => r.id === selected)
        setDownloadedTitle(report?.title ?? '')
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Download Ready</p>
        <h1 className="font-serif text-3xl font-bold mb-4">Check your inbox.</h1>
        <p className="text-muted leading-relaxed">
          We have sent <strong>{downloadedTitle}</strong> to your email address. It may take a minute to arrive.
        </p>
        <p className="text-muted text-sm mt-4">
          While you wait, explore the latest <a href="/insights" className="text-gold hover:underline">Insights</a> on Hospitality121.
        </p>
      </div>
    )
  }

  const report = REPORTS.find(r => r.id === selected) ?? REPORTS[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Free Resources</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
          Industry Reports & Guides
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
          Original research and practical guides for hospitality professionals. Free to download.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Report selector */}
        <div className="flex flex-col gap-4">
          {REPORTS.map(r => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`text-left bg-surface rounded-xl p-5 border transition-all ${
                selected === r.id ? 'border-gold ring-1 ring-gold/30' : 'border-transparent hover:border-muted/30'
              }`}
            >
              <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">{r.pages}</p>
              <h3 className="font-serif text-lg font-bold mb-2">{r.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{r.description}</p>
              {selected === r.id && (
                <ul className="mt-4 flex flex-col gap-2">
                  {r.topics.map(t => (
                    <li key={t} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          ))}
        </div>

        {/* Download form */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold mb-1">Get your free copy</h2>
          <p className="text-muted text-sm mb-6">Enter your details and we will send it straight to your inbox.</p>

          <form
            name="resource-download"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="form-name" value="resource-download" />
            <input type="hidden" name="report" value={selected} />
            <p className="hidden" aria-hidden="true"><input name="bot-field" tabIndex={-1} /></p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dl-name" className="text-sm font-medium">Full name</label>
              <input
                id="dl-name"
                name="name"
                type="text"
                required
                placeholder="Jane Smith"
                className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dl-email" className="text-sm font-medium">Work email</label>
              <input
                id="dl-email"
                name="email"
                type="email"
                required
                placeholder="jane@hotel.com"
                className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dl-company" className="text-sm font-medium">Company</label>
              <input
                id="dl-company"
                name="company"
                type="text"
                required
                placeholder="Marriott International"
                className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dl-role" className="text-sm font-medium">Job title</label>
              <input
                id="dl-role"
                name="role"
                type="text"
                required
                placeholder="Director of Technology"
                className="bg-navy border border-muted/30 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-surface transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-gold text-navy font-bold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
            >
              {status === 'submitting' ? 'Sending…' : 'Download Free Report'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center" role="alert">Something went wrong. Please try again.</p>
            )}

            <p className="text-xs text-muted text-center">
              By downloading you agree to receive the Hospitality121 newsletter. Unsubscribe any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
