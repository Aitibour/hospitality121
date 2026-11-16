import { createHash } from 'node:crypto'
import { canonicalUrl } from './daily-hero.mjs'
import { isAllowedRegionalArticle, validateNewsPost } from './content-quality.mjs'

export const PRIMARY_HOSTS = ['stories.hilton.com', 'news.hiltonworldwide.com', 'newsroom.hyatt.com', 'news.marriott.com', 'marriott.gcs-web.com', 'www.ihgplc.com', 'corporate.wyndhamhotels.com', 'media.choicehotels.com', 'group.accor.com', 'press.accor.com', 'press.mandarinoriental.com', 'www.mews.com', 'mews.com', 'www.canarytechnologies.com', 'canarytechnologies.com', 'www.shijigroup.com', 'shijigroup.com', 'www.cloudbeds.com', 'cloudbeds.com', 'rhisac.org', 'www.rhisac.org', 'www.cisa.gov', 'www.oracle.com', 'www.sabre.com', 'amadeus.com', 'www.amadeus.com', 'www.assaabloy.com', 'www.vingcard.com', 'antavo.com', 'www.antavo.com', 'www.ahla.com', 'ir.hworld.com', 'www.inn-flow.com', 'www.dailypoint.com', 'www.urvenue.com', 'terrapinn.com', 'www.terrapinn.com', 'hoteltechnologynews.com', 'www.hoteltechnologynews.com', 'hotelmanagement.net', 'www.hotelmanagement.net', 'skift.com', 'www.skift.com', 'www.globenewswire.com']

export const DAILY_ARTICLE_LIMIT = 4
export const PUBLICATION_INTERVAL_HOURS = 4
// Match a story to a real editorial section before drafting. The order gives
// specific subjects precedence over broad words such as "business" or "trends".
export const EDITORIAL_CATEGORIES = [
  ['CONFERENCE', /\b(conference|congress|summit|forum|convention|symposium)\b/i],
  ['EVENTS', /\b(event|expo|exhibition|trade show|fair)\b/i],
  ['WELLNESS', /\b(wellness|spa|wellbeing|well-being|health retreat)\b/i],
  ['GUEST EXPERIENCE', /\b(guest experience|guest journey|personalization|personalisation|guest service|guest satisfaction)\b/i],
  ['SUSTAINABILITY', /\b(sustainab\w*|decarbon\w*|energy efficiency|carbon footprint)\b/i],
  ['FOOD & BEVERAGE', /\b(food and beverage|restaurant|dining|culinary|chef)\b/i],
  ['OPENINGS', /\b(opening|opens new|new hotel|new resort|debut\w*)\b/i],
  ['DESIGN', /\b(design|architecture|renovation|interior\w*)\b/i],
  ['LOYALTY', /\b(loyalty|loyal guest|rewards program|membership program)\b/i],
  ['MARKETING', /\b(marketing|brand campaign|advertising|customer acquisition)\b/i],
  ['LEADERSHIP', /\b(leadership|chief executive|ceo|general manager|appoint\w*)\b/i],
  ['TALENT', /\b(talent|recruitment|training|education|career\w*)\b/i],
  ['REVENUE', /\b(revenue|revpar|average daily rate|occupancy rate|pricing strategy)\b/i],
  ['PARTNERSHIPS', /\b(partner\w*|joint venture|collaboration)\b/i],
  ['INVESTMENT', /\b(investment|investor|funding|acquisition|merger|private equity)\b/i],
  ['EXPANSION', /\b(expansion|expands into|new market|growth plan)\b/i],
  ['BUSINESS', /\b(business|financial|earnings|profit|portfolio|franchise|development|expansion)\b/i],
  ['TRENDS', /\b(trend\w*|forecast\w*|outlook|prediction\w*|survey)\b/i],
  ['INSIGHTS', /\b(insight\w*|research|report|analysis|study|data show)\b/i],
  ['OPERATIONS', /\b(operations|housekeeping|staffing|workforce|revenue management)\b/i],
  ['LUXURY', /\b(luxury|premium|high-end)\b/i],
  ['DISTRIBUTION', /\b(distribution|booking|travel agent|ota|channel manager)\b/i],
  ['TECHNOLOGY', /\b(technolog\w*|software|digital|automation|integration|ai|artificial intelligence|cybersecurity|pms|cloud)\b/i],
]

export function classifyEditorialCategory(article) {
  const text = `${article.title || ''} ${article.excerpt || ''}`
  return EDITORIAL_CATEGORIES.find(([, pattern]) => pattern.test(text))?.[0] ?? null
}

function dailyRank(value, day) {
  return createHash('sha256').update(`${day}:${value}`).digest('hex')
}
export const PRIMARY_EDITORIAL_FEEDS = [
  { url: 'https://www.cloudbeds.com/feed/', source: 'Cloudbeds' },
  { url: 'https://www.canarytechnologies.com/blog/rss.xml', source: 'Canary Technologies' },
  { url: 'https://www.ahla.com/rss.xml', source: 'American Hotel & Lodging Association' },
  { url: 'https://ir.hworld.com/rss/news-releases.xml', source: 'H World Group' },
  { url: 'https://www.globenewswire.com/RssFeed/subjectcode/70-Hotels%20and%20Resorts/feedTitle/Hotels%20and%20Resorts', source: 'GlobeNewswire Hotels and Resorts' },
]
// Inclusive five-calendar-day discovery: at any time on Nov 16, Nov 11 remains eligible.
export const EDITORIAL_DISCOVERY_HOURS = 144
const publicationCalendar = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' })

const publicationHour = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Vancouver', hour: '2-digit', hourCycle: 'h23' })

export function publicationSlot(date) {
  const hour = Number(publicationHour.format(date))
  if (hour < 8) return null
  return 8 + Math.floor((hour - 8) / PUBLICATION_INTERVAL_HOURS) * PUBLICATION_INTERVAL_HOURS
}

export function editorialDay(date) {
  return publicationCalendar.format(date)
}

export function countDailyCloudArticles(content, now) {
  const day = editorialDay(now)
  return content.filter(item => {
    const timestamp = Date.parse(item.cloudPublishedAt)
    return item.status === 'published' && Number.isFinite(timestamp) && timestamp <= +now && editorialDay(timestamp) === day
  }).length
}

export function selectCloudCandidates(articles, existing, now = new Date()) {
  const used = new Set(existing.map(item => canonicalUrl(item.sourceUrl)).filter(Boolean))
  const todayCategories = new Set(existing.filter(item => item.cloudPublishedAt && editorialDay(Date.parse(item.cloudPublishedAt)) === editorialDay(now)).map(item => item.category))
  const candidates = articles.filter(article => {
    const age = +now - Date.parse(article.pubDate), url = canonicalUrl(article.url)
    return url && !used.has(url) && age >= 0 && age <= EDITORIAL_DISCOVERY_HOURS * 3600000 && isAllowedRegionalArticle(article)
      && classifyEditorialCategory(article)
      && /hotel|hospitality|resort|lodging/i.test(`${article.title} ${article.excerpt} ${article.source}`)
  }).map(article => ({ ...article, category: classifyEditorialCategory(article) }))
  const day = editorialDay(now)
  const categories = [...new Set(candidates.map(item => item.category))].sort((a, b) => dailyRank(a, day).localeCompare(dailyRank(b, day)))
  const ordered = categories.filter(category => !todayCategories.has(category)).concat(categories.filter(category => todayCategories.has(category)))
  const buckets = ordered.map(category => candidates.filter(item => item.category === category)
    .sort((a, b) => Number(PRIMARY_HOSTS.includes(new URL(b.url).hostname)) - Number(PRIMARY_HOSTS.includes(new URL(a.url).hostname))
      || Date.parse(b.pubDate) - Date.parse(a.pubDate)
      || dailyRank(a.url, day).localeCompare(dailyRank(b.url, day))))
  const result = []
  while (result.length < 36 && buckets.some(bucket => bucket.length)) for (const bucket of buckets) {
    if (bucket.length && result.length < 36) result.push(bucket.shift())
  }
  return result
}

export function validateEvidence(evidence, sources, now = new Date()) {
  if (!evidence?.publishable || !Array.isArray(evidence.facts) || evidence.facts.length < 2 || evidence.facts.length > 4) throw new Error('Insufficient verified source facts')
  const event = Date.parse(evidence.eventDate)
  if (!Number.isFinite(event) || event > +now || event < +now - EDITORIAL_DISCOVERY_HOURS * 3600000) throw new Error('Primary event date is missing or not recent')
  let quotedWords = 0
  for (const fact of evidence.facts) {
    const source = sources.find(s => s.url === fact.sourceUrl)
    const quote = String(fact.evidence || '').trim()
    quotedWords += quote.split(/\s+/).length
    if (!source || !quote || !source.text.includes(quote) || !fact.claim || fact.claim.split(/\s+/).length > 30) throw new Error('Fact lacks an exact primary-source anchor')
  }
  if (quotedWords > 24) throw new Error('Evidence quotations exceed the short excerpt limit')
}

export function validateCloudPost(post, evidence, titles) {
  if (!post || !/^[a-z0-9-]{8,70}$/.test(post.slug || '') || !post.title || post.title.length > 85 || !post.description || post.description.length > 155) throw new Error('Invalid article metadata')
  if (!post.body || post.body.split(/\s+/).length < 180 || post.body.split(/\s+/).length > 550) throw new Error('Article depth outside supported scope')
  if (!post.body.includes('Hospitality121 analysis:')) throw new Error('Operational analysis must be labelled')
  if (/```|<script|<iframe|!\[|\bI interviewed\b/i.test(post.body)) throw new Error('Unsupported article content')
  // Generated prose may use only numbers supported by extracted facts or their dates.
  const allowed = new Set((JSON.stringify(evidence).match(/\d+(?:[.,]\d+)?/g) || []))
  for (const number of `${post.title} ${post.description} ${post.body}`.match(/\d+(?:[.,]\d+)?/g) || []) if (!allowed.has(number) && number !== '121') throw new Error('Article contains an unsupported number')
  const issues = validateNewsPost(post, titles)
  if (issues.length) throw new Error(issues.join('; '))
}
