import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Hospitality121 editorial and commercial team. We welcome press enquiries, content partnerships, and reader feedback.',
  alternates: { canonical: 'https://hospitality121.com/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
