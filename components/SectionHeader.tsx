'use client'

import { useLanguage } from '@/context/LanguageContext'
import type { Locale } from '@/lib/translations'

type SectionKey = 'insights' | 'podcasts' | 'news' | 'events' | 'blog' | 'interviews'

type Props = {
  sectionKey: SectionKey
  count: number
}

export default function SectionHeader({ sectionKey, count }: Props) {
  const { t } = useLanguage()
  const s = t.sections[sectionKey]
  const noun = 'pluralNoun' in s && count !== 1 ? (s as { pluralNoun: string }).pluralNoun : count !== 1 ? `${s.noun}s` : s.noun

  return (
    <div className="bg-surface border-b border-muted/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">{s.title}</h1>
        <p className="text-muted max-w-xl text-base">{s.description}</p>
        <p className="text-gold text-sm font-medium mt-4">{count} {noun}</p>
      </div>
    </div>
  )
}
