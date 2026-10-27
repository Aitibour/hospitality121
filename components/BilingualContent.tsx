'use client'

import { useLanguage } from '@/context/LanguageContext'
import type { ReactNode } from 'react'

type Props = {
  titleEn: string
  titleFr?: string
  htmlEn: string
  htmlFr?: string
  children?: ReactNode
}

export default function BilingualContent({ titleEn, titleFr, htmlEn, htmlFr, children }: Props) {
  const { locale } = useLanguage()
  const hasTranslation = !!titleFr && !!htmlFr
  const isFr = locale === 'fr' && hasTranslation
  return (
    <>
      <h1 lang={isFr ? 'fr' : 'en'} className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 break-words">{isFr ? titleFr : titleEn}</h1>
      {locale === 'fr' && !hasTranslation && <p lang="fr" className="text-sm text-muted mb-4">Cet article est disponible en anglais uniquement.</p>}
      {children}
      <div lang={isFr ? 'fr' : 'en'} className="prose prose-lg max-w-none prose-a:text-gold prose-headings:font-serif overflow-x-auto" dangerouslySetInnerHTML={{ __html: isFr ? htmlFr! : htmlEn }} />
    </>
  )
}
