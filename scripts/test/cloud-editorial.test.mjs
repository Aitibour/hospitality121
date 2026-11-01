import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectCloudCandidates, validateEvidence, validateCloudPost } from '../lib/cloud-editorial.mjs'
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
