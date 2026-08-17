#!/usr/bin/env node
/**
 * Ingest DISCOVERY probe output.
 *
 *   node scripts/seo/ingest-discovery.mjs <discovery-output.json> [--date=YYYY-MM-DD] [--dry-run]
 *
 * Writes to the `serp_discovery` source block — deliberately NOT `serp_probe`.
 * The two instruments answer different questions and must never be merged:
 *
 *   serp_probe      41 frozen benchmark queries. Same set every time, so its
 *                   totals ARE a trend series.
 *   serp_discovery  an evolving set. Its totals are NOT a trend series, because
 *                   "3 of 27 ranked" and "3 of 31 ranked" are not comparable
 *                   when the 27 and the 31 are different queries.
 *
 * So this ingest tracks movement PER QUERY against that query's own history,
 * and refuses to compute a set-level delta. A discovery query that has been in
 * the set for three runs has a real three-point series; the set does not.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SEO_DIR, QUERY_SET, resolveDate, hasFlag, mergeSource, sourceBlock,
  listSnapshotDates, loadSnapshot, readJSON, log,
} from './lib/core.mjs';

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.error('usage: node scripts/seo/ingest-discovery.mjs <output.json> [--date=YYYY-MM-DD] [--dry-run]');
  process.exit(1);
}

const date = resolveDate();
const force = hasFlag('force-date');
const dryRun = hasFlag('dry-run');
const raw = JSON.parse(readFileSync(file, 'utf8'));
const rows = Array.isArray(raw) ? raw : (raw.rows ?? raw.results ?? []);

const SET = readJSON(join(SEO_DIR, 'discovery-queries.json'));
if (!SET) {
  console.error('REFUSED: docs/seo/discovery-queries.json is missing or unreadable.');
  process.exit(2);
}

const active = SET.queries.filter((q) => q.status === 'active');
const expected = active.map((q) => q.q);
const got = rows.map((r) => r.q ?? r.query);

/* --- Separation guard. The one mistake that would ruin both instruments. --- */

const benchmark = new Set(QUERY_SET.queries.map((q) => q.q.toLowerCase()));
const contaminating = expected.filter((q) => benchmark.has(q.toLowerCase()));
if (contaminating.length) {
  console.error(
    `\nREFUSED: ${contaminating.length} discovery quer${contaminating.length === 1 ? 'y is' : 'ies are'} also in the frozen benchmark:\n` +
      contaminating.map((q) => `  - ${q}`).join('\n') +
      `\n\nThe two sets must stay disjoint. The benchmark measures a fixed thing over time;\n` +
      `discovery measures a moving one. Overlap makes both unreadable.\n`,
  );
  process.exit(2);
}

/* --- Set membership. Unlike the benchmark, additions are allowed — but the --
   probe must have measured the CURRENT set, not a stale copy. */

const missing = expected.filter((q) => !got.includes(q));
const extra = got.filter((q) => !expected.includes(q));
if (missing.length || extra.length) {
  console.error(
    `\nREFUSED: probe output does not match the active discovery set.\n` +
      (missing.length ? `  not measured (${missing.length}): ${missing.join(' | ')}\n` : '') +
      (extra.length ? `  measured but not in the active set (${extra.length}): ${extra.join(' | ')}\n` : '') +
      `\nRegenerate the browser probe with scripts/seo/discovery-probe-build.mjs and re-run.\n`,
  );
  process.exit(2);
}

/* ------------------------------------- per-query history, not set history --- */

// Build each query's own prior observations. This is the only comparison that
// is valid for an evolving set.
const history = new Map();
for (const d of listSnapshotDates().filter((d) => d < date)) {
  const b = loadSnapshot(d)?.sources?.serp_discovery;
  if (b?.status !== 'ok') continue;
  for (const r of b.data.results ?? []) {
    const list = history.get(r.query) ?? [];
    list.push({ date: d, position: r.position });
    history.set(r.query, list);
  }
}

const meta = new Map(active.map((q) => [q.q, q]));
const errored = [];

const results = rows.map((r) => {
  const query = r.q ?? r.query;
  const position = r.pos ?? r.position ?? 0;
  const m = meta.get(query);
  if (position === -1) errored.push(query);

  const prior = history.get(query) ?? [];
  const last = prior.length ? prior[prior.length - 1] : null;

  let movement_label = 'first_observation';
  let movement = null;
  if (last) {
    const from = last.position;
    if (from === 0 && position === 0) movement_label = 'absent';
    else if (from === 0) movement_label = 'entered';
    else if (position === 0) movement_label = 'dropped_out';
    else {
      movement = from - position;
      movement_label = movement > 0 ? 'improved' : movement < 0 ? 'declined' : 'flat';
    }
  }

  return {
    query,
    cluster: m?.cluster ?? null,
    target_page: m?.target ?? null,
    provenance: m?.provenance ?? null,
    added: m?.added ?? null,
    position,
    top_domains: (r.top3 ?? r.top_domains ?? '').toString(),
    previous_position: last?.position ?? null,
    previous_date: last?.date ?? null,
    movement,
    movement_label,
    observations: prior.length + 1,
  };
});

const ranked = results.filter((r) => r.position > 0);
const summary = {
  set_version: SET.version,
  measured: results.length,
  errored: errored.length,
  in_top_20: ranked.length,
  in_top_10: ranked.filter((r) => r.position <= 10).length,
  in_top_3: ranked.filter((r) => r.position <= 3).length,
  at_1: ranked.filter((r) => r.position === 1).length,
  by_cluster: {},
  by_provenance: {},
};
for (const r of results) {
  const c = r.cluster ?? 'unknown';
  summary.by_cluster[c] ??= { measured: 0, in_top_20: 0, in_top_10: 0 };
  summary.by_cluster[c].measured++;
  if (r.position > 0) summary.by_cluster[c].in_top_20++;
  if (r.position > 0 && r.position <= 10) summary.by_cluster[c].in_top_10++;

  const p = r.provenance ?? 'unknown';
  summary.by_provenance[p] ??= { measured: 0, in_top_20: 0 };
  summary.by_provenance[p].measured++;
  if (r.position > 0) summary.by_provenance[p].in_top_20++;
}

const block = sourceBlock({
  source: 'discovery-serp-probe',
  status: errored.length === results.length ? 'error' : 'ok',
  window_start: date,
  window_end: date,
  lag_days: 0,
  limitations: [
    'DISCOVERY SET, NOT THE BENCHMARK. Never compare these counts against serp_probe counts, and never present them as the same measurement.',
    'The set EVOLVES. Set-level totals are not a trend series — "3 of 27" and "3 of 31" are not comparable when the queries differ. Only per-query history is valid.',
    'Results are personalised and geolocated; this scripted read has disagreed with the rendered SERP by 6 places on the same query on the same day.',
    'Position 0 means "not found in the top 20" — censored, not position 21.',
    'Search Console remains authoritative for position, impressions and CTR.',
    'A discovery query is never promoted into the frozen benchmark; doing so would manufacture an improvement from a query we already ranked for.',
  ],
  data: {
    set_version: SET.version,
    summary,
    results,
    errored_queries: errored,
  },
});

if (!dryRun) mergeSource(date, 'serp_discovery', block, { force });

log(`\nDiscovery probe ${dryRun ? 'VALIDATED (dry run — nothing written)' : `ingested into ${date}.json`}`);
log(`  set version  ${SET.version} · ${summary.measured} active queries (${summary.errored} errored)`);
log(`  top 20/10/3  ${summary.in_top_20} / ${summary.in_top_10} / ${summary.in_top_3}   [DISCOVERY — not comparable to the benchmark]`);
for (const [c, v] of Object.entries(summary.by_cluster)) {
  log(`    ${c.padEnd(16)} ${v.in_top_20}/${v.measured} in top 20`);
}
const moved = results.filter((r) => ['improved', 'declined', 'entered', 'dropped_out'].includes(r.movement_label));
if (moved.length) {
  log(`  per-query movement (${moved.length}):`);
  for (const r of moved.slice(0, 12)) log(`    ${r.movement_label.padEnd(13)} ${r.query} — ${r.previous_position} → ${r.position}`);
} else {
  log('  no per-query movement — first observation for every query, or all flat');
}
const rankedList = results.filter((r) => r.position > 0).sort((a, b) => a.position - b.position);
if (rankedList.length) {
  log(`  ranked:`);
  for (const r of rankedList) log(`    ${String(r.position).padStart(3)}  ${r.query}  [${r.provenance}]`);
}
log('');
