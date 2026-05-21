import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: 'Interviews',
  alternates: { canonical: 'https://hospitality121.com/interviews' },
  description: 'In-depth conversations with hotel CIOs, IT directors, startup founders, luxury executives, and the innovators reshaping the future of hospitality.',
  keywords: 'hospitality interviews, hotel CIO interview, hospitality technology leaders, hotel innovation',
  openGraph: {
    title: 'Hospitality Interviews | Hospitality121',
    description: 'In-depth conversations with hotel CIOs, IT directors, startup founders, luxury executives, and the innovators reshaping the future of hospitality.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://hospitality121.com/images/linkedin-banner.jpg'] },
}

export const revalidate = 3600

export default function InterviewsPage() {
  const items = getAllContent().filter(item => item.category === 'INTERVIEW')
  return (
    <>
      <SectionHeader sectionKey="interviews" count={items.length} />
      <ContentGrid items={items} />
    </>
  )
}
