import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectEditorialModels, isEditorialServiceFailure, validatedEditorialTask, editorialCompletion } from '../lib/editorial-models.mjs'

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

test('rate-limited text uses the available reviewed fallback without changing the request', async () => {
  const models = { text: 'preferred', vision: 'reviewed-fallback' }, calls = []
  const create = async request => { calls.push(request); if (request.model === 'preferred') throw { status: 429 }; return 'completed' }
  assert.equal(await editorialCompletion(create, { messages: ['evidence'] }, models), 'completed')
  assert.deepEqual(calls, [{ messages: ['evidence'], model: 'preferred' }, { messages: ['evidence'], model: 'reviewed-fallback' }])
  assert.equal(models.text, 'reviewed-fallback')
  await assert.rejects(editorialCompletion(async () => { throw { status: 429 } }, {}, models, true))
  await assert.rejects(editorialCompletion(async () => { throw { status: 401 } }, {}, { text: 'a', vision: 'b' }))
})

test('Qwen completion size fits the existing output rate limit and returns JSON without reasoning text', async () => {
  let sent
  await editorialCompletion(async request => { sent = request; return {} }, { max_tokens: 3500 }, { text: 'qwen/qwen3.8-27b' })
  assert.equal(sent.max_tokens, 900)
  assert.equal(sent.reasoning_effort, 'none')
  assert.equal(sent.reasoning_format, 'hidden')
})

test('short provider quota waits are respected with a boundary buffer and bounded retries', async () => {
  let calls = 0
  const waits = []
  const models = { text: 'same', vision: 'same' }
  const limited = () => ({ status: 429, message: 'Please try again in 539.999999ms.' })
  const result = await editorialCompletion(async () => { if (++calls === 1) throw limited(); return 'done' }, {}, models, false, async delay => waits.push(delay))
  assert.equal(result, 'done')
  assert.deepEqual(waits, [1540])
  calls = 0
  await assert.rejects(editorialCompletion(async () => { calls++; throw limited() }, {}, models, false, async () => {}))
  assert.equal(calls, 4)
  await assert.rejects(editorialCompletion(async () => { throw { status: 429, message: 'Please try again in 2m.' } }, {}, models, false, async () => assert.fail('long quota waits must fail visibly')))
})
