import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllAuthors } from '@/lib/authors'

export const metadata: Metadata = {
  title: 'About Hospitality121 - Hospitality Technology Media',
  alternates: { canonical: 'https://hospitality121.com/about' },
  description: 'Hospitality121 is a premium media platform exploring how AI, digital transformation, and human connection are shaping the future of hospitality.',
  keywords: 'about hospitality121, hospitality media platform, hotel technology media, hospitality journalism, editorial team',
  openGraph: {
    title: 'About Hospitality121 | Hospitality Technology Media',
    description: 'Hospitality121 is a premium media platform exploring how AI, digital transformation, and human connection are shaping the future of hospitality.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
}

export default function AboutPage() {
  const team = getAllAuthors()
    .filter(author => ['sumaya-oneill', 'marcus-webb', 'claire-fontaine', 'elena-marchetti'].includes(author.slug))

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
          <h2 className="font-serif text-2xl font-bold mb-3">Editorial Team</h2>
          <p className="text-muted leading-relaxed mb-6">
            Hospitality121 is written and edited by contributors with direct experience across hotel
            technology, revenue strategy, luxury guest experience, sustainability, and hospitality
            operations.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {team.map(author => (
              <article key={author.slug} className="border border-gray-100 rounded-lg p-4 bg-white">
                <div className="flex gap-4">
                  <Image
                    src={author.photo}
                    alt={author.name}
                    width={72}
                    height={72}
                    className="h-18 w-18 rounded object-cover bg-surface"
                  />
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-tight">{author.name}</h3>
                    <p className="text-xs font-bold tracking-wide uppercase text-gold mt-1">{author.title}</p>
                  </div>
                </div>
                <p className="text-muted text-sm leading-relaxed mt-4">{author.bio}</p>
                <Link
                  href={`/author/${author.slug}`}
                  className="inline-block text-sm font-medium text-gray-800 hover:text-gold transition-colors mt-4"
                >
                  View articles
                </Link>
              </article>
            ))}
          </div>
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
