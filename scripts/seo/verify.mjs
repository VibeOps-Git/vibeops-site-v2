#!/usr/bin/env node
/**
 * System integrity check.
 *
 *   node scripts/seo/verify.mjs
 *
 * Run before committing, and as the first step of the daily run. Catches the
 * failure modes that would quietly corrupt the dataset rather than crash:
 * a drifted query set, a snapshot missing its provenance, a credential about
 * to be committed, a history file that no longer matches its inputs.
 *
 * Exits non-zero if anything fails, so it can gate a scheduled run.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT, SEO_DIR, DATA_DIR, CONFIG, QUERY_SET, listSnapshotDates, loadSnapshot,
  readJSON, log,
} from './lib/core.mjs';

let failures = 0;
let warnings = 0;

const pass = (m) => log(`  ok    ${m}`);
const fail = (m) => { failures++; log(`  FAIL  ${m}`); };
const warn = (m) => { warnings++; log(`  warn  ${m}`); };

log('\nSEO system verification\n');

/* --------------------------------------------- 1. query-set parity ------ */

log('Query set');
{
  const probe = readFileSync(join(SEO_DIR, 'probe.js'), 'utf8');
  // Pull the generated QUERIES array out of probe.js and compare against
  // queries.json. probe.js must stay self-contained because it is pasted into a
  // browser page context, so the copies are verified rather than shared.
  const m = /const QUERIES = \[([\s\S]*?)\n\];/.exec(probe);
  if (!m) {
    fail('could not parse the QUERIES array out of probe.js');
  } else {
    const inProbe = [...m[1].matchAll(/q: '((?:[^'\\]|\\.)*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
    const inJson = QUERY_SET.queries.map((q) => q.q);
    const missing = inJson.filter((q) => !inProbe.includes(q));
    const extra = inProbe.filter((q) => !inJson.includes(q));
    if (missing.length || extra.length) {
      fail(`probe.js and queries.json disagree — missing in probe: [${missing.join(', ')}]; not in queries.json: [${extra.join(', ')}]. Run npm run seo:sync-probe.`);
    } else {
      pass(`probe.js and queries.json agree on all ${inJson.length} queries`);
    }
    // Cluster tags travel with the query into the probe output and into the
    // register, so a mismatch would misattribute every position it reports.
    const probeClusters = [...m[1].matchAll(/cluster: '([^']*)'/g)].map((x) => x[1]);
    const jsonClusters = QUERY_SET.queries.map((q) => q.cluster);
    if (inProbe.length === inJson.length && probeClusters.join('|') !== jsonClusters.join('|')) {
      fail('probe.js cluster tags do not match queries.json. Run npm run seo:sync-probe.');
    } else if (inProbe.length === inJson.length) {
      pass('cluster tags agree between probe.js and queries.json');
    }
  }

  const dupes = QUERY_SET.queries.map((q) => q.q).filter((q, i, a) => a.indexOf(q) !== i);
  if (dupes.length) fail(`duplicate queries in queries.json: ${dupes.join(', ')}`);
  else pass('no duplicate queries');

  const badTargets = QUERY_SET.queries.filter((q) => q.target && !CONFIG.pages.some((p) => p.path === q.target));
  if (badTargets.length) fail(`queries target pages not in config: ${badTargets.map((q) => q.target).join(', ')}`);
  else pass('every query target is a known page');

  const badClusters = QUERY_SET.queries.filter((q) => q.cluster && !CONFIG.clusters[q.cluster]);
  if (badClusters.length) fail(`queries reference unknown clusters: ${[...new Set(badClusters.map((q) => q.cluster))].join(', ')}`);
  else pass('every query cluster exists in config');
}

/* ------------------ 1a. benchmark immutability + discovery separation --- */

log('\nBenchmark integrity');
{
  const { createHash } = await import('node:crypto');
  const qs = QUERY_SET.queries.map((q) => q.q);
  const sha = createHash('sha256').update(JSON.stringify(qs)).digest('hex');
  const expected = CONFIG.benchmark;

  if (!expected) {
    warn('no benchmark fingerprint recorded in config.json');
  } else if (expected.sha256 == null) {
    // Deliberately a warning, not a failure. The system has to be usable on the
    // day it is installed, and freezing before the query set has been reviewed
    // once would freeze a mistake. Freeze it before the first weekly review.
    warn(`benchmark is UNFROZEN — ${qs.length} queries, current sha256 ${sha.slice(0, 16)}…. Run 'npm run seo:freeze' before the first weekly review, or week-over-week comparison has no fixed baseline.`);
  } else if (sha !== expected.sha256) {
    // This is the most consequential failure in the whole system. Every weekly
    // comparison since 2026-08-10 assumes this set is identical.
    fail(
      `THE FROZEN BENCHMARK HAS CHANGED. Expected sha256 ${expected.sha256.slice(0, 16)}…, got ${sha.slice(0, 16)}…, ` +
        `${qs.length} queries against ${expected.query_count} recorded. Every prior week's comparison is now suspect. ` +
        `If a query is genuinely invalid, mark it deprecated and KEEP MEASURING IT — do not remove or reword it.`,
    );
  } else {
    pass(`benchmark unchanged since ${expected.frozen_on} — ${qs.length} queries, sha256 ${sha.slice(0, 16)}…`);
  }

  // The discovery set may evolve, but it must stay disjoint from the benchmark.
  const disc = readJSON(join(SEO_DIR, 'discovery-queries.json'));
  if (!disc) {
    warn('discovery-queries.json missing');
  } else {
    const benchLower = new Set(qs.map((q) => q.toLowerCase()));
    const active = disc.queries.filter((q) => q.status === 'active');
    const overlap = active.filter((q) => benchLower.has(q.q.toLowerCase()));
    if (overlap.length) {
      fail(`${overlap.length} discovery quer(y/ies) also appear in the frozen benchmark: ${overlap.map((q) => q.q).join(', ')}. The sets must stay disjoint.`);
    } else {
      pass(`discovery set disjoint from benchmark — ${active.length} active discovery queries`);
    }

    const noProv = active.filter((q) => !q.provenance);
    if (noProv.length) fail(`${noProv.length} discovery quer(y/ies) have no provenance recorded`);
    else pass('every discovery query records its provenance');

    // The browser copy is generated, so it must match the source of truth.
    const probeSrc = readFileSync(join(SEO_DIR, 'discovery-probe.js'), 'utf8');
    const m = /const DISCOVERY_QUERIES = \[([\s\S]*?)\];/.exec(probeSrc);
    const inProbe = m ? [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => JSON.parse('"' + x[1] + '"')) : [];
    const missing = active.map((q) => q.q).filter((q) => !inProbe.includes(q));
    const extra = inProbe.filter((q) => !active.some((a) => a.q === q));
    if (missing.length || extra.length) {
      fail(`discovery-probe.js is stale — missing [${missing.join(', ')}], extra [${extra.join(', ')}]. Run scripts/seo/discovery-probe-build.mjs.`);
    } else {
      pass(`discovery-probe.js matches the active set (${inProbe.length} queries)`);
    }
  }
}

/* -------------------------------- 1b. (no UX telemetry on this site) ---- */
//
// roadway.tools verifies its first-party UX telemetry vocabulary here, asserting
// that the TypeScript taxonomy and the Node reporting mirror have not drifted,
// and that the telemetry client never reads a form value. This site ships no
// first-party telemetry — analytics is GTM, which we do not control the schema
// of — so there is nothing to verify and the section is intentionally absent
// rather than stubbed. If first-party telemetry is ever added here, port that
// check with it; it is the thing that stops user input reaching an analytics
// store.

/* ------------------------------------------------ 2. snapshot integrity - */

log('\nDaily snapshots');
{
  const dates = listSnapshotDates();
  if (!dates.length) warn('no snapshots on disk yet');
  else pass(`${dates.length} snapshot(s): ${dates[0]} → ${dates[dates.length - 1]}`);

  for (const d of dates) {
    const s = loadSnapshot(d);
    if (s.date !== d) fail(`${d}.json has date field "${s.date}"`);
    for (const [name, b] of Object.entries(s.sources ?? {})) {
      if (!b.source) fail(`${d}/${name} has no source attribution`);
      if (!b.collected_at) fail(`${d}/${name} has no collection timestamp`);
      if (!b.status) fail(`${d}/${name} has no status`);
      if (b.status === 'ok' && !b.represents) fail(`${d}/${name} is ok but records no window`);
      if (b.status === 'ok' && b.lag_days == null) warn(`${d}/${name} records no lag`);
      if (b.status === 'ok' && !(b.limitations?.length)) warn(`${d}/${name} declares no limitations`);
    }
    // The gate that matters most: no Search Console data from another account.
    const g = s.sources?.search_console;
    if (g?.status === 'ok' && g.data?.account_verified !== CONFIG.site.gsc_account) {
      fail(`${d} Search Console block is attributed to "${g.data?.account_verified}", not ${CONFIG.site.gsc_account}`);
    }
  }
  if (dates.length) pass('every source block carries source, timestamp, status and window');
}

/* ------------------------------------------- 3. history reproducibility - */

log('\nDerived files');
{
  const h = readJSON(join(DATA_DIR, 'history.json'));
  if (!h) warn('history.json not generated yet');
  else {
    const dates = listSnapshotDates();
    const obs = new Set(h.by_observation.map((r) => r.observed_on));
    const missing = dates.filter((d) => !obs.has(d));
    if (missing.length) fail(`history.json is stale — missing observations for ${missing.join(', ')}. Re-run history.mjs.`);
    else pass(`history.json covers all ${dates.length} observation(s)`);

    // Per-day GSC values must never exceed the cumulative total reported for
    // the same window — a sign of a transcription or merge error.
    for (const s of dates.map(loadSnapshot)) {
      const g = s.sources?.search_console;
      if (g?.status !== 'ok') continue;
      const summed = (g.data.by_day ?? []).reduce((a, b) => a + (b.impressions ?? 0), 0);
      const total = g.data.totals?.impressions ?? 0;
      if (summed > total) fail(`${s.date}: by_day impressions sum to ${summed}, above the reported total ${total}`);
    }
    pass('per-day figures are consistent with reported totals');
  }
}

/* ------------------------------------------------- 4. registers well-formed */

log('\nRegisters');
for (const [file, key] of [
  ['opportunities.json', 'opportunities'],
  ['experiments.json', 'experiments'],
  ['link-opportunities.json', 'opportunities'],
  ['competitors.json', 'competitors'],
]) {
  const p = join(DATA_DIR, file);
  if (!existsSync(p)) { warn(`${file} missing`); continue; }
  const j = readJSON(p);
  if (!j) { fail(`${file} is not valid JSON`); continue; }
  if (!Array.isArray(j[key])) { fail(`${file} has no ${key}[] array`); continue; }
  pass(`${file} — ${j[key].length} record(s)`);
}
{
  const db = readJSON(join(DATA_DIR, 'opportunities.json'));
  const ids = (db?.opportunities ?? []).map((o) => o.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(`duplicate opportunity ids: ${[...new Set(dupes)].join(', ')}`);
  else if (ids.length) pass('opportunity ids are unique');

  const bad = (db?.opportunities ?? []).filter(
    (o) => !['HOLD', 'OPTIMIZE', 'CREATE', 'PROMOTE', 'TECHNICAL', 'UX'].includes(o.recommended_action),
  );
  if (bad.length) fail(`${bad.length} opportunity(ies) have an action outside the six allowed values`);
  else if (ids.length) pass('every opportunity maps to one of the six allowed recommendations');
}

/* ------------------------------------------------------- 5. no secrets -- */

log('\nSecrets');
{
  // Only genuinely secret-shaped variables count. The Vercel team and project
  // ids in config.json are identifiers, not credentials: they appear in
  // dashboard URLs and grant nothing on their own. Treating them as secrets
  // would make this check cry wolf and get ignored, which is worse than not
  // having it. Tokens and API keys are the things that must never leak.
  let env = '';
  try {
    env = readFileSync(join(ROOT, '.env'), 'utf8').trim();
  } catch {
    // No .env is a legitimate state here: every collector either needs no
    // credential or falls back to one the Vercel CLI already stores.
  }
  const secrets = env
    .split('\n')
    .map((l) => l.match(/^([A-Z0-9_]+)=(.+)$/))
    .filter((m) => m && /TOKEN|SECRET|KEY|PASSWORD|CREDENTIAL/.test(m[1]))
    .map((m) => m[2])
    .filter((v) => v && v.length > 8);

  const scan = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(json|md|mjs|js|csv|svg)$/.test(e.name)) scan.push(p);
    }
  };
  walk(SEO_DIR);
  walk(join(ROOT, 'scripts'));

  let leaked = 0;
  for (const f of scan) {
    const body = readFileSync(f, 'utf8');
    for (const s of secrets) {
      if (body.includes(s)) { fail(`credential value appears in ${f.replace(ROOT + '/', '')}`); leaked++; }
    }
  }
  if (!leaked) pass(`no .env credential value appears in any of ${scan.length} committed file(s)`);

  const gitignore = readFileSync(join(ROOT, '.gitignore'), 'utf8');
  if (!/^\.env$/m.test(gitignore)) fail('.env is not gitignored');
  else pass('.env is gitignored');
}

/* ------------------------------------------------- 6. scope enforcement - */

log('\nScope');
{
  // The system observes and recommends. Flipping either of these turns a
  // reporting tool into something that edits the live site on a schedule, which
  // is exactly the auto-publishing behaviour this was built to avoid.
  for (const [k, label] of [
    ['may_edit_production', 'edit production'],
    ['may_publish_content', 'publish content'],
  ]) {
    if (CONFIG.product_scope[k] === true) {
      warn(`config declares the system MAY ${label} — confirm this was a deliberate, user-approved change`);
    } else {
      pass(`system may not ${label} (it identifies; a person writes and ships)`);
    }
  }

  // The account gate. This Chrome profile also has dentzander@gmail.com signed
  // in, which owns roadway.tools — ingesting one property's numbers into the
  // other's dataset would be silent and unrecoverable, so it is checked here
  // and again inside ingest-gsc.mjs.
  if (!CONFIG.site.gsc_account) {
    fail('config.site.gsc_account is unset — Search Console ingestion has no account gate');
  } else {
    pass(`Search Console account gate is set to ${CONFIG.site.gsc_account}`);
  }
  if (!/^sc-domain:|^https?:\/\//.test(CONFIG.site.gsc_property ?? '')) {
    fail(`config.site.gsc_property "${CONFIG.site.gsc_property}" is not a valid property id`);
  } else {
    pass(`Search Console property is ${CONFIG.site.gsc_property}`);
  }
}

/* -------------------------------------------------------------- result -- */

log(`\n${failures ? 'FAILED' : 'PASSED'} — ${failures} failure(s), ${warnings} warning(s)\n`);
process.exit(failures ? 1 : 0);
