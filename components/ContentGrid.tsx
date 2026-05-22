import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'
import { getCategorySlugForTerm } from '@/lib/categories'

type Props = { items: ContentItem[] }

function getCardMeta(item: ContentItem) {
  switch (item.type) {
    case 'article':
    case 'news':
    case 'blog':
      return { name: item.author, avatar: item.authorAvatar, meta: item.readTime }
    case 'podcast':
      return { name: item.guest, avatar: item.guestAvatar, meta: item.duration }
    case 'event':
      return { name: item.organizer, avatar: item.organizerAvatar, meta: item.location }
  }
}

export default function ContentGrid({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => {
          const { name, avatar, meta } = getCardMeta(item)
          const formattedDate = item.type === 'event'
            ? `Event: ${formatDate(item.eventDate)}`
            : formatDate(item.date)
          const cardId = `card-title-${item.slug}`
          return (
            <article
              key={item.slug}
              aria-labelledby={cardId}
              className="bg-surface rounded-lg overflow-hidden hover:ring-1 hover:ring-gold/40 transition-shadow"
            >
              <Link href={`/content/${item.slug}`} className="block group">
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col gap-2">
                <AuthorLine name={name} avatar={avatar} date={formattedDate} />
                {(() => {
                  const catSlug = getCategorySlugForTerm(item.category)
                  return catSlug ? (
                    <Link href={`/category/${catSlug}`}>
                      <CategoryLabel label={item.category} />
                    </Link>
                  ) : (
                    <CategoryLabel label={item.category} />
                  )
                })()}
                <Link href={`/content/${item.slug}`} className="group">
                  <h3 id={cardId} className="font-serif text-gray-900 font-semibold text-base leading-snug line-clamp-3">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted text-xs">{meta}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
