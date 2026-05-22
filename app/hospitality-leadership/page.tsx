import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import { getDiamondPillarBySlug } from '@/lib/diamond-seo'
import DiamondPillarPage from '@/components/DiamondPillarPage'

const pillar = getDiamondPillarBySlug('hospitality-leadership')!

export const metadata: Metadata = {
  title: `${pillar.title} | Hospitality121`,
  description: pillar.description,
  keywords: pillar.keywords,
  alternates: { canonical: pillar.canonical },
}

export default function HospitalityLeadershipPage() {
  const items = getAllContent().filter(item => pillar.matchTerms.some(term => item.category.toUpperCase().includes(term) || item.title.toUpperCase().includes(term)))
  return <DiamondPillarPage pillar={pillar} items={items} />
}
