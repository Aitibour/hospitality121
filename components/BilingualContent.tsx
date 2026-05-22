'use client'

import { useLanguage } from '@/context/LanguageContext'
import type { ReactNode } from 'react'

type Props = {
  titleEn: string
  titleFr?: string
  bodyEn: string
  bodyFr?: string
}

export default function BilingualContent({ titleEn, titleFr, bodyEn, bodyFr }: Props) {
  const { locale } = useLanguage()
  const isFr = locale === 'fr' && !!titleFr

  const title = isFr ? titleFr! : titleEn
  const body = isFr && bodyFr ? bodyFr : bodyEn

  const paragraphs = body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <>
      <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">{title}</h1>
      {paragraphs.length > 0 ? (
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((para, i) => renderBlock(para, i))}
        </div>
      ) : (
        <p className="text-muted italic">Full article coming soon.</p>
      )}
    </>
  )
}

function renderBlock(block: string, key: number) {
  if (block.startsWith('## ')) {
    return (
      <h2 key={key} className="font-serif text-2xl font-bold mt-10 mb-4 text-gray-900">
        {renderInlineLinks(block.replace(/^##\s+/, ''))}
      </h2>
    )
  }

  if (block.startsWith('### ')) {
    return (
      <h3 key={key} className="font-serif text-xl font-bold mt-8 mb-3 text-gray-900">
        {renderInlineLinks(block.replace(/^###\s+/, ''))}
      </h3>
    )
  }

  const listItems = block
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))

  if (listItems.length > 0 && listItems.length === block.split('\n').filter(Boolean).length) {
    return (
      <ul key={key} className="mb-6 flex flex-col gap-2">
        {listItems.map((line, index) => (
          <li key={index} className="text-base leading-relaxed text-gray-700">
            {renderInlineLinks(line.replace(/^-\s+/, ''))}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p key={key} className="mb-5 text-base leading-relaxed text-gray-700">
      {renderInlineLinks(block)}
    </p>
  )
}

function renderInlineLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const [, label, href] = match
    const isExternal = href.startsWith('http') && !href.includes('hospitality121.com')
    parts.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        className="font-semibold text-gold hover:underline"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    )
    lastIndex = linkPattern.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}
