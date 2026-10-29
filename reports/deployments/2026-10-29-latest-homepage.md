# Latest coverage, reliable hero links and real view counts

Owner-requested changes: remove the separate source banner and visible photo credits/captions, shorten source-faithful article titles, keep each hero photograph associated with its own story, fix the Read full article control and replace old archive content in the two sections immediately below the hero with recent coverage and real views.

The hero photograph, headline and CTA now use independent native internal links. The gradient cannot intercept input, controls have explicit stacking, and images are keyed by article and preloaded to avoid showing a previous story's photograph while its replacement loads. Eight existing real licensed photographs remain distinct. All eight headlines were rewritten without changing the article's substantive claims.

The latest grid and sidebar select published news/articles/blogs within seven days in date order. They share eight distinct stories, split four/four, instead of excluding recent hero stories and filling the space with old archive entries. Dates remain actual publication dates; no article has been redated to appear new. Older material remains accessible elsewhere.

The source banner and figure/hero captions were removed. Source provenance remains in structured citations and reporting-basis text; photographer/licence/source records remain in content metadata and the photographic evidence report. The eight photographs use Pexels/CC0 licences that do not require visible attribution.

View counts begin on the actual release date, 29 October 2026. A first-party Netlify function stores one immutable entry per article and random browser-session identifier in a site-wide Blobs store. Refreshes use the same identifier. Counting occurs after five seconds on a visible article; the UI labels the metric views, not confirmed reads or unique people. No historical totals are fabricated. Storage failure produces unavailable metrics, not a false zero. The counter stores no names, email addresses or IP addresses. Privacy wording was updated.

Validation: 87 tests passed, including duplicate view prevention, article separation, invalid input, cross-origin write rejection, unavailable storage and latest-story date filtering. Lint, TypeScript, structural validation of 292 content files and a static build of 373 routes passed. Local browser navigation confirmed the independent Read full article link and removed source/credit blocks. Hosted preview and production verification are recorded below after deployment.
