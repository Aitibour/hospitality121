import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Subscribe to the Hospitality121 newsletter for weekly hospitality insights, podcast episodes, industry news, and event highlights delivered to your inbox.',
  alternates: { canonical: 'https://hospitality121.com/subscribe' },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
