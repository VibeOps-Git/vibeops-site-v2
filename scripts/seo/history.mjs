#!/usr/bin/env node
/**
 * Aggregate the daily snapshots into an inspectable time series.
 *
 *   node scripts/seo/history.mjs
 *
 * Fully regenerated from docs/seo/data/daily/*.json on every run. Nothing here
 * is hand-maintained, so the CSVs can always be deleted and rebuilt, and a
 * correction to a snapshot propagates automatically.
 *
 * TWO files, deliberately, because two different things get called "daily":
 *
 *   history.csv       One row per CALENDAR DAY. The true time series: what
 *                     actually happened on that date. Search Console per-day
 *                     impressions/clicks, web-analytics per-day pageviews,
 *                     feedback by day.
 *
 *   observations.csv  One row per RUN DATE. Point-in-time readings that have
 *                     no per-day meaning: cumulative totals as displayed,
 *                     disclosed query count, SERP rank distribution, the
 *                     topicality mix, technical issue count.
 *
 * Collapsing these into one table is the mistake section 21 of the brief warns
 * about. A Search Console cumulative total observed on the 15th describes
 * searches through the 13th; a pageview count on the 15th describes
 * the 15th. Putting them in one row implies a shared window that does not
 * exist, and that has already misled an interim review here.
 */

import { join } from 'node:path';
import {
  DATA_DIR, CONFIG, listSnapshotDates, loadSnapshot, writeText, writeJSON,
  addDays, daysBetween, log,
} from './lib/core.mjs';

const dates = listSnapshotDates();
if (!dates.length) {
  log('No daily snapshots found — nothing to aggregate.');
  process.exit(0);
}

const snapshots = dates.map((d) => loadSnapshot(d));
const ok = (s, k) => (s?.sources?.[k]?.status === 'ok' ? s.sources[k] : null);

/* ============================ history.csv — one row per calendar day ===== */

const firstDay = CONFIG.site.launch_date;
const lastDay = dates[dates.length - 1];

/**
 * Per-day Search Console values.
 *
 * A given calendar day is reported by several snapshots as the lag window
 * rolls forward. The LATEST snapshot that covers a day wins, because Search
 * Console revises recent days upward for a while after first publishing them.
 * A day is only marked settled once a snapshot at least 3 days later still
 * reports it — before that the figure can still move.
 */
const gscByDay = new Map();
for (const s of snapshots) {
  const b = ok(s, 'search_console');
  if (!b) continue;
  for (const row of b.data.by_day ?? []) {
    const prev = gscByDay.get(row.date);
    if (!prev || s.date >= prev.observed_on) {
      gscByDay.set(row.date, {
        impressions: row.impressions ?? 0,
        clicks: row.clicks ?? 0,
        observed_on: s.date,
        settled: daysBetween(row.date, s.date) >= 3,
      });
    }
  }
}

// Web analytics per-day. Latest snapshot wins for the same reason: the final
// day of any window is partial when collected and completes later.
const rumByDay = new Map();
const feedbackByDay = new Map();
for (const s of snapshots) {
  const r = ok(s, 'web_analytics');
  if (r) {
    for (const [day, v] of Object.entries(r.data.pageloads_by_day ?? {})) {
      rumByDay.set(day, { ...v, observed_on: s.date });
    }
  }
  const f = ok(s, 'd1_feedback');
  if (f) for (const [day, n] of Object.entries(f.data.by_day ?? {})) feedbackByDay.set(day, n);
}

// Channel attribution per day, taken once from the newest RUM block so there is
// no accumulation to get wrong. The collector already buckets every human
// arrival into exactly one channel, so these figures sum to human_pageloads.
const newestTraffic = [...snapshots].reverse().map((s) => ok(s, 'web_analytics')).find(Boolean);
const channelsByDay = new Map(Object.entries(newestTraffic?.data.traffic?.by_channel_by_day ?? {}));

const dayRows = [];
for (let d = firstDay; d <= lastDay; d = addDays(d, 1)) {
  const g = gscByDay.get(d);
  const r = rumByDay.get(d);
  const c = channelsByDay.get(d) ?? {};
  const ch = (k) => (r ? (c[k] ?? 0) : '');
  const searchReferred = r
    ? (c.google ?? 0) + (c.bing ?? 0) + (c.other_search ?? 0)
    : '';

  dayRows.push({
    date: d,
    domain_age_days: daysBetween(CONFIG.site.launch_date, d),

    gsc_impressions: g?.impressions ?? '',
    gsc_clicks: g?.clicks ?? '',
    gsc_settled: g ? (g.settled ? 1 : 0) : '',
    gsc_observed_on: g?.observed_on ?? '',

    // THE traffic-side organic KPI. Deliberately placed ahead of
    // human_pageloads: the total mixes our own testing, internal navigation and
    // JS-executing scanners, and answers a different question entirely.
    search_referred_human_pageloads: searchReferred,
    google_referred_pageloads: ch('google'),
    bing_referred_pageloads: ch('bing'),
    other_search_pageloads: ch('other_search'),
    direct_pageloads: ch('direct'),
    other_referral_pageloads: ch('other_referral'),
    internal_pageloads: ch('internal'),

    human_pageloads: r?.human ?? '',
    bot_pageloads: r?.bot ?? '',

    feedback_submissions: feedbackByDay.get(d) ?? 0,
  });
}

/* ======================= observations.csv — one row per run date ========= */

const obsRows = snapshots.map((s) => {
  const g = ok(s, 'search_console');
  const r = ok(s, 'web_analytics');
  const p = ok(s, 'serp_probe');
  const disc = ok(s, 'serp_discovery');
  const f = ok(s, 'd1_feedback');
  const t = ok(s, 'technical');

  const t_ = g?.data.totals ?? {};
  const mix = g?.data.topicality_mix ?? {};
  const cluster = (key) => {
    const pages = CONFIG.clusters[key].pages;
    const rows = (g?.data.pages ?? []).filter((x) => pages.includes(x.page));
    return {
      impressions: rows.reduce((a, b) => a + b.impressions, 0),
      clicks: rows.reduce((a, b) => a + b.clicks, 0),
    };
  };
  const ssd = g ? cluster('ssd') : {};
  const vc = g ? cluster('vertical-curve') : {};

  const mobile = (g?.data.devices ?? []).find((d) => /mobile/i.test(d.device ?? ''));
  const desktop = (g?.data.devices ?? []).find((d) => /desktop/i.test(d.device ?? ''));

  return {
    observed_on: s.date,
    domain_age_days: s.domain_age_days,

    gsc_window_end: g?.represents?.end ?? '',
    gsc_latest_date: g?.data.latest_date_available ?? '',
    gsc_lag_days: g?.lag_days ?? '',

    impressions_cumulative: t_.impressions ?? '',
    clicks_cumulative: t_.clicks ?? '',
    ctr: t_.ctr != null ? t_.ctr.toFixed(4) : '',
    avg_position: t_.position ?? '',

    disclosed_query_count: g?.data.disclosed_query_count ?? '',
    undisclosed_impressions: g?.data.undisclosed_impressions ?? '',
    on_topic_query_count: mix.on_topic ?? '',
    adjacent_query_count: mix.adjacent ?? '',
    irrelevant_query_count: mix.irrelevant ?? '',

    ssd_impressions: ssd.impressions ?? '',
    ssd_clicks: ssd.clicks ?? '',
    vertical_curve_impressions: vc.impressions ?? '',
    vertical_curve_clicks: vc.clicks ?? '',

    countries_with_impressions: g?.data.country_count_reported ?? g?.data.countries?.length ?? '',

    // Device split as a first-class series, not a footnote. Made first-class on
    // 2026-08-17 while mobile averaged position 7.7 against desktop's 17.3 on
    // a tenth of the volume. Tracked so the gap can be watched for persistence;
    // NOT to be optimised against until the mobile denominator is meaningful.
    mobile_impressions: mobile?.impressions ?? '',
    mobile_clicks: mobile?.clicks ?? '',
    mobile_position: mobile?.position ?? '',
    desktop_impressions: desktop?.impressions ?? '',
    desktop_clicks: desktop?.clicks ?? '',
    desktop_position: desktop?.position ?? '',
    mobile_desktop_position_gap:
      mobile?.position != null && desktop?.position != null
        ? Math.round((desktop.position - mobile.position) * 10) / 10
        : '',
    mobile_impression_share:
      mobile?.impressions != null && t_.impressions
        ? Math.round((mobile.impressions / t_.impressions) * 1000) / 1000
        : '',
    indexed_pages: g?.data.indexed_pages ?? '',

    // BENCHMARK probe — frozen 41-query set. These ARE a trend series.
    serp_top_3: p?.data.summary.in_top_3 ?? '',
    serp_top_10: p?.data.summary.in_top_10 ?? '',
    serp_top_20: p?.data.summary.in_top_20 ?? '',
    serp_measured: p?.data.summary.measured ?? '',

    // DISCOVERY probe — evolving set. Deliberately prefixed `discovery_` so a
    // reader cannot mistake these for benchmark columns. These are NOT a trend
    // series: the denominator changes as the set evolves, so compare a query
    // against its own history, never these totals against prior totals.
    discovery_set_version: disc?.data.set_version ?? '',
    discovery_measured: disc?.data.summary.measured ?? '',
    discovery_top_20: disc?.data.summary.in_top_20 ?? '',
    discovery_top_10: disc?.data.summary.in_top_10 ?? '',

    search_referred_cumulative: r?.data.search_referred_human_pageloads ?? r?.data.search_referred?.total ?? '',
    google_referred_cumulative: r?.data.traffic?.by_channel?.google ?? '',
    bing_referred_cumulative: r?.data.traffic?.by_channel?.bing ?? '',
    other_search_cumulative: r?.data.traffic?.by_channel?.other_search ?? '',
    direct_cumulative: r?.data.traffic?.by_channel?.direct ?? '',
    other_referral_cumulative: r?.data.traffic?.by_channel?.other_referral ?? '',
    internal_cumulative: r?.data.traffic?.by_channel?.internal ?? '',
    search_referred_mobile: r?.data.search_referred?.by_device?.mobile ?? '',
    search_referred_countries: r ? Object.keys(r.data.search_referred?.by_country ?? {}).length : '',
    human_pageloads_cumulative: r?.data.human_pageloads ?? '',
    bot_pageloads_cumulative: r?.data.bot_pageloads ?? '',

    feedback_genuine_cumulative: f?.data.genuine_submissions ?? '',
    technical_issues: t?.data.issues?.length ?? '',

    sources_ok: Object.entries(s.sources ?? {})
      .filter(([, v]) => v.status === 'ok')
      .map(([k]) => k)
      .join(' '),
  };
});

/* ------------------------------------------------------------- writing --- */

function toCSV(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
}

writeText(join(DATA_DIR, 'history.csv'), toCSV(dayRows));
writeText(join(DATA_DIR, 'observations.csv'), toCSV(obsRows));
writeJSON(join(DATA_DIR, 'history.json'), {
  generated_at: new Date().toISOString(),
  generated_by: 'scripts/seo/history.mjs',
  note: 'Regenerated from docs/seo/data/daily/*.json. Do not hand-edit; edit the snapshots.',
  by_day: dayRows,
  by_observation: obsRows,
});

log(`history.csv        ${dayRows.length} calendar days (${firstDay} → ${lastDay})`);
log(`observations.csv   ${obsRows.length} observations`);
log(`history.json       both series`);

const unsettled = dayRows.filter((r) => r.gsc_settled === 0).length;
if (unsettled) log(`\n  ${unsettled} day(s) have Search Console figures that may still be revised upward.`);
const noGSC = dayRows.filter((r) => r.gsc_impressions === '').length;
if (noGSC) log(`  ${noGSC} day(s) have no Search Console coverage yet (lag, or not yet ingested).`);
