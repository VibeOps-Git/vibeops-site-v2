/**
 * The opportunity database: persistence and scoring.
 *
 * The point of this file is memory. If the system notices an interesting query
 * today, it must still know about it tomorrow, and the day after it should be
 * able to say "this has now been visible for three days and is growing" rather
 * than rediscovering it from scratch. Opportunities therefore ACCUMULATE
 * evidence; they are never rebuilt from a single day's data.
 *
 * Scoring is documented in full in docs/seo/PLAYBOOK.md. The score exists to
 * rank a queue for human attention, not to authorise action. Nothing in this
 * system may act on a score alone — the weekly decision gate does that, with a
 * person in the loop.
 */

import { join } from 'node:path';
import { DATA_DIR, CONFIG, readJSON, writeJSON, classifyQuery, daysBetween } from './core.mjs';
import { expectedCTR, ctrOpportunity } from './trends.mjs';

export const OPPORTUNITIES_PATH = join(DATA_DIR, 'opportunities.json');
const T = CONFIG.thresholds;

export function loadOpportunities() {
  return readJSON(OPPORTUNITIES_PATH, {
    schema_version: 1,
    generated_by: 'scripts/seo/analyze.mjs',
    note: 'Accumulating opportunity register. Evidence appends; opportunities are never silently dropped. A rejected opportunity keeps status REJECTED so it is not rediscovered every day.',
    opportunities: [],
  });
}

export function saveOpportunities(db) {
  db.updated_at = new Date().toISOString();
  writeJSON(OPPORTUNITIES_PATH, db);
}

/** Stable id so the same query maps to the same record across runs. */
export function opportunityId(kind, key) {
  return `${kind}:${key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/* ============================================================= scoring == */

/**
 * Score an opportunity 0-100.
 *
 * Six positive components, then multiplicative penalties. Multiplicative
 * because the penalties describe reasons not to TRUST the signal, and an
 * untrustworthy signal should be suppressed proportionally rather than have a
 * fixed number of points shaved off a large score.
 *
 * Every component returns its own reasoning string, and the strings are stored
 * on the opportunity. A score with no visible derivation is not usable by a
 * person deciding whether to act, which is the only thing scores are for here.
 */
export function scoreOpportunity(o) {
  const parts = [];
  const penalties = [];

  // 1. Volume (0-25). Log-scaled: the difference between 10 and 50 impressions
  //    matters far more than between 500 and 540.
  const imp = o.impressions_7d ?? 0;
  const volume = Math.min(25, Math.log10(imp + 1) * 12);
  parts.push({ factor: 'impression_volume', points: volume, of: 25, note: `${imp} impressions in the 7-day window` });

  // 2. Growth (0-15).
  let growth = 0;
  let growthNote = 'no growth data';
  if (o.impression_trend === 'rising') { growth = 15; growthNote = 'impressions rising across the window'; }
  else if (o.impression_trend === 'flat') { growth = 7; growthNote = 'impressions flat'; }
  else if (o.impression_trend === 'falling') { growth = 2; growthNote = 'impressions falling'; }
  parts.push({ factor: 'impression_growth', points: growth, of: 15, note: growthNote });

  // 3. Position headroom (0-20). Peaks in the 4-15 band: that is where a real
  //    improvement is both achievable and worth the most traffic. Already
  //    top-3 scores low because there is little left to win; beyond 30 scores
  //    low because closing that gap is an authority problem, not a page edit.
  const pos = o.average_position;
  let posPts = 0;
  let posNote = 'no position recorded';
  if (pos != null && pos > 0) {
    if (pos <= 3) { posPts = 5; posNote = `position ${pos} — already won, little headroom`; }
    else if (pos <= 10) { posPts = 20; posNote = `position ${pos} — page one, closest achievable gain`; }
    else if (pos <= 20) { posPts = 16; posNote = `position ${pos} — page two, realistic target`; }
    else if (pos <= 30) { posPts = 9; posNote = `position ${pos} — distant but visible`; }
    else { posPts = 3; posNote = `position ${pos} — an authority gap, not a page-edit gap`; }
  }
  parts.push({ factor: 'position_headroom', points: posPts, of: 20, note: posNote });

  // 4. CTR gap (0-15). Gated on volume — below the threshold this contributes
  //    nothing at all rather than a small amount, because a CTR computed on 3
  //    impressions should have no influence whatsoever.
  const ctrGap = ctrOpportunity({
    impressions: imp,
    clicks: o.clicks_7d ?? 0,
    position: pos,
  });
  const ctrPts = ctrGap.meaningful ? Math.min(15, (1 - ctrGap.ratio) * 20) : 0;
  parts.push({
    factor: 'ctr_gap',
    points: ctrPts,
    of: 15,
    note: ctrGap.meaningful
      ? `CTR ${(ctrGap.actual * 100).toFixed(1)}% against ~${(ctrGap.expected * 100).toFixed(1)}% expected at position ${pos}`
      : (ctrGap.reason ?? 'CTR not evaluable'),
  });

  // 5. Professional relevance (0-15).
  const relMap = { on_topic: 15, adjacent: 6, irrelevant: 0 };
  const rel = relMap[o.topicality] ?? 0;
  parts.push({ factor: 'relevance', points: rel, of: 15, note: `classified ${o.topicality}` });

  // 6. Cluster fit (0-10). An opportunity that deepens a cluster we already
  //    serve is worth more than an orphan, because topical depth is the whole
  //    acquisition thesis.
  const fit = o.cluster && o.cluster !== 'sitewide' ? 10 : o.cluster === 'sitewide' ? 4 : 0;
  parts.push({ factor: 'cluster_fit', points: fit, of: 10, note: o.cluster ? `strengthens the ${o.cluster} cluster` : 'no cluster mapping' });

  let score = parts.reduce((a, p) => a + p.points, 0);

  /* ------------------------------------------------------- penalties --- */

  if (imp < T.ranking_min_impressions) {
    score *= 0.3;
    penalties.push({ penalty: 'tiny_sample', factor: 0.3, note: `${imp} impressions is below the ${T.ranking_min_impressions}-impression floor for reading anything into this` });
  }
  if ((o.days_seen ?? 0) < T.trend_min_days) {
    score *= 0.5;
    penalties.push({ penalty: 'short_history', factor: 0.5, note: `seen on ${o.days_seen ?? 0} day(s); a trend needs at least ${T.trend_min_days}` });
  }
  if (o.topicality === 'irrelevant') {
    score *= 0.1;
    penalties.push({ penalty: 'irrelevant', factor: 0.1, note: 'not an AE-engineering search intent' });
  }
  if (o.duplicate_intent_of) {
    score *= 0.6;
    penalties.push({ penalty: 'duplicate_intent', factor: 0.6, note: `substantially the same intent as ${o.duplicate_intent_of}, which is already served` });
  }
  if (o.already_served_well) {
    score *= 0.5;
    penalties.push({ penalty: 'already_served', factor: 0.5, note: 'an existing page already ranks well for this intent' });
  }

  return {
    score: Math.round(score * 10) / 10,
    components: parts.map((p) => ({ ...p, points: Math.round(p.points * 10) / 10 })),
    penalties,
  };
}

/**
 * Confidence is about EVIDENCE ACCUMULATION, not score magnitude.
 * A high score seen once is LOW confidence. That distinction is what stops the
 * system chasing a one-day spike.
 */
export function confidenceFor(o) {
  // UX opportunities are evidenced by behavioural sample size and persistence,
  // not by search impressions. Using the search thresholds would permanently
  // pin every UX finding at LOW.
  if (o.kind === 'ux') {
    const days = o.days_seen ?? 0;
    const sig = o.ux_signal ?? 'INSUFFICIENT';
    if (sig === 'INSUFFICIENT') return 'LOW';
    if (sig === 'STRONG' && days >= T.trend_min_days) return 'HIGH';
    if (sig === 'MODERATE' && days >= T.trend_min_days) return 'MEDIUM';
    if (sig === 'STRONG') return 'MEDIUM';
    return 'LOW';
  }
  const days = o.days_seen ?? 0;
  const imp = o.impressions_7d ?? 0;
  if (days >= 7 && imp >= 50) return 'HIGH';
  if (days >= T.trend_min_days && imp >= T.ranking_min_impressions) return 'MEDIUM';
  return 'LOW';
}

/**
 * Map an opportunity to exactly one of the five allowed recommendations.
 *
 * HOLD is the default and should stay the overwhelming majority. The other
 * four each require a specific, stated reason to be reached.
 */
export function recommendAction(o, ctx = {}) {
  // TECHNICAL wins over everything: something being broken is not an
  // optimisation question and is the only category that may act same-day.
  if (ctx.technical_issue) {
    return { action: 'TECHNICAL', why: `Technical defect on ${o.target_page}: ${ctx.technical_issue}` };
  }

  // UX opportunities come from behavioural evidence rather than search data, so
  // they are scored and gated on their own terms. The action is only reached
  // when the underlying sample cleared its threshold in the UX layer — see
  // the UX summariser on roadway.tools, which returns a null rate rather than a
  // confident-looking number when the denominator is too small.
  if (o.kind === 'ux') {
    if (o.ux_signal === 'INSUFFICIENT') {
      return { action: 'HOLD', why: `Behavioural sample is too small to support any claim (${o.ux_denominator ?? 0} observations).` };
    }
    return { action: 'UX', why: o.ux_finding ?? 'Behavioural evidence indicates a usability deficiency.' };
  }

  const conf = confidenceFor(o);
  const imp = o.impressions_7d ?? 0;

  if (conf === 'LOW') {
    return { action: 'HOLD', why: `Only ${o.days_seen ?? 0} day(s) of evidence at ${imp} impressions — not enough to distinguish signal from noise.` };
  }
  if (o.topicality === 'irrelevant') {
    return { action: 'HOLD', why: 'Not an AE-engineering intent; exposure here is Google exploring, not demand worth serving.' };
  }

  if (o.link_worthy) {
    return { action: 'PROMOTE', why: 'An existing resource here is unusually citable; a candidate for individually-written outreach, subject to approval.' };
  }

  const ctr = ctrOpportunity({ impressions: imp, clicks: o.clicks_7d ?? 0, position: o.average_position });
  if (ctr.meaningful) {
    return { action: 'OPTIMIZE', why: `Position ${o.average_position} at ${imp} impressions but CTR ${(ctr.actual * 100).toFixed(1)}% against ~${(ctr.expected * 100).toFixed(1)}% expected — a snippet problem, roughly ${ctr.shortfall_clicks} clicks/week unclaimed.` };
  }

  if (o.intent_match === 'weak' && conf !== 'LOW' && imp >= T.ranking_min_impressions) {
    return { action: 'OPTIMIZE', why: `We rank for this at meaningful volume but the target page only weakly serves the intent: ${o.content_gap ?? 'gap recorded but undescribed'}.` };
  }

  if (o.intent_match === 'none' && conf === 'HIGH') {
    return { action: 'CREATE', why: `Sustained demand that no existing page serves: ${o.content_gap ?? 'distinct information need'}. Must independently deserve to exist before it is written.` };
  }

  return { action: 'HOLD', why: 'Evidence is accumulating but no specific, measurable improvement has been identified yet.' };
}

/**
 * Fold one day's observation into the register.
 *
 * Existing records gain an evidence entry and refreshed metrics; genuinely new
 * ones are created as WATCHING. Records already marked ACTED or REJECTED keep
 * their status — the system must not re-open a decision a person has made.
 */
export function upsert(db, observation, date) {
  const id = observation.id;
  let o = db.opportunities.find((x) => x.id === id);

  if (!o) {
    o = {
      id,
      query_or_topic: observation.query_or_topic,
      kind: observation.kind ?? 'query',
      cluster: observation.cluster ?? null,
      target_page: observation.target_page ?? null,
      first_seen: date,
      last_seen: date,
      days_seen: 0,
      status: 'WATCHING',
      evidence: [],
      notes: '',
    };
    db.opportunities.push(o);
  }

  // days_seen counts DISTINCT observation dates, so re-running the daily job
  // cannot inflate an opportunity's apparent history.
  const already = o.evidence.some((e) => e.date === date);
  if (!already) o.days_seen = (o.days_seen ?? 0) + 1;

  o.last_seen = date;
  o.cluster ??= observation.cluster ?? null;
  o.target_page ??= observation.target_page ?? null;
  o.topicality = observation.topicality ?? o.topicality ?? classifyQuery(o.query_or_topic);

  Object.assign(o, {
    impressions_7d: observation.impressions_7d ?? o.impressions_7d ?? 0,
    impressions_28d: observation.impressions_28d ?? o.impressions_28d ?? 0,
    clicks_7d: observation.clicks_7d ?? o.clicks_7d ?? 0,
    ctr: observation.ctr ?? o.ctr ?? 0,
    average_position: observation.average_position ?? o.average_position ?? null,
    position_trend: observation.position_trend ?? o.position_trend ?? 'unknown',
    impression_trend: observation.impression_trend ?? o.impression_trend ?? 'unknown',
    intent: observation.intent ?? o.intent ?? null,
    intent_match: observation.intent_match ?? o.intent_match ?? 'unassessed',
    content_gap: observation.content_gap ?? o.content_gap ?? null,
    competitor_gap: observation.competitor_gap ?? o.competitor_gap ?? null,
    link_worthy: observation.link_worthy ?? o.link_worthy ?? false,
    ux_signal: observation.ux_signal ?? o.ux_signal ?? null,
    ux_finding: observation.ux_finding ?? o.ux_finding ?? null,
    ux_metric: observation.ux_metric ?? o.ux_metric ?? null,
    ux_value: observation.ux_value ?? o.ux_value ?? null,
    ux_denominator: observation.ux_denominator ?? o.ux_denominator ?? null,
    ux_hypothesis: observation.ux_hypothesis ?? o.ux_hypothesis ?? null,
  });

  if (!already) {
    o.evidence.push({
      date,
      impressions: observation.impressions_7d ?? 0,
      clicks: observation.clicks_7d ?? 0,
      position: observation.average_position ?? null,
      source: observation.source ?? 'search_console',
    });
    // Keep the register readable: 60 days of evidence is ample for any
    // decision, and the full history remains in the daily snapshots anyway.
    if (o.evidence.length > 60) o.evidence = o.evidence.slice(-60);
  }

  const scored = scoreOpportunity(o);
  o.score = scored.score;
  o.score_components = scored.components;
  o.score_penalties = scored.penalties;
  o.confidence = confidenceFor(o);

  const rec = recommendAction(o, { technical_issue: observation.technical_issue });
  o.recommended_action = rec.action;
  o.recommendation_why = rec.why;

  // Promotion to READY is a gate, not a score threshold: it needs persistence
  // AND volume AND confidence AND a non-HOLD action. Anything a person already
  // decided (ACTED/REJECTED) is left alone.
  if (o.status === 'WATCHING') {
    const persisted = daysBetween(o.first_seen, date) >= T.opportunity_promote_to_ready_days;
    const ready =
      persisted &&
      o.confidence !== 'LOW' &&
      o.recommended_action !== 'HOLD' &&
      (o.impressions_7d ?? 0) >= T.ranking_min_impressions;
    if (ready) o.status = 'READY';
  }
  // A verified technical defect skips the waiting period by design.
  if (o.recommended_action === 'TECHNICAL' && o.status === 'WATCHING') o.status = 'READY';

  // A UX finding reaches READY on behavioural persistence rather than the
  // search-opportunity waiting period, but still needs MORE THAN ONE DAY: a
  // single day's heatmap is exactly the kind of evidence that produces a
  // confident redesign of a problem that was never there.
  if (
    o.kind === 'ux' &&
    o.status === 'WATCHING' &&
    o.recommended_action === 'UX' &&
    o.confidence !== 'LOW' &&
    (o.days_seen ?? 0) >= T.trend_min_days
  ) {
    o.status = 'READY';
  }

  return o;
}
