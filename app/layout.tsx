import type { Metadata } from 'next'
import { Lato, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DeferredClientWidgets from '@/components/DeferredClientWidgets'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-lato' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-cormorant' })
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const metadata: Metadata = {
  metadataBase: new URL('https://hospitality121.com'),
  title: {
    template: '%s | Hospitality121',
    default: 'Hospitality121 — Hotel Tech News, Insights & Podcasts',
  },
  description: 'North American hospitality media platform based in Vancouver, BC — covering AI, hotel technology, guest experience, revenue management, and sustainability for professionals across the US, Canada, and globally.',
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

const WEBSITE_SCHEMA = JSON.stringify({
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

const ORG_SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hospitality121',
  alternateName: 'Hospitality One 2 One',
  url: 'https://hospitality121.com',
  logo: 'https://hospitality121.com/images/Logo.png',
  description: 'North American hospitality media platform headquartered in Vancouver, BC, covering AI, hotel technology, guest experience, revenue management, sustainability, and leadership for a global audience.',
  foundingLocation: 'Vancouver, British Columbia, Canada',
  areaServed: ['US', 'CA', 'GB', 'AU', 'Global'],
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
  contactPoint: [
    { '@type': 'ContactPoint', email: 'contact@hospitality121.com', contactType: 'customer support' },
    { '@type': 'ContactPoint', email: 'editorial@hospitality121.com', contactType: 'editorial' },
  ],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_SCHEMA }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_SCHEMA }} />
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="bg-navy font-sans">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <DeferredClientWidgets />
        </LanguageProvider>
      </body>
    </html>
  )
}
