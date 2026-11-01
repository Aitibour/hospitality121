import { getStore } from '@netlify/blobs'
import { timingSafeEqual } from 'node:crypto'
import { runBufferSlot } from '../lib/buffer-publisher.mjs'
import { bufferClient } from '../lib/buffer-client.mjs'
import { isPublishedProduction } from '../lib/production.mjs'

export default async function handler(request, context) {
  const expected = `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET || ''}`, actual = request.headers.get('authorization') || ''
  if (!process.env.SOCIAL_AUTOMATION_SECRET || Buffer.byteLength(expected) !== Buffer.byteLength(actual) || !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) return new Response(null, { status: 401 })
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (!isPublishedProduction(context) || process.env.LINKEDIN_AUTOMATION_ENABLED !== 'true') return
  const store = getStore({ name: 'hospitality121-linkedin', consistency: 'strong' })
  try {
    const result = await runBufferSlot({ store, platform: 'linkedin', client: bufferClient({ apiKey: process.env.BUFFER_API_KEY, channelId: process.env.BUFFER_LINKEDIN_CHANNEL_ID, organizationId: process.env.BUFFER_ORGANIZATION_ID, accountId: process.env.LINKEDIN_ACCOUNT_ID, service: 'linkedin' }) })
    await store.setJSON('health', { status: result.status, checkedAt: new Date().toISOString(), postUrl: result.postUrl })
  } catch (error) {
    await store.setJSON('health', { status: 'needs_attention', checkedAt: new Date().toISOString(), error: error.message })
    throw error
  }
}
