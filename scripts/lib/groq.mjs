import Groq from 'groq-sdk'

const VALID_CATEGORIES = ['TRENDS', 'TECHNOLOGY', 'SUSTAINABILITY', 'WELLNESS', 'OPERATIONS', 'LUXURY', 'F&B']
const VALID_NEWS_CATEGORIES = ['INVESTMENT', 'TECHNOLOGY', 'SUSTAINABILITY', 'WORKFORCE', 'BRANDS', 'OPERATIONS', 'DEVELOPMENT', 'LUXURY', 'DISTRIBUTION', 'PARTNERSHIPS']

/**
 * Calls Groq to generate a bilingual EN/FR blog post from a source article.
 * @param {{ title: string, url: string, excerpt: string, source: string }} article
 * @returns {Promise<{ slug, titleEn, titleFr, excerptEn, excerptFr, category, bodyEn, bodyFr, keywords }>}
 * @throws if Groq returns malformed JSON or is missing required fields
 */
export async function generatePost(article) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const systemPrompt = `You are a senior hospitality industry journalist writing for Hospitality121, a bilingual EN/FR professional media brand read by hotel owners, operators, and investors. Write with authority and insight. Avoid jargon and fluff. Respond with valid JSON only — no markdown, no code fences, no extra text.`

  const userPrompt = `Source article:
Title: ${article.title}
URL: ${article.url}
Excerpt: ${article.excerpt}
Source: ${article.source}

Write an original commentary post inspired by this article. Return ONLY a JSON object with exactly these keys:
{
  "slug": "kebab-case-max-60-chars",
  "titleEn": "Engaging English title, max 60 chars",
  "titleFr": "Titre en français accrocheur, max 60 chars",
  "excerptEn": "One sentence English summary, max 155 chars",
  "excerptFr": "Résumé en une phrase en français, max 155 chars",
  "category": "exactly one of: TRENDS, TECHNOLOGY, SUSTAINABILITY, WELLNESS, OPERATIONS, LUXURY, F&B",
  "bodyEn": "400-600 words. 4-6 paragraphs separated by double newlines. Use **bold** for key terms. No headers. Industry tone. Do NOT mention the source URL.",
  "bodyFr": "Full French translation of bodyEn. Same structure, natural French (not literal), same word count.",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 4000,
  })

  const parsed = JSON.parse(response.choices[0].message.content)

  const required = ['slug', 'titleEn', 'titleFr', 'excerptEn', 'excerptFr', 'category', 'bodyEn', 'bodyFr', 'keywords']
  for (const key of required) {
    if (parsed[key] == null || parsed[key] === '') throw new Error(`Groq response missing field: ${key}`)
  }
  if (!Array.isArray(parsed.keywords) || parsed.keywords.length === 0) {
    throw new Error('Groq response missing field: keywords')
  }

  if (!VALID_CATEGORIES.includes(parsed.category)) {
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
