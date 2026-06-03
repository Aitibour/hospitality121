import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/seo-metadata'

export const metadata: Metadata = buildStaticMetadata({
  title: 'Subscribe',
  description: 'Subscribe to the Hospitality121 newsletter for weekly hospitality insights, podcast episodes, industry news, and event highlights delivered to your inbox.',
  path: '/subscribe',
})

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
