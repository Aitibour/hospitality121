/**
 * One-shot LinkedIn test — posts a real entry to the company page then exits.
 * Run via: node scripts/test-linkedin.mjs
 * Delete this file after confirming LinkedIn works.
 */
import { publishToLinkedIn } from './lib/linkedin.mjs'

await publishToLinkedIn({
  slug: 'marriott-india-expansion',
  titleEn: "Marriott's Rapid India Growth",
  excerptEn: 'Marriott International is accelerating its India expansion with new properties across tier-one and tier-two cities.',
  category: 'BRANDS',
  imageFile: 'marriott-india-expansion.jpg',
  contentType: 'blog',
})
// env: LINKEDIN_ORG_URN=urn:li:person:0RYMC9s4lP (personal profile, until Community Management API approved)

console.log('LinkedIn test complete.')
