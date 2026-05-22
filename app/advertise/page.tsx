import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise & Partner',
  alternates: { canonical: 'https://hospitality121.com/advertise' },
  description: 'Reach senior hospitality professionals and hotel technology buyers through Hospitality121. Sponsorship, content partnerships, and advertising.',
  openGraph: {
    title: 'Advertise & Partner | Hospitality121',
    description: 'Reach senior hospitality professionals and hotel technology buyers through Hospitality121.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const TIERS = [
  {
    name: 'Newsletter Sponsor',
    price: 'From £500/issue',
    description: 'Your brand reaches our weekly subscriber base of hospitality professionals and technology buyers. Includes a dedicated sponsor callout, logo placement, and a 60-word brand message.',
    features: ['Logo + brand message in weekly newsletter', 'Dedicated sponsor section above the fold', 'Click-through tracking', 'One-issue or multi-issue packages available'],
  },
  {
    name: 'Content Partnership',
    price: 'From £1,500',
    description: 'Branded editorial content written by our team and published on Hospitality121. Long-form articles, sponsored insights, or executive interview spotlights — positioned alongside our editorial coverage.',
    features: ['Original branded article or interview', 'Published in relevant section (News, Insights, Blog)', 'Included in newsletter and sitemap', 'Permanent indexed URL on hospitality121.com'],
  },
  {
    name: 'Podcast Sponsorship',
    price: 'From £800/episode',
    description: 'Sponsor a Hospitality121 Podcast episode and reach engaged listeners who follow conversations with hotel CIOs, luxury executives, and hospitality innovators.',
    features: ['30-second sponsor mention at episode open', 'Brand included in episode show notes', 'Cross-promotion in newsletter that week', 'Episode page ad placement'],
  },
  {
    name: 'Event Partner',
    price: 'Custom',
    description: 'Partner with Hospitality121 on an event listing, roundtable, or industry gathering. We bring the audience; you bring the platform.',
    features: ['Event featured on Hospitality121 events page', 'Newsletter promotion to subscriber list', 'Co-branded social coverage', 'Bespoke packages available'],
  },
]

const AUDIENCE = [
  { label: 'Job titles', value: 'Hotel GMs, CIOs, Revenue Managers, F&B Directors, Owners' },
  { label: 'Focus', value: 'Hospitality technology, AI, guest experience, luxury operations' },
  { label: 'Geography', value: 'UK, Europe, Middle East, Asia Pacific, North America' },
  { label: 'Content', value: '54+ articles, podcasts, news pieces, and event listings' },
]

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Work With Us</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-5">
          Reach the People<br />Shaping Hospitality
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
          Hospitality121 connects brands with senior hospitality professionals, hotel technology buyers, and luxury executives actively seeking solutions, ideas, and partnerships.
        </p>
      </div>

      {/* Audience snapshot */}
      <div className="bg-surface rounded-xl p-6 mb-14">
        <h2 className="font-serif text-xl font-bold mb-5">Our Audience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUDIENCE.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs font-bold tracking-widest text-gold uppercase">{label}</span>
              <span className="text-sm text-muted leading-relaxed">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsorship tiers */}
      <h2 className="font-serif text-2xl font-bold mb-8">Partnership Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {TIERS.map(tier => (
          <div key={tier.name} className="bg-surface rounded-xl p-6 flex flex-col gap-4 border border-transparent hover:border-gold/30 transition-colors">
            <div>
              <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">{tier.price}</p>
              <h3 className="font-serif text-xl font-bold">{tier.name}</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">{tier.description}</p>
            <ul className="flex flex-col gap-2 mt-auto">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Tell us about your brand and goals and we will put together a custom package that fits your budget and audience.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity text-sm"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  )
}
