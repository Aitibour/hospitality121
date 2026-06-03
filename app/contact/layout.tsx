import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'Contact',
  description: 'Get in touch with the Hospitality121 editorial and commercial team. We welcome press enquiries, content partnerships, and reader feedback.',
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
