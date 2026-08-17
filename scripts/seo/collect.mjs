#!/usr/bin/env node
/**
 * Daily collection — the unattended half of the OBSERVE step.
 *
 *   node scripts/seo/collect.mjs [--date=YYYY-MM-DD] [--force-date]
 *                                [--skip=technical,links,schema,psi,vercel]
 *
 * Collects everything that can be read without a human at a keyboard, and
 * merges each into docs/seo/data/daily/<date>.json as its own provenanced
 * source block.
 *
 * WHAT THIS SITE CAN AND CANNOT COLLECT
 *
 * roadway.tools, where this system came from, sits on Cloudflare and can read
 * RUM pageloads and a D1 feedback table straight from an API. This site is on
 * Vercel, and the equivalent does not exist:
 *
 *   - Vercel Web Analytics IS enabled on the project, but Vercel publishes no
 *     stable REST endpoint for it. Five endpoint shapes were probed on
 *     2026-08-17 and every one returned 404. It is therefore treated exactly
 *     like Search Console: collected from the browser by a person, recorded as
 *     `pending` until then. A pending block cannot later be misread as a zero,
 *     which is the entire reason the state exists.
 *   - Vercel Speed Insights is enabled but reports hasData:false, because the
 *     @vercel/speed-insights package is not in the app. Field performance
 *     therefore comes from CrUX via PageSpeed Insights instead.
 *
 * So the traffic half of the picture is thinner here than on roadway.tools, and
 * the technical half is considerably richer. That is an honest trade, not a
 * degraded port: for a 16-page site whose organic volume is near zero, crawl
 * health and internal linking are the things that can actually be acted on.
 *
 * READ-ONLY toward production throughout. Nothing here writes to the site, to
 * Vercel, or to any deployment. The only writes are into docs/seo/data/.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONFIG, loadEnv, redact, resolveDate, hasFlag, mergeSource, sourceBlock,
  loadSnapshot, log, ROOT,
} from './lib/core.mjs';

const date = resolveDate();
const force = hasFlag('force-date');
const skip = (process.argv.find((a) => a.startsWith('--skip=')) ?? '').slice(7).split(',');

const ORIGIN = CONFIG.site.origin;

log(`\nSEO collection — ${date} (site age ${Math.max(0, Math.round((new Date(date) - new Date(CONFIG.site.launch_date)) / 86400000))} days)\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch with a timeout, polite pacing and one retry on a transient status.
 *
 * The pacing is not decoration. The first run of this collector fired ~45
 * requests at the origin as fast as node could issue them and got 403 on every
 * one, including robots.txt. Left unfixed, the scheduled job would have written
 * a snapshot every night saying all 16 pages were down and the sitemap was
 * unreachable, which is a far worse failure than not running: it is a
 * confident, plausible, wrong dataset that the analysis layer would then
 * faithfully turn into critical issues.
 *
 * So: 250 ms between origin requests, and one retry after a pause on the
 * statuses that mean "slow down" or "try again" rather than "this is broken".
 * A page that is genuinely 404 or 500 still reports as such on the first read.
 */
async function get(url, { timeout = 20000, retry = true, pace = 0, ...init } = {}) {
  if (pace) await sleep(pace);
  const once = async () => {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeout);
    try {
      return await fetch(url, {
        ...init,
        signal: ac.signal,
        headers: { 'user-agent': UA, ...(init.headers ?? {}) },
      });
    } finally {
      clearTimeout(t);
    }
  };

  const res = await once();
  if (retry && [403, 408, 429, 500, 502, 503, 504].includes(res.status)) {
    await sleep(2000);
    return once();
  }
  return res;
}

// Identifies the collector honestly. A generic node fetch UA is both rude and,
// on some edges, the thing that gets rate-limited first.
const UA = 'VibeOpsSEOBot/1.0 (+https://www.vibeops.ca; internal site monitoring)';

/** Milliseconds between successive requests to our own origin. */
const PACE_MS = 250;

/* ----------------------------------------------------- technical health --- */

/**
 * The cheap daily technical checks.
 *
 * The point of this block is to separate "a ranking moved" from "something
 * broke". Only the latter may justify a same-day production change.
 *
 * SPA caveat, and it matters for how a failure here should be read: this site
 * is client-rendered with a prerender step, so a raw fetch sees the prerendered
 * html. That is genuinely what Googlebot's first pass sees, so these checks are
 * meaningful. But anything react-helmet-async injects at runtime that is NOT in
 * the prerendered output reads as missing here while being visible to a
 * rendering crawler. Confirm against the rendered page before calling it a bug.
 */
async function technical() {
  const checks = [];
  const issues = [];
  const titles = new Map();

  for (const page of CONFIG.pages) {
    const url = ORIGIN + page.path;
    try {
      const res = await get(url, { redirect: 'manual', pace: PACE_MS });
      const html = res.status === 200 ? await res.text() : '';
      const canonicalHref = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
        ?.match(/href=["']([^"']+)["']/i)?.[1] ?? null;
      const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? null;
      const xRobots = res.headers.get('x-robots-tag') ?? '';
      const noindex = /noindex/i.test(robotsMeta ?? '') || /noindex/i.test(xRobots);
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
      const desc = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0]
        ?.match(/content=["']([^"']*)["']/i)?.[1] ?? null;
      const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
      const ogImage = /property=["']og:image["']/i.test(html);

      const check = {
        path: page.path,
        journey: page.journey ?? null,
        status: res.status,
        canonical: canonicalHref,
        canonical_self: canonicalHref === url || canonicalHref === url + '/',
        noindex,
        title,
        title_length: title?.length ?? 0,
        description_length: desc?.length ?? 0,
        h1_count: h1Count,
        og_image: ogImage,
        bytes: html.length,
      };
      checks.push(check);

      if (title) {
        if (!titles.has(title)) titles.set(title, []);
        titles.get(title).push(page.path);
      }

      if (res.status !== 200) issues.push({ severity: 'high', path: page.path, issue: `HTTP ${res.status}` });
      if (noindex) issues.push({ severity: 'critical', path: page.path, issue: 'noindex directive present' });
      if (!canonicalHref) issues.push({ severity: 'medium', path: page.path, issue: 'no canonical link in the prerendered html' });
      else if (!check.canonical_self) issues.push({ severity: 'medium', path: page.path, issue: `canonical points elsewhere: ${canonicalHref}` });
      if (h1Count !== 1 && res.status === 200) issues.push({ severity: 'low', path: page.path, issue: `${h1Count} h1 elements` });
      // Length bands are Google's practical truncation points, not rules.
      if (title && (title.length < 15 || title.length > 65)) {
        issues.push({ severity: 'low', path: page.path, issue: `title is ${title.length} chars (aim 15-65)` });
      }
      if (desc && (desc.length < 70 || desc.length > 165)) {
        issues.push({ severity: 'low', path: page.path, issue: `meta description is ${desc.length} chars (aim 70-165)` });
      }
      if (!desc && res.status === 200) issues.push({ severity: 'medium', path: page.path, issue: 'no meta description' });
    } catch (err) {
      checks.push({ path: page.path, status: null, error: String(err.message) });
      issues.push({ severity: 'high', path: page.path, issue: `fetch failed: ${err.message}` });
    }
  }

  for (const [title, paths] of titles) {
    if (paths.length > 1) {
      issues.push({ severity: 'medium', path: paths.join(', '), issue: `duplicate <title>: "${title}"` });
    }
  }

  let robots = null;
  let sitemap = null;

  try {
    const r = await get(ORIGIN + '/robots.txt', { pace: PACE_MS });
    const body = await r.text();
    robots = {
      status: r.status,
      disallows_all: /^\s*Disallow:\s*\/\s*$/im.test(body),
      references_sitemap: /Sitemap:/i.test(body),
      bytes: body.length,
    };
    if (r.status !== 200) issues.push({ severity: 'high', path: '/robots.txt', issue: `HTTP ${r.status}` });
    if (robots.disallows_all) issues.push({ severity: 'critical', path: '/robots.txt', issue: 'Disallow: / present — site blocked from crawling' });
    if (!robots.references_sitemap) issues.push({ severity: 'low', path: '/robots.txt', issue: 'does not reference the sitemap' });
  } catch (err) {
    issues.push({ severity: 'high', path: '/robots.txt', issue: `fetch failed: ${err.message}` });
  }

  try {
    const r = await get(ORIGIN + '/sitemap.xml', { pace: PACE_MS });
    const body = await r.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    sitemap = { url: r.url, status: r.status, entries: locs.length, urls: locs };
    if (r.status !== 200) issues.push({ severity: 'high', path: '/sitemap.xml', issue: `HTTP ${r.status}` });

    // Parity between what we track and what we advertise.
    const paths = new Set(locs.map((u) => new URL(u).pathname.replace(/\/$/, '') || '/'));
    for (const p of CONFIG.pages) {
      if (!paths.has(p.path)) {
        issues.push({ severity: 'medium', path: p.path, issue: 'tracked page is absent from the sitemap' });
      }
    }
  } catch (err) {
    issues.push({ severity: 'high', path: '/sitemap.xml', issue: `fetch failed: ${err.message}` });
  }

  log(`  Technical   ${checks.filter((c) => c.status === 200).length}/${CONFIG.pages.length} pages 200 · ${issues.length} issue(s)`);

  return sourceBlock({
    source: 'http-technical-check',
    status: 'ok',
    window_start: date,
    window_end: date,
    lag_days: 0,
    limitations: [
      'A live fetch of the production origin at collection time — a point sample, not a crawl.',
      'Reads the PRERENDERED html. Anything injected only at runtime by react-helmet-async will read as missing here but is visible to a rendering crawler.',
      'Indexed page count is NOT measurable here; it comes from Search Console and is ingested separately.',
    ],
    data: { pages: checks, robots, sitemap, issues },
  });
}

/* ------------------------------------------------------- internal links --- */

/**
 * Crawl every sitemap URL once and build the internal link graph.
 *
 * This is the collector that earns its keep on a site this size. Organic volume
 * is near zero, so there is nothing to read in the traffic numbers for a while;
 * meanwhile internal linking is fully under our control, fully measurable, and
 * the single most common structural reason a small site's pages fail to
 * accumulate authority.
 *
 * Three things it answers:
 *   - orphans: pages in the sitemap that nothing links to. Google finds them
 *     but treats them as unimportant, and they almost never rank.
 *   - depth: clicks from the homepage. Anything past depth 3 is being told it
 *     does not matter.
 *   - anchor text: what our own site says a page is about. The cheapest
 *     relevance signal there is, and the most often left on the floor.
 */
async function links() {
  let sitemapUrls = [];
  try {
    const r = await get(ORIGIN + '/sitemap.xml', { pace: PACE_MS });
    const body = await r.text();
    sitemapUrls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (err) {
    log(`  Links       FAILED: could not read sitemap (${err.message})`);
    return sourceBlock({
      source: 'internal-link-crawl',
      status: 'error',
      window_start: date,
      window_end: date,
      error: String(err.message),
    });
  }

  const norm = (u) => {
    try {
      const p = new URL(u, ORIGIN).pathname.replace(/\/$/, '');
      return p === '' ? '/' : p;
    } catch {
      return null;
    }
  };

  const paths = sitemapUrls.map(norm).filter(Boolean);
  const outbound = new Map();   // path -> Set(path)
  const anchors = new Map();    // path -> [text]
  const broken = [];
  const fetchFailed = [];

  for (const p of paths) {
    try {
      const res = await get(ORIGIN + p, { pace: PACE_MS });
      if (!res.ok) { fetchFailed.push({ path: p, status: res.status }); continue; }
      const html = await res.text();
      const out = new Set();
      for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
        const href = m[1];
        if (/^(https?:)?\/\//i.test(href) && !href.includes(CONFIG.site.domain)) continue;
        if (/^(mailto:|tel:|#)/i.test(href)) continue;
        const t = norm(href);
        if (!t || t === p) continue;
        out.add(t);
        const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text) {
          if (!anchors.has(t)) anchors.set(t, []);
          anchors.get(t).push(text.slice(0, 80));
        }
      }
      outbound.set(p, out);
    } catch (err) {
      fetchFailed.push({ path: p, status: null, error: String(err.message) });
    }
  }

  // Inbound counts, and links pointing at URLs that are not in the sitemap.
  const inbound = new Map(paths.map((p) => [p, 0]));
  const known = new Set(paths);
  for (const [from, outs] of outbound) {
    for (const t of outs) {
      if (known.has(t)) inbound.set(t, (inbound.get(t) ?? 0) + 1);
      else broken.push({ from, to: t });
    }
  }

  // Click depth from the homepage. BFS over the graph we just built.
  const depth = new Map([['/', 0]]);
  let frontier = ['/'];
  while (frontier.length) {
    const next = [];
    for (const p of frontier) {
      for (const t of outbound.get(p) ?? []) {
        if (!depth.has(t) && known.has(t)) { depth.set(t, depth.get(p) + 1); next.push(t); }
      }
    }
    frontier = next;
  }

  const orphans = paths.filter((p) => p !== '/' && (inbound.get(p) ?? 0) === 0);
  const deep = paths.filter((p) => (depth.get(p) ?? 99) > 3);
  const unreachable = paths.filter((p) => !depth.has(p));

  const issues = [];
  for (const p of orphans) issues.push({ severity: 'medium', path: p, issue: 'orphan — no internal page links to it' });
  for (const p of unreachable) issues.push({ severity: 'medium', path: p, issue: 'not reachable from the homepage by any internal link path' });
  for (const p of deep) issues.push({ severity: 'low', path: p, issue: `click depth ${depth.get(p)} from the homepage` });
  for (const b of broken.slice(0, 20)) issues.push({ severity: 'medium', path: b.from, issue: `links to ${b.to}, which is not in the sitemap` });

  log(`  Links       ${outbound.size}/${paths.length} pages crawled · ${orphans.length} orphan(s) · ${broken.length} off-sitemap link(s)`);

  return sourceBlock({
    source: 'internal-link-crawl',
    status: 'ok',
    window_start: date,
    window_end: date,
    lag_days: 0,
    limitations: [
      'Reads the prerendered html, so links rendered only after hydration are invisible here. On this site the nav and footer are prerendered, so the graph is substantially complete.',
      'An "off-sitemap link" is not automatically a defect: /blog/* posts and legal pages are legitimately linked. Read the list, do not act on the count.',
      'Anchor text is truncated to 80 characters per link.',
    ],
    data: {
      crawled: outbound.size,
      sitemap_urls: paths.length,
      orphans,
      unreachable,
      max_depth: Math.max(0, ...[...depth.values()]),
      depth: Object.fromEntries(depth),
      inbound: Object.fromEntries(inbound),
      anchors: Object.fromEntries([...anchors].map(([k, v]) => [k, [...new Set(v)]])),
      off_sitemap_links: broken,
      fetch_failed: fetchFailed,
      issues,
    },
  });
}

/* --------------------------------------------------------- structured data --- */

/** Parse the JSON-LD blocks on each tracked page and record which types exist. */
async function schema() {
  const byPath = {};
  const issues = [];
  for (const page of CONFIG.pages) {
    try {
      const res = await get(ORIGIN + page.path, { pace: PACE_MS });
      if (!res.ok) continue;
      const html = await res.text();
      const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      const types = [];
      let invalid = 0;
      for (const b of blocks) {
        try {
          const parsed = JSON.parse(b[1]);
          for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
            if (node?.['@type']) types.push(node['@type']);
          }
        } catch {
          invalid++;
        }
      }
      byPath[page.path] = { blocks: blocks.length, types, invalid };
      if (invalid) issues.push({ severity: 'high', path: page.path, issue: `${invalid} JSON-LD block(s) failed to parse` });
      if (!blocks.length) issues.push({ severity: 'low', path: page.path, issue: 'no JSON-LD structured data' });
    } catch { /* technical() already records fetch failures; do not double-report */ }
  }

  const total = Object.values(byPath).reduce((n, v) => n + v.blocks, 0);
  log(`  Schema      ${total} JSON-LD block(s) across ${Object.keys(byPath).length} page(s) · ${issues.length} issue(s)`);

  return sourceBlock({
    source: 'structured-data-parse',
    status: 'ok',
    window_start: date,
    window_end: date,
    lag_days: 0,
    limitations: [
      'Checks that JSON-LD parses and records its @type. It does NOT validate against schema.org requirements or against Google rich-result eligibility — use the Rich Results Test for that.',
    ],
    data: { pages: byPath, issues },
  });
}

/* ------------------------------------------------------ PageSpeed / CrUX --- */

/**
 * PageSpeed Insights: Lighthouse lab scores plus, where Chrome has enough real
 * traffic, CrUX FIELD data — actual Core Web Vitals from actual visitors.
 *
 * The field half is the interesting half and is also the half most likely to be
 * absent: CrUX needs a minimum traffic threshold before it will report a URL,
 * and a site this quiet may only ever get origin-level data, or none. Absence
 * is recorded as absence.
 *
 * Runs without an API key, but the shared anonymous quota is regularly
 * exhausted (observed 429 during setup on 2026-08-17). A 429 is `pending`, not
 * an error: nothing is wrong, the reading just is not available. Set
 * PAGESPEED_API_KEY in .env for a free dedicated quota.
 */
async function psi() {
  const env = loadEnv();
  const key = env.PAGESPEED_API_KEY;
  const results = {};
  let quotaBlocked = false;

  for (const path of CONFIG.pagespeed.sampled_pages) {
    const u = new URL(CONFIG.pagespeed.endpoint);
    u.searchParams.set('url', ORIGIN + path);
    u.searchParams.set('strategy', CONFIG.pagespeed.strategy);
    for (const c of ['performance', 'seo', 'accessibility', 'best-practices']) u.searchParams.append('category', c);
    if (key) u.searchParams.set('key', key);

    try {
      const r = await get(u.toString(), { timeout: 90000, retry: false });
      const j = await r.json();
      if (j.error) {
        if (r.status === 429 || /quota/i.test(j.error.message ?? '')) { quotaBlocked = true; break; }
        results[path] = { error: String(j.error.message).slice(0, 200) };
        continue;
      }
      const cats = j.lighthouseResult?.categories ?? {};
      const field = j.loadingExperience?.metrics ?? null;
      const originField = j.originLoadingExperience?.metrics ?? null;
      results[path] = {
        lab: {
          performance: cats.performance?.score ?? null,
          seo: cats.seo?.score ?? null,
          accessibility: cats.accessibility?.score ?? null,
          best_practices: cats['best-practices']?.score ?? null,
          lcp_ms: j.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue ?? null,
          cls: j.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue ?? null,
          tbt_ms: j.lighthouseResult?.audits?.['total-blocking-time']?.numericValue ?? null,
        },
        field_url: field ? {
          lcp_ms: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
          inp_ms: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
          cls: field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
        } : null,
        field_origin: originField ? {
          lcp_ms: originField.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
          inp_ms: originField.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
          cls: originField.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
        } : null,
      };
    } catch (err) {
      results[path] = { error: String(err.message).slice(0, 200) };
    }
  }

  if (quotaBlocked) {
    log(`  PageSpeed   pending — anonymous quota exhausted${key ? ' (even with a key: check the key)' : '; set PAGESPEED_API_KEY in .env'}`);
    return sourceBlock({
      source: 'pagespeed-insights',
      status: 'pending',
      window_start: date,
      window_end: date,
      limitations: ['PageSpeed quota was exhausted at collection time. This is an unavailable reading, not a slow site.'],
      data: { how_to_collect: 'Create a free Google API key with the PageSpeed Insights API enabled and set PAGESPEED_API_KEY in .env. Without one the shared anonymous quota is frequently unavailable.' },
    });
  }

  const withField = Object.values(results).filter((r) => r.field_url).length;
  const scored = Object.values(results).filter((r) => r.lab?.performance != null);
  const avg = scored.length
    ? Math.round((scored.reduce((n, r) => n + r.lab.performance, 0) / scored.length) * 100)
    : null;
  log(`  PageSpeed   ${scored.length}/${CONFIG.pagespeed.sampled_pages.length} sampled · avg perf ${avg ?? 'n/a'} · ${withField} with CrUX field data`);

  return sourceBlock({
    source: 'pagespeed-insights',
    status: scored.length ? 'ok' : 'error',
    window_start: date,
    window_end: date,
    lag_days: 0,
    limitations: [
      'Lab scores are a single throttled run and move several points between identical runs. Only a sustained change across trend_min_days is signal.',
      'CrUX field data covers a rolling 28-day window, so it lags a change by weeks and is absent entirely for URLs below Chrome\'s traffic threshold.',
      `Mobile strategy only (${CONFIG.pagespeed.strategy}); desktop is not measured.`,
    ],
    data: { strategy: CONFIG.pagespeed.strategy, keyed: Boolean(key), pages: results },
  });
}

/* -------------------------------------------------------------- Vercel --- */

/**
 * Production deployment timeline.
 *
 * Not vanity metrics. This exists so a later reader can tell whether a metric
 * moved because we shipped something or because the SERP moved on its own.
 * Without the deploy timeline that distinction is guesswork, and guesswork is
 * how a coincidence becomes a believed cause.
 *
 * Uses the token the Vercel CLI already stores locally, so it needs no new
 * credential. If the CLI is logged out, that is `pending`, not an error.
 */
async function vercel() {
  const env = loadEnv();
  let token = env.VERCEL_TOKEN ?? null;
  if (!token) {
    for (const p of [
      join(env.HOME ?? '', 'Library', 'Application Support', 'com.vercel.cli', 'auth.json'),
      join(env.HOME ?? '', '.vercel', 'auth.json'),
      join(env.HOME ?? '', '.config', 'com.vercel.cli', 'auth.json'),
    ]) {
      try { token = JSON.parse(readFileSync(p, 'utf8')).token; if (token) break; } catch { /* next */ }
    }
  }

  if (!token) {
    log('  Vercel      pending — no CLI token found; run `vercel login`');
    return sourceBlock({
      source: 'vercel-api',
      status: 'pending',
      limitations: ['Needs either VERCEL_TOKEN in .env or a logged-in Vercel CLI.'],
      data: { how_to_collect: 'Run `vercel login`, or set VERCEL_TOKEN in .env.' },
    });
  }

  const { team_id, project_id, api } = CONFIG.vercel;
  try {
    const r = await get(
      `${api}/v6/deployments?projectId=${project_id}&teamId=${team_id}&limit=20&target=production&state=READY`,
      { headers: { Authorization: `Bearer ${token}` }, retry: false },
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    const deployments = (j.deployments ?? []).map((d) => ({
      created_at: new Date(d.created).toISOString(),
      state: d.state,
      commit_sha: d.meta?.githubCommitSha?.slice(0, 7) ?? null,
      commit_message: d.meta?.githubCommitMessage?.split('\n')[0]?.slice(0, 120) ?? null,
    }));
    const latest = deployments[0]?.created_at ?? null;
    const daysSince = latest ? Math.round((new Date(date) - new Date(latest)) / 86400000) : null;
    log(`  Vercel      ${deployments.length} production deploy(s) known · latest ${latest?.slice(0, 10) ?? 'n/a'}`);

    return sourceBlock({
      source: 'vercel-api',
      status: 'ok',
      window_start: deployments.at(-1)?.created_at?.slice(0, 10) ?? null,
      window_end: date,
      lag_days: 0,
      limitations: [
        'The last 20 READY production deployments only, so a long history is truncated.',
        'Vercel Web Analytics is NOT included: it is enabled on the project but has no stable REST endpoint. It is collected as a separate browser-gated source.',
      ],
      data: { latest_production_deploy: latest, days_since_deploy: daysSince, deployments },
    });
  } catch (err) {
    log(`  Vercel      FAILED: ${redact(err.message)}`);
    return sourceBlock({ source: 'vercel-api', status: 'error', error: redact(err.message).slice(0, 400) });
  }
}

/* ------------------------------------------------------------------ run --- */

const results = {};
if (!skip.includes('technical')) results.technical = await technical();
if (!skip.includes('links')) results.internal_links = await links();
if (!skip.includes('schema')) results.structured_data = await schema();
if (!skip.includes('psi')) results.page_speed = await psi();
if (!skip.includes('vercel')) results.vercel = await vercel();

// The historical-write guard lives in mergeSource. Surface its refusal as a
// plain message and a non-zero exit rather than a stack trace — this is an
// expected, correct outcome when someone points a run at a past date, not a
// crash, and it should read that way in a scheduled job's log.
function merge(name, block) {
  if (!block) return;
  try {
    mergeSource(date, name, block, { force });
  } catch (err) {
    console.error(`\n${err.message}\n`);
    process.exit(3);
  }
}

for (const [name, block] of Object.entries(results)) merge(name, block);

// Record the absence of the browser-collected sources explicitly. A missing key
// would later be read as a zero; a `pending` block cannot be.
const snap = loadSnapshot(date) ?? {};
for (const [key, source, how] of [
  ['search_console', 'google-search-console', `Capture the figures from Search Console as ${CONFIG.site.gsc_account} on property ${CONFIG.site.gsc_property}, then run scripts/seo/ingest-gsc.mjs.`],
  ['serp_probe', 'fixed-serp-probe', 'Run docs/seo/probe.js in the attached Chrome from a google.com tab, then scripts/seo/ingest-serp.mjs.'],
  ['vercel_web_analytics', 'vercel-web-analytics-ui', 'Read pageviews, top pages and referrers from the Vercel dashboard. Vercel publishes no REST endpoint for this; five shapes were probed on 2026-08-17 and all 404d.'],
]) {
  if (!snap.sources?.[key]) {
    merge(key, sourceBlock({
      source,
      status: 'pending',
      limitations: ['Requires an interactively authenticated browser session; not collectable by an unattended run.'],
      data: { how_to_collect: how },
    }));
    log(`  ${key.padEnd(20)} pending`);
  }
}

log(`\nWrote docs/seo/data/daily/${date}.json\n`);
