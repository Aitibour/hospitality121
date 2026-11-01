import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const local = JSON.parse(await fs.readFile('out/hero-feed.json', 'utf8'))
const response = await fetch('https://hospitality121.com/hero-feed.json')
assert.equal(response.status, 200)
const live = await response.json()
assert.equal(live.items[0].slug, local.items[0].slug)
const item = live.items[0]
assert.equal(item.href, `/content/${item.slug}`)
const article = await fetch(`https://hospitality121.com${item.href}`)
assert.equal(article.status, 200)
const html = await article.text()
assert(html.includes('<article'))
assert(html.includes(`https://hospitality121.com${item.href}`))
const image = await fetch(`https://hospitality121.com${item.image}`)
assert.equal(image.status, 200)
await fs.writeFile('reports/deployments/cloud-live-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), slug: item.slug, articleStatus: article.status, imageStatus: image.status, firstHeroItem: true }, null, 2))
console.log(`Live article and hero verified: ${item.href}`)
