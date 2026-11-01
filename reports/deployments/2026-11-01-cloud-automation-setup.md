Cloud publishing migration authorised by the owner.

X channel verified through Buffer: @Hospitality_121, service account ID 2053714931216781312. The IDLogice Buffer key only sees IDLogice channels; Hospitality121 uses its own key and channel, provisioned through the owner-supplied ignored local file. No credentials are stored in this report or committed files.

Direct X authentication verified account ownership, but the recent-post endpoint returned HTTP 402. The owner selected Buffer instead. The deployed worker only permits Buffer. Existing app credentials are not used by the Buffer publisher.

Cloud social schedule: Netlify cron 0,30 * * * *, gated to 09:00 and 13:00 America/Vancouver hours with DST handling, production-only, no missed-day backfill. Main post and first reply form a single Buffer thread; records are conditional-write locked and persist submission IDs. Failed/interrupted writes are not blindly retried. No extra demonstration post was sent during setup.

Cloud editorial schedule: GitHub Actions at minute 17 hourly. Up to one fresh nonduplicate article, primary event within 48 hours and RSS discovery within 24 hours. Original writing, automated source comparison, Pexels licence/provenance, visual relevance checks and complete build verification are required. A failed deployment is recovered before another story is generated.

LinkedIn is connected in Buffer according to the owner, but posting there has not been requested and remains off. It is not included in either publishing implementation.

Checks cover OAuth signing, Vancouver DST, credential/account mismatches, stale and duplicate stories, unsupported facts, missing evidence, Buffer publication state and ambiguous response recovery. Live deployment and cloud-run results are recorded separately.
