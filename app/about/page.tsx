import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Hospitality121 is a premium hospitality technology media platform exploring how AI, digital transformation, and human connection are shaping the future of hospitality.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">About</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-6">
          The Future of Hospitality,<br />One Connection at a Time
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          Hospitality121 is a premium hospitality technology media platform exploring how AI, digital
          transformation, guest experience innovation, and human connection are shaping the next
          generation of hospitality.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">What We Cover</h2>
          <p className="text-muted leading-relaxed mb-4">
            We sit at the intersection of hospitality and technology — covering the trends, leaders,
            and innovations driving the industry forward. From AI-powered guest experiences to
            cybersecurity challenges facing hotel operators, we bring executive-level insights to a
            global audience of hospitality professionals.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              'AI & Machine Learning in Hospitality',
              'Hotel Technology & Digital Transformation',
              'Guest Experience Innovation',
              'Hospitality Cybersecurity',
              'Leadership & Strategy',
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
            hospitality, technology, and innovation. We speak with hotel CIOs, startup founders,
            luxury executives, and guest experience pioneers — people building the future of the
            industry from the inside.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">The Name</h2>
          <p className="text-muted leading-relaxed">
            &ldquo;121&rdquo; stands for one-to-one — the belief that the most powerful conversations, the
            most important connections, and the most meaningful guest experiences happen between
            individuals. Technology amplifies this; it never replaces it.
          </p>
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
            className="border border-muted/30 text-white font-medium px-6 py-3 rounded hover:border-gold hover:text-gold transition-colors text-center text-sm"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}
