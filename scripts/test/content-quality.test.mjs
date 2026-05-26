import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isAllowedRegionalArticle, isDuplicateTitle, isHospitalitySource, validateHumanizedPost } from '../lib/content-quality.mjs'

test('isHospitalitySource accepts broad hospitality sources', () => {
  assert.equal(isHospitalitySource({
    title: 'Hotel leaders rethink staffing before summer',
    excerpt: 'Operators are adjusting hospitality recruitment and guest experience plans.',
    source: 'example.com',
  }), true)
})

test('regional filter blocks India and disallowed Arab-market stories', () => {
  assert.equal(isAllowedRegionalArticle({
    title: 'Yatra Eyes Corporate Travel Growth in India',
    excerpt: 'The travel company is expanding hotel distribution.',
    source: 'example.com',
  }), false)
  assert.equal(isAllowedRegionalArticle({
    title: 'Dubai hotel pipeline accelerates',
    excerpt: 'Operators are planning new hotel openings.',
    source: 'example.com',
  }), false)
})

test('regional filter allows Saudi Arabia and Qatar stories', () => {
  assert.equal(isAllowedRegionalArticle({
    title: 'Saudi Arabia luxury hospitality investment grows',
    excerpt: 'Riyadh hotel development remains active.',
    source: 'example.com',
  }), true)
  assert.equal(isAllowedRegionalArticle({
    title: 'Qatar hotels prepare for meetings demand',
    excerpt: 'Doha operators invest in guest experience.',
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
