const HOSPITALITY_TERMS = [
  'hospitality',
  'hotel',
  'hotels',
  'resort',
  'restaurant',
  'travel',
  'tourism',
  'guest',
  'lodging',
  'luxury',
  'revenue',
  'operations',
  'leadership',
  'recruitment',
  'workforce',
  'events',
  'conference',
  'podcast',
  'interview',
  'sustainability',
  'food and beverage',
  'hospitality technology',
  'hotel technology',
  'hotel tech',
  'technology',
  'ai',
  'automation',
  'pms',
  'pos',
  'cybersecurity',
  'smart hotel',
  'guest experience',
  'digital transformation',
  'data',
  'revenue management',
  'hotel it',
  'mobile key',
  'cloud',
  'hospitality software',
  'marriott',
  'hilton',
  'hyatt',
  'ihg',
  'intercontinental',
  'holiday inn',
  'wyndham',
  'choice hotels',
  'accor',
  'radisson',
  'best western',
  'bwh hotels',
  'four seasons',
  'mandarin oriental',
  'rosewood',
  'kempinski',
  'minor hotels',
  'melia',
  'nh hotels',
  'scandic',
  'louvre hotels',
  'citizenm',
  'motel one',
]

const BANNED_PHRASES = [
  'in today’s rapidly evolving world',
  "in today's rapidly evolving world",
  'in todays rapidly evolving world',
  'rapidly evolving world',
  'it is important to note',
  'delve',
  'delve into',
  'game changer',
  'revolutionary',
  'cutting edge',
  'in conclusion',
  'en conclusion',
  'as the hospitality industry continues to evolve',
  'as the travel industry continues to evolve',
  "à mesure que l'industrie continue d'évoluer",
  "à mesure que l'industrie hôtelière continue d'évoluer",
  'alors que le paysage de l’hôtellerie',
  'cannot be overstated',
  'ne peut être surestimée',
  'révolutionner',
]

const FORBIDDEN_PUNCTUATION = /[\u2013\u2014]|--/
const FORBIDDEN_ENCODING_ARTIFACTS = /(?:\u00E2\u20AC[\u201D\u201C\u0153]|\u00E2\u20AC\u201C|\u00E2\u20AC\u201D|\u00E2\u20AC\u2122|\u00E2\u20AC\u0153|\u00E2\u20AC\uFFFD|\uFFFD)/

const BLOCKED_REGION_TERMS = [
  'india',
  'indian',
  'yatra',
  'mumbai',
  'delhi',
  'bangalore',
  'uae',
  'dubai',
  'abu dhabi',
  'emirates',
  'morocco',
  'marrakech',
  'casablanca',
  'bahrain',
  'kuwait',
  'oman',
  'egypt',
  'jordan',
  'lebanon',
  'iraq',
  'syria',
  'yemen',
]

const ALLOWED_REGION_TERMS = [
  'saudi arabia',
  'saudi',
  'riyadh',
  'jeddah',
  'qatar',
  'doha',
]

export function isHospitalitySource(article) {
  const haystack = `${article.title} ${article.excerpt} ${article.source}`.toLowerCase()
  return isAllowedRegionalArticle(article) && HOSPITALITY_TERMS.some(term => haystack.includes(term))
}

export function isAllowedRegionalArticle(article) {
  const haystack = `${article.title} ${article.excerpt} ${article.source}`.toLowerCase()
  if (ALLOWED_REGION_TERMS.some(term => haystack.includes(term))) return true
  return !BLOCKED_REGION_TERMS.some(term => haystack.includes(term))
}

export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isDuplicateTitle(title, existingTitles) {
  const normalized = normalizeText(title)
  if (!normalized) return true
  return existingTitles.some(existing => {
    const other = normalizeText(existing)
    if (other === normalized) return true
    return jaccardSimilarity(normalized, other) >= 0.72
  })
}

export function hasDuplicateKeywordSet(keywords, existingSets) {
  const current = normalizeKeywordSet(keywords)
  if (current.length === 0) return true
  return existingSets.some(existing => {
    const other = normalizeKeywordSet(String(existing).split(/[,|]/))
    if (other.length === 0) return false
    const overlap = current.filter(keyword => other.includes(keyword)).length
    return overlap >= Math.min(3, current.length)
  })
}

export function validateHumanizedPost(post, existingTitles, existingKeywordSets) {
  const issues = []
  const body = `${post.bodyEn || ''} ${post.body || ''}`
  const bodyLower = body.toLowerCase()

  if (isDuplicateTitle(post.titleEn || post.title, existingTitles)) {
    issues.push('duplicate or semantically similar title')
  }
  if (hasDuplicateKeywordSet(post.keywords || [], existingKeywordSets)) {
    issues.push('duplicate keyword combination')
  }
  issues.push(...findForbiddenStyleIssues(body, bodyLower))
  if ((post.keywords || []).length < 4) {
    issues.push('needs at least four SEO keywords')
  }
  if (!post.primaryKeyword || !normalizeText(post.primaryKeyword).match(/\b(hospitality|hotel|guest|resort|travel|restaurant|lodging)\b/)) {
    issues.push('missing hospitality primary keyword')
  }
  if (!post.imageConcept || normalizeText(post.imageConcept).length < 40) {
    issues.push('missing distinct editorial image concept')
  }
  if (!post.editorialFormat) {
    issues.push('missing editorial format')
  }
  if (!post.linkedinCaption || !post.facebookCaption || !post.xCaption || !post.newsletterTeaser) {
    issues.push('missing platform social captions')
  }

  return issues
}

export function validateNewsPost(post, existingTitles) {
  const issues = []
  const body = `${post.description || ''} ${post.body || ''}`
  const bodyLower = body.toLowerCase()

  if (isDuplicateTitle(post.title, existingTitles)) {
    issues.push('duplicate or semantically similar title')
  }
  if (!isAllowedRegionalArticle({ title: post.title, excerpt: body, source: '' })) {
    issues.push('blocked regional topic')
  }
  issues.push(...findForbiddenStyleIssues(body, bodyLower))
  if (!Array.isArray(post.keywords) || post.keywords.length < 3) {
    issues.push('needs at least three SEO keywords')
  }
  if (!normalizeText([post.title, post.description, post.category, ...(post.keywords || [])].join(' ')).match(/\b(hospitality|hotel|guest|resort|travel|restaurant|lodging)\b/)) {
    issues.push('missing hospitality keyword focus')
  }

  return issues
}

export function findForbiddenStyleIssues(body, bodyLower = body.toLowerCase()) {
  const issues = []

  if (FORBIDDEN_PUNCTUATION.test(body)) {
    issues.push('contains em dash, en dash, or double hyphen')
  }
  if (FORBIDDEN_ENCODING_ARTIFACTS.test(body)) {
    issues.push('contains encoding artifact')
  }
  for (const phrase of BANNED_PHRASES) {
    if (bodyLower.includes(phrase)) issues.push(`contains banned phrase: ${phrase}`)
  }

  const leverageUses = (bodyLower.match(/\bleverage(?:d|s|ing)?\b/g) || []).length
  if (leverageUses > 1) {
    issues.push('overuses leverage phrasing')
  }

  return issues
}

function normalizeKeywordSet(keywords) {
  return keywords
    .map(normalizeText)
    .filter(Boolean)
    .map(keyword => keyword.replace(/\b(the|and|for|in|of|to)\b/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .sort()
}

function jaccardSimilarity(a, b) {
  const aWords = new Set(a.split(' ').filter(word => word.length > 2))
  const bWords = new Set(b.split(' ').filter(word => word.length > 2))
  if (aWords.size === 0 || bWords.size === 0) return 0
  const intersection = [...aWords].filter(word => bWords.has(word)).length
  const union = new Set([...aWords, ...bWords]).size
  return intersection / union
}
