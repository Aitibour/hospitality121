The owner explicitly authorised LinkedIn automation in addition to X on November 1, 2026.

Verified Buffer channel: hospitality121, channel 6ae6ae09e29c69a1711eac29, LinkedIn company organization urn:li:organization:116020434. Connection is not disconnected, locked or paused; recent-post access verified. Personal profiles and other company identities are rejected.

Schedule: 09:00 news and 13:00 article, America/Vancouver, with daylight saving time. GitHub Actions checks at minutes 5 and 35, only publishing in those hours. No past dates are backfilled. LinkedIn has its own persistent GitHub ledger, slot records and used-article history. No routine owner approval or desktop session is required. Actual cron starts may be delayed by GitHub.

Netlify rejected the attempted production release: Account credit usage exceeded, new deploys blocked until credits are added. The LinkedIn publisher therefore uses GitHub Actions and Buffer directly, independent of Netlify deployment availability. The proposed Netlify LinkedIn scheduler was removed and its flag disabled so future website deployments cannot start a second LinkedIn publisher.

Format: readable headline, verified article summary, canonical article CTA, three relevant hashtags, native link attachment and first comment pointing to the same article. No separate media attachment or X thread metadata. Only verified published local articles with the appropriate recency are eligible.

Tests cover independent X/LinkedIn histories, correct company-page link/comment input, wrong-account rejection and interrupted Buffer response recovery. No demonstration LinkedIn post sent during setup; the next eligible scheduled slot performs actual publication.
