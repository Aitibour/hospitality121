# Audit checklist and disposition

Baseline checkpoint: `2dbab74e43c7dfbda23abec6952a44ea5e6c7076`; local branch `codex/editorial-quality-audit`.

| Priority | Area | Evidence / implementation | Disposition |
| --- | --- | --- | --- |
| P0 | Dependency advisories | Baseline npm audit: 16 affected packages, including one critical; patched Next.js, sharp, sanitizer and transitive dependencies | Fixed locally; final audit saved |
| P0 | Unreviewed generation and LinkedIn publication | Existing scheduled scripts published directly to main, then posted socially | Local review status, approval checks, review branches; no draft indexing/social posts |
| P1 | Article trust | 284 files, 93 without source URL, 74 with detected quantitative claims, 28 with original-reporting/interview language | Complete machine inventory; editorial evidence needed |
| P1 | Confirmed factual conflict | HITEC 2026 location/date contradict HFTP | Cited correction drafted; editorial approval pending |
| P1 | Publisher identity | LinkedIn Vancouver / website New York conflict; owner confirmed Vancouver | Corrected local identity, schema, discovery text |
| P1 | Reading experience | Full titles were shortened and truncated; body preceded byline/image; custom Markdown parser missed formatting | Fixed local shared templates and sanitized server rendering |
| P1 | Image relevance and rights | All local assets exist; 21 identical-byte groups affecting 53 records; no complete image rights records | Homepage repeat suppression and honest illustration labels; full visual/rights review outstanding |
| P1 | Slug collision | News and blog shared `summer-travel-trends` | Preserve news URL; expose shadowed blog via distinct alias |
| P1 | Subscription/resources | Opaque newsletter response implied confirmation; no resource email delivery integration | Honest request states, unavailable-provider notice, no automatic newsletter popup without provider |
| P1 | Podcast availability | 12 entries have no embed URL; generic platform links implied playable episodes | Explicit unavailable state; valid future embeds retained with title/host validation |
| P2 | SEO | Article metadata fallback/absolute images/schema authors and bilingual word counts | Fixed; all exported pages checked |
| P2 | Social | LinkedIn page matches publication; X inaccessible to verification | Share links and draft captions retained; no real posts |
| P2 | Privacy | Existing scripts gated by consent; withdrawal requires clearing storage and reload | Existing acceptance/decline tested; easier revocation remains work |
| P2 | Runtime QA | Desktop and 390px mobile article, language fallback, menu, search; external outage fixture | Evidence saved; no fabricated performance scores |
| P2 | Production | User forbids deployment/publication without explicit approval | No deployment, infrastructure edits or social posts |

All 284 content files remain byte-for-byte unchanged. This checklist is not a claim that their reporting or image rights have been verified.
