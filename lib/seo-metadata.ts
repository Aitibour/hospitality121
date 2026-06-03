import type { Metadata } from 'next'

const BASE_URL = 'https://hospitality121.com'
const DEFAULT_IMAGE = `${BASE_URL}/images/linkedin-banner.jpg`

type StaticMetadataInput = {
  title: string
  description: string
  path: `/${string}`
}

export function buildStaticMetadata({ title, description, path }: StaticMetadataInput): Metadata {
  const url = path === '/' ? BASE_URL : `${BASE_URL}${path}`
  const socialTitle = title.includes('Hospitality121') ? title : `${title} | Hospitality121`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: 'Hospitality121',
      type: 'website',
      images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [DEFAULT_IMAGE],
    },
  }
}
