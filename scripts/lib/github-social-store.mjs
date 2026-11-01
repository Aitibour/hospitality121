// Durable publication records are written before and after Buffer submissions,
// rather than relying on ephemeral runner files or expiring workflow artifacts.
export function githubSocialStore({ token, repository = 'Aitibour/hospitality121', fetcher = fetch }) {
  if (!token) throw new Error('GitHub state token required')
  const filename = 'reports/social-publications/cloud-linkedin-state.json'
  const endpoint = `https://api.github.com/repos/${repository}/contents/${filename}`
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }
  async function read() {
    const response = await fetcher(endpoint + '?ref=main', { headers, signal: AbortSignal.timeout(20000) })
    if (response.status === 404) return { records: {}, sha: undefined }
    if (!response.ok) throw new Error(`Social ledger read HTTP ${response.status}`)
    const file = await response.json()
    return { records: JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')), sha: file.sha }
  }
  return {
    async get(key) { return (await read()).records[key] || null },
    async getWithMetadata(key) {
      const file = await read()
      return file.records[key] ? { data: file.records[key], etag: file.sha } : null
    },
    async setJSON(key, value, options = {}) {
      const file = await read()
      if ((options.onlyIfNew && file.records[key]) || (options.onlyIfMatch && file.sha !== options.onlyIfMatch)) return { modified: false }
      file.records[key] = value
      const response = await fetcher(endpoint, { method: 'PUT', headers, body: JSON.stringify({ message: `Record LinkedIn publication state: ${key}`, content: Buffer.from(JSON.stringify(file.records, null, 2)+'\n').toString('base64'), branch: 'main', ...(file.sha ? { sha: file.sha } : {}) }), signal: AbortSignal.timeout(20000) })
      if (response.status === 409 || response.status === 422) return { modified: false }
      if (!response.ok) throw new Error(`Social ledger persistence HTTP ${response.status}`)
      return { modified: true, etag: (await response.json()).content.sha }
    },
  }
}
