/**
 * Trend arithmetic with sample-size guards.
 *
 * The governing idea, from section 22 of the brief: detect momentum without
 * overreacting. `16 → 43 → 45 → 60` impressions/day is real expansion. A query
 * moving `#8 → #13 → #7` on three impressions is not ranking volatility, it is
 * noise wearing a trend's clothes.
 *
 * So every function here returns not just a number but whether the number is
 * trustworthy at this sample size. Callers are expected to check `meaningful`
 * before reporting anything, and the daily report only narrates changes that
 * clear the guard.
 */

import { CONFIG } from './core.mjs';

const T = CONFIG.thresholds;

/** Sum the last n non-empty values of a numeric series. */
export function tail(series, n) {
  return series.filter((v) => v != null && v !== '').slice(-n);
}

export function sum(xs) {
  return xs.reduce((a, b) => a + Number(b), 0);
}

export function mean(xs) {
  return xs.length ? sum(xs) / xs.length : null;
}

/**
 * Growth of the most recent `window` days against the `window` days before.
 *
 * Returns null rather than Infinity when the prior window is zero — "we went
 * from nothing to something" is a real observation, but it is not a percentage,
 * and formatting it as +Inf% in a report is how a rounding artefact becomes a
 * strategy.
 */
export function windowGrowth(series, window = 7) {
  const clean = series.filter((v) => v != null && v !== '').map(Number);
  if (clean.length < window + 1) {
    return { meaningful: false, reason: `needs ${window * 2} days, has ${clean.length}` };
  }
  const recent = clean.slice(-window);
  const prior = clean.slice(-window * 2, -window);
  if (!prior.length) return { meaningful: false, reason: 'no prior window' };

  const r = sum(recent);
  const p = sum(prior);
  const pct = p === 0 ? null : ((r - p) / p) * 100;

  return {
    meaningful: p > 0 && r + p >= 20,
    recent: r,
    prior: p,
    pct,
    direction: r > p ? 'up' : r < p ? 'down' : 'flat',
    material: pct != null && Math.abs(pct) >= T.impression_growth_material_pct,
    reason: p === 0 ? 'prior window was zero — growth is undefined, report as "first activity"' : null,
  };
}

/**
 * Is a short series monotonically expanding, and by enough to matter?
 *
 * Used for the "impressions are compounding" reading. Requires trend_min_days
 * consecutive observations — a single day's jump is explicitly not a trend.
 */
export function momentum(series, minDays = T.trend_min_days) {
  const clean = series.filter((v) => v != null && v !== '').map(Number);
  if (clean.length < minDays) {
    return { meaningful: false, reason: `needs ${minDays} days, has ${clean.length}` };
  }
  const recent = clean.slice(-minDays);
  const rising = recent.every((v, i) => i === 0 || v >= recent[i - 1]);
  const falling = recent.every((v, i) => i === 0 || v <= recent[i - 1]);
  const first = recent[0];
  const last = recent[recent.length - 1];

  return {
    meaningful: sum(recent) >= 20,
    series: recent,
    rising: rising && last > first,
    falling: falling && last < first,
    change: last - first,
    pct: first > 0 ? ((last - first) / first) * 100 : null,
    reason: sum(recent) < 20 ? 'total volume across the window is under 20 — too small to read' : null,
  };
}

/**
 * Is a position change real, or is it SERP weather?
 *
 * Two guards, both required: enough impressions behind the query, and a move
 * large enough to sit outside normal volatility. Position 0 (absent from the
 * measured range) is censored, so entering/leaving is reported as a state
 * change rather than a numeric delta.
 */
export function positionChange({ from, to, impressions = 0 }) {
  if (from == null || to == null) return { meaningful: false, label: 'no_prior' };

  if (from === 0 || to === 0) {
    const label = from === 0 && to === 0 ? 'absent' : from === 0 ? 'entered' : 'dropped_out';
    return {
      meaningful: label !== 'absent' && impressions >= T.ranking_min_impressions,
      label,
      delta: null,
      reason:
        label === 'absent'
          ? 'not present in either measurement'
          : impressions < T.ranking_min_impressions
            ? `only ${impressions} impressions behind it — below the ${T.ranking_min_impressions} needed to read a ranking change`
            : null,
    };
  }

  const delta = from - to; // positive = improved
  const enoughVolume = impressions >= T.ranking_min_impressions;
  const bigEnough = Math.abs(delta) >= T.position_material_move;

  return {
    meaningful: enoughVolume && bigEnough,
    label: delta > 0 ? 'improved' : delta < 0 ? 'declined' : 'flat',
    delta,
    crossed_top_3: from > 3 && to <= 3,
    crossed_top_10: from > 10 && to <= 10,
    crossed_top_20: from > 20 && to <= 20,
    reached_1: to === 1 && from !== 1,
    reason: !enoughVolume
      ? `only ${impressions} impressions behind it — below the ${T.ranking_min_impressions} needed to read a ranking change`
      : !bigEnough
        ? `moved ${Math.abs(delta)} places, inside the ${T.position_material_move}-place volatility band`
        : null,
  };
}

/**
 * Expected organic CTR by position.
 *
 * A GENERIC industry curve, not measured for this site. It exists only to give
 * "is this CTR obviously bad for its position" a reference point, and it is
 * deliberately conservative. Never present a number derived from this as a
 * measured expectation — at the volumes this site currently sees, the honest
 * answer to almost every CTR question is "not enough data".
 */
const CTR_CURVE = {
  1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.05, 7: 0.04, 8: 0.033, 9: 0.028, 10: 0.025,
};
export function expectedCTR(position) {
  if (position == null || position <= 0) return null;
  const p = Math.round(position);
  if (p <= 10) return CTR_CURVE[p];
  if (p <= 20) return 0.012;
  return 0.005;
}

/**
 * Flag a CTR problem only when the volume makes CTR mean something.
 *
 * The brief's own example: 2 impressions / 0 clicks is not a CTR problem;
 * 500 impressions / position 3 / 0.4% CTR might be. The gate is
 * thresholds.ctr_min_impressions_7d.
 */
export function ctrOpportunity({ impressions, clicks, position }) {
  if (impressions < T.ctr_min_impressions_7d) {
    return {
      meaningful: false,
      reason: `${impressions} impressions is below the ${T.ctr_min_impressions_7d} needed for CTR to be signal rather than arithmetic noise`,
    };
  }
  const expected = expectedCTR(position);
  if (expected == null) return { meaningful: false, reason: 'no position recorded' };

  const actual = impressions ? clicks / impressions : 0;
  const ratio = expected ? actual / expected : null;

  return {
    meaningful: ratio != null && ratio < T.ctr_underperformance_ratio,
    actual,
    expected,
    ratio,
    shortfall_clicks: Math.max(0, Math.round(expected * impressions - clicks)),
    reason:
      ratio != null && ratio >= T.ctr_underperformance_ratio
        ? `CTR is ${(ratio * 100).toFixed(0)}% of the position-expected rate, within normal range`
        : null,
  };
}

/**
 * Cannibalisation: two or more of our pages competing for one intent.
 *
 * Detected from the query→page mapping. Requires the query to carry real
 * volume, because at 1-2 impressions Google showing different pages on
 * different days is just exploration, not a conflict worth fixing.
 */
export function detectCannibalisation(queryPageRows) {
  const byQuery = new Map();
  for (const r of queryPageRows) {
    if (!r.page || !r.query) continue;
    const e = byQuery.get(r.query) ?? { query: r.query, pages: new Map(), impressions: 0 };
    e.pages.set(r.page, (e.pages.get(r.page) ?? 0) + (r.impressions ?? 0));
    e.impressions += r.impressions ?? 0;
    byQuery.set(r.query, e);
  }
  return [...byQuery.values()]
    .filter((e) => e.pages.size > 1 && e.impressions >= T.ranking_min_impressions)
    .map((e) => ({
      query: e.query,
      impressions: e.impressions,
      pages: [...e.pages.entries()].map(([page, impressions]) => ({ page, impressions })),
    }));
}
