/**
 * One-shot LinkedIn OAuth token fetcher.
 * Run: node scripts/get-linkedin-token.mjs
 * Delete after getting your token.
 */
import http from 'node:http'
import { execFile } from 'node:child_process'
import crypto from 'node:crypto'

const CLIENT_ID     = '7836h9jzxi0t8s'
const CLIENT_SECRET = 'WPL_AP1.8FgzgWUEh8CETj7y.hLm5Jg=='
const REDIRECT_URI  = 'http://localhost:3333/callback'
const SCOPES        = 'w_member_social openid profile'
const PORT          = 3333

const state = crypto.randomBytes(16).toString('hex')

const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization` +
  `?response_type=code` +
  `&client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&state=${state}`

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== '/callback') { res.end('waiting...'); return }

  const code          = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')

  if (returnedState !== state) {
    res.end('State mismatch — try again.')
    server.close()
    return
  }

  if (!code) {
    res.end('No code returned. Did you deny access?')
    server.close()
    return
  }

  // Exchange code for token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })

  const data = await tokenRes.json()

  if (data.access_token) {
    const msg = [
      '',
      '✅ SUCCESS! Your LinkedIn access token:',
      '',
      data.access_token,
      '',
      `Expires in: ${Math.round(data.expires_in / 86400)} days`,
      `Scope: ${data.scope}`,
      '',
      'Copy the token above and send it back.',
      '',
    ].join('\n')
    console.log(msg)
    res.setHeader('Content-Type', 'text/plain')
    res.end(msg)
  } else {
    const err = `Token exchange failed:\n${JSON.stringify(data, null, 2)}`
    console.error(err)
    res.end(err)
  }

  server.close()
})

server.listen(PORT, () => {
  console.log(`\nOpening LinkedIn auth in your browser...\n`)
  console.log(authUrl)
  console.log('\nIf the browser does not open, paste the URL above manually.')
  console.log('Waiting for LinkedIn callback on port 3333...\n')
  // Open browser on Windows
  execFile('cmd', ['/c', 'start', '', authUrl])
})
