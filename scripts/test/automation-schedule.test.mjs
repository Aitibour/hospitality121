import fs from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('blog automation publishes once per day', () => {
  const workflow = fs.readFileSync('.github/workflows/auto-blog.yml', 'utf8')
  const script = fs.readFileSync('scripts/auto-blog.mjs', 'utf8')

  assert.match(workflow, /cron:\s*'0 7 \* \* \*'/)
  assert.doesNotMatch(workflow, /7,20/)
  assert.match(script, /const DAILY_BLOG_LIMIT = 1/)
})

test('news automation publishes twice per day', () => {
  const workflow = fs.readFileSync('.github/workflows/auto-news.yml', 'utf8')
  const script = fs.readFileSync('scripts/auto-news.mjs', 'utf8')

  assert.match(workflow, /cron:\s*'0 8,20 \* \* \*'/)
  assert.match(script, /const DAILY_LIMIT = 2/)
})
