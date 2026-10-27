import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import matter from 'gray-matter'
import sharp from 'sharp'
import { isAllowedRegionalArticle } from './lib/content-quality.mjs'
import { publicContentSlug } from '../lib/content-routing.mjs'

const root = process.cwd()
const sha = value => createHash('sha256').update(value).digest('hex')
const group = (records, key) => {
  const map = new Map()
  for (const record of records) {
    const value = key(record)
    if (value) map.set(value, [...(map.get(value) || []), record.file])
  }
  return [...map.entries()].filter(([, files]) => files.length > 1).map(([value, files]) => ({ value, files }))
}
const records = []
for (const directory of ['articles', 'blog', 'news', 'podcasts', 'events']) {
  for (const file of fs.readdirSync(path.join(root, 'content', directory)).filter(f => f.endsWith('.mdx')).sort()) {
    const relative = `content/${directory}/${file}`
    const contentType = { articles: 'article', blog: 'blog', news: 'news', podcasts: 'podcast', events: 'event' }[directory]
    const slug = publicContentSlug(contentType, file.slice(0, -4))
    const { data, content } = matter(fs.readFileSync(relative, 'utf8'))
    const english = content.split(/<!--\s*FR\s*-->/)[0].trim()
    const flags = []
    if (!data.sourceUrl) flags.push('Source evidence not recorded; material claims require editorial review')
    if (data.sourceUrl) {
      try { if (new URL(data.sourceUrl).protocol !== 'https:') flags.push('Source URL is not HTTPS') }
      catch { flags.push('Invalid source URL') }
    }
    if (!Number.isFinite(Date.parse(data.date)) || Date.parse(data.date) > Date.now()) flags.push('Invalid or future publication date')
    const words = english.split(/\s+/).filter(Boolean).length
    if (words < 150) flags.push('Short body: assess completeness for content type')
    if (/\b\d[\d,.]*\s*(?:%|percent|million|billion)|[$€£]\s*\d/i.test(english)) flags.push('Quantitative claims require source comparison')
    if (/\b(?:interview|we spoke|told us|exclusive)\b/i.test(`${data.title} ${english}`)) flags.push('Interview or original-reporting claim: obtain transcript/evidence')
    if (!data.description && !data.excerpt) flags.push('No explicit meta description; rendered fallback used')
    if (!data.imageAlt) flags.push('Descriptive image alt text not recorded')
    if (!data.imageCredit || !data.imageLicense || !data.imageSource) flags.push('Image credit, licence or provenance incomplete')
    if (!data.title || !english) flags.push('Missing headline or body')
    if (/^(?:the future of|how .+ is transforming)/i.test(data.title || '')) flags.push('Generic headline: assess specificity')
    let imageHash = null, dimensions = null
    if (data.image?.startsWith('/') && !data.image.startsWith('//')) {
      const imagePath = path.join(root, 'public', data.image)
      if (fs.existsSync(imagePath)) {
        imageHash = sha(fs.readFileSync(imagePath))
        try { const meta = await sharp(imagePath).metadata(); dimensions = { width: meta.width, height: meta.height } }
        catch { flags.push('Image cannot be decoded') }
      } else flags.push('Missing local image')
    } else flags.push('Remote image requires availability and rights review')
    records.push({ file: relative, slug, canonical: `https://hospitality121.com/content/${slug}`, metadata: data, body: content, englishWords: words, bodyHash: sha(english.toLowerCase().replace(/\s+/g, ' ')), imageHash, dimensions, visibleUnderExistingRegionPolicy: isAllowedRegionalArticle({ title: data.title, excerpt: [data.category, data.excerpt, data.description].filter(Boolean).join(' '), source: data.source || '' }), review: 'flagged', factCheck: 'not independently verified', flags })
  }
}
const exactBodies = group(records, r => r.bodyHash)
const duplicateSlugs = group(records, r => r.slug)
const duplicateImages = group(records, r => r.imageHash)
const duplicateTitles = group(records, r => r.metadata.title?.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''))
const sourceDuplicates = group(records, r => r.metadata.sourceUrl?.replace(/[?#].*$/, '').replace(/\/$/, ''))
const similarHeadlines = []
for (let i = 0; i < records.length; i++) for (let j = i + 1; j < records.length; j++) {
  const tokens = text => new Set(text.toLowerCase().match(/[a-z0-9]{4,}/g) || [])
  const a = tokens(records[i].metadata.title || ''), b = tokens(records[j].metadata.title || '')
  const common = [...a].filter(word => b.has(word)).length
  if (Math.min(a.size, b.size) >= 4 && common / Math.max(a.size, b.size) >= 0.75) similarHeadlines.push([records[i].file, records[j].file])
}
for (const duplicates of [exactBodies, duplicateImages, duplicateTitles, sourceDuplicates]) for (const cluster of duplicates) {
  for (const file of cluster.files) records.find(r => r.file === file).flags.push('Duplicate cluster: see report for body/image/headline/source match')
}
const summary = { total: records.length, visibleUnderExistingRegionPolicy: records.filter(r => r.visibleUnderExistingRegionPolicy).length, distinctContentUrls: new Set(records.filter(r => r.visibleUnderExistingRegionPolicy).map(r => r.slug)).size, correctedArticleBodies: 0, substantivelyFactChecked: 0, flagged: records.length, unchangedArticleFiles: records.length, missingImages: records.filter(r => r.flags.includes('Missing local image')).length, imageRightsIncomplete: records.filter(r => r.flags.includes('Image credit, licence or provenance incomplete')).length, exactBodyGroups: exactBodies.length, duplicateSlugGroups: duplicateSlugs.length, duplicateImageGroups: duplicateImages.length, duplicateTitleGroups: duplicateTitles.length, repeatedSourceGroups: sourceDuplicates.length, similarHeadlinePairs: similarHeadlines.length }
fs.mkdirSync('reports/editorial-audit', { recursive: true })
fs.writeFileSync('reports/editorial-audit/inventory.json', JSON.stringify({ generatedAt: new Date().toISOString(), method: 'Automated full-archive inventory and risk screening; not a substantive editorial review or fact-check. Regional visibility follows existing frontmatter-based policy.', summary, exactBodies, duplicateSlugs, duplicateImages, duplicateTitles, sourceDuplicates, similarHeadlines, records }, null, 2))
fs.writeFileSync('reports/editorial-audit/review-queue.csv', '\uFEFF' + ['file,title,words,factCheck,flags', ...records.map(r => [r.file, r.metadata.title, r.englishWords, r.factCheck, r.flags.join('; ')].map(v => `"${String(v).replaceAll('"', '""')}"`).join(','))].join('\n'))
console.log(JSON.stringify(summary, null, 2))
