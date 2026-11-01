import fs from 'node:fs'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { bufferClient } from '../netlify/lib/buffer-client.mjs'

const { BUFFER_API_KEY } = parseEnv(fs.readFileSync('.env.buffer.local', 'utf8'))
const channelId = '6ae6ae09e29c69a1711eac29', accountId = 'urn:li:organization:116020434', organizationId = '6ae6adb11bfb2511a898d37a'
const client = bufferClient({ apiKey: BUFFER_API_KEY, channelId, organizationId, accountId, service: 'linkedin' })
await client.verify()
await client.recent()
console.log('Verified Hospitality121 LinkedIn company page and recent-post access; no posts sent')
if (!process.argv.includes('--save')) process.exit(0)
const c = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA, 'netlify/Config/config.json'), 'utf8'))
const headers = { Authorization: `Bearer ${c.users[c.userId].auth.token}`, 'Content-Type': 'application/json' }
const base = 'https://api.netlify.com/api/v1/accounts/59026eb6cf321c7359e9f482/env', query = '?site_id=7b971775-1cad-43b5-9172-701405749ba8'
const response = await fetch(base + query, { headers, signal: AbortSignal.timeout(20000) })
if (!response.ok) throw new Error('Unable to read cloud settings')
const entries = await response.json()
for (const [key, value] of Object.entries({ BUFFER_LINKEDIN_CHANNEL_ID: channelId, LINKEDIN_ACCOUNT_ID: accountId, LINKEDIN_AUTOMATION_ENABLED: 'true' })) {
  const exists = entries.some(e => e.key === key), body = { key, values: [{ context: 'all', value }] }
  const saved = await fetch(base + (exists ? `/${key}` : '') + query, { method: exists ? 'PUT' : 'POST', headers, body: JSON.stringify(exists ? body : [body]), signal: AbortSignal.timeout(20000) })
  if (!saved.ok) throw new Error(`Cloud LinkedIn settings HTTP ${saved.status}`)
}
console.log('Verified LinkedIn settings enabled. Deploy required to activate scheduler.')
