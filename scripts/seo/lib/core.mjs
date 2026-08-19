/**
 * Shared plumbing for the SEO intelligence system.
 *
 * Paths, config, credential loading, date handling, and the non-destructive
 * snapshot writer. Everything in scripts/seo/ builds on this.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const SEO_DIR = join(ROOT, 'docs', 'seo');
export const DATA_DIR = join(SEO_DIR, 'data');
export const DAILY_DATA_DIR = join(DATA_DIR, 'daily');
export const DAILY_REPORT_DIR = join(SEO_DIR, 'daily');

export const CONFIG = JSON.parse(readFileSync(join(SEO_DIR, 'config.json'), 'utf8'));
export const QUERY_SET = JSON.parse(readFileSync(join(SEO_DIR, 'queries.json'), 'utf8'));

/* ------------------------------------------------------------------ env --- */

/**
 * Load .env into a plain object without adding a dotenv dependency, matching
 * the approach already used by scripts/feedback.mjs.
 *
 * Values are returned, never logged. Nothing in this system prints a token —
 * see redact() for the one place a credential could otherwise leak, in error
 * output from a child process.
 */
export function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {
    /* fall back to the ambient environment */
  }
  return env;
}

/** Strip anything token-shaped out of text before it reaches stdout or a file. */
export function redact(text, env = loadEnv()) {
  let out = String(text ?? '');
  for (const key of ['VERCEL_TOKEN', 'VERCEL_API_KEY', 'PAGESPEED_API_KEY', 'GSC_CLIENT_SECRET']) {
    const v = env[key];
    if (v && v.length > 6) out = out.split(v).join(`<${key}>`);
  }
  return out.replace(/\b[A-Za-z0-9_-]{35,}\b/g, '<redacted>');
}

/* ---------------------------------------------------------------- dates --- */

/** Local calendar date as YYYY-MM-DD. */
export function today() {
  return new Date().toLocaleDateString('en-CA');
}

/** UTC calendar date as YYYY-MM-DD. Vercel and CrUX both report in UTC. */
export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round(
    (new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000,
  );
}

/** Days since the domain went live, for the "domain age" line in reports. */
export function domainAge(dateStr) {
  return daysBetween(CONFIG.site.launch_date, dateStr);
}

/**
 * Resolve the run date from argv. Defaults to the local date.
 *
 * `--date=YYYY-MM-DD` exists so a run is reproducible and so the historical
 * backfill can write past dates. It is deliberately explicit: a run must never
 * silently write to a date other than today.
 */
export function resolveDate(argv = process.argv) {
  const arg = argv.find((a) => a.startsWith('--date='));
  if (!arg) return today();
  const d = arg.slice('--date='.length);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error(`--date must be YYYY-MM-DD, got "${d}"`);
  return d;
}

export function hasFlag(name, argv = process.argv) {
  return argv.includes(`--${name}`);
}

/* -------------------------------------------------------------- json io --- */

export function readJSON(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Write JSON atomically so an interrupted run cannot leave a truncated dataset. */
export function writeJSON(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  renameSync(tmp, path);
}

export function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, value);
  renameSync(tmp, path);
}

/* ------------------------------------------------------------ snapshots --- */

export function snapshotPath(date) {
  return join(DAILY_DATA_DIR, `${date}.json`);
}

/** Every daily snapshot date on disk, ascending. */
export function listSnapshotDates() {
  if (!existsSync(DAILY_DATA_DIR)) return [];
  return readdirSync(DAILY_DATA_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10))
    .sort();
}

export function loadSnapshot(date) {
  return readJSON(snapshotPath(date));
}

export function loadAllSnapshots() {
  return listSnapshotDates().map((d) => loadSnapshot(d)).filter(Boolean);
}

export const SNAPSHOT_VERSION = 1;

function emptySnapshot(date) {
  return {
    schema_version: SNAPSHOT_VERSION,
    date,
    domain_age_days: domainAge(date),
    first_collected_at: new Date().toISOString(),
    revision: 0,
    sources: {},
  };
}

/**
 * Merge one source block into a day's snapshot.
 *
 * The contract that makes daily collection safe to re-run:
 *
 *   - a source block is REPLACED wholesale, never appended to, so running
 *     collect twice in one day yields the same file rather than doubled data;
 *   - sources this run did not collect are left exactly as they were, so the
 *     browser-collected GSC block survives a later API-only run;
 *   - `revision` and `collection_log` record that a re-collection happened, so
 *     a changed number is auditable rather than mysterious;
 *   - writing to a date whose snapshot already exists and is older than today
 *     requires --force-date, so history cannot be rewritten by a stray run.
 *
 * Every source block carries its own provenance. Nothing in this system stores
 * a bare number: source, collected_at, the window it represents and its known
 * lag travel with the value. Section 21 of the brief exists because mixing a
 * GSC window with a Cloudflare window already misled an interim review.
 */
export function mergeSource(date, sourceName, block, { force = false } = {}) {
  const path = snapshotPath(date);
  const existing = loadSnapshot(date);

  if (existing && date !== today() && !force) {
    throw new Error(
      `Refusing to modify the historical snapshot ${date}.json. ` +
        `Pass --force-date only if you intend to correct history, and say so in the daily report.`,
    );
  }

  const snap = existing ?? emptySnapshot(date);
  snap.schema_version = SNAPSHOT_VERSION;
  snap.domain_age_days = domainAge(date);
  snap.sources ??= {};

  const replaced = Boolean(snap.sources[sourceName]);
  snap.sources[sourceName] = block;
  snap.revision = (snap.revision ?? 0) + 1;
  snap.collection_log ??= [];
  snap.collection_log.push({
    at: new Date().toISOString(),
    source: sourceName,
    action: replaced ? 'replaced' : 'added',
    status: block?.status ?? 'unknown',
  });
  snap.updated_at = new Date().toISOString();

  writeJSON(path, snap);
  return snap;
}

/** Shape every collector returns, so provenance can never be forgotten. */
export function sourceBlock({
  source,
  status,
  window_start = null,
  window_end = null,
  lag_days = null,
  limitations = [],
  error = null,
  data = {},
}) {
  return {
    source,
    status,
    collected_at: new Date().toISOString(),
    represents: { start: window_start, end: window_end },
    lag_days,
    limitations,
    ...(error ? { error } : {}),
    data,
  };
}

/* ---------------------------------------------------------------- misc --- */

export function clusterForPath(path) {
  return CONFIG.pages.find((p) => p.path === path)?.cluster ?? 'sitewide';
}

/**
 * Heuristic topicality classification for a disclosed query.
 *
 * Deliberately crude and deliberately visible: the point is to track whether
 * the on-topic PROPORTION rises over weeks, which a consistent crude rule
 * measures fine. A per-query override can be recorded in the snapshot.
 */
export function classifyQuery(q) {
  const s = q.toLowerCase();
  const { on_topic_terms, adjacent_terms } = CONFIG.topicality;
  if (on_topic_terms.some((t) => s.includes(t))) return 'on_topic';
  if (adjacent_terms.some((t) => s.includes(t))) return 'adjacent';
  return 'irrelevant';
}

/**
 * Infer which cluster a query belongs to from its wording.
 *
 * Search Console does not always expose a query→page mapping, and the
 * historical backfill has none at all. Without this, every disclosed query
 * lands in the register with a null cluster and scores as if it strengthened
 * nothing, which understates exactly the queries the site was built for.
 *
 * Inferred, and labelled as inferred wherever it is used. A real query→page
 * mapping from Search Console always takes precedence.
 *
 * Unlike the roadway.tools original this is DATA-DRIVEN: each cluster in
 * config.json carries its own `infer_terms`, so adding a cluster is a config
 * edit rather than a code edit. The order of CONFIG.clusters is significant —
 * the first cluster whose terms match wins, so put the most specific first and
 * leave `sitewide` last.
 */
export function inferCluster(query) {
  const s = query.toLowerCase();
  for (const [id, c] of Object.entries(CONFIG.clusters)) {
    if (id === 'sitewide') continue;
    if ((c.infer_terms ?? []).some((t) => s.includes(t))) return id;
  }
  const sw = CONFIG.clusters.sitewide?.infer_terms ?? [];
  if (sw.some((t) => s.includes(t))) return 'sitewide';
  return null;
}

export function fmtPct(n, digits = 1) {
  return n == null || Number.isNaN(n) ? 'n/a' : `${(n * 100).toFixed(digits)}%`;
}

export function log(...args) {
  console.log(...args.map((a) => (typeof a === 'string' ? redact(a) : a)));
}
