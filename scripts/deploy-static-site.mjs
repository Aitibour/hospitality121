import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
const cliRoot = path.join(process.env.APPDATA, 'npm/node_modules/netlify-cli')
const { zipFunctions } = await import(pathToFileURL(path.join(cliRoot, 'node_modules/@netlify/zip-it-and-ship-it/dist/main.js')))
const root = process.cwd()
const config = JSON.parse(await fs.readFile(path.join(process.env.APPDATA, 'netlify/Config/config.json'), 'utf8'))
const token = config.users[config.userId].auth.token
const siteId = '7b971775-1cad-43b5-9172-701405749ba8'
let nextRequestAt = 0
async function api(route, options = {}) {
 for (let attempt = 0; attempt < 7; attempt++) {
  const delay = Math.max(0, nextRequestAt - Date.now())
  nextRequestAt = Math.max(Date.now(), nextRequestAt) + 160
  if (delay) await new Promise(resolve => setTimeout(resolve, delay))
  let response
  try {
    response = await fetch(`https://api.netlify.com/api/v1${route}`, { ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers }, signal: AbortSignal.timeout(60000) })
  } catch (error) {
    if (attempt === 6) throw error
    console.log('Retrying an interrupted network request...')
    await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)))
    continue
  }
  if (response.status === 429 || response.status === 503) {
    console.log(`Netlify requested slower uploads; retrying in ${Math.min(30, 3 * (attempt + 1))} seconds.`)
    await response.text()
    nextRequestAt = Date.now() + Math.min(30000, 3000 * (attempt + 1))
    await new Promise(resolve => setTimeout(resolve, Math.min(30000, 3000 * (attempt + 1))))
    continue
  }
  if (!response.ok) throw new Error(`Netlify API ${response.status}: ${(await response.text()).slice(0,300)}`)
  return response.json()
 }
 throw new Error('Netlify upload retry limit reached')
}
console.log('Bundling site functions...')
const bundleDir = path.join(root, '.netlify/daily-hero-bundle')
const bundles = await zipFunctions(path.join(root, 'netlify/functions'), bundleDir, { basePath: root, config: { '*': { nodeBundler: 'esbuild', nodeVersion: '20.x' } } })
const files = {}, fileByHash = new Map(), functions = {}, functionByHash = new Map()
async function addFile(filename, name) {
  const bytes = await fs.readFile(filename)
  const hash = createHash('sha1').update(bytes).digest('hex')
  files[name] = hash
  fileByHash.set(hash, { name, bytes })
}
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(filename)
    else await addFile(filename, '/' + path.relative(path.join(root, 'out'), filename).replaceAll('\\', '/'))
  }
}
await walk(path.join(root, 'out'))
await addFile(path.join(root, 'netlify.toml'), '/netlify.toml')
for (const bundle of bundles) {
  const bytes = await fs.readFile(bundle.path)
  const hash = createHash('sha256').update(bytes).digest('hex')
  functions[bundle.name] = hash
  functionByHash.set(hash, { bundle, bytes })
}
console.log(`Preparing draft: ${Object.keys(files).length} files, ${bundles.length} function.`)
let deploy = await api(`/sites/${siteId}/deploys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draft: true, async: true, files, functions, framework: 'next', framework_version: '16.4.3', title: 'Original Hospitality121 articles and internal hero reading' }) })
await fs.writeFile('.netlify/daily-hero-deploy.json', JSON.stringify({ id: deploy.id, url: deploy.deploy_ssl_url }))
while (deploy.state === 'preparing' || deploy.state === 'new') {
  await new Promise(resolve => setTimeout(resolve, 1500))
  deploy = await api(`/deploys/${deploy.id}`)
}
const required = deploy.required || []
console.log(`Uploading ${required.length} changed files and ${(deploy.required_functions || []).length} function.`)
let cursor = 0
let uploaded = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < required.length) {
    const hash = required[cursor++]
    const file = fileByHash.get(hash)
    await api(`/deploys/${deploy.id}/files/${file.name.slice(1).split('/').map(encodeURIComponent).join('/')}`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: file.bytes })
    uploaded++
    if (uploaded % 100 === 0) console.log(`Uploaded ${uploaded}/${required.length} changed files`)
  }
}))
for (const hash of deploy.required_functions || []) {
  const { bundle, bytes } = functionByHash.get(hash)
  await api(`/deploys/${deploy.id}/functions/${bundle.name}?runtime=${encodeURIComponent(bundle.runtimeVersion || bundle.runtime)}&invocation_mode=${encodeURIComponent(bundle.invocationMode || 'buffered')}`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: bytes })
}
let lastState
for (let attempt = 0; attempt < 60; attempt++) {
  deploy = await api(`/deploys/${deploy.id}`)
  if (deploy.state !== lastState) console.log(`Deploy ${deploy.id}: ${deploy.state}`)
  lastState = deploy.state
  if (deploy.state === 'ready') break
  if (deploy.state === 'error') throw new Error(deploy.error_message || 'Deploy failed')
  await new Promise(resolve => setTimeout(resolve, 2000))
}
if (deploy.state !== 'ready') throw new Error('Deploy did not finish in the allotted verification period')
await fs.writeFile('.netlify/daily-hero-deploy.json', JSON.stringify({ id: deploy.id, url: deploy.deploy_ssl_url, state: deploy.state }))
console.log(JSON.stringify({ id: deploy.id, url: deploy.deploy_ssl_url, state: deploy.state }))


