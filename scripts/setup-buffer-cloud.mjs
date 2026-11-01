import fs from 'node:fs'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { randomBytes } from 'node:crypto'
import { bufferClient } from '../netlify/lib/buffer-client.mjs'

const local = parseEnv(fs.readFileSync('.env.buffer.local', 'utf8'))
if (!local.BUFFER_API_KEY?.trim()) throw new Error('Save the Hospitality121 Buffer API key in .env.buffer.local first')
const key = local.BUFFER_API_KEY.trim()
async function buffer(query, variables = {}) {
  const r = await fetch('https://api.buffer.com', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(20000) })
  const result = await r.json()
  if (!r.ok || result.errors?.length) throw new Error('Buffer account lookup failed')
  return result.data
}
const { account } = await buffer('query{account{organizations{id name}}}')
const matches = []
for (const org of account.organizations) {
  const { channels } = await buffer('query($input:ChannelsInput!){channels(input:$input){id name service serviceId}}', { input: { organizationId: org.id } })
  for (const channel of channels) if (channel.service === 'twitter' && channel.serviceId === '2053714931216781312' && channel.name.toLowerCase().replace(/^@/, '') === 'hospitality_121') matches.push({ channel, org })
}
if (matches.length !== 1) throw new Error('Exactly one connected @Hospitality_121 Buffer channel is required; no other account will be used')
const { channel, org } = matches[0]
const client = bufferClient({ apiKey: key, channelId: channel.id, organizationId: org.id })
await client.verify()
await client.recent()
console.log('Verified Buffer channel @Hospitality_121 and recent-post access; no posts sent')
if (!process.argv.includes('--save')) process.exit(0)
const config = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA, 'netlify/Config/config.json'), 'utf8'))
const token = config.users[config.userId].auth.token
const base = 'https://api.netlify.com/api/v1/accounts/59026eb6cf321c7359e9f482/env', query = '?site_id=7b971775-1cad-43b5-9172-701405749ba8'
async function netlify(url, options = {}) {
  const r = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000) })
  if (!r.ok) throw new Error(`Netlify configuration HTTP ${r.status}`)
  return r.status === 204 ? null : r.json()
}
const entries = await netlify(base + query)
const secret = entries.find(e => e.key === 'SOCIAL_AUTOMATION_SECRET')?.values?.find(v => v.context === 'all')?.value || randomBytes(32).toString('hex')
// Enable last, after every verified setting has been saved.
for (const [k, value] of Object.entries({ X_AUTOMATION_ENABLED: 'false', BUFFER_API_KEY: key, BUFFER_X_CHANNEL_ID: channel.id, BUFFER_ORGANIZATION_ID: org.id, X_ACCOUNT_ID: channel.serviceId, X_PUBLISH_PROVIDER: 'buffer', SOCIAL_AUTOMATION_SECRET: secret })) {
  const exists = entries.some(e => e.key === k), body = { key: k, values: [{ context: 'all', value }] }
  await netlify(base + (exists ? `/${k}` : '') + query, { method: exists ? 'PUT' : 'POST', body: JSON.stringify(exists ? body : [body]) })
}
await netlify(base + '/X_AUTOMATION_ENABLED' + query, { method: 'PUT', body: JSON.stringify({ key: 'X_AUTOMATION_ENABLED', values: [{ context: 'all', value: 'true' }] }) })
console.log('Verified Buffer production settings saved. Redeploy to activate cloud scheduling.')
