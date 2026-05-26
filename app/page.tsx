import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import { limitByAuthor, pickEditorItems } from '@/lib/dedup'
import type { Article, Podcast } from '@/types/content'
import HeroCarousel from '@/components/HeroCarousel'
import ContentGrid from '@/components/ContentGrid'
import EditorsPick from '@/components/EditorsPick'
import TopContent from '@/components/TopContent'
import AdSlot from '@/components/AdSlot'
import DiamondAuthoritySection from '@/components/DiamondAuthoritySection'

export const metadata: Metadata = {
  title: { absolute: 'Hospitality121 - Hotel Tech News, Insights & Podcasts 2026' },
  description: 'Hospitality121 covers hotel technology news, industry insights, hospitality podcasts, AI in hotels, revenue management, sustainability, and guest experience innovation.',
  alternates: { canonical: 'https://hospitality121.com' },
}

export const revalidate = 3600

function isGeneratedPost(item: { type: string; sourceUrl?: string; author?: string }) {
  return (item.type === 'blog' || item.type === 'news') && (!!item.sourceUrl || item.author === 'H1H Newsfeed')
}

export default function HomePage() {
  const all = getAllContent()
  const editorial     = all.filter(item => item.type !== 'event')
  const generatedHero = editorial.filter(isGeneratedPost)
  const heroItems     = [
    ...generatedHero,
    ...limitByAuthor(editorial.filter(item => !isGeneratedPost(item)), 2),
  ].filter((item, index, items) => items.findIndex(candidate => candidate.slug === item.slug) === index).slice(0, 10)
  const heroSlugs     = new Set(heroItems.map(item => item.slug))
  const gridItems     = limitByAuthor(editorial.filter(item => !heroSlugs.has(item.slug)), 2).slice(0, 10)
  const featuredItems = pickEditorItems(all.filter(item => item.featured), 10)
  const articles      = all.filter((item): item is Article => item.type === 'article')
  const podcasts      = all.filter((item): item is Podcast => item.type === 'podcast')

  return (
    <>
      {/* Hidden Netlify forms */}
      <form name="newsletter" data-netlify="true" hidden>
        <input type="email" name="email" />
      </form>
      <form name="resource-download" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="company" />
        <input type="text" name="role" />
        <input type="text" name="report" />
      </form>

      <h1 className="sr-only">Hospitality Technology News & Insights</h1>
      <HeroCarousel items={heroItems} />
      <DiamondAuthoritySection />
      <AdSlot zone="hero-banner" />
      <ContentGrid items={gridItems} />
      <AdSlot zone="mid-grid" />
      <EditorsPick items={featuredItems} />
      <TopContent articles={articles} podcasts={podcasts} />
      <AdSlot zone="footer-banner" />
    </>
  )
}
