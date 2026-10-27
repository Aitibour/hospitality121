import fs from 'node:fs'
import { articleDescription } from '../lib/article-markdown.mjs'

const inventory = JSON.parse(fs.readFileSync('reports/editorial-audit/inventory.json', 'utf8'))
const drafts = inventory.records.filter(r => ['articles', 'news', 'blog'].includes(r.file.split('/')[1])).map(record => {
  const headline = record.metadata.title
  const short = [...headline].slice(0, 85).join('') + ([...headline].length > 85 ? '…' : '')
  return { file: record.file, status: 'review', factsVerified: false, url: record.canonical, previewTitle: headline, previewDescription: articleDescription(record.metadata, record.body), image: record.metadata.image, imageRights: 'not verified', linkedin: `${headline}\n\n${articleDescription(record.metadata, record.body)}\n\nWhat does this mean for your hotel? Share your perspective with your team.\n${record.canonical}`, x: `${short}\n${record.canonical}\nDiscuss with your team.`, note: 'Draft only. Review source accuracy, image rights, canonical route and caption before posting. A duplicate-slug record may not match the public article.' }
})
fs.writeFileSync('reports/editorial-audit/social-drafts.json', JSON.stringify({ generatedAt: new Date().toISOString(), publishEnabled: false, drafts }, null, 2))
console.log(`${drafts.length} social review drafts saved. No posts sent.`)
