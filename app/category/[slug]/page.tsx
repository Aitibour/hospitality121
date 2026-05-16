import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllContent } from '@/lib/content'
import { getCategoryBySlug, CATEGORIES, type CategorySlug } from '@/lib/categories'
import ContentGrid from '@/components/ContentGrid'
import SectionHeader from '@/components/SectionHeader'

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.display,
    description: category.description,
    keywords: category.keywords,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const items = getAllContent().filter(item =>
    category.matchTerms.includes(item.category.toUpperCase())
  )

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Category</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-3">
          {category.display}
        </h1>
        <p className="text-muted max-w-2xl">{category.description}</p>
        <p className="text-muted text-sm mt-2">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
      </div>
      {items.length > 0 ? (
        <ContentGrid items={items} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted">
          No content in this category yet.
        </div>
      )}
    </>
  )
}
