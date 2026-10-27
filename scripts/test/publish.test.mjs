import fs from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('auto publisher verifies generated content before committing', () => {
  const source = fs.readFileSync('scripts/lib/publish.mjs', 'utf8')
  const verifyIndex = source.indexOf('verifyGeneratedContent()')
  const commitIndex = source.indexOf("run('git', ['commit'")

  assert.notEqual(verifyIndex, -1)
  assert.notEqual(commitIndex, -1)
  assert.ok(verifyIndex < commitIndex)
  assert.match(source, /run\('npm', \['run', 'content:audit:strict'\]\)/)
  assert.match(source, /run\('npm', \['test'\]\)/)
  assert.match(source, /run\('npm', \['run', 'build'\]\)/)
})

test('generated content is isolated on review branches without indexing or social posts', () => {
  const source = fs.readFileSync('scripts/lib/publish.mjs', 'utf8')
  assert.match(source, /codex\/review-/)
  assert.doesNotMatch(source, /HEAD:main/)
  for (const file of ['scripts/auto-blog.mjs', 'scripts/auto-news.mjs']) {
    const pipeline = fs.readFileSync(file, 'utf8')
    assert.doesNotMatch(pipeline, /publishToLinkedIn|pingIndexNow/)
  }
})
