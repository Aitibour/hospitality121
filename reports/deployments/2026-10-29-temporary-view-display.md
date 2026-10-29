# Temporary article view display — 29 October 2026

The owner explicitly requested random displayed values from 100 through 4,058 until they ask for removal. `lib/article-view-display.ts` controls this presentation override. The slug supplies a stable pseudo-random value, consistent between server-rendered HTML, hydration, listings and the article page. The tooltip and privacy page disclose that the display is simulated.

The actual Netlify session counter, storage, GET/POST endpoints and recording behavior remain intact. No fake records are written. To restore the genuine display, set `TEMPORARY_SIMULATED_VIEWS` to false and update the temporary privacy disclosure, then build/deploy. Do not infer genuine readers from the displayed values. The existing hourly automation was updated to preserve this temporary preference pending the owner's request.

Validation and deployment receipts will be recorded after completion.
