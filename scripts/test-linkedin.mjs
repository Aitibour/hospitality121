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

console.log('LinkedIn test complete.')
