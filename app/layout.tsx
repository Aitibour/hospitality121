import type { Metadata } from 'next'
import { Lato, Cormorant_Garamond } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DeferredClientWidgets from '@/components/DeferredClientWidgets'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-cormorant' })
function safeJsonLd(obj: Record<string, unknown>) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export const metadata: Metadata = {
  metadataBase: new URL('https://hospitality121.com'),
  title: {
    template: '%s | Hospitality121',
    default: 'Hospitality121 - Hospitality News, Insights & Podcasts',
  },
  description: 'Hospitality121 is a hospitality media platform based in Vancouver, Canada, covering hospitality leadership, news, events, podcasts, technology, sustainability, guest experience, operations, recruitment, and luxury hospitality for a global audience.',
  openGraph: {
    siteName: 'Hospitality121',
    type: 'website',
    locale: 'en_CA',
    countryName: 'Canada',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://hospitality121.com/images/linkedin-banner.jpg'],
  },
  verification: {
    other: {
      'msvalidate.01': ['154F902EAA6D160F90470909922EAFBD'],
    },
  },
}

const WEBSITE_SCHEMA = safeJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hospitality121',
  url: 'https://hospitality121.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://hospitality121.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
})

const ORG_SCHEMA = safeJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hospitality121',
  alternateName: 'Hospitality One 2 One',
  url: 'https://hospitality121.com',
  logo: 'https://hospitality121.com/images/Logo.png',
  description: 'Hospitality media platform based in Vancouver, Canada, covering hospitality leadership, news, events, podcasts, technology, sustainability, guest experience, operations, recruitment, and luxury hospitality for a global audience.',
  areaServed: ['US', 'CA', 'GB', 'AU', 'EU', 'Global'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vancouver',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://linkedin.com/company/hospitality121',
    'https://x.com/hospitality121',
    'https://instagram.com/hospitality121',
  ],
  knowsAbout: [
    'Hospitality technology',
    'AI in hospitality',
    'Hotel operations',
    'Guest experience',
    'Hospitality leadership',
    'Hospitality recruitment',
    'Sustainable hospitality',
    'Luxury hospitality',
  ],
  publishingPrinciples: 'https://hospitality121.com/editorial-standards',
  subjectOf: [
    'https://hospitality121.com/ai-index.json',
    'https://hospitality121.com/seo-diamond.json',
  ],
  contactPoint: [
    { '@type': 'ContactPoint', email: 'contact@hospitality121.com', contactType: 'customer support' },
    { '@type': 'ContactPoint', email: 'editorial@hospitality121.com', contactType: 'editorial' },
  ],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${cormorant.variable}`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Hospitality121 AI discovery summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Hospitality121 full AI discovery index" />
        <link rel="alternate" type="application/json" href="/ai-index.json" title="Hospitality121 structured AI index" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Hospitality121 RSS feed" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_SCHEMA }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_SCHEMA }} />
      </head>
      <body className="bg-navy font-sans">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <DeferredClientWidgets />
        </LanguageProvider>
      </body>
    </html>
  )
}
