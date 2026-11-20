import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

// Private previews require a browser login rather than a Netlify API token.
// In that case verify the exact deployed bytes through the authenticated API.
export async function verifyPreview({ deploy, siteId, api, fetchImpl = fetch, readFile = fs.readFile }) {
  if (deploy.site_id !== siteId || deploy.state !== 'ready') throw new Error('Preview project or readiness mismatch')
  const origin = new URL(deploy.deploy_ssl_url)
  if (origin.protocol !== 'https:' || !origin.hostname.endsWith('.netlify.app')) throw new Error('Invalid preview origin')
  const response = await fetchImpl(`${origin.origin}/hero-feed.json`, { signal: AbortSignal.timeout(30000) })
  const protectedPreview = [401, 403].includes(response.status)
  if (!response.ok && !protectedPreview) throw new Error(`Preview published feed HTTP ${response.status}`)

  async function verifiedFile(filePath) {
    if (!filePath.startsWith('/') || filePath.includes('..') || filePath.includes('\\')) throw new Error('Invalid preview file path')
    const bytes = await readFile(path.join('out', filePath.slice(1)))
    const remote = await api(`/deploys/${deploy.id}/files/${filePath.slice(1).split('/').map(encodeURIComponent).join('/')}`)
    if (remote.deploy_id !== deploy.id || remote.site_id !== siteId || remote.path !== filePath
      || remote.sha !== createHash('sha1').update(bytes).digest('hex') || remote.size !== bytes.length) {
      throw new Error(`Preview file mismatch: ${filePath}`)
    }
    return bytes.toString('utf8')
  }

  const feed = protectedPreview ? JSON.parse(await verifiedFile('/hero-feed.json')) : await response.json()
  if (!feed.items?.length) throw new Error('No published hero articles')
  for (const item of feed.items) {
    if (!/^[a-z0-9-]+$/.test(item.slug) || item.href !== `/content/${item.slug}`) throw new Error('External or invalid hero destination')
    let html
    if (protectedPreview) {
      html = await verifiedFile(`${item.href}.html`)
      if (!/^\/images\/[a-zA-Z0-9/_.-]+$/.test(item.image || '')) throw new Error('Invalid preview image')
      await verifiedFile(item.image)
    } else {
      const article = await fetchImpl(`${origin.origin}${item.href}`, { signal: AbortSignal.timeout(30000) })
      if (!article.ok) throw new Error(`Article verification HTTP ${article.status}: ${item.slug}`)
      html = await article.text()
    }
    const escapedTitle = item.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')
    if (!html.includes('<article') || (!html.includes(item.title) && !html.includes(escapedTitle))
      || !html.includes(`https://hospitality121.com${item.href}`)) throw new Error(`Article verification failed: ${item.slug}`)
  }
  return { mode: protectedPreview ? 'authenticated_file_hashes' : 'preview_http', articles: feed.items.length }
}
