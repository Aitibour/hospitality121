import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Collaborate',
  alternates: { canonical: 'https://hospitality121.com/collaborate' },
  description: 'Join the Hospitality121 community. Apply to be a podcast guest, submit an article, explore sponsorship opportunities, or partner with us.',
  openGraph: {
    title: 'Collaborate | Hospitality121',
    description: 'Become a podcast guest, submit editorial content, or partner with Hospitality121.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const EDITORIAL = [
  { tag: 'Podcast', title: 'Be a Guest', headline: 'On air with the industry', description: 'Join a conversation heard by hotel executives, technology buyers, and senior operators. We host founders, GMs, CIOs, and innovators who have something worth saying.', criteria: ['Senior role in hospitality or hotel technology', 'A distinct perspective or story', 'Available for a 35-55 min recorded session', 'Audio or video format'], email: 'contact@hospitality121.com', cta: 'Pitch yourself' },
  { tag: 'Editorial', title: 'Write for Us', headline: 'Your words, our audience', description: 'Publish original articles, opinion, and analysis with an audience that reads closely. We work with practitioners who have real insight.', criteria: ['Original, unpublished content only', '600-2,000 words', 'No advertorial in editorial submissions', 'Author bio and headshot required'], email: 'contact@hospitality121.com', cta: 'Submit a pitch' },
]

const COMMERCIAL = [
  { tag: 'Sponsorship', title: 'Sponsor Us', headline: 'In front of decision-makers', description: 'Reach hotel CIOs, revenue managers, GMs, and tech buyers through newsletter placements, branded content, and podcast sponsorships.', criteria: ['Newsletter slots from $750/issue', 'Branded content from $2,000', 'Podcast sponsorship from $1,000', 'Multi-channel packages available'], email: 'collab@hospitality121.com', cta: 'See packages' },
  { tag: 'Partnership', title: 'Partner With Us', headline: 'Build something together', description: 'Event coverage, research publications, award programmes, and cross-promotional campaigns. We work with associations, event organisers, and media brands.', criteria: ['Event media partnerships', 'Joint research and white papers', 'Award sponsorship and campaigns', 'Cross-promotional newsletter deals'], email: 'collab@hospitality121.com', cta: 'Start a conversation' },
]

const ICONS: Record<string, React.ReactElement> = {
  Podcast: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
  Editorial: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>),
  Sponsorship: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  Partnership: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
}

type Opt = { tag: string; title: string; headline: string; description: string; criteria: string[]; email: string; cta: string }

function Card({ opt }: { opt: Opt }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-8 flex flex-col hover:border-gold/50 hover:shadow-lg transition-all">
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6 shrink-0">{ICONS[opt.tag]}</div>
      <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">{opt.tag}</p>
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">{opt.title}</h2>
      <p className="text-sm font-semibold text-gold mb-4">{opt.headline}</p>
      <p className="text-sm text-muted leading-relaxed mb-6">{opt.description}</p>
      <ul className="space-y-2 mb-8 flex-1">
        {opt.criteria.map(c => (
          <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />{c}
          </li>
        ))}
      </ul>
      <a href={`mailto:${opt.email}?subject=${encodeURIComponent(opt.title + ' - Hospitality121')}`} className="inline-flex items-center gap-2 bg-gray-900 text-gray-50 text-sm font-bold px-6 py-3 rounded-xl hover:bg-gold transition-colors self-start">
        {opt.cta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  )
}

export default function CollaboratePage() {
  return (
    <div>
      <div className="bg-gray-950 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Collaborate</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-50 mt-4 mb-6 leading-tight">Work with<br />Hospitality121</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">Whether you have something to say, something to share, or something to sell, there is a place for you here.</p>
        </div>
      </div>
      <div className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-5">
            <div><p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Editorial</p><h2 className="font-serif text-3xl font-bold text-gray-900">Articles &amp; Podcasts</h2></div>
            <a href="mailto:contact@hospitality121.com" className="text-sm font-bold text-gold hover:underline hidden sm:block">contact@hospitality121.com</a>
          </div>
          <section id="contributor-guidelines" aria-labelledby="contributor-guidelines-heading" className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8 mb-8">
            <h2 id="contributor-guidelines-heading" className="font-serif text-2xl font-bold text-gray-900 mb-5">Contributor Guidelines</h2>
            <ul className="space-y-4 text-base text-gray-600 leading-relaxed">
              <li><strong className="text-gray-900">Free editorial publication.</strong> Guest editorial articles are free to submit and publish. We do not charge contributors a publication fee.</li>
              <li><strong className="text-gray-900">Editorial review.</strong> All submissions are subject to review and acceptance under our <Link href="/editorial-standards" className="text-gold underline underline-offset-4 hover:text-gray-900">Editorial Standards</Link>. Submission does not guarantee publication.</li>
              <li><strong className="text-gray-900">Review and publication timing.</strong> We aim to respond to editorial enquiries within two business days. Review and publication timing depends on the submission, any revisions, and the editorial schedule. We confirm publication timing after acceptance.</li>
              <li><strong className="text-gray-900">Share your published work.</strong> Contributors are encouraged to follow <a href="https://www.linkedin.com/company/hospitality121" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4 hover:text-gray-900">Hospitality One2One on LinkedIn</a> and share their published articles while tagging our page. Following or sharing is optional and does not affect editorial acceptance.</li>
            </ul>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{EDITORIAL.map(opt => <Card key={opt.tag} opt={opt} />)}</div>
        </div>
      </div>
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-5">
            <div><p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Commercial</p><h2 className="font-serif text-3xl font-bold text-gray-900">Sponsorship &amp; Collaboration</h2></div>
            <a href="mailto:collab@hospitality121.com" className="text-sm font-bold text-gold hover:underline hidden sm:block">collab@hospitality121.com</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{COMMERCIAL.map(opt => <Card key={opt.tag} opt={opt} />)}</div>
        </div>
      </div>
      <div className="bg-gold py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-3xl font-bold text-gray-50 mb-3">Not sure where to start?</p>
          <p className="text-gray-50/80 mb-8 text-lg">Tell us about yourself and we will find the right fit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:contact@hospitality121.com" className="inline-block bg-gray-50 text-gold font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors text-sm">contact@hospitality121.com</a>
            <a href="mailto:collab@hospitality121.com" className="inline-block border-2 border-gray-50 text-gray-50 font-bold px-8 py-3 rounded-xl hover:bg-gray-50/10 transition-colors text-sm">collab@hospitality121.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}
