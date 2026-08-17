#!/usr/bin/env node
/**
 * Regenerate the query array inside docs/seo/discovery-probe.js from
 * docs/seo/discovery-queries.json.
 *
 *   node scripts/seo/discovery-probe-build.mjs
 *
 * The browser probe has to be self-contained (it is pasted into a page
 * context), so the active set exists in two places. Unlike the frozen
 * benchmark — where the two copies are merely CHECKED for drift, because the
 * set must never change — the discovery set is expected to evolve, so its
 * browser copy is GENERATED. Editing the array by hand is how the two silently
 * diverge.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SEO_DIR, readJSON, writeText, log } from './lib/core.mjs';

const set = readJSON(join(SEO_DIR, 'discovery-queries.json'));
const active = set.queries.filter((q) => q.status === 'active');

const src = readFileSync(join(SEO_DIR, 'discovery-probe.js'), 'utf8');
const literal =
  '// __DISCOVERY_QUERIES__ — generated; do not hand-edit.\n' +
  `const DISCOVERY_QUERIES = [\n` +
  active.map((q) => `  ${JSON.stringify(q.q)},`).join('\n') +
  `\n];`;

const replaced = src.replace(
  /\/\/ __DISCOVERY_QUERIES__[^\n]*\nconst DISCOVERY_QUERIES = \[[\s\S]*?\];/,
  literal,
);
if (replaced === src && !src.includes(literal)) {
  console.error('Could not find the generated block in discovery-probe.js.');
  process.exit(1);
}

writeText(join(SEO_DIR, 'discovery-probe.js'), replaced);
log(`discovery-probe.js regenerated — ${active.length} active queries (set version ${set.version})`);
const byCluster = {};
for (const q of active) byCluster[q.cluster] = (byCluster[q.cluster] ?? 0) + 1;
for (const [c, n] of Object.entries(byCluster)) log(`  ${c.padEnd(16)} ${n}`);
