import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'

type Props = { items: ContentItem[] }

type CardProps = { item: ContentItem; idPrefix: string }

function SmallCard({ item, idPrefix }: CardProps) {
  const name   = item.type === 'article' ? item.author       : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta   = item.type === 'article' ? item.readTime     : item.duration
  const titleId = `${idPrefix}-${item.slug}`
  return (
    <article aria-labelledby={titleId} className="group">
      <Link href={`/content/${item.slug}`} className="flex gap-3">
        <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex flex-col gap-1">
          <AuthorLine name={name} avatar={avatar} date={formatDate(item.date)} />
          <h4 id={titleId} className="font-serif text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold transition-colors">
            {item.title}
          </h4>
          <div className="flex items-center gap-2">
            <CategoryLabel label={item.category} />
            <span className="text-muted text-xs">{meta}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function LargeCard({ item, idPrefix }: CardProps) {
  const name   = item.type === 'article' ? item.author       : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta   = item.type === 'article' ? item.readTime     : item.duration
  const titleId = `${idPrefix}-${item.slug}`
  return (
    <article aria-labelledby={titleId} className="relative h-[380px] rounded-lg overflow-hidden group">
      <Link href={`/content/${item.slug}`} className="absolute inset-0">
        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <AuthorLine name={name} avatar={avatar} date={formatDate(item.date)} />
          <h3 id={titleId} className="font-serif text-white text-xl font-bold leading-snug mt-2 mb-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <CategoryLabel label={item.category} />
            <span className="text-muted text-xs">{meta}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function EditorsPick({ items }: Props) {
  if (items.length < 3) return null

  const center = items[0]
  const rest   = items.slice(1)
  const left   = rest.slice(0, 2)
  const right  = rest.length >= 4 ? rest.slice(2, 4) : rest.slice(0, 2)

  return (
    <section aria-label="Editor's Pick" className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-serif text-2xl font-bold tracking-wide">EDITOR&apos;S PICK</h2>
        <Link href="/insights" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
          SEE MORE <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          {left.map(item => <SmallCard key={item.slug} item={item} idPrefix="ep-left" />)}
        </div>
        <LargeCard item={center} idPrefix="ep-center" />
        <div className="flex flex-col gap-6">
          {right.map(item => <SmallCard key={item.slug} item={item} idPrefix="ep-right" />)}
        </div>
      </div>
    </section>
  )
}
