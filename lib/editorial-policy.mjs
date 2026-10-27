/** Legacy archive entries remain public; new generated work requires recorded human review. */
export function isPublishedContent(data) {
  if (data.status && data.status !== 'published') return false
  if (!data.aiGenerated) return true
  const review = data.editorialReview
  return data.status === 'published' && typeof review?.reviewedBy === 'string' && !!review.reviewedBy.trim()
    && Number.isFinite(Date.parse(review.reviewedAt))
    && Date.parse(review.reviewedAt) <= Date.now()
    && review.factCheck === 'approved' && review.imageRights === 'approved' && review.seo === 'approved'
    && publicationIssues(data).length === 0
}

export function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
      && !url.port && url.hostname.includes('.') && !/^\[|^[\d.]+$/.test(url.hostname)
      && !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(url.hostname)
  } catch { return false }
}

/** Structural publication checks. Passing them does not verify factual accuracy or rights. */
export function publicationIssues(data) {
  const issues = []
  if (typeof data.title !== 'string' || !data.title.trim()) issues.push('missing title')
  if (!Number.isFinite(Date.parse(data.date)) || Date.parse(data.date) > Date.now()) issues.push('invalid or future date')
  if (data.status && !['draft', 'review', 'published'].includes(data.status)) issues.push('invalid status')
  if (data.aiGenerated && data.status === 'published') {
    if (!isPublicHttpsUrl(data.sourceUrl)) issues.push('invalid public HTTPS source')
    for (const field of ['description', 'imageAlt', 'imageCredit', 'imageLicense', 'imageSource']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) issues.push(`missing ${field}`)
    }
    if (!isPublicHttpsUrl(data.imageSource)) issues.push('invalid image source')
    if (!/^\/images\/[a-zA-Z0-9/_-]+\.(?:jpe?g|png|webp|avif|svg)$/.test(data.image || '') && !isPublicHttpsUrl(data.image)) issues.push('invalid featured image URL')
  }
  return issues
}
