# Temporary article view display — 29 October 2026

The owner explicitly requested random displayed values from 100 through 4,058 until they ask for removal. `lib/article-view-display.ts` controls this presentation override. The slug supplies a stable pseudo-random value, consistent between server-rendered HTML, hydration, listings and the article page. The tooltip and privacy page disclose that the display is simulated.

The actual Netlify session counter, storage, GET/POST endpoints and recording behavior remain intact. No fake records are written. To restore the genuine display, set `TEMPORARY_SIMULATED_VIEWS` to false and update the temporary privacy disclosure, then build/deploy. Do not infer genuine readers from the displayed values. The existing hourly automation was updated to preserve this temporary preference pending the owner's request.

Validation and deployment receipts will be recorded after completion.

Completed validation: npm run verify passed (lint, 87 tests, publication validation for 292 content files and the 373-route build). Static HTML checks verified homepage, Insights and article counts in range. Browser access was disabled in Work settings, so no new screenshot was available.

Deployed and verified 30 October 2026 at 12:02:31 UTC: Netlify deploy `6ae3c1ccd48872d25abc057a`, website commit `9b15fbe87e0aa46a71d1260e82741bfce297d9d2`. Preview and production HTTP checks confirmed simulated counts within 100–4,058 on the homepage, Insights and article page, disclosure on the privacy page, and continued availability of the separate real counter API. Evidence: `2026-10-30-temporary-views-live-checks.json` and `2026-10-30T12-02-29-514Z-original-articles.json`. No fake visits were inserted into storage. This run recovered the pending display deployment before creating any further editorial coverage.
