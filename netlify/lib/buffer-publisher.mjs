import { SITE, postText, vancouverSlot } from './x-publisher.mjs'

export function linkedInPostText(item) {
  const clean = text => String(text || '').replace(/<[^>]*>|[#*_`]/g, '').replace(/\s+/g, ' ').trim()
  const title = clean(item.title), summary = clean(item.description || item.excerpt)
  if (!title || !summary) throw new Error('LinkedIn requires a verified headline and summary')
  return `${title}\n\n${summary}\n\nRead the full Hospitality121 article: ${SITE}/content/${item.slug}\n\n#HotelTechnology #Hospitality #GuestExperience`
}

export async function runBufferSlot({ now = new Date(), store, client, fetcher = fetch, platform = 'twitter' }) {
  const slot = vancouverSlot(now)
  if (!slot) return { status: 'outside_schedule' }
  await client.verify()
  if (!['twitter', 'linkedin'].includes(platform)) throw new Error('Unsupported social platform')
  const prefix = platform === 'linkedin' ? 'buffer-linkedin' : 'buffer'
  const usedPrefix = platform === 'linkedin' ? 'used-linkedin' : 'used'
  const key = `${prefix}/${slot.key}`
  const previous = await store.getWithMetadata(key, { type: 'json' })
  if (previous?.data.status === 'published') return previous.data
  if (previous?.data.status === 'publishing' && +now - Date.parse(previous.data.updatedAt) < 15 * 60000) return { status: 'already_running' }
  const claimed = await store.setJSON(key, { ...previous?.data, status: 'publishing', updatedAt: now.toISOString() }, previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true })
  if (!claimed.modified) return { status: 'already_running' }
  let record = { ...previous?.data, date: slot.date, slot: slot.kind, provider: 'buffer', platform }
  const save = async status => {
    record = { ...record, status, updatedAt: new Date().toISOString() }
    const saved = await store.setJSON(key, record)
    if (saved?.modified === false) throw new Error('Publication state could not be persisted; no further write will be attempted')
  }
  try {
    if (record.bufferPostId) {
      const post = await client.getPost(record.bufferPostId)
      record.postUrl = post.externalLink
      await save(post.status === 'sent' ? 'published' : post.status === 'error' ? 'needs_attention' : 'submitted')
      return record
    }
    const posts = await client.recent(now)
    if (!record.articleUrl) {
      const response = await fetcher(`${SITE}/hero-feed.json`, { signal: AbortSignal.timeout(10000) })
      if (!response.ok) throw new Error('Published article feed unavailable')
      const feed = await response.json()
      let item
      for (const candidate of feed.items || []) {
        const articleUrl = `${SITE}/content/${candidate.slug}`
        if (!/^[a-z0-9-]+$/.test(candidate.slug) || candidate.href !== `/content/${candidate.slug}` || candidate.imageType !== 'photograph') continue
        if (!Number.isFinite(Date.parse(candidate.date)) || Date.parse(candidate.date) > +now || Date.parse(candidate.date) < +now - 7 * 86400000) continue
        if (slot.kind === 'news' && (candidate.type !== 'news' || Date.parse(candidate.sourcePublishedAt || candidate.date) < +now - 72 * 3600000)) continue
        if (posts.some(p => p.text?.includes(articleUrl)) || await store.get(`${usedPrefix}/${candidate.slug}`, { type: 'json' })) continue
        item = candidate; break
      }
      if (!item) { await save('no_fresh_unposted_article'); return record }
      record = { ...record, slug: item.slug, articleUrl: `${SITE}/content/${item.slug}`, text: platform === 'linkedin' ? linkedInPostText(item) : postText(item, slot.kind), image: item.image }
      const page = await fetcher(record.articleUrl, { signal: AbortSignal.timeout(10000) })
      const html = await page.text()
      if (!page.ok || !html.includes('<article') || !html.includes('summary_large_image') || !html.includes(item.image) || !html.includes(record.articleUrl)) throw new Error('Full article or native website-card metadata unavailable')
      await save('publishing')
    }
    let post = posts.find(p => p.text === record.text)
    if (!post) {
      if (record.attemptedAt) throw new Error('Previous Buffer submission is unresolved; no duplicate thread sent')
      record.attemptedAt = new Date().toISOString()
      await save('publishing')
      post = await client.createThread(record.text, record.articleUrl)
    }
    record.bufferPostId = post.id
    record.postUrl = post.externalLink
    // Persist the Buffer ID before checking publication: an asynchronous send is not a failure.
    await save(post.status === 'sent' ? 'published' : post.status === 'error' ? 'needs_attention' : 'submitted')
    await store.setJSON(`${usedPrefix}/${record.slug}`, { date: slot.date, bufferPostId: post.id })
    return record
  } catch (error) {
    record.error = error.message
    await save('needs_attention')
    throw error
  }
}
