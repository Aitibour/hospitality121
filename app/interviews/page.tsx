import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: 'Interviews',
  description: 'In-depth conversations with hotel CIOs, IT directors, startup founders, luxury executives, and the innovators reshaping the future of hospitality.',
  keywords: 'hospitality interviews, hotel CIO interview, hospitality technology leaders, hotel innovation',
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
