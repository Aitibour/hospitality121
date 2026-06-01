'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Fuse from 'fuse.js'

type SearchItem = {
  slug: string
  title: string
  category: string
  type: string
  date: string
  image: string
  author: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then((data: SearchItem[]) => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['title', 'category', 'author', 'type'],
    threshold: 0.35,
    includeScore: true,
  }), [items])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).map(r => r.item)
  }, [query, fuse])

  const typeLabel: Record<string, string> = {
    article: 'ARTICLE',
    news: 'NEWS',
    podcast: 'PODCAST',
    event: 'EVENT',
    blog: 'BLOG',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold mb-8">Search</h1>

      <div className="relative mb-10">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="search"
          autoFocus
          placeholder="Search articles, podcasts, events…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-surface border border-muted/30 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-colors"
        />
      </div>

      {loading && (
        <p className="text-muted text-center py-12">Loading…</p>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-2">No results for <strong>&ldquo;{query}&rdquo;</strong></p>
          <p className="text-muted text-sm">Try different keywords or browse by category.</p>
        </div>
      )}

      {!loading && !query.trim() && (
        <div className="text-center py-16 text-muted">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <p>Start typing to search across all content</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted mb-2">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
          {results.map(item => (
            <Link
              key={item.slug}
              href={`/content/${item.slug}`}
              className="flex gap-4 group bg-surface rounded-lg p-4 hover:ring-1 hover:ring-gold/40 transition"
            >
              <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gold tracking-widest">{item.category}</span>
                  <span className="text-xs text-muted border border-muted/30 rounded px-1.5 py-0.5">{typeLabel[item.type] || item.type}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-gold transition-colors line-clamp-2">
                  {item.title}
                </span>
                {item.author && (
                  <span className="text-xs text-muted">{item.author}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
