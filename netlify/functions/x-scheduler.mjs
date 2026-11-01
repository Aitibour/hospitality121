import { getStore } from '@netlify/blobs'
import { SITE, vancouverSlot } from '../lib/x-publisher.mjs'
import { isPublishedProduction } from '../lib/production.mjs'

export default async function handler(_request, context) {
  if (!isPublishedProduction(context) || process.env.X_AUTOMATION_ENABLED !== 'true') return
  const now = new Date()
  if (!vancouverSlot(now)) return
  const store = getStore({ name: 'hospitality121-x', consistency: 'strong' })
  try {
    if (!process.env.X_ACCOUNT_ID || !process.env.SOCIAL_AUTOMATION_SECRET) throw new Error('Cloud X configuration incomplete')
    const response = await fetch(`${SITE}/.netlify/functions/x-worker-background`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.SOCIAL_AUTOMATION_SECRET}` }, signal: AbortSignal.timeout(10000) })
    if (response.status !== 202) throw new Error(`X worker dispatch HTTP ${response.status}`)
  } catch (error) {
    await store.setJSON('health', { status: 'needs_attention', checkedAt: new Date().toISOString(), error: error.message })
    throw error
  }
}

// UTC schedule; the slot calculation follows Vancouver daylight saving time.
export const config = { schedule: '0,30 * * * *' }
