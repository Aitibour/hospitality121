import { timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { bufferClient } from '../lib/buffer-client.mjs'
import { isPublishedProduction } from '../lib/production.mjs'

export default async function handler(request, context) {
  const expected = `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET || ''}`
  const actual = request.headers.get('authorization') || ''
  if (!process.env.SOCIAL_AUTOMATION_SECRET || Buffer.byteLength(expected) !== Buffer.byteLength(actual) || !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) return new Response(null, { status: 401 })
  const client = bufferClient({ apiKey: process.env.BUFFER_API_KEY, channelId: process.env.BUFFER_X_CHANNEL_ID, organizationId: process.env.BUFFER_ORGANIZATION_ID, accountId: process.env.X_ACCOUNT_ID })
  const channel = await client.verify()
  const posts = await client.recent()
  const store = getStore({ name: 'hospitality121-x', consistency: 'strong' })
  return Response.json({ provider: process.env.X_PUBLISH_PROVIDER, enabled: process.env.X_AUTOMATION_ENABLED === 'true', production: isPublishedProduction(context), channel: channel.name, serviceId: channel.serviceId, recentPosts: posts.length, timeZone: 'America/Vancouver', hours: [9, 13], health: await store.get('health', { type: 'json' }), checkedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } })
}
