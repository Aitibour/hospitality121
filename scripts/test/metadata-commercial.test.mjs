import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('shared static metadata includes canonical and social previews', () => {
  const source = fs.readFileSync('lib/seo-metadata.ts', 'utf8')

  assert.match(source, /alternates: \{ canonical: url \}/)
  assert.match(source, /openGraph: \{/)
  assert.match(source, /twitter: \{/)
  assert.match(source, /summary_large_image/)
  assert.match(source, /linkedin-banner\.jpg/)
})

test('utility pages use the shared static metadata helper', () => {
  const files = [
    'app/about/page.tsx',
    'app/contact/layout.tsx',
    'app/resources/layout.tsx',
    'app/search/layout.tsx',
    'app/subscribe/layout.tsx',
    'app/privacy/page.tsx',
  ]

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    assert.match(source, /buildStaticMetadata/)
    assert.match(source, /path: '\//)
  }
})

test('commercial pages use New York aligned USD pricing', () => {
  const advertise = fs.readFileSync('app/advertise/page.tsx', 'utf8')
  const collaborate = fs.readFileSync('app/collaborate/page.tsx', 'utf8')
  const combined = `${advertise}\n${collaborate}`

  assert.doesNotMatch(combined, /£/)
  assert.match(advertise, /From \$750\/issue/)
  assert.match(advertise, /From \$2,000/)
  assert.match(advertise, /From \$1,000\/episode/)
  assert.match(collaborate, /Newsletter slots from \$750\/issue/)
  assert.match(combined, /United States, Canada, Europe, Saudi Arabia, Qatar/)
})
