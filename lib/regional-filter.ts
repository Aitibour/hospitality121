import type { ContentItem } from '@/types/content'

const BLOCKED_REGION_TERMS = [
  'india',
  'indian',
  'yatra',
  'mumbai',
  'delhi',
  'bangalore',
  'uae',
  'dubai',
  'abu dhabi',
  'emirates',
  'morocco',
  'marrakech',
  'casablanca',
  'bahrain',
  'kuwait',
  'oman',
  'egypt',
  'jordan',
  'lebanon',
  'iraq',
  'syria',
  'yemen',
]

const ALLOWED_REGION_TERMS = [
  'saudi arabia',
  'saudi',
  'riyadh',
  'jeddah',
  'qatar',
  'doha',
]

export function isAllowedRegionalContent(item: Partial<ContentItem> & { excerpt?: string; description?: string; source?: string }) {
  const haystack = [
    item.title,
    item.category,
    item.excerpt,
    item.description,
    item.source,
  ].filter(Boolean).join(' ').toLowerCase()

  if (ALLOWED_REGION_TERMS.some(term => haystack.includes(term))) return true
  return !BLOCKED_REGION_TERMS.some(term => haystack.includes(term))
}
