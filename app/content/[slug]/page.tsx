import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getContentBySlug, getAllSlugs } from '@/lib/content'
import type { ContentItem } from '@/types/content'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllSlugs()
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

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = getContentBySlug(slug)
  if (!result) notFound()

  const { item, body } = result
  const meta = getMeta(item)

  const paragraphs = body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Category badge */}
      <div className="mb-4">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">{item.category}</span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">{item.title}</h1>

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

      {/* Body content */}
      {paragraphs.length > 0 ? (
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-5 text-base leading-relaxed text-white/85 dark:text-white/85 light:text-navy/85">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted italic">Full article coming soon.</p>
      )}
    </article>
  )
}
