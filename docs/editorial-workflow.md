# Editorial review and publication

## Owner-authorised hourly original coverage

The owner subsequently authorised hourly RSS monitoring, original rewritten coverage, original topic images and production publication without another approval. The local Codex heartbeat performs this workflow independently of the older GitHub draft generators below. It must obtain source evidence, write its own news brief and clearly distinguish operational analysis from supplier claims. Reproducing publisher text or imagery is not authorised. Source credit remains visible, while the reading destination and full article stay on Hospitality121.

Automated source checks are recorded truthfully with `editorialReview.reviewType: automated-source-check` and `reviewedBy: Codex automated editorial checks`. This is not a human sign-off or independent verification of supplier outcomes. New coverage discloses AI assistance, uses checked original illustrations and records source evidence. Skip unverifiable stories rather than manufacture detail. Structural validators remain mandatory but do not establish accuracy or rights.

The homepage and `/hero-feed.json` select only published local article slugs; the old function endpoint is an internal-feed compatibility proxy. Source URLs are retained as provenance, including structured citations, and shown as a non-navigating source credit. Hero buttons always open `/content/<slug>` with the full Hospitality121 body. New static articles require a verified build and Netlify deployment before becoming hero or social destinations.

The site is a Next.js static export on Netlify. Content is filesystem MDX, parsed as data and Markdown, not executed MDX. Existing archive URLs remain public. The daily hero links readers to recent RSS reporting at the original publisher; it does not create local articles.

## New generated drafts

RSS discovery → excerpt ingestion → source/date snapshot → title and source deduplication → AI review draft → topical image candidate → local checks → isolated `codex/review-*` branch.

`auto-blog.mjs` and `auto-news.mjs` never index or post drafts to social media. No generated draft is pushed to `main`. Their schedules are unchanged locally; production will not gain these safeguards until this branch is approved and deployed. A scheduled job does not prove an article was published.

Drafts use `status: review`, `aiGenerated: true`, and `editorialReview: null`. The shared content loader excludes them from detail routes, listings, search/discovery feeds and sitemaps. A source excerpt is incomplete evidence. Human review must obtain and compare the original reporting, supporting primary sources, quotations and dates before approval. A source returning HTTP 200 is not a fact-check.

## Required human review

1. Inspect the complete source. Record primary evidence, unresolved claims, event date versus publication date and whether a passage is reporting, analysis or opinion. Do not invent interviews or fill evidence gaps with AI prose.
2. Edit for a specific complete headline, useful opening, suitable depth and clear operational implications. Check English and French separately. Use paragraphs, Markdown lists and headings; do not copy a full third-party article.
3. Inspect the actual featured image. Verify subject, rights, source, photographer, licence conditions and alt text. Do not approve a repeated brand banner merely because its filename differs. Unsplash API hotlinking and attribution requirements require review before any new image from that pipeline is published; existing downloaded assets do not establish permission.
4. Set a concise `description`, `imageAlt`, `imageCredit`, `imageSource`, `imageLicense` and a valid `sourceUrl`. Preserve original source excerpt/date fields. Confirm canonical `/content/<slug>` and relevant internal links; check preview metadata.
5. Record review on the article, for example:

```yaml
status: published
aiGenerated: true
editorialReview:
  reviewedBy: "Actual responsible editor"
  reviewedAt: "Actual ISO review timestamp"
  factCheck: approved
  imageRights: approved
  seo: approved
```

These fields record a human decision; automated validation cannot establish that a claim is true or an image is licensed. Keep evidence and meaningful before/after changes in the review PR. Never insert example reviewer names or timestamps as real approvals.

6. Run `npm run verify`. Review the diff and preview, approve the factual edits, then separately authorise production deployment. Review-branch pushes do not deploy this site's unlinked Netlify project.
7. Verify the article's live canonical URL and image before separately approving a social post. `reports/editorial-audit/social-drafts.json` contains draft copy only, derived from the unverified archive. Never post it as fact-checked copy without review. LinkedIn profile identity was checked; X remains unverified after a 403 response.

## Known limits

Legacy entries have no approval records and are preserved for historical continuity, not retrospectively certified. The news and blog files named `summer-travel-trends` previously collided: the news keeps `/content/summer-travel-trends`, and the previously shadowed blog now uses `/content/summer-travel-trends-blog`. Future duplicate public slugs fail validation. Existing regional filtering remains unchanged pending owner confirmation. Per-branch generated quotas and seen-source tracking are not a durable cross-branch scheduling database: review branches should be reconciled before further automated runs to avoid repeated draft attempts. No end-to-end paid generator or social API calls were made during this audit.
