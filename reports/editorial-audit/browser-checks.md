# Browser and export preview evidence

Checked locally on 27 October 2026; this is not a live production acceptance test.

| Check | Actual result |
| --- | --- |
| Article desktop | Full hotel-data-monetisation headline wraps; byline and image precede body; real H2/H3 appear in accessibility tree |
| Article at 390 × 844 | Headline, byline, image and body fit viewport; screenshot saved as article-mobile.png |
| French fallback | Selecting French on an English-only article shows “Cet article est disponible en anglais uniquement.”; article remains explicitly English |
| Mobile menu | Open and close controls change menu state and expose navigation/language links |
| Cookie choice | Decline dismisses banner; no real newsletter or contact data submitted |
| Search | Final built site query `cybersecurity` returns five results; previously returned none because terms appeared after summaries. Screenshot: search-mobile.png |
| RSS outage | Local static preview deliberately returns HTTP 503 for the Netlify feed endpoint. Homepage remains populated by its recent build snapshot, with original dates, source links and illustration labels. Screenshot: home-mobile.png |
| Vancouver | About paragraph and company-information section name Vancouver, British Columbia, Canada; footer and built HTML match. Screenshot: vancouver-preview.png |
| Existing news route | `/content/summer-travel-trends` returns HTTP 200, H1 “Summer Travel Plans Unchanged” |
| Newly exposed blog | `/content/summer-travel-trends-blog` returns HTTP 200, H1 “Summer Travel Boom”; original file preserved |
| Unknown route | `/audit-unknown-route` returns HTTP 404 and exported 404 page |
| Complete export | 354 HTML files scanned; 33,558 link occurrences and 3,621 image occurrences; zero failures under documented checker rules |

Temporary viewport override was reset. The local export preview is available at http://127.0.0.1:3000. The RSS outage was injected for the test only; normal RSS handling was restored afterward. Development-mode image-quality warnings observed earlier were addressed by using the configured quality of 75. Live form/email delivery, social API access, real devices, screen-reader operation, contrast calculations and Core Web Vitals were not certified. The expanded search index is approximately 1.20 MB before transport compression and loads only on the search page; production transfer and interaction performance still need measurement.
