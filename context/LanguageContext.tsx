'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Locale, type Translations } from '@/lib/translations'

type LanguageCtx = {
  locale: Locale
  t: Translations
  setLocale: (l: Locale) => void
}

const LanguageContext = createContext<LanguageCtx>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('h1h_locale') as Locale | null
    if (saved === 'en' || saved === 'fr') {
      queueMicrotask(() => setLocaleState(saved))
    }
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('h1h_locale', l)
  }

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale] as Translations, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
