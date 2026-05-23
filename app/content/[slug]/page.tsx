import Image from 'next/image'
import PodcastPlayer from '@/components/PodcastPlayer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getContentBySlug, getAllSlugs, getAllContent } from '@/lib/content'
import { getCategorySlugForTerm } from '@/lib/categories'
import { nameToSlug, AUTHORS_BY_NAME } from '@/lib/authors'
import type { ContentItem } from '@/types/content'
import BilingualContent from '@/components/BilingualContent'
import ShareButtons from '@/components/ShareButtons'
import { GEO_AUTHORITY_PAGES, getMatchingGeoPage, getMatchingPillar } from '@/lib/diamond-seo'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const result = getContentBySlug(slug)
  if (!result) return {}

  const { item, body } = result
  const bodyEn = body.split('\n<!-- FR -->\n')[0]
  const description = (bodyEn
    .split('\n')
    .map(l => l.trim())
    .find(l => l.length > 60) ?? '')
    .replace(/[#*`[\]_|>]/g, '')
    .slice(0, 155)

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'

  const shortTitle = item.title.length > 60 ? item.title.slice(0, 57) + '…' : item.title
  return {
    title: shortTitle,
    description,
    alternates: { canonical: `${base}/content/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      images: [{ url: `${base}${item.image}` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: [`${base}${item.image}`],
    },
  }
}

function getMeta(item: ContentItem) {
  switch (item.type) {
    case 'article':
    case 'news':
    case 'blog':
      return { byline: item.author, avatar: item.authorAvatar, detail: item.readTime }
    case 'podcast':
      return { byline: item.guest, avatar: item.guestAvatar, detail: item.duration }
    case 'event':
      return { byline: item.organizer, avatar: item.organizerAvatar, detail: `${item.eventDate} · ${item.location}` }
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

function buildBreadcrumbJsonLd(item: ContentItem, base: string): string {
  const url = `${base}/content/${item.slug}`
  const catSlug = getCategorySlugForTerm(item.category)
  const items: { '@type': string; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: base },
  ]
  if (catSlug) {
    items.push({ '@type': 'ListItem', position: 2, name: item.category, item: `${base}/category/${catSlug}` })
    items.push({ '@type': 'ListItem', position: 3, name: item.title, item: url })
  } else {
    items.push({ '@type': 'ListItem', position: 2, name: item.title, item: url })
  }
  return safeJsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
}

function extractFaqJsonLd(body: string): string | null {
  const faqMatch = body.match(/##\s+(?:FAQ|Frequently Asked Questions)\s*\n+([\s\S]+?)(?=\n##\s|$)/i)
  if (!faqMatch) return null
  const pairs = [...faqMatch[1].matchAll(/###\s+(.+?)\n+([\s\S]+?)(?=\n###|$)/g)]
  if (pairs.length === 0) return null
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(([, q, a]) => ({
      '@type': 'Question',
      name: q.trim(),
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/[#*`[\]_|>]/g, '').trim().slice(0, 400) },
    })),
  })
}

function buildJsonLd(item: ContentItem, body: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'
  const url = `${base}/content/${item.slug}`
  const description = body.split('\n<!-- FR -->\n')[0].split('\n').map(l => l.trim()).find(l => l.length > 60)?.slice(0, 160) ?? ''

  if (item.type === 'event') {
    return safeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: item.title,
      startDate: item.eventDate,
      location: { '@type': 'Place', name: item.location },
      organizer: { '@type': 'Person', name: item.organizer },
      url,
      image: `${base}${item.image}`,
      description,
    })
  }

  if (item.type === 'podcast') {
    return safeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: item.title,
      datePublished: item.date,
      url,
      image: `${base}${item.image}`,
      description,
      actor: { '@type': 'Person', name: item.guest },
      publisher: { '@type': 'Organization', name: 'Hospitality121', url: base, logo: { '@type': 'ImageObject', url: `${base}/images/Logo.png` } },
      partOfSeries: { '@type': 'PodcastSeries', name: 'Hospitality121 Podcast', url: `${base}/podcasts` },
      ...(item.embedUrl ? { audio: { '@type': 'AudioObject', contentUrl: item.embedUrl, encodingFormat: 'audio/mpeg' } } : {}),
    })
  }

  const author = 'author' in item ? item.author : ''
  const wordCount = body.split(/\s+/).filter(Boolean).length
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    datePublished: item.date,
    dateModified: item.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    wordCount,
    image: { '@type': 'ImageObject', url: `${base}${item.image}` },
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'Hospitality121', url: base, logo: { '@type': 'ImageObject', url: `${base}/images/Logo.png` } },
    description,
    isPartOf: { '@type': 'WebSite', name: 'Hospitality121', url: base },
  })
}

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = getContentBySlug(slug)
  if (!result) notFound()

  const { item, body } = result
  const meta = getMeta(item)
  const catSlug = getCategorySlugForTerm(item.category)

  const [bodyEn, bodyFr] = body.split('\n<!-- FR -->\n')
  const titleFr = 'titleFr' in item ? (item as { titleFr?: string }).titleFr : undefined

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'
  const jsonLdString = buildJsonLd(item, body)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(item, base)
  const faqJsonLd = extractFaqJsonLd(body)

  const related = getAllContent()
    .filter(c => c.slug !== item.slug && c.category === item.category)
    .slice(0, 3)
  const diamondText = `${item.title} ${item.category} ${bodyEn.slice(0, 500)}`
  const diamondPillar = getMatchingPillar(diamondText)
  const diamondGeo = getMatchingGeoPage(diamondText)
  const relatedPillars = [
    diamondPillar,
    getMatchingPillar(`${item.category} hospitality technology AI operations`),
    getMatchingPillar(`${item.category} guest experience leadership trends`),
  ].filter((pillar, index, arr) => arr.findIndex(p => p.slug === pillar.slug) === index)
  const relatedGeoPages = [
    diamondGeo,
    ...GEO_AUTHORITY_PAGES.filter(page => page.slug !== diamondGeo.slug).slice(0, 2),
  ]

  return (
    <>
      {/* JSON-LD: safeJsonLd() escapes <, >, & — nosec: not user content */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} /> {/* nosec */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} /> {/* nosec */}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />} {/* nosec */}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Category badge */}
        <div className="mb-4">
          {catSlug ? (
            <Link href={`/category/${catSlug}`} className="text-xs font-bold tracking-widest text-gold uppercase hover:underline">
              {item.category}
            </Link>
          ) : (
            <span className="text-xs font-bold tracking-widest text-gold uppercase">{item.category}</span>
          )}
        </div>

        {/* Title + Body (bilingual for auto-generated posts, EN-only for existing posts) */}
        <BilingualContent
          titleEn={item.title}
          titleFr={titleFr}
          bodyEn={bodyEn}
          bodyFr={bodyFr}
        />

        {/* Author row */}
        <div className="flex items-center gap-3 mb-8 text-sm text-muted">
          {meta.avatar && (
            <Image
              src={meta.avatar}
              alt={meta.byline}
              width={40}
              height={40}
              className="rounded-full object-cover object-top"
            />
          )}
          <div>
            {(item.type === 'article' || item.type === 'news' || item.type === 'blog') ? (
              <Link href={`/author/${nameToSlug(meta.byline)}`} className="font-semibold text-gray-800 hover:text-gold transition-colors">
                {meta.byline}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">{meta.byline}</span>
            )}
            <span className="mx-2">·</span>
            <span>{formatDate(item.date)}</span>
            <span className="mx-2">·</span>
            <span>{meta.detail}</span>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-10">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Podcast embed */}
        {item.type === 'podcast' && (
          <PodcastPlayer
            title={item.title}
            guest={item.guest}
            duration={item.duration}
            embedUrl={item.embedUrl}
            showNotes={item.showNotes}
          />
        )}

        {/* Podcast extras */}
        {item.type === 'podcast' && (
          <>
            {item.keyTakeaways && item.keyTakeaways.length > 0 && (
              <div className="mt-10 bg-surface rounded-xl p-6 border-l-4 border-gold">
                <h2 className="font-serif text-xl font-bold mb-4">Key Takeaways</h2>
                <ul className="flex flex-col gap-3">
                  {item.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(item.guestBio || item.guestTitle) && (
              <div className="mt-8 bg-surface rounded-xl p-6">
                <h2 className="font-serif text-xl font-bold mb-4">About {item.guest}</h2>
                {item.guestTitle && (
                  <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">{item.guestTitle}</p>
                )}
                {item.guestBio && (
                  <p className="text-sm text-muted leading-relaxed">{item.guestBio}</p>
                )}
                {item.guestLinkedIn && (
                  <a
                    href={item.guestLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-xs font-bold tracking-wider text-gold hover:underline"
                  >
                    LinkedIn Profile →
                  </a>
                )}
              </div>
            )}
          </>
        )}

        {/* Share buttons */}
        <ShareButtons
          title={item.title}
          url={`https://hospitality121.com/content/${item.slug}`}
        />

        {/* Diamond SEO links */}
        <nav className="mt-8 bg-surface rounded-xl p-6" aria-label="Diamond authority links">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Hospitality121 Authority Network</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Core and Pillars</p>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Hospitality121 Core Hub</Link>
                {relatedPillars.map(pillar => (
                  <Link key={pillar.slug} href={pillar.href} className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">
                    {pillar.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">GEO Hospitality Pages</p>
              <div className="flex flex-col gap-2">
                {relatedGeoPages.map(page => (
                  <Link key={page.slug} href={page.href} className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Author bio */}
        {(() => {
          const authorName = item.type === 'podcast'
            ? item.guest
            : item.type === 'event'
              ? item.organizer
              : item.author
          const authorRecord = authorName ? AUTHORS_BY_NAME[authorName] : null
          if (!authorRecord || !authorRecord.bio) return null
          return (
            <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 items-start">
              <Image
                src={authorRecord.photo}
                alt={authorRecord.name}
                width={56}
                height={56}
                className="rounded-full object-cover object-top shrink-0 ring-2 ring-gold/20"
              />
              <div>
                <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">About the author</p>
                <Link href={`/author/${nameToSlug(authorRecord.name)}`} className="font-serif font-bold text-gray-900 hover:text-gold transition-colors">
                  {authorRecord.name}
                </Link>
                <p className="text-sm text-muted mt-1 leading-relaxed">{authorRecord.bio}</p>
              </div>
            </div>
          )
        })()}

        {/* Related content */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-bold mb-6">More in {item.category}</h2>
            <div className="flex flex-col gap-4">
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/content/${rel.slug}`}
                  className="flex gap-4 group bg-surface rounded-lg p-4 hover:ring-1 hover:ring-gold/40 transition"
                >
                  <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden">
                    <Image src={rel.image} alt={rel.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-gold tracking-widest">{rel.category}</span>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors line-clamp-2">{rel.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
