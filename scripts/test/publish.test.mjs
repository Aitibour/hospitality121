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

test('auto publisher rebases before pushing to main', () => {
  const source = fs.readFileSync('scripts/lib/publish.mjs', 'utf8')
  const rebaseIndex = source.indexOf("run('git', ['pull', '--rebase', 'origin', 'main'])")
  const pushIndex = source.indexOf("run('git', ['push', 'origin', 'HEAD:main'])")

  assert.notEqual(rebaseIndex, -1)
  assert.notEqual(pushIndex, -1)
  assert.ok(rebaseIndex < pushIndex)
})
