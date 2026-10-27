import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import { formatDate } from '@/lib/formatDate'

type Props = {
  items: ContentItem[]
}

export default function DiamondAuthoritySection({ items }: Props) {
  if (items.length === 0) return null

  return (
    <aside className="lg:sticky lg:top-20 h-fit rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <span className="text-[11px] font-bold tracking-widest text-gold uppercase">From the archive</span>
        <h2 className="font-serif text-xl font-bold leading-tight mt-1 text-gray-900">
          Source-based coverage
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          AI-assisted coverage with links to the original publishers. Check each story&apos;s publication date.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {items.slice(0, 8).map(item => (
          <Link
            key={item.slug}
            href={`/content/${item.slug}`}
            className="group grid grid-cols-[56px_1fr] gap-3 py-3"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-widest text-gold uppercase">
                {item.category}
              </p>
              <h3 className="mt-1 text-sm font-bold leading-snug text-gray-900 break-words group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] text-muted">{formatDate(item.date)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <Link href="/news" className="text-xs font-bold text-gold hover:underline">
          News
        </Link>
        <Link href="/blog" className="text-xs font-bold text-gold hover:underline">
          Articles
        </Link>
      </div>
    </aside>
  )
}
