const PILLARS = {
  home: { label: 'Hospitality121 Core Hub', url: 'https://hospitality121.com' },
  blog: { label: 'Hospitality Blog', url: 'https://hospitality121.com/blog' },
  news: { label: 'Hospitality News', url: 'https://hospitality121.com/news' },
  leadership: { label: 'Hospitality Leadership', url: 'https://hospitality121.com/hospitality-leadership' },
  recruitment: { label: 'Hospitality Recruitment', url: 'https://hospitality121.com/hospitality-recruitment' },
  operations: { label: 'Hotel Operations', url: 'https://hospitality121.com/hotel-operations' },
  trends: { label: 'Hospitality Trends', url: 'https://hospitality121.com/hospitality-trends' },
  luxury: { label: 'Luxury Hospitality', url: 'https://hospitality121.com/luxury-hospitality' },
  experience: { label: 'Guest Experience', url: 'https://hospitality121.com/guest-experience' },
}

const CLUSTERS = [
  {
    label: 'Hospitality AI',
    url: 'https://hospitality121.com/technology/ai',
    terms: ['AI', 'ARTIFICIAL INTELLIGENCE', 'MACHINE LEARNING', 'AUTOMATION'],
  },
  {
    label: 'PMS and POS Systems',
    url: 'https://hospitality121.com/technology/pms-pos',
    terms: ['PMS', 'POS', 'PROPERTY MANAGEMENT', 'POINT OF SALE', 'DISTRIBUTION', 'BOOKING ENGINE'],
  },
  {
    label: 'Key and Mobile Key Systems',
    url: 'https://hospitality121.com/technology/key-systems',
    terms: ['MOBILE KEY', 'KEYLESS', 'CHECK-IN', 'CONTACTLESS', 'ACCESS CONTROL'],
  },
  {
    label: 'Cybersecurity',
    url: 'https://hospitality121.com/technology/cybersecurity',
    terms: ['CYBER', 'SECURITY', 'DATA PRIVACY', 'DATA PROTECTION', 'PCI', 'GDPR'],
  },
  {
    label: 'Hospitality Technology',
    url: 'https://hospitality121.com/technology',
    terms: ['TECH', 'TECHNOLOGY', 'DIGITAL', 'INNOVATION', 'SOFTWARE'],
  },
  {
    label: 'Sustainable Hotel Operations',
    url: 'https://hospitality121.com/sustainability/sustainable-operations',
    terms: ['SUSTAINABILITY', 'SUSTAINABLE', 'GREEN', 'FOOD WASTE', 'ECO'],
  },
  {
    label: 'Smart Hotel Operations',
    url: 'https://hospitality121.com/sustainability/smart-operations',
    terms: ['SMART OPERATIONS', 'IOT', 'BUILDING MANAGEMENT', 'ENERGY MANAGEMENT'],
  },
  {
    label: 'Green Hotel Technologies',
    url: 'https://hospitality121.com/sustainability/green-technologies',
    terms: ['SOLAR', 'EV CHARGING', 'RENEWABLE', 'DECARBONISATION', 'DECARBONIZATION'],
  },
  {
    label: 'ESG and Future Travel',
    url: 'https://hospitality121.com/sustainability/esg-reporting',
    terms: ['ESG', 'CARBON', 'SCOPE 3', 'REPORTING', 'SUSTAINABLE TRAVEL'],
  },
  {
    label: 'Guest Experience',
    url: 'https://hospitality121.com/guest-experience',
    terms: ['GUEST EXPERIENCE', 'LOYALTY', 'LUXURY', 'WELLNESS', 'PERSONALISATION', 'PERSONALIZATION'],
  },
  {
    label: 'Leadership and Innovation',
    url: 'https://hospitality121.com/hospitality-leadership',
    terms: ['LEADERSHIP', 'CEO', 'MANAGEMENT', 'WORKFORCE', 'TALENT', 'STRATEGY'],
  },
  {
    label: 'Hospitality Recruitment',
    url: 'https://hospitality121.com/hospitality-recruitment',
    terms: ['RECRUITMENT', 'HIRING', 'CAREERS', 'JOBS', 'WORKFORCE', 'RETENTION', 'STAFFING'],
  },
  {
    label: 'Hotel Operations',
    url: 'https://hospitality121.com/hotel-operations',
    terms: ['OPERATIONS', 'SOP', 'HOUSEKEEPING', 'ANALYTICS', 'INFRASTRUCTURE', 'SECURITY'],
  },
  {
    label: 'Luxury Hospitality',
    url: 'https://hospitality121.com/luxury-hospitality',
    terms: ['LUXURY', 'RESORT', 'SPA', 'WELLNESS', 'DESIGN', 'BRANDED RESIDENCES'],
  },
]

export function buildSeoLinks({ contentType, title, category, keywords = [] }) {
  const pillar = PILLARS[contentType] ?? PILLARS.blog
  const haystack = [title, category, ...keywords].join(' ').toUpperCase()
  const cluster = CLUSTERS.find(item => item.terms.some(term => haystack.includes(term))) ?? {
    label: 'Hospitality Technology',
    url: 'https://hospitality121.com/technology',
  }
  const geo = getGeoLink(haystack)

  return `## Related Hospitality121 Coverage

- [${PILLARS.home.label}](${PILLARS.home.url})
- [${pillar.label}](${pillar.url})
- [${cluster.label}](${cluster.url})
- [${geo.label}](${geo.url})
`
}

function getGeoLink(haystack) {
  const geoPages = [
    { label: 'Hospitality Technology in Toronto', url: 'https://hospitality121.com/geo/hospitality-technology-toronto', terms: ['TORONTO', 'CANADA', 'ONTARIO'] },
    { label: 'Hospitality Leadership in Vancouver', url: 'https://hospitality121.com/geo/hospitality-leadership-vancouver', terms: ['VANCOUVER', 'BRITISH COLUMBIA'] },
    { label: 'Luxury Hotels in Montreal', url: 'https://hospitality121.com/geo/luxury-hotels-montreal', terms: ['MONTREAL', 'QUEBEC'] },
    { label: 'Hospitality Technology in New York', url: 'https://hospitality121.com/geo/hospitality-technology-new-york', terms: ['NEW YORK', 'NYC', 'UNITED STATES', 'USA'] },
    { label: 'Hotel Technology in Las Vegas', url: 'https://hospitality121.com/geo/hotel-technology-las-vegas', terms: ['LAS VEGAS', 'NEVADA', 'CASINO'] },
    { label: 'Hospitality Technology in London', url: 'https://hospitality121.com/geo/hospitality-technology-london', terms: ['LONDON', 'UNITED KINGDOM', 'UK', 'ENGLAND'] },
    { label: 'Hospitality AI in Doha', url: 'https://hospitality121.com/geo/hospitality-ai-doha', terms: ['DOHA', 'QATAR'] },
    { label: 'Smart Hotels in Saudi Arabia', url: 'https://hospitality121.com/geo/smart-hotels-saudi-arabia', terms: ['SAUDI', 'RIYADH', 'JEDDAH', 'NEOM'] },
    { label: 'Hospitality AI in Singapore', url: 'https://hospitality121.com/geo/hospitality-ai-singapore', terms: ['SINGAPORE'] },
    { label: 'Luxury Hotel Innovation in Paris', url: 'https://hospitality121.com/geo/luxury-hotel-innovation-paris', terms: ['PARIS', 'FRANCE'] },
  ]
  return geoPages.find(page => page.terms.some(term => haystack.includes(term))) ?? geoPages[0]
}
