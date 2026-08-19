# Weekly organic-search review — procedure

> Read [`PLAYBOOK.md`](./PLAYBOOK.md) first. It is the operating manual; this is
> the detailed procedure for the **weekly authenticated review**, the steps that
> need the attached browser.
>
> Before working through the steps below, run:
>
> ```
> npm run seo:weekly
> ```
>
> which assembles week-over-week metrics, the trajectory, the opportunity
> leaderboard, open experiments and the standing of all six expansion criteria.
> It produces **evidence, not a decision**. The report below is still written by
> hand, because the judgement in it is the point of it.

Run this once a week. The point is **comparability**, so run it the same way
every time and record the result as a new file. Never edit a past week's file.

## Hard constraint: this cannot run unattended

See the table in [`SCHEDULING.md`](./SCHEDULING.md). Search Console, the fixed
SERP probe and Vercel Web Analytics all require an interactively authenticated
browser. A cloud routine would produce an empty report that looked like a
working one.

**Agreed cadence:** no scheduled routine. Start a session with the browser
attached and say **"run the weekly SEO review"**.

## Account constraint

Search Console is only ever accessed as **team@vibeops.ca**, property
`sc-domain:vibeops.ca`. Before any Search Console step, confirm the active
identity at `https://myaccount.google.com/u/1/`.

This browser profile also has `dentzander@gmail.com` signed in, which owns
**roadway.tools** and runs an identically shaped system. Ingesting one property's
numbers into the other's dataset would be silent, plausible and unrecoverable.
If the active account is anything other than `team@vibeops.ca`, **stop the
Search Console portion** rather than proceeding. `ingest-gsc.mjs` will refuse
the payload anyway, but do not rely on that.

## Step 1 — Search Console (authoritative)

Date range = the last 7 days, compared against the previous 7:

- total impressions, clicks, CTR, average position
- number of distinct queries receiving impressions
- number of distinct queries receiving clicks
- per-page breakdown
- **any query appearing that we did not target** — the most valuable line in the
  whole review, and the seed for the discovery set
- Indexing report: indexed page count, new exclusions, crawl errors

Search Console is authoritative for position, impressions and CTR. Where it
disagrees with a SERP probe, Search Console wins.

**Watch the indexing report closely while the site is un-prerendered.** "Crawled
— currently not indexed" and "Discovered — currently not indexed" across many
URLs is the symptom that would confirm the shell problem is costing real
indexation rather than just looking untidy.

## Step 2 — Fixed SERP probe (secondary, noisy)

Open a google.com tab in the attached Chrome, run [`probe.js`](./probe.js) from
the page context. It reports the position of the first `vibeops.ca` result for
each of the 48 benchmark queries, or 0 if absent from the top 20. Poll
`window.__voProbe.done`, then read `.result`.

Do not change the query set. Do not swap queries in or out. If a query becomes
genuinely irrelevant, mark it deprecated and keep measuring it.

**Documented limitation, restate it every week:** these numbers are personalised
and geolocated, and this scripted read has disagreed with the rendered SERP by 6
places on the same query on the same day, because the rendered DOM mixes in
People Also Ask and image-block links. Trend signal only. Never act on a single
position.

**Expect a wall of zeros for a long time.** This is a 16-page consultancy site
against established agencies and directories. Zeros slowly becoming positions is
the measurement.

## Step 3 — Vercel Web Analytics

From the Vercel dashboard, project `vibeops-site-v2`: pageviews, top pages,
referrers, for the same 7-day window. There is no API for this.

Record it as its own source. **A pageview is not a click**, and this window does
not align with Search Console's — one visitor reading three pages produces three
pageviews. Indicative only.

## Step 4 — Discovery probe (once Search Console discloses anything)

If Step 1 disclosed queries we do not target, add them to
[`discovery-queries.json`](./discovery-queries.json) **with provenance**, then:

```
npm run seo:discovery-build
```

and run [`discovery-probe.js`](./discovery-probe.js) the same way as Step 2.

Seed only from evidence: a query Search Console disclosed, a phrase a real
prospect used, or a term a competitor visibly ranks for. Never from a guess —
the benchmark is already the guess, and this instrument exists to check it.

**Never promote a discovery query into the frozen benchmark.** That would
retroactively manufacture an improvement out of a query we already ranked for.

## Step 5 — Compare against every prior week

Not just last week. Read the whole `weekly/` history so a slow drift is visible
and a one-week bounce is not mistaken for a trend.

## Step 6 — Write the record

Copy `weekly/_TEMPLATE.md` to `weekly/YYYY-MM-DD.md` and fill it in. Commit it.
Never overwrite a previous week.

Ingest what you collected so it enters the dataset rather than living only in
prose. Payload shapes are in [`data/SCHEMA.md`](./data/SCHEMA.md):

```
node scripts/seo/ingest-gsc.mjs        <payload.json>   # refuses a non-team@vibeops.ca account
node scripts/seo/ingest-serp.mjs       <probe.json>     # refuses a drifted query set
node scripts/seo/ingest-discovery.mjs  <discovery.json>
node scripts/seo/analyze.mjs                            # idempotent
```

## Step 7 — Decide, conservatively

**Default action is no production change.**

Change production only for evidence-backed deficiencies:

- a technical or indexing defect
- a search-intent mismatch shown by real query data
- a snippet or CTR problem — impressions healthy, CTR poor
- something genuinely broken

**Do not touch production because a ranking moved.**

Do not publish new content off the back of this report without a person writing
it. The system may identify a gap; it may never fill one.

## The open question

Everything here exists to answer it: **does organic search bring this business
qualified enquiries, or does it not?** Impressions, positions and Core Web Vitals
are all proxies. The number that settles it is enquiries from organic search
arriving at `/contact`, and that is currently not measurable from this dataset —
conversions live in GTM, which this system does not read. Say so plainly in every
report until it changes.
