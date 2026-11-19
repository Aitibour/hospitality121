import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectEditorialModels, isEditorialServiceFailure, validatedEditorialTask } from '../lib/editorial-models.mjs'

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

test('draft corrections receive feedback and still must pass validation', async () => {
  let calls = 0
  const result = await validatedEditorialTask(async data => {
    calls++
    if (calls === 2) assert.equal(data.correction.error, 'too short')
    return { body: calls === 1 ? '' : 'corrected' }
  }, result => { if (!result.body) throw new Error('too short') }, {})
  assert.equal(result.body, 'corrected')
  calls = 0
  await assert.rejects(validatedEditorialTask(async () => { calls++; return {} }, () => { throw new Error('unsupported') }, {}), /unsupported/)
  assert.equal(calls, 3)
  calls = 0
  await assert.rejects(validatedEditorialTask(async () => { calls++; return { publishable: false } }, () => { throw new Error('insufficient evidence') }, {}), /insufficient/)
  assert.equal(calls, 1)
})
