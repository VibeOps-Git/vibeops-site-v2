#!/usr/bin/env node
/**
 * Regenerate the QUERIES array inside docs/seo/probe.js from queries.json.
 *
 *   npm run seo:sync-probe
 *
 * probe.js has to be self-contained, because it is pasted into a browser page
 * context where it cannot import anything. So the query list exists twice, and
 * the second copy is GENERATED rather than maintained. verify.mjs fails the
 * daily run if the two ever disagree, which is what makes it safe for the
 * browser copy to exist at all.
 *
 * Only the region between the generated-block markers is rewritten. The probe's
 * measurement code is never touched by this script, because changing the
 * measurement breaks comparability with every prior week and that must always
 * be a deliberate, recorded edit.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SEO_DIR, QUERY_SET, writeText, log } from './lib/core.mjs';

const PROBE = join(SEO_DIR, 'probe.js');
const BEGIN = '/* --- BEGIN GENERATED QUERIES (npm run seo:sync-probe) --- */';
const END = '/* --- END GENERATED QUERIES --- */';

const src = readFileSync(PROBE, 'utf8');
const i = src.indexOf(BEGIN);
const j = src.indexOf(END);
if (i === -1 || j === -1) {
  console.error(`Could not find the generated-block markers in ${PROBE}. Restore them before syncing.`);
  process.exit(1);
}

// Single-quote the strings to match the file's style, escaping any apostrophe.
const esc = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const body = QUERY_SET.queries
  .map((q) => `  { q: ${esc(q.q)}, cluster: ${esc(q.cluster)} },`)
  .join('\n');

const next = `${src.slice(0, i)}${BEGIN}\nconst QUERIES = [\n${body}\n];\n${src.slice(j)}`;

if (next === src) {
  log(`probe.js already matches queries.json (${QUERY_SET.queries.length} queries).`);
  process.exit(0);
}

writeText(PROBE, next);
log(`Rewrote the QUERIES array in docs/seo/probe.js — ${QUERY_SET.queries.length} queries.`);
log('Run `npm run seo:verify` to confirm parity, and remember that changing a FROZEN');
log('benchmark invalidates every prior week-over-week comparison.');
