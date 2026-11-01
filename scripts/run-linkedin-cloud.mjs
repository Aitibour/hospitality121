import fs from 'node:fs/promises'
import { runBufferSlot } from '../netlify/lib/buffer-publisher.mjs'
import { bufferClient } from '../netlify/lib/buffer-client.mjs'
import { vancouverSlot } from '../netlify/lib/x-publisher.mjs'
import { githubSocialStore } from './lib/github-social-store.mjs'

const now = new Date()
const client = bufferClient({ apiKey: process.env.BUFFER_API_KEY, channelId: '6ae6ae09e29c69a1711eac29', organizationId: '6ae6adb11bfb2511a898d37a', accountId: 'urn:li:organization:116020434', service: 'linkedin' })
const channel = await client.verify()
const posts = await client.recent(now)
const result = vancouverSlot(now)
  ? await runBufferSlot({ now, platform: 'linkedin', client, store: githubSocialStore({ token: process.env.GITHUB_TOKEN }) })
  : { status: 'outside_schedule' }
const receipt = { checkedAt: now.toISOString(), provider: 'buffer', runtime: 'GitHub Actions', channel: channel.name, company: channel.serviceId, timeZone: 'America/Vancouver', hours: [9, 13], recentPosts: posts.length, ...result }
await fs.mkdir('reports/deployments', { recursive: true })
await fs.writeFile('reports/deployments/linkedin-cloud-run.json', JSON.stringify(receipt, null, 2))
console.log(JSON.stringify(receipt))
