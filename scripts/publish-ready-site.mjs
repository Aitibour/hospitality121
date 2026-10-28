import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const config = JSON.parse(await fs.readFile(path.join(process.env.APPDATA, 'netlify/Config/config.json'), 'utf8'))
const token = config.users[config.userId].auth.token
const siteId = '7b971775-1cad-43b5-9172-701405749ba8'
async function api(route, method = 'GET') {
  const response = await fetch(`https://api.netlify.com/api/v1${route}`, { method, headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Netlify HTTP ${response.status}`)
  return response.json()
}
const state = JSON.parse(await fs.readFile('.netlify/daily-hero-deploy.json', 'utf8'))
const deploy = await api(`/deploys/${state.id}`)
if (deploy.state !== 'ready') throw new Error('Preview is not ready')
const feedResponse = await fetch(`${deploy.deploy_ssl_url}/hero-feed.json`)
if (!feedResponse.ok) throw new Error('Preview published feed failed')
const feed = await feedResponse.json()
if (!feed.items?.length) throw new Error('No published hero articles')
for (const item of feed.items) {
  if (!/^[a-z0-9-]+$/.test(item.slug) || item.href !== `/content/${item.slug}`) throw new Error('External or invalid hero destination')
  const response = await fetch(`${deploy.deploy_ssl_url}${item.href}`)
  if (!response.ok || !(await response.text()).includes(item.title)) throw new Error(`Article verification failed: ${item.slug}`)
}
const before = await api(`/sites/${siteId}`)
const receipt = { authorisedBy: 'Owner authorised original articles and deployment without another approval', websiteCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), previousDeployId: before.published_deploy.id, deployId: state.id, deployUrl: deploy.deploy_ssl_url, url: 'https://hospitality121.com/', publishedAt: null }
await fs.mkdir('reports/deployments', { recursive: true })
const receiptFile = `reports/deployments/${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}-original-articles.json`
await fs.writeFile(receiptFile, JSON.stringify(receipt, null, 2))
await api(`/sites/${siteId}/deploys/${state.id}/restore`, 'POST')
const current = await api(`/sites/${siteId}`)
if (current.published_deploy.id !== state.id) throw new Error('Unexpected production deploy')
receipt.publishedAt = new Date().toISOString()
await fs.writeFile(receiptFile, JSON.stringify(receipt, null, 2))
console.log(JSON.stringify({ ...receipt, receiptFile }))
