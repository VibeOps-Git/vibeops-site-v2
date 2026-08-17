#!/usr/bin/env node
/**
 * Weekly evidence brief — the input to the weekly decision gate.
 *
 *   npm run seo:weekly
 *   node scripts/seo/weekly-brief.mjs [--date=YYYY-MM-DD]
 *
 * This does NOT write the weekly report. It assembles the accumulated evidence
 * a person (or an agent following PLAYBOOK.md) needs in order to write one, and
 * runs each READY opportunity through the seven gate questions so that none of
 * them can be skipped silently.
 *
 * The weekly report itself stays hand-authored in docs/seo/weekly/, because the
 * judgement it contains is the point of it. A generated verdict would be a
 * formula pretending to be a decision.
 */

import { join } from 'node:path';
import {
  DATA_DIR, CONFIG, resolveDate, listSnapshotDates, loadSnapshot, readJSON,
  domainAge, daysBetween, fmtPct, log,
} from './lib/core.mjs';
import { momentum, windowGrowth } from './lib/trends.mjs';

const date = resolveDate();
const T = CONFIG.thresholds;
const dates = listSnapshotDates().filter((d) => d <= date);
const snaps = dates.map(loadSnapshot);
const ok = (s, k) => (s?.sources?.[k]?.status === 'ok' ? s.sources[k] : null);

const cur = snaps[snaps.length - 1];
const weekAgo = dates.filter((d) => daysBetween(d, date) >= 7).pop();
const prevWeek = weekAgo ? loadSnapshot(weekAgo) : null;

const g = ok(cur, 'search_console');
const gPrev = prevWeek ? ok(prevWeek, 'search_console') : null;
const p = ok(cur, 'serp_probe');
const disc = ok(cur, 'serp_discovery');
const r = ok(cur, 'web_analytics');

log(`\n${'═'.repeat(72)}`);
log(`WEEKLY EVIDENCE BRIEF — ${date}  (domain age ${domainAge(date)} days)`);
log(`${'═'.repeat(72)}\n`);

log(`This is evidence, not a decision. Write the report in docs/seo/weekly/`);
log(`using weekly/_TEMPLATE.md, and keep facts, interpretation and`);
log(`recommendation separated.\n`);

/* ------------------------------------------------------ window honesty --- */

log('REPORTING WINDOWS — do not read across these as one timeline');
log(`  Search Console   ${g ? `${g.represents.start} → ${g.represents.end}, latest ${g.data.latest_date_available} (lag ${g.lag_days}d)` : 'not collected'}`);
log(`  Web analytics    ${r ? `${r.represents.start} → ${r.represents.end}` : 'not collected (browser-gated)'}`);
log(`  SERP probe       ${p ? p.represents.end : 'not collected'}`);
log(`  Comparison base  ${weekAgo ?? 'no snapshot 7+ days back yet'}\n`);

/* --------------------------------------------------- week over week ----- */

if (g) {
  const t = g.data.totals;
  const tp = gPrev?.data.totals;
  const d = (a, b) => (b == null ? '—' : `${a - b >= 0 ? '+' : ''}${(a - b).toFixed(a % 1 ? 1 : 0)}`);
  log('WEEK OVER WEEK (Search Console, cumulative as displayed)');
  log(`  impressions      ${String(t.impressions).padStart(6)}   prev ${String(tp?.impressions ?? '—').padStart(6)}   ${d(t.impressions, tp?.impressions)}`);
  log(`  clicks           ${String(t.clicks).padStart(6)}   prev ${String(tp?.clicks ?? '—').padStart(6)}   ${d(t.clicks, tp?.clicks)}`);
  log(`  CTR              ${fmtPct(t.ctr).padStart(6)}   prev ${(tp ? fmtPct(tp.ctr) : '—').padStart(6)}`);
  log(`  avg position     ${String(t.position).padStart(6)}   prev ${String(tp?.position ?? '—').padStart(6)}`);
  log(`  disclosed qs     ${String(g.data.disclosed_query_count).padStart(6)}   prev ${String(gPrev?.data.disclosed_query_count ?? '—').padStart(6)}`);
  log(`  undisclosed imp  ${String(g.data.undisclosed_impressions).padStart(6)}   (real exposure, unattributable to a query)\n`);

  const mix = g.data.topicality_mix ?? {};
  const n = g.data.disclosed_query_count || 1;
  log('IS GOOGLE LEARNING THE TOPIC?');
  log(`  on-topic   ${mix.on_topic ?? 0}/${n}  (${fmtPct((mix.on_topic ?? 0) / n, 0)})`);
  log(`  adjacent   ${mix.adjacent ?? 0}/${n}`);
  log(`  irrelevant ${mix.irrelevant ?? 0}/${n}`);
  if (gPrev) {
    const np = gPrev.data.disclosed_query_count || 1;
    log(`  previous on-topic share: ${fmtPct((gPrev.data.topicality_mix?.on_topic ?? 0) / np, 0)}`);
  }
  log('');
}

/* ------------------------------------------- traffic-side organic KPI --- */

if (r) {
  const d = r.data;
  const ch = d.traffic?.by_channel ?? {};
  const sr = d.search_referred_human_pageloads ?? d.search_referred?.total ?? 0;
  log('TRAFFIC BY CHANNEL (web analytics — window differs from Search Console)');
  log(`  SEARCH-REFERRED  ${String(sr).padStart(5)}   <- the organic traffic KPI`);
  log(`    Google         ${String(ch.google ?? 0).padStart(5)}`);
  log(`    Bing           ${String(ch.bing ?? 0).padStart(5)}`);
  log(`    other search   ${String(ch.other_search ?? 0).padStart(5)}`);
  log(`  direct           ${String(ch.direct ?? 0).padStart(5)}   (unattributed — NOT brand demand)`);
  log(`  other referral   ${String(ch.other_referral ?? 0).padStart(5)}`);
  log(`  internal         ${String(ch.internal ?? 0).padStart(5)}   (page-to-page; excluded from acquisition)`);
  log(`  ─────────────────${'─'.repeat(5)}`);
  log(`  human total      ${String(d.human_pageloads).padStart(5)}   bot-classified ${d.bot_pageloads}`);

  const srDev = d.search_referred?.by_device ?? {};
  const srCty = d.search_referred?.by_country ?? {};
  if (sr > 0) {
    log(`  search by device   ${Object.entries(srDev).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}`);
    log(`  search by country  ${Object.entries(srCty).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}`);
    log(`  search landing     ${Object.entries(d.search_referred?.by_path ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  }
  const srDays = Object.entries(d.search_referred?.by_day ?? {}).sort();
  if (srDays.length) log(`  search/day         ${srDays.map(([k, v]) => `${k.slice(5)}:${v.total}`).join(' ')}`);
  log('');
}

/* -------------------------------------------------------- trajectory ---- */

const dayMap = new Map();
for (const s of snaps) {
  const b = ok(s, 'search_console');
  for (const row of b?.data.by_day ?? []) dayMap.set(row.date, row);
}
const days = [...dayMap.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
if (days.length) {
  log('TRAJECTORY (true per-day, settled days only where available)');
  log(`  impressions/day  ${days.map((x) => x.impressions).join(' → ')}`);
  log(`  clicks/day       ${days.map((x) => x.clicks).join(' → ')}`);
  const m = momentum(days.map((x) => x.impressions));
  const w = windowGrowth(days.map((x) => x.impressions), 7);
  log(`  3-day momentum   ${m.meaningful ? (m.rising ? `rising (+${m.change})` : m.falling ? `falling (${m.change})` : 'flat') : `not readable — ${m.reason}`}`);
  log(`  7-day growth     ${w.meaningful ? `${w.prior} → ${w.recent} (${w.pct >= 0 ? '+' : ''}${w.pct.toFixed(0)}%)` : `not readable — ${w.reason}`}\n`);
}

/* ------------------------------------------------------------- pages ---- */

if (g?.data.pages?.length) {
  log('PAGE PERFORMANCE');
  const before = new Map((gPrev?.data.pages ?? []).map((x) => [x.page, x.impressions]));
  for (const pg of [...g.data.pages].sort((a, b) => b.impressions - a.impressions)) {
    const b = before.get(pg.page);
    log(`  ${pg.page.padEnd(38)} ${String(pg.impressions).padStart(5)} imp  ${String(pg.clicks).padStart(3)} clk  ${b != null ? `(prev ${b})` : ''}`);
  }
  log('');
}

/* ------------------------------------------------------- ranking dist --- */

if (p) {
  const s = p.data.summary;
  log('RANKING DISTRIBUTION — BENCHMARK (frozen 41 queries; trend signal only, not authoritative)');
  log(`  measured ${s.measured} · top 20: ${s.in_top_20} · top 10: ${s.in_top_10} · top 3: ${s.in_top_3} · #1: ${s.at_1}`);
  for (const [k, v] of Object.entries(s.by_cluster ?? {})) {
    log(`    ${k.padEnd(16)} ${v.in_top_20}/${v.measured} top20 · ${v.in_top_10} top10 · ${v.in_top_3} top3`);
  }
  log('');
} else {
  log('RANKING DISTRIBUTION — no probe collected. Run docs/seo/probe.js in the\n  attached Chrome and ingest it before writing the weekly report.\n');
}

/* ----------------------------------- device split (standing watch) ------ */

if (g?.data.devices?.length) {
  const mob = g.data.devices.find((d) => /mobile/i.test(d.device ?? ''));
  const desk = g.data.devices.find((d) => /desktop/i.test(d.device ?? ''));
  log('DEVICE SPLIT — standing watch metric (added 2026-08-17)');
  for (const d of [desk, mob]) {
    if (!d) continue;
    log(`  ${String(d.device).padEnd(8)} ${String(d.impressions).padStart(5)} impr · ${String(d.clicks).padStart(2)} clk · position ${d.position ?? '—'}`);
  }
  if (mob && desk && mob.position != null && desk.position != null) {
    const gap = Math.round((desk.position - mob.position) * 10) / 10;
    log(`  gap      ${gap > 0 ? '+' : ''}${gap} places in mobile's favour, on ${mob.impressions} mobile impressions`);
    log(`  WATCH ONLY — do not optimise for this until the mobile denominator is meaningful.`);
    log(`  A gap this size on this few impressions is as likely to be which queries`);
    log(`  happened to fire on mobile as a real device-level difference.`);
  }
  log('');
}

/* ------------------- discovery set (SEPARATE from the benchmark) --------- */

log('DISCOVERY SET — what Google actually associates with each page');
if (!disc) {
  log('  not collected this week. Run docs/seo/discovery-probe.js and ingest-discovery.mjs.\n');
} else {
  const ds = disc.data.summary;
  log(`  set version ${ds.set_version} · ${ds.measured} active queries · ${ds.in_top_20} in top 20 · ${ds.in_top_10} top 10`);
  for (const [c, v] of Object.entries(ds.by_cluster)) {
    log(`    ${c.padEnd(16)} ${v.in_top_20}/${v.measured} top 20`);
  }
  log('  by provenance:');
  for (const [pv, v] of Object.entries(ds.by_provenance ?? {})) {
    log(`    ${pv.padEnd(18)} ${v.in_top_20}/${v.measured} top 20`);
  }
  const ranked = (disc.data.results ?? []).filter((r) => r.position > 0).sort((a, b) => a.position - b.position);
  if (ranked.length) {
    log('  ranked:');
    for (const r of ranked.slice(0, 12)) log(`    ${String(r.position).padStart(3)}  ${r.query}  [${r.provenance}]`);
  }
  log('');
  log('  NOT COMPARABLE to the benchmark counts above. The discovery set evolves,');
  log('  so its totals are not a trend series — only per-query history is valid.');
  log('  A discovery query is never promoted into the frozen benchmark.');
  log('');
}

/* ------------------------------------------- opportunity leaderboard ---- */

const db = readJSON(join(DATA_DIR, 'opportunities.json'), { opportunities: [] });
const active = db.opportunities.filter((o) => o.status === 'WATCHING' || o.status === 'READY');
log(`OPPORTUNITY LEADERBOARD (${active.length} active of ${db.opportunities.length} tracked)`);
for (const o of [...active].sort((a, b) => b.score - a.score).slice(0, 12)) {
  log(`  ${String(o.score).padStart(5)}  ${o.status.padEnd(8)} ${o.confidence.padEnd(6)} ${o.recommended_action.padEnd(9)} ${o.days_seen}d  ${o.query_or_topic}`);
}
log('');

/* ----------------------------------------------------- THE SEVEN GATES -- */

const ready = db.opportunities.filter((o) => o.status === 'READY');
log(`${'─'.repeat(72)}`);
log(`THE DECISION GATE — ${ready.length} opportunit${ready.length === 1 ? 'y' : 'ies'} READY`);
log(`${'─'.repeat(72)}\n`);

if (!ready.length) {
  log('  Nothing is READY. The correct outcome is NO PRODUCTION CHANGE.\n');
  log('  This is the expected state most weeks. An SEO system that finds');
  log('  something to change every week is not measuring, it is fidgeting.\n');
} else {
  for (const o of ready) {
    log(`  ${o.id}  —  ${o.query_or_topic}`);
    log(`    score ${o.score} · ${o.confidence} confidence · ${o.recommended_action}`);
    log(`    ${o.recommendation_why}`);
    log(`    Answer ALL SEVEN before any production change:`);
    const gates = [
      ['Has this persisted long enough to distinguish signal from noise?', `seen on ${o.days_seen} day(s) since ${o.first_seen} — threshold is ${T.opportunity_promote_to_ready_days}`],
      ['Is there enough volume to matter?', `${o.impressions_7d ?? 0} impressions/7d`],
      ['Do we understand WHY the current page underperforms?', 'ANSWER REQUIRED — the register cannot answer this'],
      ['Can we make a specific improvement?', 'ANSWER REQUIRED — must be one concrete edit'],
      ['Does the improvement genuinely help the user?', 'ANSWER REQUIRED — not just the ranking'],
      ['Can we measure whether it worked?', 'ANSWER REQUIRED — name the metric and window'],
      ['Are we changing ONE understandable variable?', 'ANSWER REQUIRED — if you cannot name it, stop'],
    ];
    gates.forEach(([q, a], i) => log(`      ${i + 1}. ${q}\n         ${a}`));
    log(`    If all seven pass: create the experiment record in data/experiments.json`);
    log(`    BEFORE deploying, capturing baseline metrics first.\n`);
  }
}

/* ------------------------------------------------------- experiments ---- */

const exp = readJSON(join(DATA_DIR, 'experiments.json'), { experiments: [] });
const open = exp.experiments.filter((e) => e.result === 'PENDING');
log('OPEN EXPERIMENTS');
if (!open.length) log('  None. No SEO-driven production change is currently under measurement.\n');
else {
  for (const e of open) {
    const due = daysBetween(date, e.evaluation_date);
    log(`  ${e.id} · ${e.page} · evaluate ${e.evaluation_date} (${due > 0 ? `in ${due}d` : 'DUE NOW'})`);
    log(`    ${e.hypothesis}`);
  }
  log('');
}

/* -------------------------------------------------- expansion criteria -- */

log('EXPANSION CRITERIA — all six must hold. Do not loosen them.');
const clusterImp = (key) => {
  const pages = CONFIG.clusters[key].pages;
  return (g?.data.pages ?? []).filter((x) => pages.includes(x.page)).reduce((a, b) => a + b.impressions, 0);
};
const evidence = [
  ['Both clusters receiving meaningful organic impressions', g ? `SSD ${clusterImp('ssd')} · vertical curve ${clusterImp('vertical-curve')}` : 'no data'],
  ['Clicks arriving consistently, not a single spike', days.length ? `clicks/day ${days.map((x) => x.clicks).join(', ')}` : 'no data'],
  ['Query breadth expanding week over week', g ? `${g.data.disclosed_query_count} disclosed (prev ${gPrev?.data.disclosed_query_count ?? '—'})` : 'no data'],
  ['Long-tail rankings strengthening', p ? `${p.data.summary.in_top_20} of ${p.data.summary.measured} in top 20` : 'no probe this week'],
  ['Head terms moving toward top positions', p ? `${p.data.summary.in_top_10} in top 10` : 'no probe this week'],
  ['Strategic terms consistently top 1-3', p ? `${p.data.summary.in_top_3} in top 3` : 'no probe this week'],
];
evidence.forEach(([c, e], i) => log(`  ${i + 1}. ${c}\n     ${e}`));
log('\n  Even if all six hold: report the evidence and ask for approval.');
log('  DO NOT edit production or publish content from this brief. It produces evidence; a person decides and writes.\n');
