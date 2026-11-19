// Use historical DST fixtures: BC stopped falling back in 2026; older ICU data varies.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bufferClient } from '../../netlify/lib/buffer-client.mjs'
import { runBufferSlot } from '../../netlify/lib/buffer-publisher.mjs'

function fixture() {
  const records = new Map(), submitted = [], posts = []
  let serial = 0, interrupt = false
  const item = { type: 'news', slug: 'verified-hotel-tech', title: 'Hotel AI requires accurate property information', description: 'A hotel technology case study examines reliable information and human service.', href: '/content/verified-hotel-tech', date: '2025-11-02', imageType: 'photograph', image: '/images/content/test.webp' }
  const store = {
    get: async key => records.get(key)?.data || null,
    getWithMetadata: async key => records.get(key) || null,
    setJSON: async (key, value, options = {}) => {
      const previous = records.get(key)
      if ((options.onlyIfNew && previous) || (options.onlyIfMatch && previous?.etag !== options.onlyIfMatch)) return { modified: false }
      records.set(key, { data: structuredClone(value), etag: String(++serial) })
      return { modified: true }
    },
  }
  const client = {
    verify: async () => {}, recent: async () => structuredClone(posts),
    createThread: async (text, url) => {
      const post = { id: 'buffer-1', text, status: 'scheduled' }
      submitted.push({ text, url }); posts.push(post)
      if (interrupt) throw Error('Interrupted after acceptance')
      return post
    },
    getPost: async () => ({ id: 'buffer-1', status: 'sent', externalLink: 'https://x.com/Hospitality_121/status/123' }),
  }
  const fetcher = async url => url.endsWith('hero-feed.json') ? Response.json({ items: [item] }) : new Response(`<article>Full article</article><meta content="summary_large_image"><img src="${item.image}"><link href="https://hospitality121.com${item.href}">`)
  return { args: { now: new Date('2025-11-02T17:00:00Z'), store, client, fetcher }, records, submitted, item, setInterrupt: () => { interrupt = true } }
}

test('Buffer submission is persisted and later confirmed without a second send', async () => {
  const f = fixture()
  assert.equal((await runBufferSlot(f.args)).status, 'submitted')
  const result = await runBufferSlot(f.args)
  assert.equal(result.status, 'published')
  assert.equal(result.postUrl, 'https://x.com/Hospitality_121/status/123')
  assert.equal(f.submitted.length, 1)
})

test('Buffer accepted request with lost response is recovered from recent posts', async () => {
  const f = fixture(); f.setInterrupt()
  await assert.rejects(runBufferSlot(f.args), /Interrupted/)
  const result = await runBufferSlot(f.args)
  assert.equal(result.bufferPostId, 'buffer-1')
  assert.equal(f.submitted.length, 1)
})

test('Buffer channel pin rejects IDLogice and unavailable channels', async () => {
  for (const channel of [
    { service: 'twitter', name: 'idlogicecanada', serviceId: '1829195467151822848' },
    { service: 'twitter', name: 'Hospitality_121', serviceId: '2053714931216781312', isDisconnected: true },
  ]) {
    const c = bufferClient({ apiKey: 'test', channelId: 'channel', organizationId: 'org', fetcher: async () => Response.json({ data: { channel } }) })
    await assert.rejects(c.verify(), /does not match|disconnected/)
  }
})

test('Buffer sends main URL and exact first reply as one thread without an image attachment', async () => {
  let input
  const c = bufferClient({ apiKey: 'test', channelId: 'verified', organizationId: 'org', fetcher: async (_url, options) => { input = JSON.parse(options.body).variables.input; return Response.json({ data: { createPost: { post: { id: 'accepted', status: 'scheduled' } } } }) } })
  const url = 'https://hospitality121.com/content/test'
  await c.createThread('Verified main post '+url, url)
  assert.equal(input.channelId, 'verified')
  assert.deepEqual(input.assets, [])
  assert.equal(input.metadata.twitter.thread.length, 2)
  assert.equal(input.metadata.twitter.thread[1].text, 'Read the full post here: '+url)
  assert.equal(input.needsApproval, false)
})

test('LinkedIn uses its own history so an X post does not suppress the company-page post', async () => {
  const f = fixture()
  await runBufferSlot(f.args)
  f.args.client.recent = async () => []
  const result = await runBufferSlot({ ...f.args, platform: 'linkedin' })
  assert.equal(result.platform, 'linkedin')
  assert.equal(f.submitted.length, 2)
  assert(f.submitted[1].text.includes('Read the full Hospitality121 article:'))
  assert(f.records.has('buffer-linkedin/2025-11-02/news'))
  assert(f.records.has('used-linkedin/verified-hotel-tech'))
})

test('LinkedIn creates a company-page link post without paid first-comment metadata or an X thread', async () => {
  let input
  const c = bufferClient({ apiKey: 'test', channelId: 'company-channel', organizationId: 'org', accountId: 'urn:li:organization:116020434', service: 'linkedin', fetcher: async (_url, options) => { input = JSON.parse(options.body).variables.input; return Response.json({ data: { createPost: { post: { id: 'linkedin-post', status: 'scheduled' } } } }) } })
  const url = 'https://hospitality121.com/content/test'
  await c.createThread('A verified hospitality story. '+url, url)
  assert.equal(input.channelId, 'company-channel')
  assert.equal(input.metadata.linkedin.linkAttachment.url, url)
  assert.equal(input.metadata.linkedin.firstComment, undefined)
  assert.equal(input.metadata.twitter, undefined)
  assert.deepEqual(input.assets, [])
})

test('LinkedIn rejects a personal profile or another company page', async () => {
  const c = bufferClient({ apiKey: 'test', channelId: 'wrong', organizationId: 'org', accountId: 'urn:li:organization:116020434', service: 'linkedin', fetcher: async () => Response.json({ data: { channel: { name: 'hospitality121', service: 'linkedin', serviceId: 'urn:li:person:other' } } }) })
  await assert.rejects(c.verify(), /does not match/)
})

test('news slot rejects old source dates and commentary', async () => {
 for(const change of [{type:'article'},{sourcePublishedAt:'2025-10-20'}]){const f=fixture();Object.assign(f.item,change);assert.equal((await runBufferSlot(f.args)).status,'no_fresh_unposted_article');assert.equal(f.submitted.length,0)}
})
