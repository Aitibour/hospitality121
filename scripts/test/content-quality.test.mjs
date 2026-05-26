import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isDuplicateTitle, isHospitalitySource, validateHumanizedPost } from '../lib/content-quality.mjs'

test('isHospitalitySource accepts broad hospitality sources', () => {
  assert.equal(isHospitalitySource({
    title: 'Hotel leaders rethink staffing before summer',
    excerpt: 'Operators are adjusting hospitality recruitment and guest experience plans.',
    source: 'example.com',
  }), true)
})

test('isDuplicateTitle catches close title repetition', () => {
  assert.equal(isDuplicateTitle('How AI Is Changing Hotel Operations', ['How AI is Changing Hotel Operations']), true)
})

test('validateHumanizedPost flags banned AI patterns', () => {
  const issues = validateHumanizedPost({
    titleEn: 'Fresh Hotel IT Lessons',
    primaryKeyword: 'hospitality technology trends',
    keywords: ['hospitality technology', 'hotel IT infrastructure', 'hotel automation', 'AI in hospitality'],
    imageConcept: 'A realistic hotel IT manager reviewing network dashboards beside the front desk during morning operations.',
    editorialFormat: 'hospitality-technology',
    linkedinCaption: 'A practical note for hotel leaders about technology and operations.',
    facebookCaption: 'A useful look at hotel technology decisions.',
    xCaption: 'Hotel technology decisions are operational decisions.',
    newsletterTeaser: 'A sharp look at hotel technology strategy.',
    bodyEn: "In today's rapidly evolving world, hotel teams need systems.",
  }, [], [])

  assert.ok(issues.some(issue => issue.includes('banned phrase')))
})
