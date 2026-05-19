'use client'

import { useLanguage } from '@/context/LanguageContext'

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
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-5 text-base leading-relaxed text-white/85">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted italic">Full article coming soon.</p>
      )}
    </>
  )
}
