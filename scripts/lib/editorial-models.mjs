// Use only reviewed models, and check account availability before drafting.
export function selectEditorialModels(models, env = {}) {
  const available = new Set(models.filter(model => model.active !== false).map(model => model.id))
  function choose(preferred, fallbacks, purpose) {
    const selected = [preferred, ...fallbacks].filter(Boolean).find(id => available.has(id))
    if (!selected) throw new Error(`No approved ${purpose} model is available; update editorial model configuration`)
    return selected
  }
  return {
    text: choose(env.EDITORIAL_TEXT_MODEL, ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b'], 'text'),
    vision: choose(env.EDITORIAL_VISION_MODEL, ['qwen/qwen3.8-27b'], 'vision'),
  }
}

export function isEditorialServiceFailure(error) {
  return [401, 402, 403, 404, 429].includes(error.status) || error.status >= 500
    || ['model_not_found', 'model_decommissioned', 'insufficient_quota'].includes(error.code)
    || /APIConnection|APITimeout/.test(error.name || '')
}

export async function validatedEditorialTask(task, validate, data) {
  let correction = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await task({ ...data, ...(correction ? { correction } : {}) })
    try { validate(result); return result } catch (error) {
      if (isEditorialServiceFailure(error) || result.publishable === false || attempt === 2) throw error
      correction = { error: error.message, previous: result, instruction: 'Correct the validation error using only the supplied evidence. Preserve all factual safeguards. If evidence is insufficient, say so; never invent supporting facts or anchors.' }
    }
  }
}

export async function editorialCompletion(create, request, models, image = false, pause = delay => new Promise(resolve => setTimeout(resolve, delay))) {
  const forModel = model => model === 'qwen/qwen3.8-27b'
    ? { ...request, model, max_tokens: Math.min(request.max_tokens ?? 900, 900), reasoning_effort: 'none', reasoning_format: 'hidden' }
    : { ...request, model }
  async function invoke(model) {
    for (let attempt = 0; ; attempt++) {
      try { return await create(forModel(model)) } catch (error) {
        const hint = String(error.message || '').match(/try again in ([\d.]+)(ms|s|m)/i)
        const header = Number(error.headers?.['retry-after']) * 1000
        const delay = hint ? Number(hint[1]) * ({ ms: 1, s: 1000, m: 60000 }[hint[2].toLowerCase()]) : header
        if (error.status !== 429 || attempt >= 3 || !Number.isFinite(delay) || delay <= 0 || delay > 60000) throw error
        // The provider's fractional wait may round down at the quota boundary.
        await pause(Math.ceil(delay) + 1000)
      }
    }
  }
  try {
    return await invoke(image ? models.vision : models.text)
  } catch (error) {
    // Both models passed the account availability preflight. Never replace image
    // review with a text-only model, or retry authentication/billing failures.
    if (image || ![404, 429].includes(error.status) || models.text === models.vision) throw error
    models.text = models.vision
    return invoke(models.text)
  }
}
