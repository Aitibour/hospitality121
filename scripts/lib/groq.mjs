import Groq from 'groq-sdk'

const VALID_BLOG_CATEGORIES = ['TECHNOLOGY', 'TRENDS', 'OPERATIONS', 'LUXURY', 'SUSTAINABILITY', 'WELLNESS', 'F&B']
const VALID_NEWS_CATEGORIES = ['INVESTMENT', 'TECHNOLOGY', 'SUSTAINABILITY', 'WORKFORCE', 'BRANDS', 'OPERATIONS', 'DEVELOPMENT', 'LUXURY', 'DISTRIBUTION', 'PARTNERSHIPS']

/**
 * Calls Groq to generate a bilingual EN/FR hospitality article.
 * @param {{ title: string, url: string, excerpt: string, source: string }} article
 * @param {{ existingTitles?: string[], existingKeywordSets?: string[] }} context
 * @returns {Promise<{ slug, titleEn, titleFr, excerptEn, excerptFr, category, primaryKeyword, keywords, imageConcept, editorialFormat, linkedinCaption, facebookCaption, xCaption, newsletterTeaser, bodyEn, bodyFr }>}
 */
export async function generatePost(article, context = {}) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const systemPrompt = `You are a senior hospitality editor writing for Hospitality121, a hospitality media platform based in New York, USA. Write for hotel owners, operators, executives, event leaders, recruiters, investors, technology vendors, and guest experience teams. The article must feel human written: natural rhythm, varied sentence length, specific operational observations, and premium editorial judgement. Do not use em dashes. Avoid robotic phrasing, generic transitions, "in today's rapidly evolving world", "it is important to note", "delve", "game changer", "revolutionary", and repeated "cutting edge". Respond with valid JSON only - no markdown, no code fences, no extra text.`

  const userPrompt = `Source article:
Title: ${article.title}
URL: ${article.url}
Excerpt: ${article.excerpt}
Source: ${article.source}

Existing Hospitality121 titles to avoid:
${(context.existingTitles || []).slice(0, 80).map(title => `- ${title}`).join('\n')}

Already used keyword combinations to avoid:
${(context.existingKeywordSets || []).slice(0, 80).map(set => `- ${set}`).join('\n')}

Target editorial format for this run:
${context.targetFormat || 'articles-and-editorials'}

Write an original hospitality article inspired by this source. It must target a primary hospitality keyword and use related terms naturally. Make the angle distinct from existing coverage. Do not copy the source. Do not repeat existing title patterns, introductions, image concepts, CTAs, or article structures.

Rotate the editorial angle across the Hospitality121 navigation sections: articles and editorials, hospitality news analysis, events and conferences, podcasts and interview-style insights, leadership, hotel operations, recruitment and workforce, guest experience, luxury hospitality, sustainability, hospitality technology, AI, revenue, distribution, and hotel investment. Do not make every article about technology.

Return ONLY a JSON object with exactly these keys:
{
  "slug": "kebab-case-max-60-chars",
  "titleEn": "Engaging English title, max 60 chars",
  "titleFr": "Titre en francais accrocheur, max 60 chars",
  "excerptEn": "One sentence English summary, max 155 chars",
  "excerptFr": "Resume en une phrase en francais, max 155 chars",
  "category": "exactly one of: TECHNOLOGY, TRENDS, OPERATIONS, LUXURY, SUSTAINABILITY, WELLNESS, F&B",
  "primaryKeyword": "one natural hospitality keyword",
  "keywords": ["4 to 7 semantically related hospitality keywords"],
  "imageConcept": "Specific realistic premium editorial photo concept, 25-45 words, no generic stock wording",
  "editorialFormat": "use the target editorial format exactly unless the source absolutely requires another Hospitality121 navigation section",
  "linkedinCaption": "Executive LinkedIn post, 55-90 words, no hashtags unless highly relevant",
  "facebookCaption": "Warm professional Facebook caption, 35-65 words",
  "xCaption": "Short X/Twitter version under 240 characters",
  "newsletterTeaser": "Newsletter teaser, 25-45 words",
  "bodyEn": "650-850 words. Use 5-8 paragraphs with natural variation. No headers. Include realistic hospitality operating context. Use the primary keyword naturally, not repetitively. Do NOT mention the source URL.",
  "bodyFr": "Full French translation of bodyEn. Same editorial meaning and natural French flow."
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.82,
    max_tokens: 5200,
  })

  const parsed = JSON.parse(response.choices[0].message.content)

  const required = ['slug', 'titleEn', 'titleFr', 'excerptEn', 'excerptFr', 'category', 'primaryKeyword', 'bodyEn', 'bodyFr', 'keywords', 'imageConcept', 'editorialFormat', 'linkedinCaption', 'facebookCaption', 'xCaption', 'newsletterTeaser']
  for (const key of required) {
    if (parsed[key] == null || parsed[key] === '') throw new Error(`Groq response missing field: ${key}`)
  }
  if (!Array.isArray(parsed.keywords) || parsed.keywords.length < 4) {
    throw new Error('Groq response needs at least four keywords')
  }

  if (!VALID_BLOG_CATEGORIES.includes(parsed.category)) {
    parsed.category = 'TRENDS'
  }

  return parsed
}

/**
 * Calls Groq to generate a concise English news item from a source article.
 * @param {{ title: string, url: string, excerpt: string, source: string }} article
 * @returns {Promise<{ slug, title, description, category, body, keywords }>}
 * @throws if Groq returns malformed JSON or is missing required fields
 */
export async function generateNewsItem(article) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const systemPrompt = `You are a senior hospitality industry news editor for Hospitality121. Write concise, factual industry news for hotel owners, operators, investors, and technology leaders. Do not copy source wording. Respond with valid JSON only - no markdown, no code fences, no extra text.`

  const userPrompt = `Source article:
Title: ${article.title}
URL: ${article.url}
Excerpt: ${article.excerpt}
Source: ${article.source}

Write an original news brief inspired by this article. Return ONLY a JSON object with exactly these keys:
{
  "slug": "kebab-case-max-60-chars",
  "title": "Clear English news headline, max 72 chars",
  "description": "One sentence meta description, max 155 chars",
  "category": "exactly one of: INVESTMENT, TECHNOLOGY, SUSTAINABILITY, WORKFORCE, BRANDS, OPERATIONS, DEVELOPMENT, LUXURY, DISTRIBUTION, PARTNERSHIPS",
  "body": "350-500 words. 5-7 short paragraphs. Factual news tone. Include concrete hospitality implications. Do NOT mention the source URL.",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.55,
    max_tokens: 2500,
  })

  const parsed = JSON.parse(response.choices[0].message.content)

  const required = ['slug', 'title', 'description', 'category', 'body', 'keywords']
  for (const key of required) {
    if (parsed[key] == null || parsed[key] === '') throw new Error(`Groq response missing field: ${key}`)
  }
  if (!Array.isArray(parsed.keywords) || parsed.keywords.length === 0) {
    throw new Error('Groq response missing field: keywords')
  }

  if (!VALID_NEWS_CATEGORIES.includes(parsed.category)) {
    parsed.category = 'OPERATIONS'
  }

  return parsed
}
