import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubSocialStore } from '../lib/github-social-store.mjs'

test('durable GitHub ledger refuses stale claims and preserves submitted IDs', async () => {
  let sha, records = {}, serial = 0
  const fetcher = async (_url, options) => {
    if (options.method !== 'PUT') return sha ? Response.json({ sha, content: Buffer.from(JSON.stringify(records)).toString('base64') }) : new Response(null, { status: 404 })
    const body = JSON.parse(options.body)
    if (sha && body.sha !== sha) return new Response(null, { status: 409 })
    records = JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))
    sha = String(++serial)
    return Response.json({ content: { sha } })
  }
  const store = githubSocialStore({ token: 'test', fetcher })
  assert.equal((await store.setJSON('slot', { status: 'publishing' }, { onlyIfNew: true })).modified, true)
  assert.equal((await store.setJSON('slot', {}, { onlyIfNew: true })).modified, false)
  const state = await store.getWithMetadata('slot')
  await store.setJSON('slot', { bufferPostId: 'accepted' })
  assert.equal((await store.setJSON('slot', {}, { onlyIfMatch: state.etag })).modified, false)
  assert.equal((await store.get('slot')).bufferPostId, 'accepted')
})

test('state-service failure blocks publication rather than pretending a record exists', async () => {
  const store = githubSocialStore({ token: 'test', fetcher: async () => new Response(null, { status: 503 }) })
  await assert.rejects(store.getWithMetadata('slot'), /ledger read HTTP 503/)
})
