# Hospitality121 audit — 27 October 2026

Local implementation on `codex/editorial-quality-audit`, checkpoint `2dbab74e43c7dfbda23abec6952a44ea5e6c7076`. No production deployment, infrastructure change or real social post was made. This is a completed technical improvement batch and full machine inventory; the substantive editorial and image-rights audit remains incomplete pending evidence and editorial decisions.

## A. Critical issues fixed locally

- Generated articles now start in review and go to isolated branches. Public routes, listings, feeds and discovery exports exclude unapproved generated drafts. Automatic LinkedIn posts and IndexNow pings were removed from generation jobs.
- Dependency updates reduced npm's reported vulnerabilities from 16 (including one critical) to zero. The site uses Next.js 16.4.3, sharp 0.35.5 and patched sanitizer/transitive dependencies. This is dependency evidence, not a claim that the live site was exploited or patched.
- Owner-confirmed Vancouver replaces New York in company descriptions, footer, About, publisher address/schema and AI discovery text. Event and market references to New York remain.
- Real Markdown headings, lists, tables and emphasis render through a server-side HTML allowlist. Article headlines are complete; byline and featured image precede the body. French fallback is explicitly labelled when a translation is missing.
- The existing news URL `/content/summer-travel-trends` is preserved. A formerly shadowed blog entry has its own `/content/summer-travel-trends-blog` route.
- Subscription responses no longer claim verified enrolment after an opaque request. Missing provider configuration is visible. Resource requests no longer claim a PDF was emailed; podcast pages without audio say so rather than sending readers to generic platform homepages.

## B. Editorial improvements and counts

| Status | Count | Definition |
| --- | ---: | --- |
| Inventoried and automatically screened | 284 | 26 articles, 69 blog posts, 163 news items, 12 podcasts, 14 events; all bodies and frontmatter included |
| Flagged | 284 | At least image-provenance/alt documentation is incomplete; this does not mean every article is inaccurate |
| Published article bodies corrected | 0 | No substantive rewrite or factual correction was published or applied to the original MDX files |
| Article files unchanged | 284 | Original content files remain byte-for-byte unchanged; shared rendering and routing improved |
| Fully fact-checked articles | 0 | No complete article is certified by this audit |
| Focused manual editorial assessments | 4 | HITEC listing, data monetisation, staffing and an interview; scope and evidence are recorded separately |

The machine screening found 93 records without a source URL, 74 with detected quantitative claims and 28 with interview/original-reporting language. There were no exact duplicate bodies or identical normalised headlines, and two similar-headline pairs need human assessment. Near-duplicate body meaning was not exhaustively assessed.

[The inventory](inventory.json) contains every body, author, date, source, category, image, metadata, canonical and individual risk flags. [The review queue](review-queue.csv) is a spreadsheet-ready index. [Correction proposals](corrections-for-review.md) document HFTP's contradictory HITEC date/location evidence and the distinction between anonymous and pseudonymised data. Staffing numbers and interview provenance require original evidence. These proposals await editorial approval.

## C. Image improvements

All 284 featured-image references resolve to local files; dimensions and SHA-256 hashes were recorded. Twenty-one identical-byte groups affect 53 entries. Homepage section selection now avoids repeated local story slugs and identical image bytes. RSS illustrations carry visible context, and the three known generated hero illustrations are labelled AI-generated when selected.

No featured-image files were replaced and no accurate publisher image was deliberately discarded. Every archive entry lacks complete credit/licence/provenance metadata and recorded descriptive alt text. Unknown images use decorative alternatives in the article/card templates instead of pretending the headline describes the photograph. These choices do not complete accessibility or art-direction review. Full image-by-image semantic inspection, perceptual duplicate detection and rights verification remain outstanding. Publisher RSS inclusion alone does not establish reuse permission. The existing Unsplash downloader also needs API hotlinking/attribution compliance before any candidate is approved.

## D. SEO improvements

Full article metadata titles, editorial descriptions where provided, proper absolute social-image URLs, organization authors for news desks and English-only structured-data word counts replace unreliable fallbacks. Canonical URLs stay on the public domain. The alias prevents two different records from sharing one article route. Existing sitemaps, robots, article schemas and discovery routes remain. French is a client-side reading preference, not a separately indexable translated URL: no false hreflang alternate was invented.

The final export checker scans every exported HTML file for a single H1, title/description, public canonical origin, internal anchor destinations and local image paths. See [export results](export-check.json). It does not verify every external link, fragment target, structured-data semantic assertion or indexation in search engines.

## E. Technical improvements

RSS rejects future dates, credential-bearing links and obvious non-public URL destinations. Generated YAML strings are escaped safely. New publication validation checks dates, titles, bodies, public slugs, source duplicates, local images and required human review/metadata. Stored review flags are evidence of an editor's decision, not automatic proof of factual truth.

Search now includes published article text and finds subjects beyond the opening summary. Homepage duplicate selection uses actual image bytes. Production builds reuse archive metadata; reduced prerender concurrency addresses a local timeout observed while development and production builds ran together. Core Web Vitals (LCP, INP, CLS), WCAG conformance and full security coverage were not measured or certified.

## F. Remaining issues and limits

- Complete substantive review of all 284 entries, check primary sources, obtain interview recordings/transcripts and verify author biographies. Resolve the detailed queue before promoting claims as verified journalism.
- Verify image rights and relevance for each entry, replace misleading imagery with approved assets and add accurate descriptions/credits. Do not infer a licence from a filename.
- Confirm X ownership and other social/guest profiles. LinkedIn's public page links back to hospitality121.com; X returned 403. No guessed replacement handle was introduced.
- Reconcile draft branches before subsequent automated runs: per-branch quotas and seen-source state do not provide durable cross-branch deduplication. Paid generation, live newsletter delivery, form delivery, social API authentication and deployment were not exercised.
- Validate privacy operator/retention statements, supply real report assets and audio, verify commercial/audience claims and improve consent revocation. Regional exclusions remain unchanged pending owner direction.
- The HEAD-only source check found 78 HTTP 200 responses, one 301, 68 access-denied responses, 43 rate-limited responses and one host outside the trusted check list. These are availability observations, not factual verification or 112 proven broken links. See [source-link evidence](source-link-check.json).

## G. Important changed files

| Files | Reason |
| --- | --- |
| `lib/editorial-policy.mjs`, `lib/content.ts`, `scripts/validate-publication.mjs` | Public/draft separation and publication checks |
| `scripts/auto-*.mjs`, `scripts/lib/{publish,mdx,groq,rss}.mjs` | Review branches, evidence snapshots, responsible prompts, URL/date validation, no social side effects |
| `lib/article-markdown.mjs`, `components/BilingualContent.tsx`, `app/content/[slug]/page.tsx` | Sanitized Markdown, complete headlines, reading order and metadata |
| `lib/content-routing.mjs` | Stable news URL plus distinct previously hidden blog route |
| `lib/home-selection.ts`, homepage/card/hero components | Duplicate suppression, readable titles and illustration context |
| `lib/search-text.mjs`, search page/index | Search subjects beyond the summary |
| About/layout/footer/discovery text | Vancouver correction and removal of unsupported audience/founding assertions |
| Subscribe/resources/newsletter/podcast/share components | Honest availability, labelled embeds and clipboard error handling |
| Package manifests, `next.config.ts`, tests | Security patches and verified build settings; Next.js refreshed its managed AGENTS.md block |
| `scripts/*inventory*`, check scripts, `reports/editorial-audit/*`, `docs/editorial-workflow.md` | Reproducible inventory, evidence, draft captions and review procedure |

## H. Verification evidence

Baseline `npm run verify` passed 70 tests and generated 363 routes on Next.js 16.2.6. An intermediate lint failure was fixed. A later concurrent dev/build run timed out and was stopped; the subsequent isolated build passed after metadata caching/concurrency changes.

Final command results are saved in [verification.log](verification.log), [export-check.json](export-check.json) and [dependency audit](dependencies-after.json). Commands executed: `npm run verify`, `npx tsc --noEmit`, `npm audit --json`, `node scripts/editorial-inventory.mjs`, `node scripts/check-export.mjs`, `node scripts/check-source-links.mjs`, `node scripts/social-review-drafts.mjs`, and `git diff --check`. The final verification run passed 78 tests, lint, content style/structure checks, TypeScript and the production build (364 routes). The final export scan covered 354 HTML files, 33,558 link occurrences and 3,621 image occurrences, with zero detected issues under its documented checks.

Browser inspection covered desktop and 390px article layout, complete headlines, real H2/H3 rendering, English-only French fallback, mobile menu, cookie decline, homepage source/illustration labels and local RSS outage fallback. Further export-preview results are recorded in browser-checks.md. No real forms or social posts were submitted. [Desktop](article-desktop.png) and [mobile](article-mobile.png) screenshots show the shared article layout.

## I. Next priorities

1. Approve and apply source-backed factual corrections; obtain reporting records for interviews and unsupported figures. Highest reader-trust benefit.
2. Establish an approved image library with per-asset rights/credits and topic review. Prioritise the 53 entries sharing image files.
3. Reconcile draft queues and add durable cross-branch scheduling/deduplication before enabling unattended generation.
4. Connect and verify actual newsletter/resource/audio delivery and approved social credentials. The 258 [social draft pairs](social-drafts.json) remain unverified review copy; nothing was posted.
5. After editorial approval, authorise deployment of the reviewed technical changes and corrections, verify live URLs/previews, then measure production Web Vitals and accessibility.
