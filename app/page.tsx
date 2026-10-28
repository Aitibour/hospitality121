import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import { limitByAuthor, pickEditorItems } from '@/lib/dedup'
import type { Article, Podcast } from '@/types/content'
import DailyHero from '@/components/DailyHero'
import { selectPublishedHeroItems } from '@/scripts/lib/published-hero.mjs'
import ContentGrid from '@/components/ContentGrid'
import EditorsPick from '@/components/EditorsPick'
import TopContent from '@/components/TopContent'
import AdSlot from '@/components/AdSlot'
import DiamondAuthoritySection from '@/components/DiamondAuthoritySection'
import { createHomeSelection } from '@/lib/home-selection'

export const metadata: Metadata = {
  title: { absolute: 'Hospitality121 - Hotel Tech News, Insights & Podcasts 2026' },
  description: 'Hospitality121 covers hotel technology news, industry insights, hospitality podcasts, AI in hotels, revenue management, sustainability, and guest experience innovation.',
  alternates: { canonical: 'https://hospitality121.com' },
}

export const revalidate = 3600

function isGeneratedPost(item: { type: string; sourceUrl?: string; author?: string }) {
  return (item.type === 'blog' || item.type === 'news') && (!!item.sourceUrl || item.author === 'H1H Newsfeed')
}

export default async function HomePage() {
  const all = getAllContent()
  const select = createHomeSelection()
  const editorial     = all.filter(item => item.type !== 'event')
  const heroItems = select(selectPublishedHeroItems(all), 8)
  const initialFeed = { updatedAt: new Date().toISOString(), items: selectPublishedHeroItems(all) }
  const heroSlugs     = new Set(heroItems.map(item => item.slug))
  const gridItems     = select(limitByAuthor(editorial.filter(item => !heroSlugs.has(item.slug)), 2), 10)
  const generatedItems = select(editorial.filter(isGeneratedPost), 8)
  const featuredItems = select(pickEditorItems(all.filter(item => item.featured), 10), 10)
  const articles      = select(all.filter((item): item is Article => item.type === 'article'), 5)
  const podcasts      = select(all.filter((item): item is Podcast => item.type === 'podcast'), 5)

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
      <DailyHero initialFeed={initialFeed} fallbackItems={heroItems} />
      <AdSlot zone="hero-banner" />
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <ContentGrid items={gridItems} contained={false} />
        <div className="py-8">
          <DiamondAuthoritySection items={generatedItems} />
        </div>
      </div>
      <AdSlot zone="mid-grid" />
      <EditorsPick items={featuredItems} />
      <TopContent articles={articles} podcasts={podcasts} />
      <AdSlot zone="footer-banner" />
    </>
  )
}
