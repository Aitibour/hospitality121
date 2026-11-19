// Use historical DST fixtures: BC stopped falling back in 2026; older ICU data varies.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { publicationSlot, countDailyCloudArticles, classifyEditorialCategory, selectCloudCandidates, validateEvidence, validateCloudPost } from '../lib/cloud-editorial.mjs'
import { isPublishedProduction } from '../../netlify/lib/production.mjs'

test('cloud discovery rejects old, duplicate and future RSS entries', () => {
  const now = new Date('2026-11-01T18:00:00Z')
  const item = { title: 'Hotel AI service platform connects reception teams', excerpt: 'Hospitality technology', url: 'https://www.mews.com/new-platform', pubDate: '2026-11-01T12:00:00Z' }
  assert.equal(selectCloudCandidates([item], [], now).length, 1)
  const olderItem = { ...item, pubDate: '2026-10-28T18:00:00Z' }
  assert.equal(selectCloudCandidates([olderItem], [{ title: item.title, sourceUrl: 'https://www.mews.com/another-release' }], now).length, 1)
  assert.equal(selectCloudCandidates([item], [{ title: 'Different', sourceUrl: item.url+'?utm_source=rss' }], now).length, 0)
  assert.equal(selectCloudCandidates([{ ...item, pubDate: '2026-10-26T12:00:00Z' }, { ...item, pubDate: '2026-11-02T12:00:00Z' }], [], now).length, 0)
})

test('scheduled discovery rotates across source-supported hospitality sections', () => {
  const now = new Date('2026-11-16T21:00:00Z')
  const titles = [
    ['Hotel wellness spa opens new retreat', 'WELLNESS'],
    ['Hospitality business investment expands portfolio', 'INVESTMENT'],
    ['Hotel technology conference announces agenda', 'CONFERENCE'],
    ['Guest experience program updates hotel service', 'GUEST EXPERIENCE'],
    ['Hospitality trends forecast for lodging', 'TRENDS'],
    ['Hotel research report presents industry insights', 'INSIGHTS'],
    ['Hotel digital technology platform expands', 'TECHNOLOGY'],
  ]
  const articles = titles.map(([title], index) => ({ title, excerpt: 'Hospitality industry update', source: 'Official publisher', url: `https://www.mews.com/story-${index}`, pubDate: '2026-11-16T12:00:00Z' }))
  titles.forEach(([title, category], index) => assert.equal(classifyEditorialCategory(articles[index]), category, title))
  const first = selectCloudCandidates(articles, [], now)
  assert.equal(first.length, articles.length)
  assert.equal(new Set(first.map(item => item.category)).size, articles.length)
  assert.deepEqual(first.map(item => item.url), selectCloudCandidates(articles, [], now).map(item => item.url))
  const published = [{ status: 'published', cloudPublishedAt: '2026-11-16T18:00:00Z', category: first[0].category, sourceUrl: first[0].url }]
  const remaining = selectCloudCandidates(articles, published, now)
  assert.equal(remaining.length, articles.length - 1)
  assert.ok(remaining.every(item => item.category !== first[0].category))
})

test('cloud evidence rejects unsupported anchors and stale primary events', () => {
  const now = new Date('2026-11-01T18:00:00Z'), sourceUrl = 'https://www.mews.com/release'
  const sources = [{ url: sourceUrl, text: 'The hotel service platform connects reception teams. Human ownership remains central to delivery.' }]
  const facts = [{ claim: 'The supplier describes a connected service platform.', sourceUrl, evidence: 'platform connects reception teams' }, { claim: 'The supplier retains human ownership.', sourceUrl, evidence: 'Human ownership remains central' }]
  const evidence = { publishable: true, eventDate: '2026-11-01T12:00:00Z', facts }
  assert.doesNotThrow(() => validateEvidence({ ...evidence, eventDate: '2026-10-26T18:00:00Z' }, sources, now))
  assert.throws(() => validateEvidence({ ...evidence, eventDate: '2026-10-26T17:59:59Z' }, sources, now), /not recent/)
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

test('Historical Vancouver publication slots stay at four local times across daylight saving changes', () => {
  for (const [date, offset] of [['2025-07-01', '-07:00'], ['2025-11-16', '-08:00']]) {
    const at = time => publicationSlot(new Date(date + 'T' + time + ':00' + offset))
    assert.equal(at('07:59'), null)
    assert.deepEqual(['08:00', '12:00', '16:00', '20:00', '23:59'].map(at), [8, 12, 16, 20, 20])
  }
})

test('daily quota counts published cloud articles across UTC midnight in Vancouver', () => {
  const now = new Date('2025-11-17T06:00:00Z')
  const published = cloudPublishedAt => ({ status: 'published', cloudPublishedAt })
  const items = [
    published('2025-11-16T22:00:00Z'),
    published('2025-11-17T04:00:00Z'),
    published('2025-11-16T07:59:00Z'),
    published('2025-11-17T07:00:00Z'),
    { status: 'review', cloudPublishedAt: '2025-11-17T05:00:00Z' },
  ]
  assert.equal(countDailyCloudArticles(items, now), 2)
  assert.equal(countDailyCloudArticles(items, new Date('2025-11-17T08:00:00Z')), 0)
})
