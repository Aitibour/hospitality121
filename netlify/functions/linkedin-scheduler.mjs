import { getStore } from '@netlify/blobs'
import { SITE, vancouverSlot } from '../lib/x-publisher.mjs'
import { isPublishedProduction } from '../lib/production.mjs'

export default async function handler(_request, context) {
  if (!isPublishedProduction(context) || process.env.LINKEDIN_AUTOMATION_ENABLED !== 'true' || !vancouverSlot(new Date())) return
  const store = getStore({ name: 'hospitality121-linkedin', consistency: 'strong' })
  try {
    if (!process.env.BUFFER_LINKEDIN_CHANNEL_ID || !process.env.SOCIAL_AUTOMATION_SECRET) throw new Error('Cloud LinkedIn configuration incomplete')
    const response = await fetch(`${SITE}/.netlify/functions/linkedin-worker-background`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET}` }, signal: AbortSignal.timeout(10000) })
    if (response.status !== 202) throw new Error(`LinkedIn worker dispatch HTTP ${response.status}`)
  } catch (error) {
    await store.setJSON('health', { status: 'needs_attention', checkedAt: new Date().toISOString(), error: error.message })
    throw error
  }
}

export const config = { schedule: '0,30 * * * *' }
