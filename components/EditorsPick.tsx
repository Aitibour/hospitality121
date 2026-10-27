import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'

type Props = { items: ContentItem[] }

function getItemMeta(item: ContentItem) {
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

function PickCard({ item, featured = false }: { item: ContentItem; featured?: boolean }) {
  const { name, avatar, meta } = getItemMeta(item)
  const titleId = `editors-pick-${item.slug}`

  return (
    <Link
      href={`/content/${item.slug}`}
      className={`group block overflow-hidden rounded-lg bg-surface transition hover:ring-1 hover:ring-gold/40 ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
      aria-labelledby={titleId}
    >
      <article>
        <div className={`relative ${featured ? 'h-72 md:h-[420px]' : 'h-44'}`}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {featured && <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />}
          {featured && (
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <AuthorLine name={name} avatar={avatar} date={formatDate(item.date)} nameColor="text-gray-50" dateColor="text-gray-300" />
              <h3 id={titleId} className="font-serif text-2xl font-bold leading-snug text-gray-50 mt-3 break-words">
                {item.title}
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <CategoryLabel label={item.category} />
                <span className="text-xs text-gray-300">{meta}</span>
              </div>
            </div>
          )}
        </div>

        {!featured && (
          <div className="p-4">
            <AuthorLine name={name} avatar={avatar} date={formatDate(item.date)} nameColor="text-gray-900" />
            <h3 id={titleId} className="mt-3 font-serif text-base font-semibold leading-snug text-gray-900 break-words group-hover:text-gold transition-colors">
              {item.title}
            </h3>
            <div className="mt-3 flex items-center gap-2">
              <CategoryLabel label={item.category} />
              <span className="text-xs text-muted">{meta}</span>
            </div>
          </div>
        )}
      </article>
    </Link>
  )
}

export default function EditorsPick({ items }: Props) {
  if (items.length === 0) return null

  const visible = items.slice(0, 10)
  const [lead, ...rest] = visible

  return (
    <section aria-label="Editor's Pick" className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 font-serif text-2xl font-bold tracking-wide">EDITOR&apos;S PICK</h2>
        <Link href="/insights" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
          SEE MORE <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6">
        <PickCard item={lead} featured />
        {rest.map(item => <PickCard key={item.slug} item={item} />)}
      </div>
    </section>
  )
}
