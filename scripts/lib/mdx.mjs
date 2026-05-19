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
 * @param {{ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, bodyEn, bodyFr }} params
 * @returns {string}
 */
export function renderMdx({ titleEn, titleFr, excerptEn, excerptFr, category, date, readTime, imageFile, sourceDomain, sourceUrl, bodyEn, bodyFr }) {
  const esc = s => s.replace(/"/g, '\\"')
  return `---
title: "${esc(titleEn)}"
titleFr: "${esc(titleFr)}"
excerpt: "${esc(excerptEn)}"
excerptFr: "${esc(excerptFr)}"
category: "${category}"
author: "H1H Newsfeed"
authorAvatar: "/images/Logo.png"
date: "${date}"
readTime: "${readTime}"
image: "/images/content/${imageFile}"
featured: false
type: "blog"
source: "${sourceDomain}"
sourceUrl: "${sourceUrl}"
---

${bodyEn}

<!-- FR -->

${bodyFr}
`
}
