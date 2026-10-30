import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAuthorBySlug, getAllAuthors, nameToSlug } from '@/lib/authors'
import { getAllContent } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllAuthors().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: author.name,
    description: author.bio?.slice(0, 155),
    alternates: { canonical: `https://hospitality121.com/author/${slug}` },
    openGraph: {
      title: `${author.name} | Hospitality121`,
      description: author.bio?.slice(0, 155),
      images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
    },
  }
}

function buildPersonJsonLd(author: { name: string; title: string; photo: string; linkedin?: string; x?: string }, slug: string): string {
  const base = 'https://hospitality121.com'
  const photoUrl = author.photo.startsWith('http') ? author.photo : `${base}${author.photo}`
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    url: `${base}/author/${slug}`,
    image: photoUrl,
    worksFor: { '@type': 'Organization', name: 'Hospitality121', url: base },
    ...((author.linkedin || author.x) ? { sameAs: [author.linkedin, author.x].filter(Boolean) } : {}),
  }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const articles = getAllContent().filter(item => {
    if (item.type === 'article' || item.type === 'news' || item.type === 'blog') {
      return nameToSlug('author' in item ? item.author : '') === slug
    }
    return false
  })

  const personJsonLd = buildPersonJsonLd(author, slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Author header */}
      <div className="flex items-start gap-6 mb-12">
        <Image
          src={author.photo}
          alt={author.name}
          width={80}
          height={80}
          className="rounded-full object-cover shrink-0"
        />
        <div>
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">{author.title}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{author.name}</h1>
          <p className="text-muted leading-relaxed text-sm">{author.bio}</p>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs font-bold tracking-wider text-gold hover:underline"
            >
              LinkedIn Profile →
            </a>
          )}
          {author.x && <a href={author.x} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 ml-5 text-xs font-bold tracking-wider text-gold hover:underline">Follow on X →</a>}
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div>
          <h2 className="font-serif text-xl font-bold mb-6 border-b border-surface pb-3">
            Articles by {author.name}
          </h2>
          <div className="flex flex-col gap-5">
            {articles.map(item => (
              <Link
                key={item.slug}
                href={`/content/${item.slug}`}
                className="flex gap-4 group bg-surface rounded-lg p-4 hover:ring-1 hover:ring-gold/40 transition"
              >
                <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gold tracking-widest">{item.category}</span>
                  <span className="text-sm font-semibold group-hover:text-gold transition-colors line-clamp-2">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted">No articles found for this author.</p>
      )}
    </div>
    </>
  )
}
