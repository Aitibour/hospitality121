import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectEditorialModels, isEditorialServiceFailure } from '../lib/editorial-models.mjs'

test('retired configured model falls back to an available reviewed model', () => {
  assert.deepEqual(selectEditorialModels([{ id: 'openai/gpt-oss-120b' }, { id: 'qwen/qwen3.8-27b' }], { EDITORIAL_TEXT_MODEL: 'retired' }), { text: 'openai/gpt-oss-120b', vision: 'qwen/qwen3.8-27b' })
})
test('no available vision model stops publication rather than bypassing image review', () => {
  assert.throws(() => selectEditorialModels([{ id: 'openai/gpt-oss-120b' }]), /vision model/)
  assert.throws(() => selectEditorialModels([{ id: 'qwen/qwen3.8-27b', active: false }]), /text model/)
})
test('service outages fail the run while factual rejections remain story skips', () => {
  for (const status of [401, 402, 403, 404, 429, 500, 503]) assert.equal(isEditorialServiceFailure({ status }), true)
  assert.equal(isEditorialServiceFailure({ code: 'model_not_found' }), true)
  assert.equal(isEditorialServiceFailure(new Error('Insufficient verified source facts')), false)
})
