# Hospitality One 2 One

> Real Leaders. Real Conversations. Real Impact.

Hospitality media site — podcasts, insights, and interviews shaping the future of hospitality.

Built with Next.js and Tailwind CSS, deployed on Netlify.

For a new Netlify account, follow [the One Dream deployment guide](docs/deploy-one-dream.md). It covers repository import, build settings, functions, environment variables, the custom domain, and switching the cloud publisher to the new Project ID.

The homepage hero loads recent RSS headlines from Hospitality Net, Hotel Technology News, and the Retail & Hospitality ISAC. A Netlify Function (`/.netlify/functions/daily-hero`) caches the selection until the next UTC midnight, so daily updates do not require a rebuild. The browser checks on load and hourly, including midnight for open tabs. Stories are limited to the past seven days, filtered for hospitality technology, operations, AI and cybersecurity, and deduplicated by canonical URL and similar headline. Available topic coverage is balanced; no stories are invented to fill gaps.

RSS cards link to the original reporting, display the actual publication date and source summary, and use distinct publisher images or topical editorial illustrations with visible illustration labels. A dated local editorial selection remains available if upstream feeds fail. Complete headlines wrap on smaller screens. Article pages and the hero include follow links; LinkedIn was matched to the publication, while X ownership still requires confirmation.

For local testing of the live RSS endpoint, use Netlify Dev; `npm run dev` renders a build-time RSS snapshot but does not serve Netlify Functions. Deploy both `out/` and `netlify/functions/` after `npm run verify`.

The separate article-generation workflows require `GROQ_API_KEY` and `UNSPLASH_ACCESS_KEY` in GitHub Actions secrets. They create review drafts on isolated Git branches, with source excerpt/date snapshots. They do not publish to main, index drafts or post them to social media. New AI-generated articles require recorded human fact, image-rights and SEO approval before the public content loader includes them. Image fetching rejects duplicates and fails if a unique candidate cannot be obtained; this does not establish relevance or licensing. Daily RSS headline updates are independent of those credentials.

See [the editorial workflow](docs/editorial-workflow.md) and [the audit report](reports/editorial-audit/README.md). Run `npm run editorial:inventory` to regenerate the complete archive inventory and risk queue, and `npm run content:validate` for structural publication checks. Neither command certifies factual accuracy. Production deployment and real social posts require separate explicit authorisation.
