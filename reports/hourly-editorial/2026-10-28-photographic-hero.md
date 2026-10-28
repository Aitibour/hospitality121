# Restored recent hero coverage with real photographs

The owner requested real photographs instead of generated illustrations and restoration of the previous eight RSS topics as complete local articles. Six original articles were added; the two existing original briefs received new photographs. This supersedes the initial two-illustration hero release.

All eight photographs were visually inspected. They are distinct reference images, not representations of the named companies, announced products or incidents. Each article records its photographer, Pexels source, reuse licence and reference-image caption. Download URLs and SHA-256 hashes are in `2026-10-28-photographic-hero.json`. Pexels' licence permits free use and modification; the computer-code photograph is listed as CC0. No third-party article image was copied. The images remain subject to their recorded licence, rather than being claimed as Hospitality121-owned photography.

## Evidence and editorial limits

| Local article | Reporting basis checked | Treatment |
| --- | --- | --- |
| worldhotels-digital-relaunch | BWH Hotels corporate release, 27 October: https://www.bestwestern.com/en-us/about/press/releases/2026/worldhotels-announcement | Announced masterbrand, website/app and 5 January 2027 loyalty plans; no claim of completed migration. |
| williamsburg-digital-upsells | Canary customer case: https://www.canarytechnologies.com/customers/williamsburg-lodge | Supplier-reported workflow; does not repeat the headline's revenue multiplier or imply independent validation. |
| hotel-ai-pilot-before-budget | Otel AI guide, 22 October: https://www.otelai.com/resources/practical-ai-strategy-guide-hotels-2027; RSS coverage 27 October | Original hotel AI pilot analysis, with original source date distinguished from later coverage. |
| hotel-tech-investment-case | Hospitality Net/Mews opinion 4135139, 27 October | Identifies supplier-authored opinion; original operational purchasing analysis, no product recommendation. |
| hotel-design-digital-journey | Hospitality Net/Outform opinion 4135137, 27 October | Identifies supplier opinion; adds original service, accessibility and maintenance questions. |
| hotel-ai-information-hub | Avalora/Yipy announcement, Hospitality Net 4135134, 27 October | Attributes integration claims to the companies and separates suggested operating checks. |
| serko-hopper-business-travel | HTS/Serko release, 27 October, PRNewswire 302919981 (also indexed via Yahoo Finance) | Avoids inventory or reimbursement guarantees; eligibility and terms remain product-specific. |
| php-security-hotel-websites | RH-ISAC update, 22 October; official PHP advisories through 26 October: https://www.php.net/archive/2026.php | Records subsequent guidance and Windows rebuilds; does not allege a hotel breach or prescribe production configuration changes. |

Source URLs and dates are also retained in each article's frontmatter. These are original concise briefs plus clearly labelled Hospitality121 analysis, not copies or reconstructions of full publisher articles. Automated source checks and AI assistance are disclosed truthfully; no human review is invented.

## Publication checks

The published hero selector and its server-rendered fallback require `imageType: photograph`, credit, licence, source URL and a local image. Every hero destination is `/content/<slug>`. Generated imagery and missing reuse provenance are excluded. The hourly automation now requires real licensed photographs and skips candidates lacking a suitable image.

All eight photograph hashes differ. Content style validation, publication validation, lint, regression tests and static build are required before deployment. Production deployment receipts and final browser screenshots record the published result separately.

## Verified production release

Published Netlify deploy `6ae1436346c471ddacdfaa4a` on 28 October 2026 at 08:50 UTC, from website commit `1ea908eb488a460578b62ecc97012b411a30fb83`. Validation passed: 292 content files, 83 tests, lint, TypeScript and 373 generated routes. The preview and production checks verified all eight internal article URLs, complete reporting bodies, photo bytes/hashes, credit, canonical URLs and homepage CTA. Browser proof confirmed the eight-slide live carousel and a full article with its photograph, source credit and body.

The interrupted uploader returned HTTP 422 after Netlify had already marked its full manifest ready. The deploy helper now checks that actual ready state when an upload retry returns 422; it still fails when the deploy is incomplete. No second deployment or duplicate article was created.
