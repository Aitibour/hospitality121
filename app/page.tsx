import { getAllContent } from '@/lib/content'
import HeroCarousel from '@/components/HeroCarousel'
import ContentGrid from '@/components/ContentGrid'
import EditorsPick from '@/components/EditorsPick'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

export default function HomePage() {
  const all = getAllContent()
  const heroItems     = all.slice(0, 4)
  const gridItems     = all.slice(4, 8)
  const featuredItems = all.filter(item => item.featured)

  return (
    <>
      <AdSlot zone="hero-banner" />
      <HeroCarousel items={heroItems} />
      <ContentGrid items={gridItems} />
      <AdSlot zone="mid-grid" />
      <EditorsPick items={featuredItems} />
      <AdSlot zone="footer-banner" />
    </>
  )
}
