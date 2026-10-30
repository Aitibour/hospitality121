export type Author = {
  name: string
  slug: string
  title: string
  bio: string
  photo: string
  linkedin?: string
  x?: string
}

const AUTHORS: Author[] = [
  {
    name: 'Abdellah Ait Ibour',
    slug: 'abdellah-ait-ibour',
    title: 'Hospitality Technology Contributor',
    photo: '/images/authors/abdellah-ait-ibour.svg',
    bio: 'Abdellah Ait Ibour writes about hospitality technology, AI and the operational decisions that shape the guest experience.',
    linkedin: 'https://www.linkedin.com/in/abdellah-ait-ibour',
    x: 'https://x.com/AbdellahAi16209',
  },
  {
    name: 'Sumaya Oneill',
    slug: 'sumaya-oneill',
    title: 'Senior Technology Editor',
    photo: '/images/authors/sumaya-oneill.jpg',
    bio: 'Sumaya Oneill covers AI, digital transformation, and guest experience innovation for Hospitality121. With a background spanning hotel operations and enterprise technology, she brings a practitioner\'s perspective to the intersection of hospitality and emerging technology.',
  },
  {
    name: 'Marcus Webb',
    slug: 'marcus-webb',
    title: 'Revenue & Strategy Correspondent',
    photo: '/images/authors/marcus-webb.jpg',
    bio: 'Marcus Webb writes on hotel revenue management, distribution strategy, and the commercial pressures shaping the modern hospitality landscape. He has reported from industry events across Europe, the Middle East, and Asia Pacific.',
  },
  {
    name: 'Claire Fontaine',
    slug: 'claire-fontaine',
    title: 'Luxury & Guest Experience Writer',
    photo: '/images/authors/claire-fontaine.jpg',
    bio: 'Claire Fontaine specialises in luxury hospitality, wellness, and the evolving definition of guest experience at the upper end of the market. Her writing draws on extensive access to flagship properties across Europe and Asia.',
  },
  {
    name: 'Elena Marchetti',
    slug: 'elena-marchetti',
    title: 'Sustainability & Operations Reporter',
    photo: '/images/authors/elena-marchetti.jpg',
    bio: 'Elena Marchetti covers sustainable hospitality, food and beverage innovation, and the operational shifts reshaping hotel management. Based in Milan, she tracks developments across Southern Europe and the Mediterranean.',
  },
  {
    name: 'David Okafor',
    slug: 'david-okafor',
    title: 'Investment & Development Editor',
    photo: '/images/authors/david-okafor.jpg',
    bio: 'David Okafor reports on hotel investment, brand expansion, and the capital flows driving new development across Africa, the Middle East, and emerging markets. He brings a finance background to hospitality industry analysis.',
  },
  {
    name: 'James Oduya',
    slug: 'james-oduya',
    title: 'Technology & Innovation Writer',
    photo: '/images/authors/james-oduya.jpg',
    bio: 'James Oduya writes on hospitality technology, property management systems, and the startups building the next generation of hotel infrastructure. He covers the EMEA market with a focus on independent and boutique operators.',
  },
  {
    name: 'Jeremy Curry',
    slug: 'jeremy-curry',
    title: 'Leadership & Culture Correspondent',
    photo: '/images/authors/jeremy-curry.jpg',
    bio: 'Jeremy Curry covers hospitality leadership, talent strategy, and organisational culture. His reporting focuses on how the industry is navigating workforce transformation and the new expectations of both employees and guests.',
  },
  {
    name: 'Sophie Laurent',
    slug: 'sophie-laurent',
    title: 'Events & Lifestyle Editor',
    photo: '/images/authors/sophie-laurent.jpg',
    bio: 'Sophie Laurent writes on hospitality events, food and beverage trends, and the lifestyle dimensions of the modern hotel experience. She contributes across the Insights, Blog, and Events sections of Hospitality121.',
  },
  {
    name: 'Samia Moore',
    slug: 'samia-moore',
    title: 'Events & Guest Experience Writer',
    photo: '/images/authors/samia-moore.jpg',
    bio: 'Samia Moore covers hospitality events, experiential design, and the post-pandemic reinvention of the industry gathering. She brings fifteen years of event production experience to her editorial work.',
  },
  {
    name: 'Diane Lara',
    slug: 'diane-lara',
    title: 'Construction & Development Writer',
    photo: '/images/authors/diane-lara.jpg',
    bio: 'Diane Lara reports on luxury hotel construction, architecture, and the design decisions shaping the next generation of flagship properties. Her work spans development projects across four continents.',
  },
  {
    name: 'Maria Chen',
    slug: 'maria-chen',
    title: 'Asia Pacific Correspondent',
    photo: '/images/authors/maria-chen.jpg',
    bio: 'Maria Chen covers hospitality developments across Asia Pacific, with a focus on luxury, branded residences, and the fast-evolving Chinese outbound travel market.',
  },
  {
    name: 'H1H Editorial',
    slug: 'h1h-editorial',
    title: 'Hospitality121 Editorial Team',
    photo: 'https://ui-avatars.com/api/?name=H1H&background=B8922E&color=ffffff&rounded=true&size=100',
    bio: 'The Hospitality121 editorial team produces news analysis, industry briefings, and original reporting on the trends and developments shaping the global hospitality sector.',
  },
  {
    name: 'H1H Newsfeed',
    slug: 'h1h-newsfeed',
    title: 'Hospitality121 News Desk',
    photo: '/images/Logo.png',
    bio: 'The Hospitality121 News Desk monitors hotel brands, hospitality technology, operations, leadership, investment, events, and travel-market signals for timely editorial briefings.',
  },
  {
    name: 'Hospitality121',
    slug: 'hospitality121',
    title: 'Hospitality121 Editorial Team',
    photo: '/images/Logo.png',
    bio: 'The Hospitality121 editorial team produces news analysis, industry briefings, and original reporting on the trends and developments shaping the global hospitality sector.',
  },
]

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(a => a.slug === slug)
}

export const AUTHORS_BY_NAME: Record<string, Author> = Object.fromEntries(
  AUTHORS.map(a => [a.name, a])
)

export function getAllAuthors(): Author[] {
  return AUTHORS
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
