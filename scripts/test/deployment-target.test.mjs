import { test } from 'node:test'
import assert from 'node:assert/strict'
import { deploymentSiteId } from '../lib/deployment-target.mjs'

test('migration selects the configured Netlify project instead of the existing project', () => {
  assert.equal(deploymentSiteId({ NETLIFY_SITE_ID: ' 11111111-2222-3333-4444-555555555555 ' }), '11111111-2222-3333-4444-555555555555')
})

test('an invalid migration target fails instead of falling back to the old project', () => {
  for (const NETLIFY_SITE_ID of ['one-dream-immigration', 'https://example.netlify.app', '   ']) {
    assert.throws(() => deploymentSiteId({ NETLIFY_SITE_ID }), /Netlify Project ID/)
  }
})

test('existing cloud publication keeps its target until migration is configured', () => {
  assert.equal(deploymentSiteId({}), 'bb6c21e7-de00-4c8e-b2ce-28a3ea1af4b7')
})
