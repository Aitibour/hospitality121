import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const config = process.env.NETLIFY_AUTH_TOKEN ? null : JSON.parse(await fs.readFile(path.join(process.env.APPDATA, 'netlify/Config/config.json'), 'utf8'))
const token = process.env.NETLIFY_AUTH_TOKEN || config.users[config.userId].auth.token
const siteId = 'bb6c21e7-de00-4c8e-b2ce-28a3ea1af4b7'
async function api(route, method = 'GET', body) {
  const response = await fetch(`https://api.netlify.com/api/v1${route}`, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Netlify HTTP ${response.status}`)
  return response.json()
}
const state = JSON.parse(await fs.readFile('.netlify/daily-hero-deploy.json', 'utf8'))
const deploy = await api(`/deploys/${state.id}`)
if (deploy.site_id !== siteId) throw new Error('Preview belongs to a different Netlify project')
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
// Restoring a preview keeps its deploy-preview context and disables production-only
// scheduled functions. Reuse its already-uploaded hashes in a production deploy.
let production = deploy
if (deploy.context !== 'production') {
  const manifest = JSON.parse(await fs.readFile('.netlify/daily-hero-manifest.json', 'utf8'))
  // This manually managed site has no linked production branch. Supplying a
  // branch would create a branch-deploy, so production deliberately has none.
  let pending
  try { pending = JSON.parse(await fs.readFile('.netlify/production-pending.json', 'utf8')) } catch { /* First release. */ }
  if (pending?.previewId === state.id) production = await api(`/deploys/${pending.id}`)
  else {
    const startedAt = Date.now()
    try {
      production = await api(`/sites/${siteId}/deploys`, 'POST', { ...manifest, draft: false, async: true, framework: 'next', framework_version: '16.4.3', title: 'Verified Hospitality121 production release' })
    } catch (error) {
      // A request timeout can occur after Netlify accepts the manifest. Recover
      // that exact new release rather than creating another production upload.
      const recent = await api(`/sites/${siteId}/deploys?per_page=10`)
      const candidate = recent.find(item => item.context === 'production' && item.title === 'Verified Hospitality121 production release' && Date.parse(item.created_at) >= startedAt - 2000 && !item.published_at)
      if (!candidate) throw error
      production = await api(`/deploys/${candidate.id}`)
      if (production.required?.length || production.required_functions?.some(hash => !Object.values(manifest.functions).includes(hash))) throw error
    }
  }
  await fs.writeFile('.netlify/production-pending.json', JSON.stringify({ id: production.id, previewId: state.id }))
  for (let attempt = 0; attempt < 90 && ['new', 'preparing'].includes(production.state); attempt++) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    production = await api(`/deploys/${production.id}`)
  }
  if (production.required?.length) throw new Error('Production requires static files outside the verified preview cache')
  // Netlify may require re-uploading function bundles when switching contexts,
  // even though their file hashes match the verified preview exactly.
  const bundleManifest = JSON.parse(await fs.readFile('.netlify/daily-hero-bundle/manifest.json', 'utf8'))
  for (const hash of production.required_functions || []) {
    const entries = await Promise.all(bundleManifest.functions.map(async fn => ({ fn, bytes: await fs.readFile(fn.path) })))
    const entry = entries.find(({ bytes }) => createHash('sha256').update(bytes).digest('hex') === hash)
    if (!entry) throw new Error('Verified function bundle not available for production')
    for (let attempt = 0; attempt < 5; attempt++) {
      production = await api(`/deploys/${production.id}`)
      if (production.state === 'ready' || !production.required_functions?.includes(hash)) break
      try {
        const { fn, bytes } = entry
        const response = await fetch(`https://api.netlify.com/api/v1/deploys/${production.id}/functions/${fn.name}?runtime=${encodeURIComponent(fn.runtimeVersion || fn.runtime)}&invocation_mode=${encodeURIComponent(fn.invocationMode || 'buffered')}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' }, body: bytes, signal: AbortSignal.timeout(45000) })
        if (response.ok) { await response.text(); break }
        if (![429, 503].includes(response.status)) throw new Error(`Production function upload HTTP ${response.status}`)
        await response.text()
      } catch (error) { if (attempt === 4) throw error }
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)))
    }
  }
  for (let attempt = 0; attempt < 90 && production.state !== 'ready'; attempt++) {
    if (production.state === 'error') throw new Error('Production release failed')
    await new Promise(resolve => setTimeout(resolve, 2000))
    production = await api(`/deploys/${production.id}`)
  }
  if (production.state !== 'ready' || production.context !== 'production') throw new Error('Production context was not established')
}
await api(`/sites/${siteId}/deploys/${production.id}/restore`, 'POST')
const current = await api(`/sites/${siteId}`)
if (current.published_deploy.id !== production.id) throw new Error('Unexpected production deploy')
receipt.previewDeployId = state.id
receipt.deployId = production.id
receipt.deployUrl = production.deploy_ssl_url
await fs.writeFile('.netlify/daily-hero-deploy.json', JSON.stringify({ id: production.id, url: production.deploy_ssl_url, state: production.state }))
receipt.publishedAt = new Date().toISOString()
await fs.writeFile(receiptFile, JSON.stringify(receipt, null, 2))
console.log(JSON.stringify({ ...receipt, receiptFile }))
