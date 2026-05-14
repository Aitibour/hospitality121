'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (items.length === 0) return null

  const item = items[current]
  const name = item.type === 'article' ? item.author : item.guest
  const avatar = item.type === 'article' ? item.authorAvatar : item.guestAvatar
  const meta = item.type === 'article' ? item.readTime : item.duration
  const publishedAgo = formatDate(item.date)
  const slideId = 'hero-slide'

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Featured content"
      className="relative w-full h-[480px] md:h-[560px] overflow-hidden"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

      <div
        id={slideId}
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${items.length}: ${item.title}`}
        aria-live="polite"
        className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <CategoryLabel label={item.category} />
          <span className="text-muted text-sm" aria-hidden="true">·</span>
          <span className="text-muted text-sm">{publishedAgo}</span>
          <span className="ml-2 text-xs bg-surface text-gold border border-gold/30 px-2 py-0.5 rounded">
            {item.type === 'podcast' ? 'PODCAST' : 'ARTICLE'}
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
          {item.title}
        </h1>
        <div className="flex items-center gap-4">
          <AuthorLine name={name} avatar={avatar} date={publishedAgo} />
          <span className="text-muted text-sm">{meta}</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        <button onClick={prev} aria-label="Previous slide" className="text-white/70 hover:text-white text-2xl leading-none">‹</button>
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
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
        <button onClick={next} aria-label="Next slide" className="text-white/70 hover:text-white text-2xl leading-none">›</button>
      </div>
    </div>
  )
}
