import { canonicalUrl, classifyHeroTopic } from './daily-hero.mjs'
import { isAllowedRegionalArticle, validateNewsPost } from './content-quality.mjs'

export const PRIMARY_HOSTS = ['stories.hilton.com', 'newsroom.hyatt.com', 'news.marriott.com', 'marriott.gcs-web.com', 'www.ihgplc.com', 'corporate.wyndhamhotels.com', 'media.choicehotels.com', 'group.accor.com', 'press.accor.com', 'www.mews.com', 'mews.com', 'www.canarytechnologies.com', 'canarytechnologies.com', 'www.shijigroup.com', 'shijigroup.com', 'www.cloudbeds.com', 'cloudbeds.com', 'rhisac.org', 'www.rhisac.org', 'www.cisa.gov', 'www.oracle.com', 'www.sabre.com', 'amadeus.com', 'www.amadeus.com', 'www.assaabloy.com', 'www.vingcard.com', 'antavo.com', 'www.antavo.com', 'www.ahla.com', 'ir.hworld.com', 'www.inn-flow.com', 'www.dailypoint.com', 'www.urvenue.com', 'terrapinn.com', 'www.terrapinn.com']

export const DAILY_ARTICLE_LIMIT = 4
export const PUBLICATION_INTERVAL_HOURS = 4
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
  return articles.filter(article => {
    const age = +now - Date.parse(article.pubDate), url = canonicalUrl(article.url)
    return url && !used.has(url) && age >= 0 && age <= EDITORIAL_DISCOVERY_HOURS * 3600000 && isAllowedRegionalArticle(article)
      && classifyHeroTopic(`${article.title} ${article.excerpt}`)
      && /hotel|hospitality|resort|lodging/i.test(`${article.title} ${article.excerpt} ${article.source}`)
  }).sort((a, b) => {
    const isPrimary = item => Number(PRIMARY_HOSTS.includes(new URL(canonicalUrl(item.url)).hostname))
    return isPrimary(b) - isPrimary(a) || Date.parse(b.pubDate) - Date.parse(a.pubDate)
  }).slice(0, 12)
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
