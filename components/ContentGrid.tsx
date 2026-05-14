import Image from 'next/image'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { timeAgo } from '@/lib/timeAgo'

type Props = { items: ContentItem[] }

export default function ContentGrid({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => {
          const name = item.type === 'article' ? item.author : item.guest
          const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
          const meta = item.type === 'article' ? item.readTime : item.duration
          const publishedAgo = timeAgo(item.date)
          return (
            <article
              key={item.slug}
              className="bg-surface rounded-lg overflow-hidden hover:ring-1 hover:ring-gold/40 transition-all cursor-pointer"
            >
              <div className="relative h-44">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <AuthorLine name={name} avatar={avatar} timeAgo={publishedAgo} />
                <CategoryLabel label={item.category} />
                <h3 className="font-serif text-white font-semibold text-base leading-snug line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-muted text-xs">{meta}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
