'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/types/content'
import CategoryLabel from './CategoryLabel'
import AuthorLine from './AuthorLine'
import { formatDate } from '@/lib/formatDate'
import FollowCTA from './FollowCTA'

export type HeroItem = ContentItem & { href?: string; rss?: boolean; imageAlt?: string; imageCaption?: string; excerpt?: string }
type Props = { items: HeroItem[] }

export default function HeroCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length])

  useEffect(() => {
    if (items.length <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [items.length, next, paused])

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
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          prev()
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          next()
        }
      }}
      className="relative w-full h-[72svh] min-h-[420px] max-h-[760px] overflow-hidden md:h-[calc(100vh-64px)] md:min-h-[520px]"
    >
      <Image
        src={item.image}
        alt={item.imageAlt || item.title}
        fill
        sizes="100vw"
        quality={75}
        className="object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div
        id={slideId}
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${items.length}: ${item.title}`}
        aria-live={paused ? 'polite' : 'off'}
        className="absolute bottom-0 left-0 right-0 max-w-3xl p-4 pb-12 sm:p-6 md:p-10"
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CategoryLabel label={item.category} />
          <span className="text-gray-300 text-sm" aria-hidden="true">·</span>
          <span className="text-gray-300 text-xs sm:text-sm">{publishedAgo}</span>
          {item.type !== 'event' && (
            <span className="text-xs bg-surface text-gold border border-gold/30 px-2 py-0.5 rounded">
              {item.rss ? 'RSS · DAILY SELECTION' : item.type === 'podcast' ? 'PODCAST' : 'ARTICLE'}
            </span>
          )}
        </div>
        <Link href={item.href || `/content/${item.slug}`} prefetch={item.rss ? false : undefined} className="group/title block w-full min-w-0" title={item.title}>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-gray-50 leading-tight mb-3 break-words group-hover/title:text-gold transition-colors">
            {item.title}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-950 shadow-sm transition-transform group-hover/title:translate-x-1">
            {item.rss ? 'Read at source' : 'Read now'}
            <span aria-hidden="true">-&gt;</span>
          </span>
        </Link>
        {item.excerpt && <p className="mb-3 mt-3 max-w-2xl text-sm leading-relaxed text-gray-200 line-clamp-2">{item.excerpt}</p>}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <AuthorLine name={name} avatar={avatar} date={publishedAgo} nameColor="text-gray-100" dateColor="text-gray-300" />
          <span className="text-gray-300 text-sm">{meta}</span>
        </div>
        <FollowCTA compact />
        {item.imageCaption && <p className="mt-2 text-xs text-gray-200">{item.imageCaption}</p>}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3 md:bottom-6 md:right-6">
        <button onClick={prev} aria-label="Previous slide" className="hidden sm:grid h-10 w-10 place-items-center rounded-full bg-black/35 text-gray-100 hover:bg-black/60 hover:text-gray-50 text-2xl leading-none">‹</button>
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
                className={`h-8 w-8 rounded-full grid place-items-center transition-colors before:block before:h-2 before:w-2 before:rounded-full ${
                  i === current ? 'before:bg-gold' : 'before:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <button onClick={next} aria-label="Next slide" className="hidden sm:grid h-10 w-10 place-items-center rounded-full bg-black/35 text-gray-100 hover:bg-black/60 hover:text-gray-50 text-2xl leading-none">›</button>
      </div>
    </div>
  )
}
