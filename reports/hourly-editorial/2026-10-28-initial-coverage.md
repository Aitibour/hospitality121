# Original on-site RSS coverage

Owner instruction: write original coverage inspired by RSS reports, use different topic-relevant imagery and keep full hero reading on Hospitality121. Production deployment and scheduled publication are authorised without another approval.

## Source checks and editorial scope

- `hotel-ai-information-hub`: Avalora's 27 October announcement on Hospitality Net, discovered in the RSS feed, with matching vendor announcement text on Hotel Online/Hospitality Upgrade. Facts retained: VAIA connects with Yipy; the announcement describes central operating information feeding connected hotel systems. No asserted universal integration count, measured savings, implementation timetable or customer results. Source access to Hospitality Net's direct HTTP page was blocked; indexed announcement text and the matching syndicated vendor release supplied the evidence. Supplier claims are explicitly identified as such.
- `hotel-ai-pilot-before-budget`: Otel's own guide announcement dated 22 October, checked against Hotel Technology News coverage dated 27 October. Facts retained: the 2027 guide, a four-week comparison alongside existing work, and ten templates. No survey percentages, implementation guarantees or supplier performance claims. Most of the article is separately labelled Hospitality121 operational analysis and suggested evaluation questions.

The articles are approximately 380 and 420 words including headings and disclosures. They are original news briefs and analysis, not republications or close reconstructions. Source credit remains in the visible article and provenance metadata. AI assistance and automated source checks are disclosed; no human reviewer is claimed.

## Image generation

Built-in ImageGen generated both original illustrations, visually inspected before inclusion. WebP copies are stored in `public/images/content/` with credits, alt text and image-source records in frontmatter.

- `hotel-ai-information-hub.webp`: hotel operations office; a central monitor connects reception, housekeeping and messaging panels; manager checks information on a tablet; teal/amber, natural light; no real product UI, logos or statistics; labelled editorial illustration. SHA256 `3b07d33ac9cff39eeab3a810e22fe552188bb91168fa1f37320a3503ef42a06b`.
- `hotel-ai-pilot-before-budget.webp`: overhead hotel management meeting table; bounded AI workflow experiment, checklist, four progress cards and abstract comparison panels; forest-green/cream; no actual report covers, product UI, logos or statistics; labelled editorial illustration. SHA256 `e0719a813a5d2c5affb9f496e40ef804fe7b759f0a73b42c52a8eb4c13dac4ff`.

## Runtime behaviour

The homepage and static `/hero-feed.json` use published local article slugs. The carousel always builds `/content/<slug>` destinations and displays Read full article. Refresh rejects external destinations. The old Netlify function proxies the same site's published feed for compatibility, filtering unsafe/external items and failing closed on error. Publisher RSS remains a discovery source only.

The existing local heartbeat `hospitality121-daily-x-news-and-article` is updated to run the original-article workflow hourly, at most one suitable verified nonduplicate article per hour. It skips inadequate evidence rather than publishing filler. X remains 09:00/13:00 Vancouver with native article cards; LinkedIn posting remains skipped. Local scheduled runs require Codex, the computer and necessary authenticated access to remain available.

Validation: 82 tests passed, structural content validation passed for 286 files, and lint passed. Build and production receipts are recorded separately after deployment.
