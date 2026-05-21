import type { Metadata } from 'next'
import { Lato, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import CookieBanner from '@/components/CookieBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-lato' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-cormorant' })

export const metadata: Metadata = {
  metadataBase: new URL('https://hospitality121.com'),
  title: {
    template: '%s | Hospitality121',
    default: 'Hospitality121 — Hotel Tech News, Insights & Podcasts',
  },
  description: 'Hospitality121 covers AI, hotel technology, guest experience, revenue management, sustainability, and leadership for hospitality professionals worldwide.',
  openGraph: {
    siteName: 'Hospitality121',
    type: 'website',
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
  url: 'https://hospitality121.com',
  logo: 'https://hospitality121.com/images/Logo.png',
  description: 'Premium hospitality media platform covering AI, hotel technology, guest experience, revenue management, sustainability, and leadership.',
  sameAs: [
    'https://linkedin.com/company/hospitality121',
    'https://x.com/hospitality121',
    'https://instagram.com/hospitality121',
  ],
  contactPoint: { '@type': 'ContactPoint', email: 'contact@hospitality121.com', contactType: 'editorial' },
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-navy font-sans">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <GoogleAnalytics />
          <NewsletterPopup />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}
