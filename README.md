# Hospitality One 2 One

> Real Leaders. Real Conversations. Real Impact.

Hospitality media site — podcasts, insights, and interviews shaping the future of hospitality.

Built with Next.js and Tailwind CSS, deployed on Netlify.

The homepage hero loads recent RSS headlines from Hospitality Net, Hotel Technology News, and the Retail & Hospitality ISAC. A Netlify Function (`/.netlify/functions/daily-hero`) caches the selection until the next UTC midnight, so daily updates do not require a rebuild. The browser checks on load and hourly, including midnight for open tabs. Stories are limited to the past seven days, filtered for hospitality technology, operations, AI and cybersecurity, and deduplicated by canonical URL and similar headline. Available topic coverage is balanced; no stories are invented to fill gaps.

RSS cards link to the original reporting, display the actual publication date and source summary, and use distinct publisher images or topical editorial illustrations. A dated local editorial selection remains available if upstream feeds fail. Display headlines fit one line; full titles remain available on hover. Every article and hero selection includes LinkedIn and X follow links.

For local testing of the live RSS endpoint, use Netlify Dev; `npm run dev` renders a build-time RSS snapshot but does not serve Netlify Functions. Deploy both `out/` and `netlify/functions/` after `npm run verify`.

The separate article-generation workflows require `GROQ_API_KEY` and `UNSPLASH_ACCESS_KEY` in GitHub Actions secrets. They use a factual hospitality technology editorial style, concise headlines and social CTAs. Image fetching rejects duplicates and stops publication if a unique topical photograph cannot be obtained, instead of copying a random brand banner. Daily RSS headline updates are independent of those credentials.
