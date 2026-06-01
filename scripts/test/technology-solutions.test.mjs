import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync('lib/technology-topics.ts', 'utf8')

test('technology topics include product and solution SEO blocks', () => {
  const topicCount = [...source.matchAll(/slug: '/g)].length
  const solutionBlocks = [...source.matchAll(/solutions: \[/g)].length
  const solutionCards = [...source.matchAll(/buyer: '/g)].length

  assert.ok(topicCount >= 10)
  assert.equal(solutionBlocks, topicCount)
  assert.equal(solutionCards, topicCount * 4)
  assert.match(source, /hospitality technology solutions/)
  assert.match(source, /hotel property management system/)
  assert.match(source, /hotel cybersecurity/)
})
