/**
 * Converts a title to URL-safe kebab-case (max 60 chars).
 * @param {string} title
 * @returns {string}
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '')
}

/**
 * Calculates reading time at 200 words per minute.
 * @param {string} text
 * @returns {string} e.g. "5 min read"
 */
export function calcReadTime(text) {
  const words = text.trim().split(/\s+/).length
  return `${Math.ceil(words / 200)} min read`
}

/**
 * Renders a complete bilingual MDX file string.
 * @param {{ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, bodyEn, bodyFr, seoLinks, primaryKeyword?, keywords?, imageConcept?, editorialFormat?, linkedinCaption?, facebookCaption?, xCaption?, newsletterTeaser? }} params
 * @returns {string}
 */
export function renderMdx({ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, sourceExcerpt = '', sourcePublishedAt = '', bodyEn, bodyFr, seoLinks = '', primaryKeyword = '', keywords = [], imageConcept = '', editorialFormat = '', linkedinCaption = '', facebookCaption = '', xCaption = '', newsletterTeaser = '' }) {
  const esc = s => JSON.stringify(String(s ?? '')).slice(1, -1)
  const keywordLine = Array.isArray(keywords) ? keywords.join(', ') : String(keywords || '')
  return `---
title: "${esc(titleEn)}"
titleFr: "${esc(titleFr)}"
excerpt: "${esc(excerptEn)}"
excerptFr: "${esc(excerptFr)}"
category: "${esc(category)}"
author: "H1H Newsfeed"
authorAvatar: "/images/Logo.png"
date: "${esc(date)}"
readTime: "${esc(readTime)}"
image: "/images/content/${esc(imageFile)}"
featured: false
type: "blog"
status: "review"
aiGenerated: true
editorialReview: null
source: "${esc(sourceDomain)}"
sourceUrl: "${esc(sourceUrl)}"
sourceExcerpt: "${esc(sourceExcerpt)}"
sourcePublishedAt: "${esc(sourcePublishedAt)}"
primaryKeyword: "${esc(primaryKeyword)}"
keywords: "${esc(keywordLine)}"
imageConcept: "${esc(imageConcept)}"
editorialFormat: "${esc(editorialFormat)}"
linkedinCaption: "${esc(linkedinCaption)}"
facebookCaption: "${esc(facebookCaption)}"
xCaption: "${esc(xCaption)}"
newsletterTeaser: "${esc(newsletterTeaser)}"
---

${bodyEn}

${seoLinks}

<!-- FR -->

${bodyFr}
`
}

/**
 * Renders a complete news MDX file string.
 * @param {{ title, description, category, date, readTime, imageFile, sourceDomain, sourceUrl, body, seoLinks }} params
 * @returns {string}
 */
export function renderNewsMdx({ title, description, category, date, readTime, imageFile, sourceDomain, sourceUrl, sourceExcerpt = '', sourcePublishedAt = '', body, seoLinks = '' }) {
  const esc = s => JSON.stringify(String(s ?? '')).slice(1, -1)
  return `---
title: "${esc(title)}"
category: "${esc(category)}"
author: "H1H Newsfeed"
authorAvatar: "/images/Logo.png"
date: "${esc(date)}"
readTime: "${esc(readTime)}"
image: "/images/content/${esc(imageFile)}"
featured: false
type: "news"
status: "review"
aiGenerated: true
editorialReview: null
description: "${esc(description)}"
source: "${esc(sourceDomain)}"
sourceUrl: "${esc(sourceUrl)}"
sourceExcerpt: "${esc(sourceExcerpt)}"
sourcePublishedAt: "${esc(sourcePublishedAt)}"
---

${body}

${seoLinks}
`
}
