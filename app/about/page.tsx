import type { Metadata } from 'next'
import Link from 'next/link'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'About',
  description: 'Hospitality121 is a hospitality media platform based in Vancouver, Canada, covering leadership, news, events, podcasts, technology, guest experience, operations, recruitment, sustainability, and luxury hospitality.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">About</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-6">
          The Future of Hospitality,<br />One Connection at a Time
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          Hospitality121 is a hospitality media platform based in Vancouver, Canada, exploring the
          people, ideas, technology, operations, events, and market shifts shaping the next
          generation of hospitality for operators, executives, investors, and emerging leaders.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Who We Are</h2>
          <p className="text-muted leading-relaxed mb-4">
            Based in Vancouver, Hospitality121 is an independent media company
            serving the US and global hospitality industry. Our editorial lens spans the United
            States, Canada, Europe, the Middle East, Africa, and Asia Pacific.
          </p>
          <p className="text-muted leading-relaxed">
            We operate as a bilingual-capable platform, publishing primary coverage in English
            with a readership of hotel executives, technology leaders, revenue managers, operators,
            recruiters, event organizers, and hospitality professionals.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">What We Cover</h2>
          <p className="text-muted leading-relaxed mb-4">
            We cover hospitality as a complete industry, not only as a technology beat. Our work
            moves across news, articles, podcasts, events, leadership, operations, recruitment,
            sustainability, luxury, guest experience, and the technology changing how hotels work.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              'Hospitality News & Market Signals',
              'Articles & Editorial Analysis',
              'Events, Conferences & Community',
              'Podcasts & Executive Interviews',
              'Leadership, Recruitment & Operations',
              'Hotel Technology & AI',
              'Guest Experience Innovation',
              'Luxury Hospitality',
              'Sustainability & ESG',
            ].map(topic => (
              <li key={topic} className="flex items-center gap-3 text-sm text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">The Podcast</h2>
          <p className="text-muted leading-relaxed">
            The Hospitality121 Podcast brings together conversations at the intersection of
            hospitality, leadership, operations, technology, recruitment, and innovation. We speak
            with hotel executives, founders, operators, event leaders, and guest experience pioneers.
            Check each episode page for audio availability and supporting notes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">The Name</h2>
          <p className="text-muted leading-relaxed">
            &ldquo;121&rdquo; stands for one-to-one: the belief that the most powerful conversations, the
            most important connections, and the most meaningful guest experiences happen between
            individuals. Technology amplifies this; it never replaces it.
          </p>
        </section>

        <section className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold mb-4">Company Information</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Headquarters</dt>
              <dd className="text-muted">Vancouver, British Columbia, Canada</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Markets Served</dt>
              <dd className="text-muted">Global hospitality</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Primary language</dt>
              <dd className="text-muted">English</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Coverage</dt>
              <dd className="text-muted">Hospitality technology and operations</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Publication Type</dt>
              <dd className="text-muted">Independent B2B Media</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Editorial Email</dt>
              <dd className="text-muted">
                <a href="mailto:editorial@hospitality121.com" className="hover:text-gold transition-colors">
                  editorial@hospitality121.com
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/subscribe"
            className="bg-gold text-navy font-bold px-6 py-3 rounded hover:opacity-90 transition-opacity text-center text-sm"
          >
            Subscribe to the Newsletter
          </Link>
          <Link
            href="/contact"
            className="border border-muted/30 text-gray-800 font-medium px-6 py-3 rounded hover:border-gold hover:text-gold transition-colors text-center text-sm"
          >
            Get in Touch
          </Link>
          <Link
            href="/editorial-standards"
            className="border border-muted/30 text-gray-800 font-medium px-6 py-3 rounded hover:border-gold hover:text-gold transition-colors text-center text-sm"
          >
            Editorial Standards
          </Link>
        </div>
      </div>
    </div>
  )
}
