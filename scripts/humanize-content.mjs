import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(process.cwd(), 'content')
const TARGET_DIRS = ['articles', 'blog', 'events', 'news', 'podcasts']

function humanize(body) {
  return body
    .replace(/(\d)\u2013(\d)/g, '$1 to $2')
    .replace(/ \u2014 /g, ', ')
    .replace(/ \u2013 /g, ' to ')
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, ' to ')
    .replace(/ -- /g, ', ')
    .replace(/\u00E2\u20AC\u201D/g, ', ')
    .replace(/\u00E2\u20AC\u201C/g, ' to ')
    .replace(/\u00E2\u20AC\u2122/g, "'")
    .replace(/\u00E2\u20AC\u0153|\u00E2\u20AC\uFFFD/g, '"')
    .replace(/\uFFFD/g, ', ')
    .replace(/\bIn conclusion,\s*/gi, '')
    .replace(/\bin conclusion\b/gi, 'overall')
    .replace(/\bAs the hospitality industry continues to evolve,?\s*/gi, 'As hotel operators adapt to new market conditions, ')
    .replace(/\bAs the travel industry continues to evolve,?\s*/gi, 'As travel companies adapt to new market conditions, ')
    .replace(/\bcannot be overstated\b/gi, 'is significant')
    .replace(/\bEn conclusion,\s*/gi, '')
    .replace(/\ben conclusion\b/gi, 'dans l’ensemble')
    .replace(/À mesure que l'industrie continue d'évoluer,?\s*/gi, "À mesure que les opérateurs s'adaptent aux nouvelles conditions du marché, ")
    .replace(/À mesure que l'industrie hôtelière continue d'évoluer(?: et de devenir de plus en plus concurrentielle)?,?\s*/gi, "À mesure que les hôteliers s'adaptent aux nouvelles conditions du marché, ")
    .replace(/Alors que le paysage de l’hôtellerie de luxe continue d'évoluer,?\s*/gi, "À mesure que l'hôtellerie de luxe change, ")
    .replace(/\bne peut être surestimée\b/gi, 'est significative')
    .replace(/\brévolutionner\b/gi, 'transformer')
    .replace(/\brevolutionary\b/gi, 'material')
    .replace(/\bleveraging\b/gi, 'using')
    .replace(/\bleveraged\b/gi, 'used')
    .replace(/\bleverages\b/gi, 'uses')
    .replace(/\bleverage\b/gi, 'use')
    .replace(/\. the appointment/g, '. The appointment')
    .replace(/\. the rise/g, '. The rise')
    .replace(/\. the importance/g, '. The importance')
    .replace(/\. the luxury/g, '. The luxury')
    .replace(/\. the launch/g, '. The launch')
    .replace(/\. l'industrie/g, ". L'industrie")
    .replace(/\. le système/g, '. Le système')
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .join('\n')
}

function normalizeFile(raw) {
  return raw.replace(/^\uFEFF/, '')
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const raw = normalizeFile(original)
  const fmEnd = raw.indexOf('---', 3)
  if (fmEnd === -1) return false

  const frontmatter = raw.slice(0, fmEnd + 3)
  const body = raw.slice(fmEnd + 3)
  const newBody = humanize(body)

  if (newBody === body && raw === original) return false

  fs.writeFileSync(filePath, frontmatter + newBody, 'utf8')
  return true
}

const files = []
for (const dir of TARGET_DIRS) {
  const dirPath = path.join(ROOT, dir)
  if (!fs.existsSync(dirPath)) continue
  for (const file of fs.readdirSync(dirPath)) {
    if (file.endsWith('.mdx')) files.push(path.join(dirPath, file))
  }
}

console.log(`Processing ${files.length} files...`)
let changed = 0
for (const file of files) {
  const wasChanged = processFile(file)
  const label = path.relative(ROOT, file)
  console.log(`${wasChanged ? 'updated' : 'clean'} ${label}`)
  if (wasChanged) changed++
}

console.log(`Done. ${changed}/${files.length} files updated.`)
