import { getAllContent } from '@/lib/content'
import type { Article, Podcast } from '@/types/content'
import HeroCarousel from '@/components/HeroCarousel'
import ContentGrid from '@/components/ContentGrid'
import EditorsPick from '@/components/EditorsPick'
import TopContent from '@/components/TopContent'
import AdSlot from '@/components/AdSlot'
import NewsletterPopup from '@/components/NewsletterPopup'

export const revalidate = 3600

export default function HomePage() {
  const all = getAllContent()
  const heroItems     = all.slice(0, 4)
  const gridItems     = all.slice(4, 8)
  const featuredItems = all.filter(item => item.featured)
  const articles      = all.filter((item): item is Article => item.type === 'article')
  const podcasts      = all.filter((item): item is Podcast => item.type === 'podcast')

  return (
    <>
      {/* Hidden Netlify form for newsletter popup submissions */}
      <form name="newsletter" data-netlify="true" hidden>
        <input type="email" name="email" />
      </form>

      <NewsletterPopup />
      <AdSlot zone="hero-banner" />
      <HeroCarousel items={heroItems} />
      <ContentGrid items={gridItems} />
      <AdSlot zone="mid-grid" />
      <EditorsPick items={featuredItems} />
      <TopContent articles={articles} podcasts={podcasts} />
      <AdSlot zone="footer-banner" />
    </>
  )
}
