# SEO operating playbook — vibeops.ca

The canonical manual for this system. Read this before running anything.

- **Scheduling and what is automated:** [`SCHEDULING.md`](./SCHEDULING.md)
- **The weekly interactive review:** [`PROCEDURE.md`](./PROCEDURE.md)
- **Data shapes:** [`data/SCHEMA.md`](./data/SCHEMA.md)
- **Config:** [`config.json`](./config.json) — single source of truth
- **Frozen benchmark:** [`queries.json`](./queries.json)

---

## What this system is for

It answers one question, slowly and honestly: **is organic search becoming an
acquisition channel for this business, or not?**

It is not a ranking dashboard, and it is not a content machine. It observes,
accumulates evidence, and recommends. A person decides and a person writes.

## The three hard rules

**1. It never touches production.** Every script is read-only toward the site.
`config.product_scope` declares `may_edit_production: false` and
`may_publish_content: false`, and `verify.mjs` warns loudly if either flips.
This is a deliberate choice: no auto-published pages, no generated outreach, no
programmatic doorway pages. Legitimate on-codebase SEO only.

**2. No bare numbers.** Every value carries its source, collection time, the
window it represents, its lag and its limitations. Mixing a Search Console
window with an analytics window is the single easiest way to mislead yourself,
and the schema is shaped to make that visible rather than silent.

**3. The benchmark never changes.** 48 queries, fingerprinted by sha256. If a
query becomes irrelevant, mark it `deprecated` and **keep measuring it**. A set
that quietly loses its failures always looks like progress.

## Daily

`npm run seo:daily` (or wait for 09:12). Then read
`docs/seo/daily/<date>.md` — the top of it, at least.

**The default action after a daily report is nothing.** Change production only
for a verified technical defect. Do not touch the site because a ranking moved:
rewriting pages weekly creates volatility and destroys the ability to attribute
cause to anything.

## Weekly

`npm run seo:weekly` assembles the evidence, then follow
[`PROCEDURE.md`](./PROCEDURE.md) with the browser attached. The report is
written by hand, because the judgement in it is the point of it.

Keep **facts**, **interpretation** and **recommendation** visibly separate.

## Reading the numbers, in priority order

While volume is small, read in this order. Clicks and CTR come last on purpose:
at low impression counts CTR is arithmetic noise, and optimising against it means
optimising against randomness.

1. **Technical health.** Can Google crawl, render and index what we published?
   Since 2026-08-20, yes — see below.
2. **Query breadth.** Is Google testing us against increasingly relevant
   searches? The most informative early signal by a distance.
3. **Impression trajectory.** 5/day → 15/day → 50/day matters far more right now
   than clicks do.
4. **Which page and query combinations Google chooses to test.**
5. **Position distribution** — how many impressions land in the top 3, 10, 20.
   Not the average, which is meaningless on small samples.
6. **Clicks and CTR** — only once impressions make CTR meaningful (100+ in 7d).

## The finding that dominated everything, and its fix (SHIPPED 2026-08-20)

Measured 2026-08-17, on the first run:

> **All 16 tracked URLs returned byte-identical HTML.** The site was a
> client-rendered SPA with no prerendering. The "prerender route list" in
> `vite.config.ts` only generated the sitemap. On a crawler's first pass every
> URL had the same title, the same description, no `<h1>`, no canonical and no
> links. All 27 non-home pages read as orphans because the nav did not exist
> until React ran.

Search Console corroborated it independently: 5 pages reported as **"Duplicate
without user-selected canonical"**, plus 1 Soft 404.

**Fixed the same day.** `scripts/prerender.mjs` now runs as part of `npm run
build`: it walks all 28 routes in Playwright (already a devDependency for the
e2e suite, so no new dependency) and writes real HTML to `dist/<route>/index.html`.
Vercel serves a matching static file before falling through to the SPA rewrite.

Result on the build, verified: 28 distinct titles across 28 pages, one `<h1>`
each, 31 to 74 internal links per page, correct self-referential canonicals,
28 distinct md5s where there had been one.

Two traps that pass silently if you are not looking for them, both handled in
the prerenderer and both worth knowing if it is ever rewritten:

1. **The theme gets baked in.** The no-flash script in `index.html` stamps
   `class="dark"` on `<html>` from `localStorage` or the OS preference. Captured
   into a static file that becomes *everyone's* theme, and the inline script has
   no code path that removes it. A light-mode visitor would get a dark page.
   The prerenderer strips it explicitly. Verified in both colour schemes.
2. **framer-motion leaves `opacity: 0` inline** on anything below the fold that
   has not entered the viewport. Captured naively, half the page ships invisible.
   The prerenderer scrolls the full page to fire every `whileInView` reveal, then
   clears any leftover inline opacity and transform.

The client still mounts with `createRoot`, not `hydrateRoot`. Hydration is the
textbook choice, but this app reads `window.matchMedia`, `localStorage` and
scroll position during render, so mismatches are close to certain. `createRoot`
clears and re-renders: it costs a frame and buys total safety, and the SEO
benefit is identical either way because it lives entirely in the bytes we serve.

**Live in production since 2026-08-20**, deployment
`dpl_6SmQPMQusEwahFRL5nCQoLSnRF8Q` (commit `15f0fb0`), verified by fetching all
28 URLs from www.vibeops.ca rather than by trusting the build:

| Measured on production | Before | After |
|---|---|---|
| distinct page HTML (md5) | 1 | **28** |
| distinct `<title>` | 1 | **28** |
| pages with exactly one `<h1>` | 0 | **28/28** |
| self-referential canonicals | 0 | **28/28** |
| pages with >=10 internal links | 0 | **28/28** |
| orphan pages in the link graph | 27 | **0** |
| max click depth from the homepage | 0 (unreachable) | **2** |
| critical technical findings | 1 | **0** |
| total technical findings | 65 | 20, all low |

Getting there took three production deploys, and both failures are worth
knowing about because neither reproduced locally:

1. `.gitignore` carried `scripts/*.mjs` to ignore ad-hoc screenshot scripts.
   `routes.mjs` and `prerender.mjs` matched it and were never committed, so the
   build passed locally and died on Vercel with "Could not resolve
   ./scripts/routes.mjs". `git status` stayed clean throughout: an ignored file
   is not an untracked one, and nothing anywhere signalled it.
2. Vercel's builder is Amazon Linux and cannot run a stock chromium
   (`libnspr4.so: cannot open shared object file`). `playwright install
   --with-deps` cannot help, being apt-based. The build now uses
   `@sparticuz/chromium` when `VERCEL` is set, and the local browser otherwise.

Production verification also surfaced a defect prerendering did not cause but
did reveal: 12 blog posts carried two `<h1>` elements, because the template
renders the title and each MDX body opens with `# Title`. Invisible while the
served HTML was an empty shell. Fixed by remapping MDX `h1` at the render site.

**The daily run guards this permanently.**## Opportunity scoring

`analyze.mjs` maintains a register in `data/opportunities.json`. Each record
accumulates evidence day over day and must persist
`thresholds.opportunity_promote_to_ready_days` (7) days before it can reach
READY. An opportunity seen once is not an opportunity, it is a fluctuation.

Every record carries exactly one action: `HOLD`, `OPTIMIZE`, `CREATE`,
`PROMOTE`, `TECHNICAL`, `UX`.

## Evidence gates

Set in advance in `config.thresholds` so a reading cannot be rationalised after
the fact. Changing one is a **methodology change** and must be recorded in that
week's report.

| Gate | Value | Meaning |
|---|---|---|
| `ctr_min_impressions_7d` | 100 | Below this, CTR is noise and is never flagged |
| `ranking_min_impressions` | 10 | Below this, position movement is volatility |
| `position_material_move` | 5 | Smaller moves are inside normal SERP variance |
| `trend_min_days` | 3 | A trend visible for one day is not a trend |
| `opportunity_promote_to_ready_days` | 7 | Persistence required before acting |

## Expansion criteria

The six in `config.expansion_criteria`. All should hold before recommending that
the site expand its content or targeting. If met, **report the evidence and
recommend**; do not start building. If not met, diagnose which of authority,
demand, intent match, internal linking, indexing or page quality is the binding
constraint.

## Commands

| Command | What |
|---|---|
| `npm run seo:daily` | The whole daily pipeline |
| `npm run seo:verify` | Integrity check. Run before any commit touching `docs/seo/` |
| `npm run seo:collect` | Collection only |
| `npm run seo:analyze` | Re-analyse. Idempotent, safe to repeat after an ingest |
| `npm run seo:weekly` | Assemble the weekly evidence brief |
| `npm run seo:freeze` | Freeze the benchmark. Once, deliberately |
| `npm run seo:sync-probe` | Regenerate `probe.js` queries from `queries.json` |
| `npm run seo:discovery-build` | Regenerate `discovery-probe.js` from the discovery set |

## Setup still outstanding

1. **`npm run seo:freeze`** before the first weekly review, or week-over-week
   comparison has no fixed baseline. Hold off until the benchmark question below
   is settled.
2. **`PAGESPEED_API_KEY`** in `.env`. Free, and without it the shared anonymous
   quota is usually exhausted, so Core Web Vitals stay `pending`.
3. **Confirm the Search Console property** `sc-domain:vibeops.ca` exists under
   `team@vibeops.ca`. The account gate is enforced in two places and ingestion
   will refuse a payload from any other account.

## The open question the first week raised

The frozen benchmark targets consultancy intent: "ai consultant for engineering
firms", "custom software for engineering firms". The first Search Console week
(2026-08-09 to 2026-08-15) disclosed something different:

| What Google actually showed us for | Impressions |
|---|---|
| `best ai tools for civil engineers` | 26 |
| `best ai for civil engineering` | 16 |
| `civil engineering ai tools` | 6 |
| `ai tools for civil engineers` | 4 |

And the page taking the exposure was a blog post, `/blog/best-ai-tools-for-civil-engineers-in-2026`,
at **248 of 644 impressions — 39% of the site's entire search exposure**, against
206 for the homepage. Not one `/what-we-solve/*` page appeared in the top ten.

That is tool-discovery intent, not hire-a-firm intent. Different searcher,
different page, different funnel. Both may be worth serving; only one currently
is, and it is not the one the site was rebuilt around.

**This is a hypothesis with one week behind it, not a finding.** 19 clicks, 9 of
them the brand name. It is recorded in `discovery-queries.json` with the
evidence attached so week 2 can confirm or kill it rather than it being
remembered selectively. Do not restructure the site around it yet.

## Notifications

The scheduled run notifies the logged-in desktop **only when a person has to
decide something** — a critical technical finding, or the job itself failing.
`analyze.mjs` makes that judgement and writes `docs/seo/data/.status.json`;
`run-daily.sh` only delivers it. A silent morning means a healthy site, and a
failed run is never silent, because silence from a broken job is
indistinguishable from silence from a healthy site.
