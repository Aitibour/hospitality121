'use client'

import { useLanguage } from '@/context/LanguageContext'
import type { ReactNode } from 'react'

type Props = {
  titleEn: string
  titleFr?: string
  htmlEn: string
  htmlFr?: string
  children?: ReactNode
  bodyInsert?: ReactNode
  bodyInsertBefore?: string
}

export default function BilingualContent({ titleEn, titleFr, htmlEn, htmlFr, children, bodyInsert, bodyInsertBefore }: Props) {
  const { locale } = useLanguage()
  const hasTranslation = !!titleFr && !!htmlFr
  const isFr = locale === 'fr' && hasTranslation
  const html = isFr ? htmlFr! : htmlEn
  const insertIndex = bodyInsert && bodyInsertBefore ? html.indexOf(bodyInsertBefore) : -1
  const proseClass = 'prose prose-lg max-w-none prose-a:text-gold prose-headings:font-serif overflow-x-auto'
  return (
    <>
      <h1 lang={isFr ? 'fr' : 'en'} className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 break-words">{isFr ? titleFr : titleEn}</h1>
      {locale === 'fr' && !hasTranslation && <p lang="fr" className="text-sm text-muted mb-4">Cet article est disponible en anglais uniquement.</p>}
      {children}
      {insertIndex >= 0 ? <>
        <div lang={isFr ? 'fr' : 'en'} className={proseClass} dangerouslySetInnerHTML={{ __html: html.slice(0, insertIndex) }} />
        {bodyInsert}
        <div lang={isFr ? 'fr' : 'en'} className={proseClass} dangerouslySetInnerHTML={{ __html: html.slice(insertIndex) }} />
      </> : <div lang={isFr ? 'fr' : 'en'} className={proseClass} dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  )
}
