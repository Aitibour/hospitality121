import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getContentBySlug, getAllSlugs, getAllContent } from '@/lib/content'
import { getCategorySlugForTerm } from '@/lib/categories'
import type { ContentItem } from '@/types/content'
import BilingualContent from '@/components/BilingualContent'

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
  const description = bodyEn
    .split('\n')
    .map(l => l.trim())
    .find(l => l.length > 60)
    ?.slice(0, 160) ?? ''

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://hospitality121.com'

  return {
    title: item.title,
    description,
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
      actor: { '@type': 'Person', name: item.guest },
      publisher: { '@type': 'Organization', name: 'Hospitality121', url: base },
    })
  }

  const author = 'author' in item ? item.author : ''
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    datePublished: item.date,
    url,
    image: `${base}${item.image}`,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'Hospitality121', url: base },
    description,
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

  const jsonLdString = buildJsonLd(item, body)

  const related = getAllContent()
    .filter(c => c.slug !== item.slug && c.category === item.category)
    .slice(0, 3)

  return (
    <>
      {/* JSON-LD structured data — content comes from our own MDX files, escaped above */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

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
              className="rounded-full object-cover"
            />
          )}
          <div>
            <span className="font-semibold text-white/90">{meta.byline}</span>
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
        {item.type === 'podcast' && item.embedUrl && (
          <div className="mb-10">
            <iframe
              src={item.embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-lg"
            />
          </div>
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

        {/* Newsletter CTA */}
        <div className="mt-12 bg-surface rounded-xl p-8 text-center">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Newsletter</p>
          <h2 className="font-serif text-2xl font-bold mb-2">Stay in the know.</h2>
          <p className="text-muted text-sm mb-6">
            The best hospitality insights, podcasts, and events — delivered weekly.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity text-sm"
          >
            SUBSCRIBE FREE
          </Link>
        </div>

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
                    <span className="text-sm font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">{rel.title}</span>
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
