import { getStore } from '@netlify/blobs'
import { timingSafeEqual } from 'node:crypto'
import { runBufferSlot } from '../lib/buffer-publisher.mjs'
import { bufferClient } from '../lib/buffer-client.mjs'
import { isPublishedProduction } from '../lib/production.mjs'

export default async function handler(request, context) {
  const expected = `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET || ''}`
  const actual = request.headers.get('authorization') || ''
  if (!process.env.SOCIAL_AUTOMATION_SECRET || Buffer.byteLength(expected) !== Buffer.byteLength(actual) || !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) return new Response(null, { status: 401 })
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (!isPublishedProduction(context) || process.env.X_AUTOMATION_ENABLED !== 'true') return
  const store = getStore({ name: 'hospitality121-x', consistency: 'strong' })
  try {
    if (process.env.X_PUBLISH_PROVIDER !== 'buffer') throw new Error('Only the owner-selected Buffer provider is enabled')
    const result = await runBufferSlot({ store, client: bufferClient({ apiKey: process.env.BUFFER_API_KEY, channelId: process.env.BUFFER_X_CHANNEL_ID, organizationId: process.env.BUFFER_ORGANIZATION_ID, accountId: process.env.X_ACCOUNT_ID }) })
    await store.setJSON('health', { status: result.status, checkedAt: new Date().toISOString(), postUrl: result.postUrl, replyUrl: result.replyUrl })
  } catch (error) {
    await store.setJSON('health', { status: 'needs_attention', checkedAt: new Date().toISOString(), error: error.message })
    throw error
  }
}
