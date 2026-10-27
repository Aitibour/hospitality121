import { execFileSync } from 'node:child_process'

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit' })
}

export function verifyGeneratedContent() {
  run('npm', ['run', 'content:audit:strict'])
  run('npm', ['test'])
  run('npm', ['run', 'build'])
}

/**
 * Save generated drafts on a review branch. Never push generated work to main.
 * Uses execFileSync with argument arrays, no shell interpolation.
 * @param {{ slug: string, imageFile: string, contentType?: 'blog' | 'news' }} params
 */
export function commitAndPush({ slug, imageFile, contentType = 'blog' }) {
  const scope = contentType === 'news' ? 'news' : 'blog'

  verifyGeneratedContent()

  const reviewBranch = `codex/review-${scope}-${slug}`
  run('git', ['switch', '-c', reviewBranch])

  run('git', ['config', '--local', 'user.email', 'action@github.com'])
  run('git', ['config', '--local', 'user.name', 'H1H Auto Publisher'])
  run('git', ['add',
    `content/${scope}/${slug}.mdx`,
    `public/images/content/${imageFile}`,
    'scripts/seen-articles.json',
  ])
  run('git', ['commit', '-m', `draft(${scope}): editorial review ${slug}`])
  run('git', ['push', '-u', 'origin', reviewBranch])

  console.log(`Draft saved for review: ${reviewBranch}`)
}

/**
 * Pings IndexNow to fast-index the new post on Bing and Yandex.
 * Non-fatal: logs a warning if it fails, never throws.
 * @param {string} slug
 */
export async function pingIndexNow(slug) {
  const siteUrl = process.env.SITE_URL ?? 'https://hospitality121.com'
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.warn('INDEXNOW_KEY not set, skipping IndexNow ping')
    return
  }

  const host = new URL(siteUrl).hostname
  const payload = {
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList: [`${siteUrl}/content/${slug}`],
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
    console.log(`IndexNow ping: ${res.status}`)
  } catch (err) {
    console.warn(`IndexNow ping failed: ${err.message}`)
  }
}
