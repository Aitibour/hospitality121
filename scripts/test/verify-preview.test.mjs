import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { verifyPreview } from '../lib/verify-preview.mjs'

const deploy = { id: 'preview123', site_id: 'site123', state: 'ready', deploy_ssl_url: 'https://preview123--example.netlify.app' }
const item = { slug: 'test-story', href: '/content/test-story', title: 'Hotels & Technology', image: '/images/story.webp' }
function fixture(overrides = {}) {
  const files = {
    '/hero-feed.json': JSON.stringify({ items: [item] }),
    '/content/test-story.html': '<article>Hotels &amp; Technology</article><link rel="canonical" href="https://hospitality121.com/content/test-story">',
    '/images/story.webp': 'photo bytes',
  }
  return {
    deploy, siteId: deploy.site_id,
    fetchImpl: async () => new Response('Login', { status: 401 }),
    readFile: async filename => Buffer.from(files['/' + filename.replaceAll('\\', '/').replace(/^out\//, '')]),
    api: async route => {
      const filePath = route.replace(`/deploys/${deploy.id}/files`, '')
      const bytes = Buffer.from(files[filePath])
      return { deploy_id: deploy.id, site_id: deploy.site_id, path: filePath, sha: createHash('sha1').update(bytes).digest('hex'), size: bytes.length }
    }, ...overrides,
  }
}

test('protected preview verifies feed, article and photograph from the exact deploy', async () => {
  const options = fixture(), paths = [], api = options.api
  options.api = async route => { paths.push(route); return api(route) }
  assert.deepEqual(await verifyPreview(options), { mode: 'authenticated_file_hashes', articles: 1 })
  assert.deepEqual(paths, ['/hero-feed.json', '/content/test-story.html', '/images/story.webp'].map(p => `/deploys/${deploy.id}/files${p}`))
})

for (const field of ['sha', 'deploy_id', 'site_id', 'path', 'size']) {
  test(`protected preview rejects mismatched ${field}`, async () => {
    const options = fixture(), api = options.api
    options.api = async route => ({ ...await api(route), [field]: 'wrong' })
    await assert.rejects(verifyPreview(options), /Preview file mismatch/)
  })
}

test('preview server errors fail instead of falling back', async () => {
  await assert.rejects(verifyPreview(fixture({ fetchImpl: async () => new Response('', { status: 500 }) })), /HTTP 500/)
})

test('public previews retain HTTP article verification', async () => {
  const options = fixture()
  options.fetchImpl = async url => url.endsWith('hero-feed.json')
    ? Response.json({ items: [item] })
    : new Response('<article>Hotels &amp; Technology</article>https://hospitality121.com/content/test-story')
  options.api = async () => { throw new Error('Should not use metadata fallback') }
  assert.deepEqual(await verifyPreview(options), { mode: 'preview_http', articles: 1 })
})

test('protected preview rejects external hero destinations', async () => {
  const options = fixture()
  options.readFile = async () => Buffer.from(JSON.stringify({ items: [{ ...item, href: 'https://example.org' }] }))
  options.api = async () => {
    const bytes = await options.readFile()
    return { deploy_id: deploy.id, site_id: deploy.site_id, path: '/hero-feed.json', sha: createHash('sha1').update(bytes).digest('hex'), size: bytes.length }
  }
  await assert.rejects(verifyPreview(options), /invalid hero destination/)
})
