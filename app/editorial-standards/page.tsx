import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial Standards',
  description: 'Hospitality121 editorial standards: how we research, verify, and publish content on hospitality technology, AI, and industry trends.',
  alternates: { canonical: 'https://hospitality121.com/editorial-standards' },
  openGraph: {
    title: 'Editorial Standards | Hospitality121',
    description: 'Hospitality121 editorial standards: how we research, verify, and publish content on hospitality technology, AI, and industry trends.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const SECTIONS = [
  {
    id: 'mission',
    heading: 'Our Editorial Mission',
    body: `Hospitality121 exists to serve hospitality professionals — hotel executives, technology leaders, revenue managers, and operators — with accurate, independent, and substantive coverage of the forces shaping the global industry. We prioritise relevance, depth, and editorial integrity over content volume.

Our coverage spans AI and digital transformation, hotel technology, guest experience innovation, revenue management, sustainability, hospitality investment, and leadership. We do not accept payment to influence editorial coverage. Sponsored content is clearly labelled and editorially separate from independent journalism.`,
  },
  {
    id: 'sourcing',
    heading: 'Sourcing and Research Standards',
    body: `All claims in Hospitality121 content are supported by one or more of the following:

- **Primary sources**: Direct interviews with named executives, operators, or subject-matter experts
- **Industry research**: Reports from recognised research firms (Phocuswright, STR, CBRE, JLL, HVS, Skift Research) cited with publication date and source
- **Company data**: Official press releases, earnings reports, or investor materials, attributed to source
- **Regulatory and government sources**: Official filings, government statistics, and regulatory announcements
- **Trade press**: Reported facts cross-referenced from multiple credible industry publications

We do not publish unverified claims, anonymous accusations, or speculation presented as fact. Where data is estimated or projected, this is stated clearly in the text.`,
  },
  {
    id: 'authors',
    heading: 'Author Standards and Credentials',
    body: `Contributors to Hospitality121 meet one or more of the following criteria:

- Demonstrable professional experience in hospitality operations, technology, investment, or adjacent fields
- A track record of published work in hospitality or related trade media
- Direct primary-source access relevant to their coverage area

All authors are identified by full name, title, and biography. Author pages provide a full publication record and, where available, professional profile links. The Hospitality121 editorial team reviews all content for factual accuracy, clarity, and adherence to this policy before publication.

Guest contributors must disclose any material conflicts of interest — including employer relationships, investment positions, or commercial arrangements — relevant to the subject of their contribution. Undisclosed conflicts of interest are grounds for removal of content.`,
  },
  {
    id: 'accuracy',
    heading: 'Accuracy and Fact-Checking',
    body: `Before publication, editorial staff verify:

1. **Statistics and data**: All quantitative claims are traced to primary or authoritative secondary sources. Data points are checked against the original report or dataset, not intermediary coverage.
2. **Named quotes**: Quotes attributed to named individuals are confirmed as direct statements — either from interviews conducted by Hospitality121 or from publicly available primary-source material (earnings calls, press releases, official statements).
3. **Company and product claims**: Descriptions of technology products, services, or company positions are cross-referenced against official company communications.
4. **Dates and events**: All dates, event names, and locations are verified against official sources.

We aim to complete fact-checking before publication. Where time-sensitive news requires faster turnaround, we publish what is confirmed and update articles as additional verification is completed, noting any updates.`,
  },
  {
    id: 'corrections',
    heading: 'Corrections Policy',
    body: `Hospitality121 is committed to correcting errors promptly and transparently.

**Minor corrections** (typographical errors, formatting issues, broken links): corrected silently.

**Factual corrections** (incorrect data, misattributed quotes, wrong dates or names): corrected with a timestamped correction notice appended to the article, clearly identifying what was changed and why.

**Significant errors** (substantive misrepresentation of facts or positions): the article is corrected and a prominent correction notice is added. In cases of serious inaccuracy, we may unpublish the piece pending review.

To request a correction, contact **editorial@hospitality121.com** with the article URL, the specific error, and supporting evidence. We aim to respond within two business days.`,
  },
  {
    id: 'independence',
    heading: 'Editorial Independence and Commercial Separation',
    body: `Hospitality121 operates under a strict separation between editorial and commercial activities:

- **Advertising and sponsorship** do not influence editorial coverage. Advertisers receive no editorial consideration, advance review of stories, or ability to suppress coverage.
- **Sponsored content** is clearly labelled "Sponsored" or "Partner Content" and is visually distinguished from editorial material. Sponsored content is produced or reviewed by the editorial team to ensure factual accuracy but does not represent Hospitality121's editorial views.
- **Affiliate relationships**: Where content links to products or services through affiliate arrangements, this is disclosed. Affiliate arrangements do not influence which products are covered or how they are assessed.
- **Event partnerships**: Hospitality121 may partner with industry events for coverage purposes. Event partners do not receive editorial control over coverage of their events.

Editorial staff are not permitted to hold financial interests in companies they cover without full disclosure to the Editor and recusal from relevant coverage.`,
  },
  {
    id: 'ai',
    heading: 'AI-Assisted Content',
    body: `Hospitality121 may use AI writing tools to assist with drafting, research organisation, or editing. Where AI assistance is used:

- All AI-assisted content is reviewed, edited, and approved by a named human author or editor before publication
- Factual claims in AI-assisted drafts are verified against primary sources before publication
- The final published article reflects the editorial judgement and responsibility of the named author

AI tools are not used as primary sources. We do not publish AI-generated content without substantive human review and editorial ownership.`,
  },
  {
    id: 'contact',
    heading: 'Editorial Contact',
    body: `For editorial enquiries, pitches, corrections, or complaints:

**Email**: editorial@hospitality121.com

For advertising and commercial enquiries: contact@hospitality121.com

We aim to respond to all editorial enquiries within two business days.`,
  },
]

export default function EditorialStandardsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Trust & Transparency</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-6">
          Editorial Standards
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          Hospitality121 is committed to accurate, independent, and transparent journalism. This page
          explains how we research, verify, publish, and correct content across the platform.
        </p>
        <p className="text-xs text-muted mt-4">Last reviewed: May 2026</p>
      </div>

      {/* TOC */}
      <nav className="bg-surface rounded-xl p-6 mb-12">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">On This Page</p>
        <ol className="flex flex-col gap-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-sm text-gray-700 hover:text-gold transition-colors">
                {i + 1}. {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="flex flex-col gap-12">
        {SECTIONS.map(section => (
          <section key={section.id} id={section.id}>
            <h2 className="font-serif text-2xl font-bold mb-4 scroll-mt-8">{section.heading}</h2>
            <div className="text-muted leading-relaxed text-sm whitespace-pre-line prose prose-sm max-w-none prose-strong:text-gray-900 prose-a:text-gold prose-ul:text-muted prose-ol:text-muted prose-li:leading-relaxed">
              {section.body.split('\n').map((line, i) => {
                if (line.startsWith('- **')) {
                  const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/)
                  if (match) return (
                    <p key={i} className="flex gap-2 mb-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span><strong className="text-gray-900">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span>
                    </p>
                  )
                }
                if (/^\d+\.\s+\*\*/.test(line)) {
                  const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)$/)
                  if (match) return (
                    <p key={i} className="flex gap-2 mb-2">
                      <span className="shrink-0 font-bold text-gold text-xs mt-0.5">{match[1]}.</span>
                      <span><strong className="text-gray-900">{match[2]}</strong>{match[3] ? `: ${match[3]}` : ''}</span>
                    </p>
                  )
                }
                if (line.startsWith('**')) {
                  const match = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/)
                  if (match) return (
                    <p key={i} className="mb-2">
                      <strong className="text-gray-900">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
                    </p>
                  )
                }
                if (line.trim() === '') return <div key={i} className="h-3" />
                return <p key={i} className="mb-2">{line}</p>
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 border-t border-gray-100 pt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/about"
          className="text-sm font-medium text-gray-700 hover:text-gold transition-colors"
        >
          About Hospitality121 →
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-gray-700 hover:text-gold transition-colors"
        >
          Contact the Editorial Team →
        </Link>
      </div>
    </div>
  )
}
