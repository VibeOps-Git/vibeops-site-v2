#!/usr/bin/env node
/**
 * Freeze the benchmark query set.
 *
 *   npm run seo:freeze
 *
 * Writes the sha256 of the current query list into config.benchmark, after
 * which verify.mjs FAILS if the set ever changes. Run this once, deliberately,
 * before the first weekly review.
 *
 * Why a fingerprint rather than trust: the value of a fixed query set is that it
 * can prove us wrong. A set that quietly gains a query that started ranking, or
 * quietly loses one that never did, will always look like progress. The hash
 * makes that edit impossible to make by accident and impossible to make
 * silently.
 *
 * Re-freezing an already-frozen set requires --force and should be treated as a
 * methodology change: every prior week-over-week comparison becomes suspect and
 * the change must be recorded in that week's report.
 */

import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { SEO_DIR, CONFIG, QUERY_SET, readJSON, writeJSON, today, log } from './lib/core.mjs';

const force = process.argv.includes('--force');
const queries = QUERY_SET.queries.map((q) => q.q);
const sha = createHash('sha256').update(JSON.stringify(queries)).digest('hex');

if (CONFIG.benchmark?.sha256 && !force) {
  if (CONFIG.benchmark.sha256 === sha) {
    log(`\nAlready frozen on ${CONFIG.benchmark.frozen_on} and unchanged — ${queries.length} queries, sha256 ${sha.slice(0, 16)}…\n`);
    process.exit(0);
  }
  console.error(
    `\nThe benchmark is already frozen (${CONFIG.benchmark.frozen_on}, ${CONFIG.benchmark.query_count} queries) and the\n` +
    `current set does NOT match it.\n\n` +
    `  recorded  ${CONFIG.benchmark.sha256}\n` +
    `  current   ${sha}\n\n` +
    `Re-freezing invalidates every week-over-week comparison made so far. If a query is\n` +
    `genuinely invalid, mark it deprecated in queries.json and keep measuring it instead.\n` +
    `If you truly intend to re-freeze, pass --force and record the reason in this week's report.\n`,
  );
  process.exit(1);
}

const path = join(SEO_DIR, 'config.json');
const cfg = readJSON(path);
const prior = cfg.benchmark?.sha256 ?? null;

cfg.benchmark = {
  ...cfg.benchmark,
  frozen_on: today(),
  query_count: queries.length,
  sha256: sha,
};
delete cfg.benchmark._pending_freeze;
if (prior) cfg.benchmark._refrozen_from = prior;

// queries.json records the same date so the two never disagree about when the
// set became authoritative.
const qPath = join(SEO_DIR, 'queries.json');
const qs = readJSON(qPath);
qs.frozen_on = cfg.benchmark.frozen_on;

writeJSON(path, cfg);
writeJSON(qPath, qs);

log(`\nBenchmark frozen — ${queries.length} queries, sha256 ${sha.slice(0, 16)}…, dated ${cfg.benchmark.frozen_on}.`);
log('From now on verify.mjs fails if the set changes. That is the point.\n');
