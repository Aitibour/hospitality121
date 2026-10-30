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
import { renderArticleMarkdown, articleDescription } from '@/lib/article-markdown.mjs'
import ShareButtons from '@/components/ShareButtons'
import FollowCTA from '@/components/FollowCTA'
import ArticleViews from '@/components/ArticleViews'
import { GEO_AUTHORITY_PAGES, getMatchingGeoPage, getMatchingPillar } from '@/lib/diamond-seo'

export const revalidate = 3600
export const dynamicParams = false

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const result = getContentBySlug(slug)
  if (!result) return {}

  const { item, body } = result
  const description = articleDescription(item, body)

  const base = 'https://hospitality121.com'
  const authorName = 'author' in item ? item.author : item.type === 'podcast' ? item.guest : item.organizer

  return {
    title: item.title,
    description,
    alternates: { canonical: `${base}/content/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      images: [{ url: new URL(item.image, base).href }],
      type: 'article',
      url: `${base}/content/${item.slug}`,
      publishedTime: item.date,
      authors: [authorName],
      section: item.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: [new URL(item.image, base).href],
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
  const base = 'https://hospitality121.com'
  const url = `${base}/content/${item.slug}`
  const description = articleDescription(item, body)

  if (item.type === 'event') {
    return safeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: item.title,
      startDate: item.eventDate,
      location: { '@type': 'Place', name: item.location },
      organizer: { '@type': 'Person', name: item.organizer },
      url,
      image: new URL(item.image, base).href,
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
      image: new URL(item.image, base).href,
      description,
      actor: { '@type': 'Person', name: item.guest },
      publisher: { '@type': 'Organization', name: 'Hospitality121', url: base, logo: { '@type': 'ImageObject', url: `${base}/images/Logo.png` } },
      partOfSeries: { '@type': 'PodcastSeries', name: 'Hospitality121 Podcast', url: `${base}/podcasts` },
      ...(item.embedUrl ? { audio: { '@type': 'AudioObject', contentUrl: item.embedUrl, encodingFormat: 'audio/mpeg' } } : {}),
    })
  }

  const author = 'author' in item ? item.author : ''
  const wordCount = body.split(/<!--\s*FR\s*-->/)[0].split(/\s+/).filter(Boolean).length
  const authorRecord = AUTHORS_BY_NAME[author]
  const pillar = getMatchingPillar(`${item.title} ${item.category} ${description}`)
  const schemaType = item.type === 'news' ? 'NewsArticle' : item.type === 'blog' ? 'BlogPosting' : 'Article'
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: item.title,
    datePublished: item.date,
    dateModified: item.dateModified || item.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    wordCount,
    image: { '@type': 'ImageObject', url: new URL(item.image, base).href },
    author: {
      '@type': /^(H1H|Hospitality121)/.test(author) ? 'Organization' : 'Person',
      name: author,
      url: `${base}/author/${nameToSlug(author)}`,
      ...((authorRecord?.linkedin || authorRecord?.x) ? { sameAs: [authorRecord.linkedin, authorRecord.x].filter(Boolean) } : {}),
    },
    publisher: { '@type': 'Organization', name: 'Hospitality121', url: base, logo: { '@type': 'ImageObject', url: `${base}/images/Logo.png` } },
    description,
    articleSection: item.category,
    keywords: pillar.keywords,
    about: { '@type': 'Thing', name: pillar.title, url: pillar.canonical },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article h2', 'article p'],
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
    ...('sourceUrl' in item && item.sourceUrl ? { citation: item.sourceUrl, isBasedOn: item.sourceUrl } : {}),
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

  const [bodyEn, bodyFr] = body.split(/<!--\s*FR\s*-->/)
  const titleFr = 'titleFr' in item ? (item as { titleFr?: string }).titleFr : undefined

  const base = 'https://hospitality121.com'
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
          htmlEn={renderArticleMarkdown(bodyEn)}
          htmlFr={bodyFr?.trim() ? renderArticleMarkdown(bodyFr) : undefined}
          bodyInsertBefore="<h2>Build a service loop the team can trust</h2>"
          bodyInsert={item.slug === 'hotel-ai-must-earn-guest-trust' ? (
            <div className="my-10 rounded-xl border border-gold/30 bg-surface p-3 sm:p-6">
              <Image src="/images/content/hotel-ai-guest-trust-flow.svg" width={960} height={1020} alt="The hotel AI service loop: understand the request, check live hotel facts, assign a responsible team, confirm delivery, and learn from the guest outcome. A human can take over at every stage." className="w-full h-auto" />
              <p className="mt-3 text-sm text-muted">An operating model proposed by Abdellah Ait Ibour. A response becomes service only when someone owns delivery.</p>
            </div>
          ) : undefined}
        >


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
            <span className="mx-2">·</span>
            <ArticleViews slug={item.slug} record />
          </div>
        </div>

        {/* Hero image */}
        <figure className="mb-10">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt || ''}
            fill
            className="object-cover"
            preload
          />
        </div>
        </figure>
        </BilingualContent>

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
                {item.guestLinkedIn?.startsWith('https://www.linkedin.com/in/') && (
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
        <FollowCTA />
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
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-gold transition-colors">{rel.title}</span>
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
