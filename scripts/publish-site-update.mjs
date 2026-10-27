import fs from 'node:fs'

// A one-off, explicitly authorised site announcement. Do not call from article generation.
const token = process.env.LINKEDIN_ACCESS_TOKEN
const author = process.env.LINKEDIN_ORG_URN
const receipt = { attemptedAt: new Date().toISOString(), platform: 'linkedin', status: 'not_published' }
function save() { fs.writeFileSync('publication-receipt.json', JSON.stringify(receipt, null, 2)) }
if (!token || !/^urn:li:organization:\d+$/.test(author || '')) {
  save()
  throw new Error('LinkedIn company-page credentials are missing or invalid. No post sent.')
}
const headers = { Authorization: `Bearer ${token}`, 'Linkedin-Version': '202606', 'X-Restli-Protocol-Version': '2.0.0', 'Content-Type': 'application/json' }
const live = await fetch('https://hospitality121.com/about', { signal: AbortSignal.timeout(15000) })
if (!live.ok || !(await live.text()).includes('Vancouver, Canada')) {
  save()
  throw new Error('The updated website is not verified live. No post sent.')
}
const commentary = 'Hospitality121 has a refreshed reading experience.\n\nExplore daily RSS selections on hotel technology, AI, cybersecurity and hotel operations, along with clearer article layouts and improved search.\n\nWhich technology challenge should hospitality leaders be discussing next?\n\nhttps://hospitality121.com/\n\n#Hospitality121 #HotelTechnology'
// Check the latest posts first. Refuse to publish when duplicate detection is unavailable.
const prior = await fetch(`https://api.linkedin.com/rest/posts?q=author&author=${encodeURIComponent(author)}&count=100&sortBy=LAST_MODIFIED`, { headers: { ...headers, 'X-RestLi-Method': 'FINDER' }, signal: AbortSignal.timeout(20000) })
if (!prior.ok) {
  receipt.status = 'account_check_failed'; receipt.httpStatus = prior.status; save()
  throw new Error(`LinkedIn account/duplicate check returned HTTP ${prior.status}. No post sent; credentials or permissions may need renewal.`)
}
const existing = await prior.json()
const duplicate = existing.elements?.find(post => post.commentary === commentary)
if (duplicate) {
  receipt.status = 'already_published'; receipt.postUrn = duplicate.id; save()
  console.log(JSON.stringify(receipt)); process.exit(0)
}
const response = await fetch('https://api.linkedin.com/rest/posts', {
  method: 'POST', headers,
  body: JSON.stringify({ author, commentary, visibility: 'PUBLIC', distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] }, lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false }),
  signal: AbortSignal.timeout(30000),
})
receipt.httpStatus = response.status
if (response.status !== 201) {
  receipt.status = 'publication_failed'; save()
  throw new Error(`LinkedIn returned HTTP ${response.status}. No successful publication confirmed.`)
}
receipt.postUrn = response.headers.get('x-restli-id')
receipt.status = receipt.postUrn ? 'published' : 'publication_requires_reconciliation'
if (receipt.postUrn) receipt.url = `https://www.linkedin.com/feed/update/${receipt.postUrn}/`
save()
console.log(JSON.stringify(receipt))
