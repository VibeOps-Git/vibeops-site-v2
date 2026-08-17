#!/usr/bin/env node
/**
 * Ingest fixed SERP probe output.
 *
 *   node scripts/seo/ingest-serp.mjs <probe-output.json> [--date=YYYY-MM-DD]
 *
 * Accepts the JSON emitted by docs/seo/probe.js (`probe.json` in its return
 * value). Computes movement against the most recent prior probe so a position
 * change is stored as a change, not just a number.
 *
 * The measurement itself is unchanged from the 2026-08-10 baseline. Positions
 * are personalised, geolocated, and this scripted read has disagreed with the
 * rendered SERP by 6 places on the same query on the same day. Consistency of
 * method across runs is the whole point; a single position is not actionable.
 */

import { readFileSync } from 'node:fs';
import {
  QUERY_SET, resolveDate, hasFlag, mergeSource, sourceBlock, listSnapshotDates,
  loadSnapshot, log, CONFIG,
} from './lib/core.mjs';

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.error('usage: node scripts/seo/ingest-serp.mjs <probe-output.json> [--date=YYYY-MM-DD]');
  process.exit(1);
}

const date = resolveDate();
const force = hasFlag('force-date');
// --dry-run validates query-set parity and computes movement without recording.
const dryRun = hasFlag('dry-run');
const raw = JSON.parse(readFileSync(file, 'utf8'));
const rows = Array.isArray(raw) ? raw : (raw.rows ?? raw.results ?? []);

if (!rows.length) {
  console.error('REFUSED: no probe rows found in payload.');
  process.exit(2);
}

/* --- Query-set parity. A probe that measured a different set is not -------
   comparable with any prior week, so it is rejected rather than recorded. */

const expected = QUERY_SET.queries.map((q) => q.q);
const got = rows.map((r) => r.q ?? r.query);
const missing = expected.filter((q) => !got.includes(q));
const extra = got.filter((q) => !expected.includes(q));
if (missing.length || extra.length) {
  console.error(
    `\nREFUSED: probe set does not match docs/seo/queries.json.\n` +
      (missing.length ? `  missing (${missing.length}): ${missing.join(' | ')}\n` : '') +
      (extra.length ? `  unexpected (${extra.length}): ${extra.join(' | ')}\n` : '') +
      `\nA changed query set breaks comparability with every prior measurement.\n` +
      `If the set genuinely must change, update queries.json AND probe.js together and\n` +
      `record the methodology change in that week's report.\n`,
  );
  process.exit(2);
}

/* --------------------------------------------- previous probe for delta --- */

let previous = null;
let previousDate = null;
for (const d of listSnapshotDates().filter((d) => d < date).reverse()) {
  const s = loadSnapshot(d);
  const b = s?.sources?.serp_probe;
  if (b?.status === 'ok' && b.data?.results?.length) {
    previous = new Map(b.data.results.map((r) => [r.query, r.position]));
    previousDate = d;
    break;
  }
}

const meta = new Map(QUERY_SET.queries.map((q) => [q.q, q]));
const errored = [];

const results = rows.map((r) => {
  const query = r.q ?? r.query;
  const position = r.pos ?? r.position ?? 0;
  const m = meta.get(query);
  const prev = previous?.get(query) ?? null;
  if (position === -1) errored.push(query);

  // Movement is only meaningful between two real observations. 0 means "not in
  // the top 20", which is a censored value, not position 21 — so entering or
  // leaving the measured range is labelled rather than differenced.
  let movement = null;
  if (prev != null && position > 0 && prev > 0) movement = prev - position;

  let movement_label = 'no_prior';
  if (prev != null) {
    if (position === 0 && prev === 0) movement_label = 'absent';
    else if (position === 0 && prev > 0) movement_label = 'dropped_out';
    else if (position > 0 && prev === 0) movement_label = 'entered';
    else if (movement === 0) movement_label = 'flat';
    else movement_label = movement > 0 ? 'improved' : 'declined';
  }

  return {
    query,
    cluster: m?.cluster ?? null,
    target_page: m?.target ?? null,
    head: Boolean(m?.head),
    strategic: Boolean(m?.strategic),
    position,
    top_domains: (r.top3 ?? r.top_domains ?? '').toString(),
    previous_position: prev,
    previous_date: previousDate,
    movement,
    movement_label,
  };
});

const ranked = results.filter((r) => r.position > 0);
const summary = {
  measured: results.length,
  errored: errored.length,
  in_top_20: ranked.length,
  in_top_10: ranked.filter((r) => r.position <= 10).length,
  in_top_3: ranked.filter((r) => r.position <= 3).length,
  at_1: ranked.filter((r) => r.position === 1).length,
  by_cluster: {},
};
for (const key of Object.keys(CONFIG.clusters)) {
  const c = results.filter((r) => r.cluster === key);
  if (!c.length) continue;
  summary.by_cluster[key] = {
    measured: c.length,
    in_top_20: c.filter((r) => r.position > 0).length,
    in_top_10: c.filter((r) => r.position > 0 && r.position <= 10).length,
    in_top_3: c.filter((r) => r.position > 0 && r.position <= 3).length,
  };
}

const block = sourceBlock({
  source: 'fixed-serp-probe',
  status: errored.length === results.length ? 'error' : 'ok',
  window_start: date,
  window_end: date,
  lag_days: 0,
  limitations: [
    'Results are personalised and geolocated; absolute positions are approximate.',
    'This scripted read has disagreed with the rendered SERP by 6 places on the same query on the same day, because the rendered DOM mixes in People Also Ask and image-block links.',
    'Search Console is authoritative for position, impressions and CTR. Where the two disagree, Search Console wins.',
    'Position 0 means "not found in the top 20" — a censored value, not position 21. Do not average it in.',
    'Trend signal only. Do not act on a single position.',
    ...(errored.length ? [`${errored.length} queries errored and are recorded as -1; re-run before reading them.`] : []),
  ],
  data: { summary, results, errored_queries: errored, previous_probe_date: previousDate },
});

if (!dryRun) mergeSource(date, 'serp_probe', block, { force });

log(`\nSERP probe ${dryRun ? 'VALIDATED (dry run — nothing written)' : `ingested into ${date}.json`}`);
log(`  measured     ${summary.measured} queries (${summary.errored} errored)`);
log(`  top 20/10/3  ${summary.in_top_20} / ${summary.in_top_10} / ${summary.in_top_3}`);
if (previousDate) {
  const moved = results.filter((r) => ['improved', 'declined', 'entered', 'dropped_out'].includes(r.movement_label));
  log(`  vs ${previousDate}   ${moved.length} queries changed state`);
  for (const r of moved.slice(0, 12)) {
    log(`    ${r.movement_label.padEnd(12)} ${r.query} — ${r.previous_position} → ${r.position}`);
  }
} else {
  log('  no prior probe on record — this becomes the comparison point');
}
log('');
