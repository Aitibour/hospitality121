import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isAllowedRegionalArticle, isDuplicateTitle, isHospitalitySource, validateHumanizedPost, validateNewsPost } from '../lib/content-quality.mjs'

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

test('validateHumanizedPost flags forbidden punctuation and leverage repetition', () => {
  const issues = validateHumanizedPost({
    titleEn: 'Fresh Hotel Operations Lessons',
    primaryKeyword: 'hotel operations technology',
    keywords: ['hotel operations technology', 'hospitality automation', 'guest experience systems', 'hotel data strategy'],
    imageConcept: 'A realistic hotel operations director reviewing service dashboards with front office leaders in a calm lobby setting.',
    editorialFormat: 'hotel-operations',
    linkedinCaption: 'A practical note for hotel leaders about operational technology.',
    facebookCaption: 'A useful look at hotel operations decisions.',
    xCaption: 'Hotel operations technology is an operating choice.',
    newsletterTeaser: 'A sharp look at hotel operations strategy.',
    bodyEn: 'Hotels can leverage data — carefully. Teams should not leverage dashboards without service context.',
  }, [], [])

  assert.ok(issues.includes('contains em dash, en dash, or double hyphen'))
  assert.ok(issues.includes('overuses leverage phrasing'))
})

test('validateNewsPost flags stock closing language', () => {
  const issues = validateNewsPost({
    title: 'Hotel Groups Expand Guest Data Programs',
    description: 'Hotel groups are investing in guest data programs.',
    category: 'TECHNOLOGY',
    body: 'Hotel operators are studying guest data workflows. In conclusion, this cannot be overstated for the sector.',
    keywords: ['hotel data', 'hospitality technology', 'guest experience'],
  }, [])

  assert.ok(issues.some(issue => issue.includes('in conclusion')))
  assert.ok(issues.some(issue => issue.includes('cannot be overstated')))
})

test('validateNewsPost blocks duplicate and regional news', () => {
  const issues = validateNewsPost({
    title: 'Yatra Eyes Corporate Travel Growth in India',
    description: 'A hotel distribution story about India.',
    category: 'DISTRIBUTION',
    body: 'The story covers hotel distribution and travel demand.',
    keywords: ['hotel distribution', 'hospitality news', 'travel technology'],
  }, ['Yatra Eyes Corporate Travel Growth in India'])

  assert.ok(issues.includes('duplicate or semantically similar title'))
  assert.ok(issues.includes('blocked regional topic'))
})

test('validateNewsPost accepts clean hospitality news', () => {
  const issues = validateNewsPost({
    title: 'Hotel Operators Expand AI Guest Messaging',
    description: 'Hospitality technology teams are investing in guest messaging.',
    category: 'TECHNOLOGY',
    body: 'Hotel operators are testing AI guest messaging across front office workflows. The operational impact is focused on response times and service consistency.',
    keywords: ['hospitality technology', 'hotel AI', 'guest experience'],
  }, [])

  assert.deepEqual(issues, [])
})
