export type CategorySlug = 'ai' | 'technology' | 'guest-experience' | 'cybersecurity' | 'leadership'

export const CATEGORIES: Record<CategorySlug, {
  display: string
  description: string
  keywords: string
  matchTerms: string[]
}> = {
  ai: {
    display: 'AI in Hospitality',
    description: 'How artificial intelligence and machine learning are reshaping guest experiences, hotel operations, and the future of hospitality.',
    keywords: 'AI in hospitality, artificial intelligence hotels, machine learning hospitality',
    matchTerms: ['AI', 'ARTIFICIAL INTELLIGENCE'],
  },
  technology: {
    display: 'Hospitality Technology',
    description: 'Hotel technology trends, PMS evolution, digital infrastructure, and the tech platforms driving hospitality forward.',
    keywords: 'hospitality technology, hotel technology trends, hotel IT, hotel tech',
    matchTerms: ['TECH', 'TECHNOLOGY', 'INNOVATION', 'DIGITAL'],
  },
  'guest-experience': {
    display: 'Guest Experience',
    description: 'Digital guest journeys, personalization, wellness, loyalty, and the balance between technology and human hospitality.',
    keywords: 'guest experience innovation, hotel guest experience, luxury hospitality, hotel wellness',
    matchTerms: ['WELLNESS', 'LUXURY', 'LOYALTY', 'TRENDS', 'SUSTAINABILITY', 'GUEST EXPERIENCE'],
  },
  cybersecurity: {
    display: 'Hospitality Cybersecurity',
    description: 'Data protection, cyber threats, compliance, and best practices for securing hotel operations and guest data.',
    keywords: 'hotel cybersecurity, hospitality data protection, hotel cyber threats',
    matchTerms: ['CYBERSECURITY', 'SECURITY', 'DATA PROTECTION'],
  },
  leadership: {
    display: 'Leadership & Innovation',
    description: 'The new role of hospitality technology leaders, innovation culture, and driving digital transformation in hotels.',
    keywords: 'hospitality leadership, hotel innovation, hospitality digital transformation',
    matchTerms: ['LEADERSHIP', 'STRATEGY', 'MANAGEMENT'],
  },
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES[slug as CategorySlug] ?? null
}

export function getCategorySlugForTerm(term: string): CategorySlug | null {
  const upper = term.toUpperCase()
  for (const [slug, cat] of Object.entries(CATEGORIES)) {
    if (cat.matchTerms.includes(upper)) return slug as CategorySlug
  }
  return null
}
