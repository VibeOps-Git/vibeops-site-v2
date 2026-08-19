#!/usr/bin/env node
/**
 * Ingest a Search Console payload captured from the authenticated browser.
 *
 *   node scripts/seo/ingest-gsc.mjs <payload.json> [--date=YYYY-MM-DD] [--force-date]
 *
 * Search Console has no API connector in this environment and the Chrome MCP is
 * interactively authenticated, so an unattended run cannot reach it. The agent
 * running the daily review reads the numbers in the browser, writes them to a
 * JSON file in the shape documented in docs/seo/data/SCHEMA.md, and hands the
 * file to this script. That keeps the manual step to transcription and puts
 * validation, lag arithmetic and the account gate in code.
 *
 * THE ACCOUNT GATE IS ENFORCED HERE. A payload attributed to any account other
 * than config.site.gsc_account is rejected. This matters here specifically: the
 * same Chrome profile is also signed in as dentzander@gmail.com, which owns the
 * roadway.tools property and runs an identically-shaped system. Ingesting one
 * property's numbers into the other's dataset would be silent, plausible, and
 * unrecoverable, so the assertion is required rather than inferred.
 */

import { readFileSync } from 'node:fs';
import {
  CONFIG, resolveDate, hasFlag, mergeSource, sourceBlock, classifyQuery,
  clusterForPath, daysBetween, log,
} from './lib/core.mjs';

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.error('usage: node scripts/seo/ingest-gsc.mjs <payload.json> [--date=YYYY-MM-DD]');
  process.exit(1);
}

const date = resolveDate();
const force = hasFlag('force-date');
// --dry-run validates and reports without recording. The account gate and all
// validation still run, so a payload can be checked before it becomes history.
const dryRun = hasFlag('dry-run');
const p = JSON.parse(readFileSync(file, 'utf8'));

/* ------------------------------------------------------- the hard gate --- */

const REQUIRED_ACCOUNT = CONFIG.site.gsc_account;
if (p.account_verified !== REQUIRED_ACCOUNT) {
  console.error(
    `\nREFUSED: payload declares account_verified="${p.account_verified ?? '(absent)'}".\n` +
      `Search Console data is only ever accepted from ${REQUIRED_ACCOUNT}.\n` +
      `If you could not confirm the active identity at https://myaccount.google.com/u/1/,\n` +
      `stop the Search Console portion of the run rather than recording unverified data.\n`,
  );
  process.exit(2);
}
if (p.property && p.property !== CONFIG.site.gsc_property) {
  console.error(`\nREFUSED: property "${p.property}" is not ${CONFIG.site.gsc_property}.\n`);
  process.exit(2);
}

/* -------------------------------------------------------- validation ---- */

const problems = [];
if (!p.latest_date_available) problems.push('latest_date_available is required — it is what makes the reporting lag explicit.');
if (!p.window?.start || !p.window?.end) problems.push('window.start and window.end are required.');
if (!p.totals) problems.push('totals is required.');
if (problems.length) {
  console.error('\nREFUSED — payload is not usable:\n' + problems.map((x) => `  - ${x}`).join('\n') + '\n');
  process.exit(2);
}

const lag = daysBetween(p.latest_date_available, date);
if (lag < 0) problems.push(`latest_date_available (${p.latest_date_available}) is after the run date (${date}).`);
if (lag > 7) log(`  ! Search Console lag is ${lag} days, which is unusually large. Confirm the window before trusting it.`);

/* --------------------------------------------------------- enrichment --- */

const queries = (p.queries ?? []).map((q) => ({
  query: q.query,
  impressions: q.impressions ?? 0,
  clicks: q.clicks ?? 0,
  ctr: q.ctr ?? (q.impressions ? (q.clicks ?? 0) / q.impressions : 0),
  position: q.position ?? null,
  page: q.page ?? null,
  // Topicality is the "is Google learning what we are about" signal. Stored
  // per query so the proportion is recomputable if the heuristic changes.
  topicality: q.topicality ?? classifyQuery(q.query),
  cluster: q.cluster ?? (q.page ? clusterForPath(q.page) : null),
}));

const topicality_mix = { on_topic: 0, adjacent: 0, irrelevant: 0 };
for (const q of queries) topicality_mix[q.topicality]++;

const pages = (p.pages ?? []).map((x) => ({
  page: x.page,
  cluster: clusterForPath(x.page),
  impressions: x.impressions ?? 0,
  clicks: x.clicks ?? 0,
  ctr: x.ctr ?? (x.impressions ? (x.clicks ?? 0) / x.impressions : 0),
  position: x.position ?? null,
}));

const disclosed_impressions = queries.reduce((a, q) => a + q.impressions, 0);
const total_impressions = p.totals.impressions ?? 0;

const block = sourceBlock({
  source: 'google-search-console',
  status: 'ok',
  window_start: p.window.start,
  window_end: p.window.end,
  lag_days: lag,
  limitations: [
    `Collected on ${date}, but the data covers only through ${p.latest_date_available}. These figures do NOT describe searches on ${date}.`,
    'Search Console discloses only queries above an anonymity threshold. Undisclosed impressions are real exposure that cannot be attributed to a query.',
    `${total_impressions - disclosed_impressions} of ${total_impressions} impressions come from queries Search Console will not name.`,
    'Average position is impression-weighted across all queries; on small samples it moves for reasons unrelated to ranking quality (broader testing at deeper positions lowers it).',
    'Transcribed by hand from the Search Console UI — a transcription error is possible and is the main data-quality risk in this source.',
  ],
  data: {
    property: p.property ?? CONFIG.site.gsc_property,
    account_verified: p.account_verified,
    latest_date_available: p.latest_date_available,
    totals: {
      impressions: total_impressions,
      clicks: p.totals.clicks ?? 0,
      ctr: p.totals.ctr ?? (total_impressions ? (p.totals.clicks ?? 0) / total_impressions : 0),
      position: p.totals.position ?? null,
    },
    by_day: p.by_day ?? [],
    pages,
    queries,
    disclosed_query_count: queries.length,
    disclosed_impressions,
    undisclosed_impressions: total_impressions - disclosed_impressions,
    topicality_mix,
    devices: p.devices ?? [],
    countries: p.countries ?? [],
    // The Search Console UI paginates ("1-10 of 16"). Recording only the rows
    // captured would understate geographic breadth, which is one of the
    // signals we actually care about. Pass country_count when the UI states a
    // total larger than the rows transcribed.
    country_count_reported: p.country_count ?? p.country_count_reported ?? (p.countries ?? []).length,
    countries_captured: (p.countries ?? []).length,
    indexed_pages: p.indexed_pages ?? null,
    // The Page indexing report's stated reasons. Far more actionable than the
    // count: "Excluded by 'noindex'" is our own directive and ours to fix,
    // while "Discovered - currently not indexed" is Google declining to index
    // and needs an entirely different response. Optional — a payload captured
    // without opening that report simply omits them.
    not_indexed_pages: p.not_indexed_pages ?? null,
    indexing_reasons: p.indexing_reasons ?? null,
    coverage_notes: p.coverage_notes ?? null,
    notes: p.notes ?? null,
  },
});

if (!dryRun) mergeSource(date, 'search_console', block, { force });

log(`\nSearch Console ${dryRun ? 'VALIDATED (dry run — nothing written)' : `ingested into ${date}.json`}`);
log(`  account      ${p.account_verified} (verified)`);
log(`  window       ${p.window.start} → ${p.window.end}, latest ${p.latest_date_available} (lag ${lag}d)`);
log(`  totals       ${total_impressions} impressions · ${p.totals.clicks ?? 0} clicks · pos ${p.totals.position ?? '—'}`);
log(`  queries      ${queries.length} disclosed (${topicality_mix.on_topic} on-topic, ${topicality_mix.adjacent} adjacent, ${topicality_mix.irrelevant} irrelevant)`);
log(`  undisclosed  ${total_impressions - disclosed_impressions} impressions not attributable to a named query\n`);
