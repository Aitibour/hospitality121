import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'
import { shortHeadline } from '@/lib/headlines.mjs'

type Props = {
  items: ContentItem[]
  showEpisodeNumbers?: boolean
  contained?: boolean
}

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

export default function ContentGrid({ items, showEpisodeNumbers = false, contained = true }: Props) {
  if (items.length === 0) return null

  return (
    <div className={contained ? 'max-w-7xl mx-auto px-4 py-8' : 'py-8'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => {
          const { name, avatar, meta } = getCardMeta(item)
          const formattedDate = item.type === 'event'
            ? `Event: ${formatDate(item.eventDate)}`
            : formatDate(item.date)
          const cardId = `card-title-${item.slug}`
          return (
            <Link
              key={item.slug}
              href={`/content/${item.slug}`}
              aria-labelledby={cardId}
              className="group block bg-surface rounded-lg overflow-hidden hover:ring-1 hover:ring-gold/40 transition-shadow"
            >
              <article>
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {showEpisodeNumbers && item.type === 'podcast' && (
                    <div className="absolute left-3 top-3 rounded-full bg-gray-950/85 px-3 py-1 text-xs font-bold tracking-widest text-gray-50">
                      EP {String(index + 1).padStart(2, '0')}
                    </div>
                  )}
                </div>
              <div className="p-4 flex flex-col gap-2">
                <AuthorLine name={name} avatar={avatar} date={formattedDate} />
                <CategoryLabel label={item.category} />
                <h3 id={cardId} title={item.title} className="font-serif text-gray-900 font-semibold text-base leading-snug truncate group-hover:text-gold transition-colors">
                  {showEpisodeNumbers && item.type === 'podcast' ? `Episode ${index + 1}: ` : ''}
                  {shortHeadline(item.title)}
                </h3>
                <p className="text-muted text-xs">{meta}</p>
              </div>
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
