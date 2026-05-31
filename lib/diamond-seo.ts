export type DiamondPillar = {
  slug: string
  title: string
  eyebrow: string
  description: string
  keywords: string
  href: string
  canonical: string
  matchTerms: string[]
  clusters: { title: string; description: string; keywords: string[] }[]
}

export type GeoAuthorityPage = {
  slug: string
  title: string
  region: string
  description: string
  keywords: string
  href: string
  canonical: string
  matchTerms: string[]
}

const BASE = 'https://hospitality121.com'

export const DIAMOND_PILLARS: DiamondPillar[] = [
  {
    slug: 'hotel-technology',
    title: 'Hotel Technology',
    eyebrow: 'Technology',
    href: '/technology',
    canonical: `${BASE}/technology`,
    description: 'Hotel technology, hospitality innovation, PMS systems, cybersecurity, smart hotels, and the platforms modernizing hotel operations.',
    keywords: 'hotel technology, hospitality technology, hotel IT, hotel innovation, hotel tech solutions',
    matchTerms: ['TECHNOLOGY', 'TECH', 'DIGITAL', 'INNOVATION', 'PMS', 'POS', 'CYBERSECURITY', 'SMART HOTEL'],
    clusters: [
      { title: 'AI in Hotels', description: 'Artificial intelligence across hotel revenue, operations, guest service, and marketing.', keywords: ['AI in hotels', 'hospitality AI'] },
      { title: 'PMS Systems', description: 'Cloud PMS, POS integrations, booking engines, and property management platforms.', keywords: ['hotel PMS', 'cloud PMS'] },
      { title: 'Hotel Cybersecurity', description: 'PCI DSS, guest data privacy, incident response, and hotel technology risk.', keywords: ['hotel cybersecurity', 'PCI DSS hotels'] },
      { title: 'Smart Hotels', description: 'IoT rooms, mobile keys, connected guest journeys, and intelligent hotel operations.', keywords: ['smart hotel technology', 'IoT hotels'] },
    ],
  },
  {
    slug: 'hospitality-ai',
    title: 'Hospitality AI',
    eyebrow: 'AI',
    href: '/technology/ai',
    canonical: `${BASE}/technology/ai`,
    description: 'AI in hospitality, hotel automation, AI guest experience, revenue forecasting, concierge systems, and operational intelligence.',
    keywords: 'AI hospitality, AI hotels, hotel automation, AI guest experience, AI hotel operations',
    matchTerms: ['AI', 'ARTIFICIAL INTELLIGENCE', 'MACHINE LEARNING', 'AUTOMATION', 'CHATBOT', 'CONCIERGE'],
    clusters: [
      { title: 'AI Hotel Operations', description: 'How AI supports staffing, maintenance, housekeeping, forecasting, and daily hotel decisions.', keywords: ['AI hotel operations', 'hotel automation'] },
      { title: 'AI Concierge', description: 'Conversational AI, messaging, and guest support systems in hotels.', keywords: ['AI concierge', 'AI guest support'] },
      { title: 'AI Revenue Management', description: 'Forecasting, pricing, market signals, and commercial intelligence for hotel revenue teams.', keywords: ['AI revenue management', 'AI pricing hotels'] },
      { title: 'AI Housekeeping', description: 'Task routing, room readiness prediction, and operational planning for housekeeping teams.', keywords: ['AI housekeeping', 'hotel operations AI'] },
    ],
  },
  {
    slug: 'hospitality-leadership',
    title: 'Hospitality Leadership',
    eyebrow: 'Leadership',
    href: '/hospitality-leadership',
    canonical: `${BASE}/hospitality-leadership`,
    description: 'Hospitality leadership, hotel executives, management strategy, workforce culture, and the future of hotel decision-making.',
    keywords: 'hospitality leadership, hotel leadership, hospitality management, hotel executives, hotel management strategy',
    matchTerms: ['LEADERSHIP', 'CEO', 'EXECUTIVE', 'MANAGEMENT', 'CULTURE', 'STRATEGY', 'TALENT'],
    clusters: [
      { title: 'Leadership in Luxury Hospitality', description: 'How luxury hotel leaders build service cultures, brand standards, and resilient teams.', keywords: ['luxury hospitality leadership', 'hotel executives'] },
      { title: 'How Hotel Leaders Use AI', description: 'Practical ways general managers and ownership groups apply AI to operations and guest strategy.', keywords: ['AI hotel leadership', 'hotel management AI'] },
      { title: 'Hospitality Leadership Trends', description: 'The leadership models, skills, and commercial priorities shaping hospitality in 2026.', keywords: ['hospitality leadership trends', 'hotel leadership 2026'] },
      { title: 'Leadership Skills for Hotel Managers', description: 'People management, service recovery, data literacy, and operational judgement for modern hotel managers.', keywords: ['hotel manager skills', 'hospitality management'] },
    ],
  },
  {
    slug: 'guest-experience',
    title: 'Guest Experience',
    eyebrow: 'Experience',
    href: '/guest-experience',
    canonical: `${BASE}/guest-experience`,
    description: 'Hotel guest experience, digital guest journeys, personalization, loyalty, wellness, and the balance between technology and human service.',
    keywords: 'guest experience, hotel personalization, digital guest journey, hotel loyalty, luxury guest experience',
    matchTerms: ['GUEST EXPERIENCE', 'LOYALTY', 'LUXURY', 'WELLNESS', 'PERSONALISATION', 'PERSONALIZATION', 'CONCIERGE'],
    clusters: [
      { title: 'AI Guest Personalization', description: 'How AI uses stay history, preference data, and context to tailor hotel experiences.', keywords: ['AI guest personalization', 'hotel personalization'] },
      { title: 'Contactless Check-in', description: 'Mobile check-in, digital identity, mobile key, and the new arrival experience.', keywords: ['contactless check-in', 'mobile key hotel'] },
      { title: 'Guest Mobile Apps', description: 'What guests expect from hotel apps, from messaging to upsells and loyalty integration.', keywords: ['hotel guest app', 'digital guest journey'] },
      { title: 'Digital Concierge Systems', description: 'The role of conversational AI, messaging, and local recommendations in modern guest service.', keywords: ['digital concierge', 'AI concierge hotel'] },
    ],
  },
  {
    slug: 'hospitality-recruitment',
    title: 'Hospitality Recruitment',
    eyebrow: 'Recruitment',
    href: '/hospitality-recruitment',
    canonical: `${BASE}/hospitality-recruitment`,
    description: 'Hospitality recruitment, hotel careers, talent retention, hiring strategy, workforce development, and career growth in hotels.',
    keywords: 'hospitality careers, hotel recruitment, hospitality jobs, hotel hiring, hospitality talent retention',
    matchTerms: ['RECRUITMENT', 'HIRING', 'CAREERS', 'JOBS', 'WORKFORCE', 'RETENTION', 'STAFFING'],
    clusters: [
      { title: 'Hospitality Hiring Trends', description: 'The recruitment pressures and workforce expectations reshaping hotel hiring.', keywords: ['hospitality hiring trends', 'hotel recruitment'] },
      { title: 'AI in Recruitment', description: 'How hotels use automation and analytics to source, screen, and retain talent.', keywords: ['AI recruitment hospitality', 'hotel hiring technology'] },
      { title: 'Hospitality Career Growth', description: 'Training, internal mobility, mentorship, and skills pathways for hospitality professionals.', keywords: ['hospitality career growth', 'hotel careers'] },
      { title: 'Luxury Hotel Recruitment', description: 'How luxury properties compete for high-touch service talent in constrained labour markets.', keywords: ['luxury hotel recruitment', 'hotel jobs'] },
    ],
  },
  {
    slug: 'hotel-operations',
    title: 'Hotel Operations',
    eyebrow: 'Operations',
    href: '/hotel-operations',
    canonical: `${BASE}/hotel-operations`,
    description: 'Hotel operations, hospitality analytics, SOP optimization, multi-property management, security systems, and operational technology.',
    keywords: 'hotel operations, hospitality operations, hotel management systems, hotel SOP, hospitality analytics',
    matchTerms: ['OPERATIONS', 'SOP', 'ANALYTICS', 'INFRASTRUCTURE', 'SECURITY', 'MULTI-PROPERTY', 'HOUSEKEEPING'],
    clusters: [
      { title: 'Hotel SOP Optimization', description: 'How operators standardize service, housekeeping, maintenance, and escalation workflows.', keywords: ['hotel SOP', 'hotel operations'] },
      { title: 'Hotel IT Infrastructure', description: 'Networks, integrations, cloud systems, and the operational backbone of modern hotels.', keywords: ['hotel IT infrastructure', 'hospitality technology'] },
      { title: 'Multi-property Operations', description: 'The systems and leadership routines that help groups manage distributed hotel portfolios.', keywords: ['multi-property hotel operations', 'hotel management systems'] },
      { title: 'Hospitality Analytics', description: 'Operational dashboards, benchmarking, forecasting, and performance intelligence for hotels.', keywords: ['hospitality analytics', 'hotel data'] },
    ],
  },
  {
    slug: 'hospitality-trends',
    title: 'Hospitality Trends',
    eyebrow: 'Trends',
    href: '/hospitality-trends',
    canonical: `${BASE}/hospitality-trends`,
    description: 'Hospitality trends, hotel industry news, investment signals, technology predictions, and market shifts shaping the sector.',
    keywords: 'hospitality trends, hotel industry trends, hospitality news, hotel innovation trends, hospitality trends 2026',
    matchTerms: ['TRENDS', 'NEWS', 'INVESTMENT', 'MARKET', 'PREDICTIONS', 'FORECAST', 'REPORT'],
    clusters: [
      { title: 'Top Hospitality Trends 2026', description: 'The technology, workforce, revenue, and guest behaviour shifts defining 2026.', keywords: ['hospitality trends 2026', 'hotel trends'] },
      { title: 'Hospitality Technology Predictions', description: 'Where hotel technology budgets, vendors, and operators are moving next.', keywords: ['hospitality technology predictions', 'hotel tech trends'] },
      { title: 'Hotel Digital Transformation Case Studies', description: 'What digital transformation looks like in real hotel operating environments.', keywords: ['hotel digital transformation', 'hotel case studies'] },
      { title: 'Hotel Investment Reports', description: 'Development, capital flows, and strategic investment signals across hospitality markets.', keywords: ['hotel investment reports', 'hospitality investment'] },
    ],
  },
  {
    slug: 'luxury-hospitality',
    title: 'Luxury Hospitality',
    eyebrow: 'Luxury',
    href: '/luxury-hospitality',
    canonical: `${BASE}/luxury-hospitality`,
    description: 'Luxury hospitality technology, high-touch service, wellness, design, personalization, and the future of premium hotel experiences.',
    keywords: 'luxury hospitality, luxury hotels, luxury hotel technology, premium guest experience, luxury hotel innovation',
    matchTerms: ['LUXURY', 'WELLNESS', 'DESIGN', 'PREMIUM', 'RESORT', 'SPA', 'BRANDED RESIDENCES'],
    clusters: [
      { title: 'Luxury Guest Experience', description: 'How luxury properties blend technology and human service without losing emotional texture.', keywords: ['luxury guest experience', 'luxury hospitality'] },
      { title: 'Luxury Hotel Technology', description: 'Technology decisions that support privacy, personalization, and operational elegance.', keywords: ['luxury hotel technology', 'hotel innovation'] },
      { title: 'Wellness and Spa Revenue', description: 'The commercial strategy behind wellness-led luxury hospitality.', keywords: ['hotel wellness', 'spa revenue'] },
      { title: 'Luxury Hotel Design Trends', description: 'The design choices shaping flagship properties and boutique hotel brands.', keywords: ['luxury hotel design', 'boutique hotel trends'] },
    ],
  },
]

export const GEO_AUTHORITY_PAGES: GeoAuthorityPage[] = [
  {
    slug: 'hospitality-technology-toronto',
    title: 'Hospitality Technology in Toronto',
    region: 'Canada',
    href: '/geo/hospitality-technology-toronto',
    canonical: `${BASE}/geo/hospitality-technology-toronto`,
    description: 'Toronto hospitality technology coverage for hotel operators, owners, vendors, and leaders tracking AI, PMS, guest apps, and digital transformation.',
    keywords: 'hospitality technology Toronto, hotel technology Toronto, Toronto hotels AI, hotel tech Canada',
    matchTerms: ['TORONTO', 'CANADA', 'ONTARIO'],
  },
  {
    slug: 'hospitality-leadership-vancouver',
    title: 'Hospitality Leadership in Vancouver',
    region: 'Canada',
    href: '/geo/hospitality-leadership-vancouver',
    canonical: `${BASE}/geo/hospitality-leadership-vancouver`,
    description: 'Vancouver hospitality leadership, hotel management, recruitment, operations, and guest experience trends.',
    keywords: 'hospitality leadership Vancouver, hotel leadership Vancouver, Vancouver hotel management',
    matchTerms: ['VANCOUVER', 'CANADA', 'BRITISH COLUMBIA'],
  },
  {
    slug: 'luxury-hotels-montreal',
    title: 'Luxury Hotels in Montreal',
    region: 'Canada',
    href: '/geo/luxury-hotels-montreal',
    canonical: `${BASE}/geo/luxury-hotels-montreal`,
    description: 'Montreal luxury hospitality coverage across hotel design, guest experience, technology, and premium travel demand.',
    keywords: 'luxury hotels Montreal, Montreal hospitality, luxury hospitality Montreal',
    matchTerms: ['MONTREAL', 'CANADA', 'QUEBEC', 'LUXURY'],
  },
  {
    slug: 'hospitality-technology-new-york',
    title: 'Hospitality Technology in New York',
    region: 'United States',
    href: '/geo/hospitality-technology-new-york',
    canonical: `${BASE}/geo/hospitality-technology-new-york`,
    description: 'New York hospitality technology coverage for hotel owners, operators, brand leaders, vendors, and investors tracking AI, guest experience, revenue, and operations.',
    keywords: 'hospitality technology New York, hotel technology NYC, New York hotels AI, hotel innovation USA',
    matchTerms: ['NEW YORK', 'NYC', 'UNITED STATES', 'USA'],
  },
  {
    slug: 'hotel-technology-las-vegas',
    title: 'Hotel Technology in Las Vegas',
    region: 'United States',
    href: '/geo/hotel-technology-las-vegas',
    canonical: `${BASE}/geo/hotel-technology-las-vegas`,
    description: 'Las Vegas hotel technology coverage across conferences, casino resorts, guest data, smart rooms, payments, revenue systems, and large-scale hotel operations.',
    keywords: 'hotel technology Las Vegas, hospitality technology USA, casino resort technology, hotel tech events',
    matchTerms: ['LAS VEGAS', 'NEVADA', 'CASINO', 'RESORT TECHNOLOGY'],
  },
  {
    slug: 'hospitality-technology-london',
    title: 'Hospitality Technology in London',
    region: 'United Kingdom',
    href: '/geo/hospitality-technology-london',
    canonical: `${BASE}/geo/hospitality-technology-london`,
    description: 'London hospitality technology coverage across hotel IT, AI, guest experience, investment, sustainability, events, and European hotel operations.',
    keywords: 'hospitality technology London, hotel technology UK, London hotel innovation, hospitality tech Europe',
    matchTerms: ['LONDON', 'UNITED KINGDOM', 'UK', 'ENGLAND'],
  },
  {
    slug: 'hospitality-ai-doha',
    title: 'Hospitality AI in Doha',
    region: 'Qatar',
    href: '/geo/hospitality-ai-doha',
    canonical: `${BASE}/geo/hospitality-ai-doha`,
    description: 'Doha hospitality AI coverage for luxury hotels, smart guest journeys, event-led demand, operations, revenue analytics, and Qatar hotel innovation.',
    keywords: 'hospitality AI Doha, hotel technology Qatar, AI hotels Qatar, Doha hospitality innovation',
    matchTerms: ['DOHA', 'QATAR', 'AI'],
  },
  {
    slug: 'smart-hotels-saudi-arabia',
    title: 'Smart Hotels in Saudi Arabia',
    region: 'Saudi Arabia',
    href: '/geo/smart-hotels-saudi-arabia',
    canonical: `${BASE}/geo/smart-hotels-saudi-arabia`,
    description: 'Saudi Arabia smart hotel coverage across connected rooms, AI guest services, mega-projects, and hospitality innovation.',
    keywords: 'smart hotels Saudi Arabia, hotel technology Saudi Arabia, Saudi hospitality innovation',
    matchTerms: ['SAUDI', 'RIYADH', 'JEDDAH', 'NEOM'],
  },
  {
    slug: 'hospitality-ai-singapore',
    title: 'Hospitality AI in Singapore',
    region: 'Singapore',
    href: '/geo/hospitality-ai-singapore',
    canonical: `${BASE}/geo/hospitality-ai-singapore`,
    description: 'Singapore hospitality AI, smart hotel operations, guest technology, revenue analytics, and digital transformation.',
    keywords: 'hospitality AI Singapore, hotel technology Singapore, AI hotels Singapore',
    matchTerms: ['SINGAPORE', 'AI'],
  },
  {
    slug: 'luxury-hotel-innovation-paris',
    title: 'Luxury Hotel Innovation in Paris',
    region: 'France',
    href: '/geo/luxury-hotel-innovation-paris',
    canonical: `${BASE}/geo/luxury-hotel-innovation-paris`,
    description: 'Paris luxury hotel innovation, guest experience, design, wellness, and hospitality technology coverage.',
    keywords: 'luxury hotel innovation Paris, Paris luxury hotels, hospitality technology Paris',
    matchTerms: ['PARIS', 'FRANCE', 'LUXURY'],
  },
]

export function getDiamondPillarBySlug(slug: string): DiamondPillar | undefined {
  return DIAMOND_PILLARS.find(pillar => pillar.slug === slug)
}

export function getGeoPageBySlug(slug: string): GeoAuthorityPage | undefined {
  return GEO_AUTHORITY_PAGES.find(page => page.slug === slug)
}

export function getMatchingPillar(text: string): DiamondPillar {
  const upper = text.toUpperCase()
  return DIAMOND_PILLARS.find(pillar => pillar.matchTerms.some(term => upper.includes(term))) ?? DIAMOND_PILLARS[1]
}

export function getMatchingGeoPage(text: string): GeoAuthorityPage {
  const upper = text.toUpperCase()
  return GEO_AUTHORITY_PAGES.find(page => page.matchTerms.some(term => upper.includes(term))) ?? GEO_AUTHORITY_PAGES[0]
}
