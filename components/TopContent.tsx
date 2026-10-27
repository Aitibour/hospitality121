import Image from 'next/image'
import Link from 'next/link'
import type { Article, Podcast } from '@/types/content'
import { formatDate } from '@/lib/formatDate'

type ArticleRowProps = { items: Article[]; rank: number }
type PodcastRowProps = { items: Podcast[]; rank: number }

function ArticleRow({ items, rank }: ArticleRowProps) {
  return (
    <div className="flex gap-4 items-start group">
      <span className="text-gold font-serif text-3xl font-bold leading-none w-8 flex-shrink-0 opacity-60">
        {rank}
      </span>
      <Link href={`/content/${items[0]?.slug}`} className="flex gap-3 items-start flex-1 min-w-0">
        <div className="relative w-16 h-16 rounded flex-shrink-0 overflow-hidden">
          <Image src={items[0]?.image} alt={items[0]?.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gold font-semibold tracking-wider mb-1">{items[0]?.category}</p>
          <h4 className="font-serif text-sm font-semibold leading-snug break-words group-hover:text-gold transition-colors">
            {items[0].title}
          </h4>
          <p className="text-muted text-xs mt-1">{formatDate(items[0]?.date)} · {items[0]?.readTime}</p>
        </div>
      </Link>
    </div>
  )
}

function PodcastRow({ items, rank }: PodcastRowProps) {
  return (
    <div className="flex gap-4 items-start group">
      <span className="text-gold font-serif text-3xl font-bold leading-none w-8 flex-shrink-0 opacity-60">
        {rank}
      </span>
      <Link href={`/content/${items[0]?.slug}`} className="flex gap-3 items-start flex-1 min-w-0">
        <div className="relative w-16 h-16 rounded flex-shrink-0 overflow-hidden">
          <Image src={items[0]?.image} alt={items[0]?.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gold font-semibold tracking-wider mb-1">{items[0]?.category}</p>
          <h4 className="font-serif text-sm font-semibold leading-snug break-words group-hover:text-gold transition-colors">
            {items[0].title}
          </h4>
          <p className="text-muted text-xs mt-1">{formatDate(items[0]?.date)} · {items[0]?.duration}</p>
        </div>
      </Link>
    </div>
  )
}

type Props = { articles: Article[]; podcasts: Podcast[] }

export default function TopContent({ articles, podcasts }: Props) {
  const topArticles = articles.slice(0, 5)
  const topPodcasts = podcasts.slice(0, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Top Articles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold tracking-wide">TOP ARTICLES</h2>
            <Link href="/insights" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
              SEE ALL <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {topArticles.map((item, i) => (
              <ArticleRow key={item.slug} items={[item]} rank={i + 1} />
            ))}
          </div>
        </div>

        {/* Top Podcasts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold tracking-wide">TOP PODCASTS</h2>
            <Link href="/podcasts" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
              SEE ALL <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {topPodcasts.map((item, i) => (
              <PodcastRow key={item.slug} items={[item]} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
