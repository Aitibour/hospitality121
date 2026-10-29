import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createViewsHandler } from '../../netlify/lib/article-views.mjs'
import { selectLatestArticles } from '../lib/latest-articles.mjs'

const origin = 'https://hospitality121.com'
const session = '4ec4792a-e09f-431c-8413-4f6339ca0cbf'
function setup() {
  const entries = new Map()
  const store = { list: async ({ prefix }) => ({ blobs: [...entries.keys()].filter(key => key.startsWith(prefix)) }), set: async (key, value) => {
    const modified = !entries.has(key); entries.set(key, value); return { modified }
  } }
  return createViewsHandler({ openStore: () => store, slugs: ['hotel-a', 'hotel-b'] })
}
const post = (slug = 'hotel-a', id = session) => new Request(`${origin}/.netlify/functions/article-views`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, session: id }) })

test('real view counters deduplicate refreshes and keep articles separate', async () => {
  const handler = setup()
  await handler(post()); await handler(post()); await handler(post('hotel-b'))
  await handler(post('hotel-a', '78d19465-c76e-4843-a960-5ac51920a2ad'))
  const response = await handler(new Request(`${origin}/?slugs=hotel-a,hotel-b`))
  assert.deepEqual((await response.json()).counts, { 'hotel-a': 2, 'hotel-b': 1 })
})
test('view endpoint rejects arbitrary slugs, invalid sessions and cross-origin writes', async () => {
  const handler = setup()
  assert.equal((await handler(post('../escape'))).status, 400)
  assert.equal((await handler(post('hotel-a', 'fake'))).status, 400)
  assert.equal((await handler(new Request(`${origin}/`, { method: 'POST', headers: { Origin: 'https://other.example' } }))).status, 403)
})
test('storage failure is unavailable rather than a false zero', async () => {
  const handler = createViewsHandler({ openStore: () => { throw Error('Offline') }, slugs: ['hotel-a'] })
  assert.equal((await handler(new Request(`${origin}/?slugs=hotel-a`))).status, 503)
})
test('latest sections sort by date and exclude stale, future and repeated content', () => {
  const item = (slug, date, image = slug) => ({ slug, date, image, type: 'news' })
  const result = selectLatestArticles([item('old', '2026-08-01'), item('first', '2026-10-27'), item('latest', '2026-10-28'), item('duplicate', '2026-10-27', 'latest'), item('future', '2027-01-01')], new Date('2026-10-28T12:00:00Z'))
  assert.deepEqual(result.map(item => item.slug), ['latest', 'first'])
})
