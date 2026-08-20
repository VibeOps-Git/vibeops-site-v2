# Data schemas

Reference for the machine-readable SEO dataset. Operating rules are in
[`../PLAYBOOK.md`](../PLAYBOOK.md).

## The provenance contract

**No bare numbers.** Every value in this dataset travels with its source, when
it was collected, the window it represents, its known lag, and its known
limitations. This is not bureaucracy — mixing a Search Console window with a
Vercel window has already misled an interim review here, and the schema is
shaped to make that mistake visible instead of silent.

Every source block:

```jsonc
{
  "source": "google-search-console",     // where it came from
  "status": "ok|pending|error",          // pending = needs the authenticated browser
  "collected_at": "2026-08-15T17:04:00Z",// when we read it
  "represents": { "start": "2026-08-09", "end": "2026-08-13" },  // the window it describes
  "lag_days": 2,                         // collected_at date minus latest data date
  "limitations": ["..."],                // carried into every report
  "data": { }
}
```

`status: "pending"` matters: a **missing** key would later read as a zero, so
absence is recorded explicitly.

---

## Daily snapshot — `daily/YYYY-MM-DD.json`

Immutable once the date has passed. `mergeSource()` refuses to modify a
historical snapshot without `--force-date`.

```jsonc
{
  "schema_version": 1,
  "date": "2026-08-15",
  "domain_age_days": 5,
  "first_collected_at": "...",
  "updated_at": "...",
  "revision": 8,                  // increments per source write
  "collection_log": [             // audit trail; a changed number is explainable
    { "at": "...", "source": "web_analytics", "action": "replaced", "status": "ok" }
  ],
  "sources": {
    "search_console": { },        // see below
    "web_analytics": { },
    "(no equivalent on this site)": { },
    "serp_probe": { },
    "technical": { }
  }
}
```

**Re-running collection on the same day is safe.** A source block is *replaced*
wholesale, never appended to, so the file converges rather than doubling.
Sources not collected by a given run are left untouched — an API-only run cannot
clobber browser-collected Search Console data.

### `sources.search_console.data`

```jsonc
{
  "property": "sc-domain:vibeops.ca",
  "account_verified": "team@vibeops.ca",   // REQUIRED — the gate
  "latest_date_available": "2026-08-13",        // REQUIRED — makes lag explicit
  "totals": { "impressions": 164, "clicks": 6, "ctr": 0.037, "position": 15.5 },
  "by_day": [ { "date": "2026-08-13", "impressions": 60, "clicks": 3 } ],
  "pages": [ { "page": "/what-we-solve/document-production", "cluster": "vertical-curve",
               "impressions": 93, "clicks": 4, "ctr": 0.043, "position": null } ],
  "queries": [ { "query": "sag internal tools", "impressions": 1, "clicks": 0,
                 "ctr": 0, "position": null, "page": null,
                 "topicality": "on_topic", "cluster": null } ],
  "disclosed_query_count": 9,
  "disclosed_impressions": 11,
  "undisclosed_impressions": 153,   // real exposure, unattributable to a query
  "topicality_mix": { "on_topic": 8, "adjacent": 1, "irrelevant": 0 },
  "devices": [ { "device": "DESKTOP", "impressions": 152, "clicks": 5 } ],
  "countries": [ { "country": "United States", "impressions": 83, "clicks": 3 } ],
  "country_count_reported": 16,     // when the UI states more than were listed
  "indexed_pages": 4
}
```

### `sources.web_analytics.data`

```jsonc
{
  // THE traffic-side organic KPI. Promoted to the top level so it cannot be
  // missed when reading a snapshot by hand.
  "search_referred_human_pageloads": 10,

  "traffic": {
    // Every human pageload lands in exactly ONE channel, so these sum to
    // human_pageloads and a marginal can be trusted.
    "by_channel": { "google": 9, "bing": 1, "other_search": 0,
                    "direct": 99, "other_referral": 0, "internal": 36 },
    "by_channel_by_day": { "2026-08-13": { "google": 3, "direct": 17, "internal": 0 } },
    "acquisition_total": 109,   // excludes `internal` — page-to-page is not a channel
    "channel_definitions": { }  // stored inline; see the table below
  },

  "search_referred": {
    "total": 10, "google": 9, "bing": 1, "other": 0,
    "by_engine": { "google": 9, "bing": 1 },
    "by_day": { "2026-08-13": { "total": 3, "google": 3, "bing": 0, "other_search": 0 } },
    // Dimensions for the SEARCH-REFERRED SUBSET specifically. The sitewide
    // by_device/by_country below are dominated by our own testing and answer a
    // different question.
    "by_device":  { "desktop": 9, "mobile": 1 },
    "by_country": { "US": 10 },
    "by_path":    { "/what-we-solve/secure-ai": 5 },
    "by_referrer_host": { "www.google.com": 9, "bing.com": 1 },
    "detail": [ { "date": "2026-08-13", "refererHost": "www.google.com",
                  "countryName": "US", "deviceType": "mobile",
                  "requestPath": "/what-we-solve/document-production",
                  "count": 1, "engine": "google", "channel": "google" } ]
  },

  "human_pageloads": 145, "bot_pageloads": 5,
  "pageloads_by_day": { "2026-08-13": { "human": 20, "bot": 1 } },
  "by_country": { }, "by_device": { }, "by_path": { }, "by_referrer": { },
  "performance": { "pageLoadTimeP50": 0, "pageLoadTimeP75": 0 },
  "web_vitals": { "largestContentfulPaintP75": 0, "interactionToNextPaintP75": 0,
                  "cumulativeLayoutShiftP75": 0, "timeToFirstByteP75": 0 },
  "web_vitals_sample": 0
}
```

#### Channel definitions

| Channel | Meaning |
|---|---|
| `google` | Referrer host is a Google search property |
| `bing` | Referrer host is `bing.com` |
| `other_search` | Another recognised engine (DuckDuckGo, Yahoo, Ecosia, Brave, Yandex, Baidu) |
| `direct` | **No referrer reported.** NOT "typed the URL" — referrers are stripped by many clients, apps and privacy settings. Treat as *unattributed*, never as brand demand |
| `other_referral` | A referrer that is neither a recognised engine nor our own domain |
| `internal` | Referrer is `vibeops.ca` — page-to-page navigation. Excluded from `acquisition_total` |

`search_referred_human_pageloads` = `google` + `bing` + `other_search`.

**Why this is the KPI, and total human pageloads is not.** The total mixes our
own testing, internal navigation and JS-executing scanners into one number. On
2026-08-15 it read 145 — of which 99 were direct and 36 internal, leaving 10
from search. A decline in the total told us our launch testing was tapering off;
it said nothing about organic acquisition.

**Attribution limits, which the channel split does not remove.** Search-referred
pageloads still cannot be separated from our own search clicks at this volume.
That is a statement about the aggregate. **No attempt is made — and none should
be made — to decide whether any individual pageload is the owner or a stranger.**
A pageload is also not a session: one visitor reading three pages is three
pageloads, which is why search-referred pageloads can exceed Search Console
clicks while both are correct.

### `sources.(no equivalent on this site).data`

Read-only. Never contains page inputs — the product does not collect them.

```jsonc
{
  "total_rows": 1, "known_test_rows": 1, "genuine_submissions": 0,
  "helpful_yes": 0, "helpful_no": 0, "with_message": 0,
  "by_page": { }, "by_day": { },
  "messages": [ { "id": 0, "page_id": "", "helpful": null,
                  "message": "", "created_at": "" } ]
}
```

### `sources.ux_behavior.data`

Aggregate UX telemetry from Workers Analytics Engine. Full model in
[`../UX-ANALYTICS.md`](../UX-ANALYTICS.md).

```jsonc
{
  "dataset": "roadway_tools_ux",
  "windows": {
    "d1":  { },            // 1-day, all traffic
    "d7":  { },            // 7-day, all traffic
    "d1_google": { },      // organic-search segment, when non-empty
    "d7_google": { }
  }
}
```

Each window:

```jsonc
{
  "window_days": 7,
  "referrer_segment": "all",
  "total_page_views": 0,
  "total_events": 0,
  "signal": "INSUFFICIENT|WEAK|MODERATE|STRONG",
  "active_attention_seconds": 0,
  "attention_by_section": { },
  "section_reach": { },
  "scroll_funnel": { "25": 0, "50": 0, "75": 0, "90": 0, "100": 0 },
  "dead_click_hotspots": [ { "section": "diagram", "target": "diagram", "n": 18 } ],
  "pages": {
    "/what-we-solve/document-production": {
      "page_views": 0,
      "by_device": { "desktop": 0, "mobile": 0 },
      "signal": "INSUFFICIENT",
      // Every rate is an object, never a bare number.
      "page_interaction_rate": {
        "value": null,          // null when the denominator is too small
        "numerator": 0,
        "denominator": 0,
        "signal": "INSUFFICIENT"
      }
      // ...formula_reach_rate, sources_reach_rate, dead_click_rate, etc.
    }
  }
}
```

**Rates are objects, deliberately.** A bare `0.21` cannot tell you whether it
came from 5 observations or 5,000. Carrying the numerator, denominator and
signal strength with every rate is what stops "21% of visitors interact with the
page" being written when the truth is "1 of 5 QA pageviews did".

A rate whose denominator is below 30 is emitted as `value: null` with signal
`INSUFFICIENT` — never as a confident-looking percentage.

**Status semantics:** `pending` means the Analytics Engine read permission or
the dataset is missing. Telemetry *writes* are unaffected by that; only
reporting is blocked. It is never recorded as a zero.

### `sources.serp_probe.data`

```jsonc
{
  "summary": { "measured": 41, "errored": 0, "in_top_20": 1,
               "in_top_10": 1, "in_top_3": 0, "at_1": 0, "by_cluster": { } },
  "results": [ { "query": "engineering report automation on grade table",
                 "cluster": "secure-ai", "target_page": "/stopping-sight-distance-table",
                 "head": false, "strategic": false,
                 "position": 8,            // 0 = not in top 20 (CENSORED, not 21)
                 "top_domains": "txdot.gov, modot, highways.dot.gov",
                 "previous_position": 7, "previous_date": "2026-08-10",
                 "movement": -1,
                 "movement_label": "declined|improved|flat|entered|dropped_out|absent|no_prior" } ],
  "errored_queries": [], "previous_probe_date": "2026-08-10"
}
```

### `sources.technical.data`

```jsonc
{
  "pages": [ { "path": "/", "status": 200, "canonical": "https://vibeops.ca/",
               "canonical_self": true, "noindex": false, "title": "...",
               "title_length": 0, "h1_count": 1, "bytes": 0 } ],
  "robots": { "status": 200, "disallows_all": false, "references_sitemap": true },
  "sitemap": { "url": "...", "status": 200, "is_index": true,
               "child_sitemaps": ["..."], "entries": 7, "urls": ["..."] },
  "issues": [ { "severity": "critical|high|medium|low", "path": "/", "issue": "..." } ]
}
```

---

## Search Console ingest payload

The hand-written file passed to `ingest-gsc.mjs`. Only `account_verified`,
`latest_date_available`, `window` and `totals` are required; everything else is
recorded if present.

```jsonc
{
  "account_verified": "team@vibeops.ca",   // REFUSED if anything else
  "property": "sc-domain:vibeops.ca",
  "latest_date_available": "2026-08-13",
  "window": { "start": "2026-08-09", "end": "2026-08-13" },
  "totals": { "impressions": 164, "clicks": 6, "ctr": 0.037, "position": 15.5 },
  "by_day":    [ { "date": "2026-08-13", "impressions": 60, "clicks": 3 } ],
  "pages":     [ { "page": "/what-we-solve/document-production", "impressions": 93, "clicks": 4 } ],
  "queries":   [ { "query": "sag internal tools", "impressions": 1, "clicks": 0,
                   "position": 12.5, "page": "/what-we-solve/document-production" } ],
  "devices":   [ { "device": "DESKTOP", "impressions": 152, "clicks": 5 } ],
  "countries": [ { "country": "United States", "impressions": 83, "clicks": 3 } ],
  "indexed_pages": 4,
  "coverage_notes": "any new exclusions or crawl errors",
  "notes": "anything unusual about this reading"
}
```

The `page` field on a query is worth capturing when Search Console shows it — it
is what makes cannibalisation detectable and lets an opportunity map to a real
target page instead of an inferred one.

---

## Derived files — regenerate, never hand-edit

| File | Grain | Notes |
|---|---|---|
| `history.csv` | one row per **calendar day** | The true time series. `search_referred_human_pageloads` is the traffic-side organic KPI and is deliberately placed ahead of `human_pageloads`. `gsc_settled=0` means the figure may still revise upward. Blank = no coverage yet; `0` in a channel column means nobody arrived that way, which is different |
| `observations.csv` | one row per **run date** | Point-in-time readings with no per-day meaning: cumulative totals, disclosed counts, rank distribution |
| `history.json` | both | Input to `charts.mjs` |
| `charts/*.svg` | — | Static, dependency-free |

Two files rather than one because two different things get called "daily". A
cumulative Search Console total observed on the 15th describes searches through
the 13th; a Vercel pageload count on the 15th describes the 15th. One row
would imply a shared window that does not exist.

---

## Registers

| File | Key | Lifecycle |
|---|---|---|
| `opportunities.json` | `opportunities[]` | Accumulates evidence. `WATCHING → READY → ACTED\|REJECTED`. Never silently dropped; `ACTED`/`REJECTED` are never re-opened by the system |
| `experiments.json` | `experiments[]` | Created **before** a change deploys, with baseline captured |
| `link-opportunities.json` | `opportunities[]` | Research only. `outreach_sent` must stay `false` without human approval |
| `competitors.json` | `competitors[]` | Updated when SERPs reveal something materially new — not daily |

### Opportunity record

```jsonc
{
  "id": "query:sag-vertical-curve",     // stable across runs
  "query_or_topic": "sag internal tools",
  "kind": "query|technical|topic",
  "cluster": "secure-ai|vertical-curve|sitewide|null",
  "cluster_inferred": true,             // no GSC query→page mapping available
  "target_page": "/what-we-solve/document-production",
  "first_seen": "2026-08-12", "last_seen": "2026-08-15",
  "days_seen": 4,                       // DISTINCT dates — re-runs cannot inflate it
  "impressions_7d": 1, "impressions_28d": 0, "clicks_7d": 0,
  "ctr": 0, "average_position": null,
  "position_trend": "...", "impression_trend": "rising|flat|falling",
  "topicality": "on_topic",
  "intent": null, "intent_match": "unassessed|none|weak|good",
  "content_gap": null, "competitor_gap": null, "link_worthy": false,
  "score": 10.7,
  "score_components": [ { "factor": "impression_volume", "points": 3.6, "of": 25, "note": "..." } ],
  "score_penalties":  [ { "penalty": "tiny_sample", "factor": 0.3, "note": "..." } ],
  "confidence": "LOW|MEDIUM|HIGH",
  "recommended_action": "HOLD|OPTIMIZE|CREATE|PROMOTE|TECHNICAL",
  "recommendation_why": "...",
  "status": "WATCHING|READY|ACTED|REJECTED",
  "evidence": [ { "date": "2026-08-15", "impressions": 1, "clicks": 0,
                  "position": null, "source": "search_console" } ],
  "notes": ""
}
```

`score_components` and `score_penalties` are stored, not just the score. A
number with no visible derivation is not usable by a person deciding whether to
act, which is the only thing scores are for here.

---

## Invariants — checked by `scripts/seo/verify.mjs`

1. `probe.js` and `queries.json` describe the identical 41-query set.
2. Every source block has `source`, `collected_at`, `status`, and a window when `ok`.
3. No Search Console block is attributed to an account other than `team@vibeops.ca`.
4. `history.json` covers every snapshot on disk (not stale).
5. Per-day impressions never sum above the reported total for the same window.
6. Opportunity ids are unique; every `recommended_action` is one of the five.
7. No `.env` credential value appears in any committed file.
8. `product_scope.new_pages_authorized` is `false`.

## Precedence: which observation of the same day wins

**Write the rule per source, next to the reason for it.** There is no correct
global answer, and assuming one is how a source's behaviour quietly corrupts a
series.

| Source | Rule | Why |
|---|---|---|
| Search Console | **latest** observation wins | GSC revises figures *upward* as it finishes processing. A day read on D+2 is less complete than the same day read on D+5. |
| Vercel deployments | latest wins | Immutable records; a later read only adds deployments. |
| Technical / link crawl | latest wins | A point sample of the live origin. The newest read is the current truth by definition. |
| PageSpeed / CrUX | latest wins | CrUX is a rolling 28-day window; later reads describe a later window. |
| _(a source that downsamples with age)_ | **earliest** wins | Not hypothetical. The sibling roadway.tools system found Cloudflare RUM re-reporting the same day differently once it aged past ~8 days, losing a search arrival entirely. Where a source degrades history, the first observation is the truest one. |

Neither behaviour is a quirk; both follow from how the source works. So the
question to ask of any new source is **"does this rewrite its own history?"**
before assuming latest-wins.

This is also the strongest argument for immutable daily snapshots: they preserve
a measurement the API can no longer produce.

## Arithmetic invariants

`verify.mjs` asserts, per snapshot:

- `disclosed_impressions + undisclosed_impressions === totals.impressions` —
  every impression is attributed to a named query or it is not; there is no
  third category.
- topicality buckets sum to `disclosed_query_count`.
- clicks never exceed impressions, per day and in total.

These are checks that **can fail**, and they are deliberately about the data
model rather than about any one API. They catch a transcription slip, a bug in
`ingest-gsc.mjs`, and a future source that silently samples, with equal
indifference. Reading code is not a substitute for asserting the arithmetic:
verified by injecting a 7-impression error into a snapshot, which the check
caught and named.

