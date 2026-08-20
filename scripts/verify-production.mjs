#!/usr/bin/env node
/**
 * Verify what PRODUCTION actually serves. Not what the build produced, and not
 * what the deployment's exit code claimed.
 *
 *   npm run verify:prod
 *
 * WHY THIS IS A COMMITTED SCRIPT RATHER THAN A ONE-OFF
 *
 * On 2026-08-20 the prerender fix took three production deploys. Two failed for
 * reasons that could not reproduce locally (an ignored build input; a builder
 * that cannot run a stock chromium), and the third succeeded while still
 * serving a defect the build was perfectly happy with: 12 blog posts with two
 * <h1> elements. "Deployment READY" asserted none of that.
 *
 * So the rule this file exists to enforce: a deploy is verified when the
 * responses are verified. Anything less is trusting a build to report on
 * itself.
 *
 * Exits non-zero on any failure, so it can gate a release.
 */

import { createHash } from 'node:crypto';
import { allRoutes } from './routes.mjs';

const ORIGIN = process.env.VERIFY_ORIGIN ?? 'https://www.vibeops.ca';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Paced. An unpaced burst of ~30 requests at this origin returned 403 on every
// one during earlier work, which would read here as a site-wide outage.
const PACE_MS = 250;

const routes = allRoutes();
const rows = [];

console.log(`\nVerifying ${routes.length} routes against ${ORIGIN}\n`);

for (const route of routes) {
  await sleep(PACE_MS);
  try {
    const res = await fetch(ORIGIN + route, { headers: { 'user-agent': 'VibeOpsProdVerify/1.0' } });
    const html = await res.text();
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
      ?.match(/href=["']([^"']+)["']/i)?.[1] ?? null;
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0]
      ?.match(/content=["']([^"']*)["']/i)?.[1] ?? null;
    const expected = ORIGIN + route;
    rows.push({
      route,
      status: res.status,
      md5: createHash('md5').update(html).digest('hex'),
      title,
      h1: (html.match(/<h1[\s>]/gi) ?? []).length,
      links: (html.match(/<a\b[^>]*href=/gi) ?? []).length,
      canonicalSelf: canonical === expected || canonical === `${expected}/`,
      canonical,
      hasDesc: Boolean(desc),
    });
  } catch (err) {
    rows.push({ route, error: err.message });
  }
}

const ok = rows.filter((r) => !r.error);
const errored = rows.filter((r) => r.error);
const md5s = new Set(ok.map((r) => r.md5));
const titles = new Set(ok.map((r) => r.title));

const checks = [
  ['every route fetched',        errored.length === 0,                       `${ok.length}/${routes.length}`],
  ['every route HTTP 200',       ok.every((r) => r.status === 200),          `${ok.filter((r) => r.status === 200).length}/${ok.length}`],
  // THE one that matters. Identical HTML across routes means the SPA shell is
  // being served and prerendering has silently stopped.
  ['HTML distinct per route',    md5s.size === ok.length,                    `${md5s.size} distinct / ${ok.length}`],
  ['<title> distinct per route', titles.size === ok.length,                  `${titles.size} distinct / ${ok.length}`],
  ['exactly one <h1>',           ok.every((r) => r.h1 === 1),                `${ok.filter((r) => r.h1 === 1).length}/${ok.length}`],
  ['canonical self-referential', ok.every((r) => r.canonicalSelf),           `${ok.filter((r) => r.canonicalSelf).length}/${ok.length}`],
  ['>=10 internal links',        ok.every((r) => r.links >= 10),             `${ok.filter((r) => r.links >= 10).length}/${ok.length}`],
  ['meta description present',   ok.every((r) => r.hasDesc),                 `${ok.filter((r) => r.hasDesc).length}/${ok.length}`],
];

for (const [label, passed, detail] of checks) {
  console.log(`  ${passed ? 'ok  ' : 'FAIL'}  ${label.padEnd(28)} ${detail}`);
}

const bad = ok.filter((r) => r.status !== 200 || r.h1 !== 1 || !r.canonicalSelf || r.links < 10 || !r.hasDesc);
if (bad.length) {
  console.log('\nRoutes needing attention:');
  for (const b of bad) console.log(`  ${b.route}  status=${b.status} h1=${b.h1} links=${b.links} canonical=${b.canonical}`);
}
for (const e of errored) console.log(`  FETCH FAILED ${e.route}: ${e.error}`);

const failed = checks.some(([, p]) => !p);
console.log(`\n${failed ? 'FAILED' : 'PASSED'} — production verified against ${ORIGIN}\n`);
process.exit(failed ? 1 : 0);
