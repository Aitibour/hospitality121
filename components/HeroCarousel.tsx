'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'

type Props = { items: ContentItem[] }

export default function HeroCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length])

  useEffect(() => {
    if (items.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [items.length, next])

  if (items.length === 0) return null

  const item = items[current]
  const name = item.type === 'article' || item.type === 'news' || item.type === 'blog' ? item.author
    : item.type === 'podcast' ? item.guest
      : item.organizer
  const avatar = item.type === 'article' || item.type === 'news' || item.type === 'blog' ? item.authorAvatar
    : item.type === 'podcast' ? item.guestAvatar
      : item.organizerAvatar
  const meta = item.type === 'article' || item.type === 'news' || item.type === 'blog' ? item.readTime
    : item.type === 'podcast' ? item.duration
      : item.location
  const publishedAgo = formatDate(item.date)
  const slideId = 'hero-slide'

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Featured content"
      className="relative w-full h-[72svh] min-h-[420px] max-h-[760px] overflow-hidden md:h-[calc(100vh-64px)] md:min-h-[520px]"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="100vw"
        quality={76}
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div
        id={slideId}
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${items.length}: ${item.title}`}
        aria-live="polite"
        className="absolute bottom-0 left-0 right-0 max-w-3xl p-4 pb-12 sm:p-6 md:p-10"
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CategoryLabel label={item.category} />
          <span className="text-gray-300 text-sm" aria-hidden="true">·</span>
          <span className="text-gray-300 text-xs sm:text-sm">{publishedAgo}</span>
          {item.type !== 'event' && (
            <span className="text-xs bg-surface text-gold border border-gold/30 px-2 py-0.5 rounded">
              {item.type === 'podcast' ? 'PODCAST' : 'ARTICLE'}
            </span>
          )}
        </div>
        <Link href={`/content/${item.slug}`} className="group/title inline-block max-w-full">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-50 leading-tight mb-3 group-hover/title:text-gold transition-colors">
            {item.title}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-950 shadow-sm transition-transform group-hover/title:translate-x-1">
            Read now
            <span aria-hidden="true">-&gt;</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <AuthorLine name={name} avatar={avatar} date={publishedAgo} nameColor="text-gray-100" dateColor="text-gray-300" />
          <span className="text-gray-300 text-sm">{meta}</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3 md:bottom-6 md:right-6">
        <button onClick={prev} aria-label="Previous slide" className="hidden sm:block text-gray-200/80 hover:text-gray-50 text-2xl leading-none">‹</button>
        <div role="tablist" aria-label="Carousel slides">
          <div className="flex gap-1.5">
            {items.map((it, i) => (
              <button
                key={it.slug}
                onClick={() => setCurrent(i)}
                role="tab"
                aria-selected={i === current}
                aria-controls={slideId}
                aria-label={`Slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
        <button onClick={next} aria-label="Next slide" className="hidden sm:block text-gray-200/80 hover:text-gray-50 text-2xl leading-none">›</button>
      </div>
    </div>
  )
}
