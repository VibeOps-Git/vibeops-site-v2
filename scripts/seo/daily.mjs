#!/usr/bin/env node
/**
 * The daily run, one command.
 *
 *   npm run seo:daily
 *   node scripts/seo/daily.mjs [--date=YYYY-MM-DD] [--skip=psi,vercel]
 *
 * Order: verify → collect → aggregate → analyse → chart. Verification runs
 * FIRST so a drifted query set or a stale history is caught before anything
 * writes on top of it.
 *
 * READ-ONLY toward production throughout. This command cannot edit a page,
 * publish anything, or deploy. It writes only inside docs/seo/.
 *
 * What it CANNOT do, by design rather than oversight: Search Console, the fixed
 * SERP probe and Vercel Web Analytics all need an interactively authenticated
 * browser session. Those are reported as pending and collected by a person, at
 * the weekly authenticated review. See docs/seo/SCHEDULING.md.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveDate, loadSnapshot, log, CONFIG } from './lib/core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const date = resolveDate();
const passthrough = process.argv.slice(2).filter((a) => a.startsWith('--'));

function step(name, script, args = []) {
  log(`\n─── ${name} ${'─'.repeat(Math.max(0, 56 - name.length))}`);
  const r = spawnSync(process.execPath, [join(HERE, script), ...args], {
    stdio: 'inherit',
    cwd: join(HERE, '..', '..'),
  });
  return r.status ?? 1;
}

log(`\n╭─ vibeops.ca daily SEO intelligence · ${date}`);
log(`╰─ read-only toward production\n`);

// A verification failure stops the run. Collecting on top of a known-broken
// dataset is how a small inconsistency becomes an unrecoverable one.
if (step('VERIFY', 'verify.mjs') !== 0) {
  log('\nVerification failed. Fix the reported problems before collecting.\n');
  process.exit(1);
}

const collectStatus = step('COLLECT', 'collect.mjs', passthrough);
if (collectStatus !== 0) {
  log('\nCollection refused or failed — see the message above. Nothing further will run.\n');
  process.exit(collectStatus);
}

step('AGGREGATE', 'history.mjs');
step('ANALYSE', 'analyze.mjs', passthrough.filter((a) => a.startsWith('--date=')));
step('CHARTS', 'charts.mjs');

/* ------------------------------------------------------------ summary --- */

const snap = loadSnapshot(date);
const pending = Object.entries(snap?.sources ?? {})
  .filter(([, b]) => b.status === 'pending')
  .map(([k]) => k);
const errored = Object.entries(snap?.sources ?? {})
  .filter(([, b]) => b.status === 'error')
  .map(([k]) => k);

log(`\n─── DONE ${'─'.repeat(56)}\n`);
log(`  snapshot   docs/seo/data/daily/${date}.json`);
log(`  report     docs/seo/daily/${date}.md`);
log(`  history    docs/seo/data/history.csv · observations.csv`);
log(`  charts     docs/seo/data/charts/`);

if (errored.length) log(`\n  ERRORED: ${errored.join(', ')} — investigate before trusting today's reading.`);

if (pending.length) {
  // Two different reasons a source can be pending, and conflating them sends
  // someone to open a browser for a problem a token scope would fix.
  const browserGated = pending.filter((p) => ['search_console', 'serp_probe', 'vercel_web_analytics'].includes(p));
  const permissionGated = pending.filter((p) => p === 'page_speed');
  if (browserGated.length) log(`\n  PENDING (needs the authenticated Chrome session): ${browserGated.join(', ')}`);
  if (permissionGated.length) {
    log(`\n  PENDING (needs a quota, not a browser): ${permissionGated.join(', ')}`);
    log(`    PageSpeed's shared anonymous quota was exhausted. Set PAGESPEED_API_KEY in .env`);
    log(`    for a free dedicated quota. Nothing is broken; the reading is unavailable.`);
  }
  if (browserGated.length) log(`\n  To complete today's picture:`);
  if (pending.includes('search_console')) {
    log(`    1. Confirm the active Google identity is ${CONFIG.site.gsc_account} at`);
    log(`       https://myaccount.google.com/u/1/ — if not, STOP this portion.`);
    log(`    2. Read the figures from Search Console, write the payload described in`);
    log(`       docs/seo/data/SCHEMA.md, then:`);
    log(`       node scripts/seo/ingest-gsc.mjs <payload.json>`);
  }
  if (pending.includes('serp_probe')) {
    log(`    3. Run docs/seo/probe.js from an open google.com tab, save the JSON, then:`);
    log(`       node scripts/seo/ingest-serp.mjs <probe.json>`);
  }
  if (pending.includes('vercel_web_analytics')) {
    log(`    3b. Read pageviews / top pages / referrers from the Vercel dashboard.`);
    log(`        Vercel exposes no REST endpoint for Web Analytics, so this stays manual.`);
  }
  log(`    4. Re-run: node scripts/seo/analyze.mjs   (idempotent — safe to repeat)`);
}

log(`\n  Production action: NONE unless the report names a verified technical defect.\n`);
