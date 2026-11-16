import { test } from 'node:test'
import assert from 'node:assert/strict'
import { publicationSlot, countDailyCloudArticles, selectCloudCandidates, validateEvidence, validateCloudPost } from '../lib/cloud-editorial.mjs'
import { isPublishedProduction } from '../../netlify/lib/production.mjs'

test('cloud discovery rejects old, duplicate and future RSS entries', () => {
  const now = new Date('2026-11-01T18:00:00Z')
  const item = { title: 'Hotel AI service platform connects reception teams', excerpt: 'Hospitality technology', url: 'https://www.mews.com/new-platform', pubDate: '2026-11-01T12:00:00Z' }
  assert.equal(selectCloudCandidates([item], [], now).length, 1)
  assert.equal(selectCloudCandidates([item], [{ title: 'Different', sourceUrl: item.url+'?utm_source=rss' }], now).length, 0)
  assert.equal(selectCloudCandidates([{ ...item, pubDate: '2026-10-30T12:00:00Z' }, { ...item, pubDate: '2026-11-02T12:00:00Z' }], [], now).length, 0)
})

test('cloud evidence rejects unsupported anchors and stale primary events', () => {
  const now = new Date('2026-11-01T18:00:00Z'), sourceUrl = 'https://www.mews.com/release'
  const sources = [{ url: sourceUrl, text: 'The hotel service platform connects reception teams. Human ownership remains central to delivery.' }]
  const facts = [{ claim: 'The supplier describes a connected service platform.', sourceUrl, evidence: 'platform connects reception teams' }, { claim: 'The supplier retains human ownership.', sourceUrl, evidence: 'Human ownership remains central' }]
  const evidence = { publishable: true, eventDate: '2026-11-01T12:00:00Z', facts }
  assert.doesNotThrow(() => validateEvidence(evidence, sources, now))
  assert.throws(() => validateEvidence({ ...evidence, eventDate: '2023-01-01' }, sources, now), /not recent/)
  assert.throws(() => validateEvidence({ ...evidence, facts: [facts[0], { ...facts[1], evidence: 'invented quotation' }] }, sources, now), /source anchor/)
})

test('generated article cannot introduce unsupported numerical results', () => {
  const post = { slug: 'hotel-service-platform-check', title: 'Hotel Service Platform Connects Teams', description: 'A supplier describes a hotel service workflow.', keywords: ['hotel', 'operations', 'service'], body: 'Hospitality121 analysis: '+('An operator could review the service workflow with its hotel team before expanding the programme. '.repeat(14)) }
  assert.doesNotThrow(() => validateCloudPost(post, { facts: [] }, []))
  assert.throws(() => validateCloudPost({ ...post, body: post.body+' Results increased 94%.' }, { facts: [] }, []), /unsupported number/)
})

test('only the current published deploy can run the social publisher, including promoted drafts', () => {
  assert.equal(isPublishedProduction({ deploy: { context: 'production', published: true } }), true)
  assert.equal(isPublishedProduction({ deploy: { context: 'production', published: false } }), false)
  assert.equal(isPublishedProduction({ deploy: { context: 'deploy-preview', published: false } }), false)
  assert.equal(isPublishedProduction({ deploy: { context: 'deploy-preview', published: true } }), true)
})

test('Vancouver publication slots stay at four local times across daylight saving changes', () => {
  for (const [date, offset] of [['2026-07-01', '-07:00'], ['2026-11-16', '-08:00']]) {
    const at = time => publicationSlot(new Date(date + 'T' + time + ':00' + offset))
    assert.equal(at('07:59'), null)
    assert.deepEqual(['08:00', '12:00', '16:00', '20:00', '23:59'].map(at), [8, 12, 16, 20, 20])
  }
})

test('daily quota counts published cloud articles across UTC midnight in Vancouver', () => {
  const now = new Date('2026-11-17T06:00:00Z')
  const published = cloudPublishedAt => ({ status: 'published', cloudPublishedAt })
  const items = [
    published('2026-11-16T22:00:00Z'),
    published('2026-11-17T04:00:00Z'),
    published('2026-11-16T07:59:00Z'),
    published('2026-11-17T07:00:00Z'),
    { status: 'review', cloudPublishedAt: '2026-11-17T05:00:00Z' },
  ]
  assert.equal(countDailyCloudArticles(items, now), 2)
  assert.equal(countDailyCloudArticles(items, new Date('2026-11-17T08:00:00Z')), 0)
})
