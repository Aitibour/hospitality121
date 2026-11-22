const CURRENT_SITE_ID = 'bb6c21e7-de00-4c8e-b2ce-28a3ea1af4b7'

export function deploymentSiteId(env = process.env) {
  const siteId = (env.NETLIFY_SITE_ID || CURRENT_SITE_ID).trim()
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(siteId)) {
    throw new Error('NETLIFY_SITE_ID must be the Netlify Project ID, not a team name or URL')
  }
  return siteId
}
