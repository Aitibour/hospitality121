export function bufferClient({ apiKey, channelId, organizationId, accountId = '2053714931216781312', service = 'twitter', fetcher = fetch }) {
  async function query(query, variables = {}) {
    if (!apiKey) throw new Error('Hospitality121 Buffer API key is required')
    const response = await fetcher('https://api.buffer.com', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(25000) })
    if (!response.ok) throw new Error(`Buffer HTTP ${response.status}`)
    const result = await response.json()
    if (result.errors?.length || !result.data) throw new Error('Buffer rejected the operation; inspect the channel connection and API permissions')
    return result.data
  }
  return {
    async verify() {
      if (!channelId || !organizationId) throw new Error('Buffer channel and organization must be pinned before publication')
      const { channel } = await query('query($input:ChannelInput!){channel(input:$input){id name service serviceId isDisconnected isLocked isQueuePaused}}', { input: { id: channelId } })
      const name = service === 'linkedin' ? 'hospitality121' : 'hospitality_121'
      if (!['twitter', 'linkedin'].includes(service) || (service === 'linkedin' && accountId !== 'urn:li:organization:116020434')) throw new Error('Hospitality121 company-page identity must be pinned')
      if (channel.service !== service || channel.serviceId !== accountId || channel.name.replace(/^@/, '').toLowerCase() !== name) throw new Error('Buffer channel does not match the Hospitality121 account')
      if (channel.isDisconnected || channel.isLocked || channel.isQueuePaused) throw new Error('Buffer channel is disconnected, locked or paused')
      return channel
    },
    async recent(now = new Date()) {
      const input = { organizationId, filter: { channelIds: [channelId], createdAt: { start: new Date(+now - 8 * 86400000).toISOString() } }, sort: [{ field: 'createdAt', direction: 'desc' }] }
      const all = []
      let after = null
      for (let page = 0; page < 5; page++) {
        const { posts } = await query('query($input:PostsInput!,$after:String){posts(input:$input,first:100,after:$after){edges{node{id text status externalLink createdAt}}pageInfo{hasNextPage endCursor}}}', { input, after })
        all.push(...posts.edges.map(e => e.node))
        if (!posts.pageInfo.hasNextPage) return all
        after = posts.pageInfo.endCursor
      }
      throw new Error('Buffer duplicate check exceeded page limit; no post sent')
    },
    async createThread(text, articleUrl) {
      if (!/^https:\/\/hospitality121\.com\/content\/[a-z0-9-]+$/.test(articleUrl)) throw new Error('Only live Hospitality121 articles may be posted')
      const metadata = service === 'linkedin'
        ? { linkedin: { linkAttachment: { url: articleUrl } } }
        : { twitter: { thread: [{ text, assets: [] }, { text: `Read the full post here: ${articleUrl}`, assets: [] }] } }
      const input = { channelId, text, schedulingType: 'automatic', mode: 'shareNow', saveToDraft: false, needsApproval: false, aiAssisted: true, assets: [], metadata }
      // No image upload: keep the article URL eligible for X's native website card.
      const { createPost } = await query('mutation($input:CreatePostInput!){createPost(input:$input){...on PostActionSuccess{post{id status externalLink}}...on MutationError{message}}}', { input })
      if (!createPost.post?.id) {
        const error = new Error(createPost.message ? `Buffer rejected the post: ${createPost.message.slice(0, 300)}` : 'Buffer did not accept the post; check Buffer for the result before retrying')
        error.definitiveRejection = !!createPost.message
        throw error
      }
      return createPost.post
    },
    async getPost(id) {
      return (await query('query($input:PostInput!){post(input:$input){id status externalLink}}', { input: { id } })).post
    },
  }
}
