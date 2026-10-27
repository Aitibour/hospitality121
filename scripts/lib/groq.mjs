import Groq from 'groq-sdk'

const VALID_BLOG_CATEGORIES = ['TECHNOLOGY', 'TRENDS', 'OPERATIONS', 'LUXURY', 'SUSTAINABILITY', 'WELLNESS', 'F&B']
const VALID_NEWS_CATEGORIES = ['INVESTMENT', 'TECHNOLOGY', 'SUSTAINABILITY', 'WORKFORCE', 'BRANDS', 'OPERATIONS', 'DEVELOPMENT', 'LUXURY', 'DISTRIBUTION', 'PARTNERSHIPS']

const EDITORIAL_STYLE = `Prepare an editorial REVIEW DRAFT in the voice of an experienced hospitality technology journalist. The RSS excerpt is incomplete evidence, not a licence to fill gaps. Attribute every reported development to the named publisher. Separate what the excerpt reports from operational analysis and unanswered questions. Never invent quotes, interviews, statistics, product capabilities, research findings, dates, experience or results. Do not claim to have interviewed anyone or inspected the original article. Omit details the excerpt cannot support; say what needs confirmation. Match depth to evidence, without padding or a minimum word count. Explain a relevant workflow, decision or trade-off in clear English and natural French. Headlines must be specific and complete, at most 90 characters, with no clickbait. Social captions are drafts only. End with one useful reader question; the website supplies the follow CTA separately.`

/**
 * Calls Groq to generate a bilingual EN/FR hospitality article.
 * @param {{ title: string, url: string, excerpt: string, source: string }} article
 * @param {{ existingTitles?: string[], existingKeywordSets?: string[] }} context
 * @returns {Promise<{ slug, titleEn, titleFr, excerptEn, excerptFr, category, primaryKeyword, keywords, imageConcept, editorialFormat, linkedinCaption, facebookCaption, xCaption, newsletterTeaser, bodyEn, bodyFr }>}
 */
export async function generatePost(article, context = {}) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const systemPrompt = `You are preparing a hospitality technology editorial draft for Hospitality121. Write for hotel operators and IT leaders. Use clear, natural language. Do not use em dashes. Avoid hype, generic transitions and keyword stuffing. Respond with valid JSON only.`

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

Choose a source-supported angle about hotel technology, AI, cybersecurity or technology in hotel operations. Never manufacture an interview or podcast from an RSS excerpt.

Return ONLY a JSON object with exactly these keys:
{
  "slug": "kebab-case-max-60-chars",
  "titleEn": "Specific, complete English headline, max 90 chars",
  "titleFr": "Titre francais precis et complet, max 90 chars",
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
  "bodyEn": "Write only as much as the available evidence supports. Attribute the publisher, explain the development, distinguish operational analysis, and identify what remains unknown. Use Markdown paragraphs and useful headings. Do not imply original reporting.",
  "bodyFr": "Full French translation of bodyEn. Same editorial meaning and natural French flow."
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: `${systemPrompt}\n${EDITORIAL_STYLE}` },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.82,
    max_tokens: 5200,
  })

  const parsed = JSON.parse(response.choices[0].message.content)
  if (parsed.titleEn?.length > 90 || parsed.titleFr?.length > 90) throw new Error('Headline exceeds 90 characters')

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
  "title": "Specific, complete English headline, max 90 chars",
  "description": "One sentence meta description, max 155 chars",
  "category": "exactly one of: INVESTMENT, TECHNOLOGY, SUSTAINABILITY, WORKFORCE, BRANDS, OPERATIONS, DEVELOPMENT, LUXURY, DISTRIBUTION, PARTNERSHIPS",
  "body": "A short, attributed news draft limited to what the excerpt supports. No minimum word count. Explain the operational question and what needs confirmation. Never invent details to lengthen the brief.",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: `${systemPrompt}\n${EDITORIAL_STYLE}` },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.55,
    max_tokens: 2500,
  })

  const parsed = JSON.parse(response.choices[0].message.content)
  if (parsed.title?.length > 90) throw new Error('Headline exceeds 90 characters')

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
