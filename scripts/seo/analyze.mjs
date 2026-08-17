#!/usr/bin/env node
/**
 * COMPARE → DIAGNOSE → SCORE → RECOMMEND, and write the daily report.
 *
 *   node scripts/seo/analyze.mjs [--date=YYYY-MM-DD] [--dry-run]
 *
 * Reads the accumulated snapshots, compares the newest available data against
 * yesterday / 3-day / 7-day / previous week / launch baseline / historical
 * high, folds findings into the opportunity register, and writes
 * docs/seo/daily/<date>.md.
 *
 * READ-ONLY toward production. This script writes only inside docs/seo/. It
 * cannot and must not edit a page, a title, a description or a link.
 *
 * --dry-run prints the report to stdout and writes nothing, which is how the
 * pipeline gets exercised without leaving artefacts.
 */

import { join } from 'node:path';
import {
  CONFIG, QUERY_SET, DAILY_REPORT_DIR, resolveDate, hasFlag, listSnapshotDates, loadSnapshot,
  writeText, domainAge, daysBetween, fmtPct, log, clusterForPath, inferCluster,
} from './lib/core.mjs';
import { momentum, windowGrowth, positionChange, ctrOpportunity, detectCannibalisation } from './lib/trends.mjs';
import { loadOpportunities, saveOpportunities, upsert, opportunityId } from './lib/opportunities.mjs';

const date = resolveDate();
const dryRun = hasFlag('dry-run');
const T = CONFIG.thresholds;

const dates = listSnapshotDates().filter((d) => d <= date);
if (!dates.length) {
  console.error(`No snapshots on or before ${date}. Run collect.mjs first.`);
  process.exit(1);
}
const snaps = dates.map(loadSnapshot);
const cur = snaps[snaps.length - 1];
const prev = snaps.length > 1 ? snaps[snaps.length - 2] : null;

const ok = (s, k) => (s?.sources?.[k]?.status === 'ok' ? s.sources[k] : null);
const gsc = ok(cur, 'search_console');
const traffic = ok(cur, 'web_analytics');
const tech = ok(cur, 'technical');
const serp = ok(cur, 'serp_probe');
const disc = ok(cur, 'serp_discovery');
const linkg = ok(cur, 'internal_links');
const psi = ok(cur, 'page_speed');
const deploys = ok(cur, 'vercel');

const gscPrev = prev ? ok(prev, 'search_console') : null;

/* ==================================================== per-day GSC series == */

// Rebuilt from the newest snapshot that reports each day, matching history.mjs.
const dayMap = new Map();
for (const s of snaps) {
  const b = ok(s, 'search_console');
  if (!b) continue;
  for (const r of b.data.by_day ?? []) dayMap.set(r.date, { ...r, observed_on: s.date });
}
const gscDays = [...dayMap.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
const impSeries = gscDays.map((d) => d.impressions);
const clickSeries = gscDays.map((d) => d.clicks);

const latestCovered = gsc?.data.latest_date_available ?? null;
const lagDays = gsc?.lag_days ?? null;

/* ============================================================ findings === */

const facts = [];
const interpretations = [];
const risks = [];
const newBehaviour = [];

/* --- exposure ----------------------------------------------------------- */

const impMomentum = momentum(impSeries);
const impGrowth7 = windowGrowth(impSeries, 7);

if (gscDays.length) {
  const last = gscDays[gscDays.length - 1];
  facts.push(`Search Console covers through **${latestCovered}** (lag ${lagDays}d). Latest reported day ${last.date}: **${last.impressions} impressions, ${last.clicks} clicks**.`);
  facts.push(`Impressions/day so far: ${gscDays.map((d) => d.impressions).join(' → ')}.`);
}

if (impMomentum.meaningful && impMomentum.rising) {
  interpretations.push(`Impressions are compounding, not spiking: ${impMomentum.series.join(' → ')} across the last ${impMomentum.series.length} reported days (+${impMomentum.change}).`);
} else if (impMomentum.meaningful && impMomentum.falling) {
  risks.push(`Impressions declining across the last ${impMomentum.series.length} reported days: ${impMomentum.series.join(' → ')}.`);
} else if (!impMomentum.meaningful) {
  interpretations.push(`Impression trend not yet readable — ${impMomentum.reason}.`);
}

/* --- query breadth and topicality --------------------------------------- */

let topicalityLine = null;
if (gsc) {
  const mix = gsc.data.topicality_mix ?? {};
  const n = gsc.data.disclosed_query_count ?? 0;
  const onTopicPct = n ? mix.on_topic / n : 0;
  topicalityLine = `${n} disclosed queries — ${mix.on_topic} on-topic, ${mix.adjacent} adjacent, ${mix.irrelevant} irrelevant (${fmtPct(onTopicPct, 0)} on-topic).`;
  facts.push(topicalityLine);
  facts.push(`${gsc.data.undisclosed_impressions} of ${gsc.data.totals.impressions} impressions come from queries Search Console will not name.`);

  if (gscPrev) {
    const before = new Set((gscPrev.data.queries ?? []).map((q) => q.query));
    const fresh = (gsc.data.queries ?? []).filter((q) => !before.has(q.query));
    if (fresh.length) {
      newBehaviour.push(
        `**${fresh.length} newly disclosed quer${fresh.length === 1 ? 'y' : 'ies'}:** ` +
          fresh.map((q) => `\`${q.query}\` (${q.impressions}, ${q.topicality})`).join(', '),
      );
    }
    const prevPct = gscPrev.data.disclosed_query_count
      ? (gscPrev.data.topicality_mix?.on_topic ?? 0) / gscPrev.data.disclosed_query_count
      : 0;
    if (onTopicPct > prevPct && n >= 4) {
      interpretations.push(`On-topic share of disclosed queries rose ${fmtPct(prevPct, 0)} → ${fmtPct(onTopicPct, 0)}. Google is testing the site against more relevant intent, which is the early-domain signal that matters most right now.`);
    }
  }
}

/* --- pages and clusters -------------------------------------------------- */

if (gsc?.data.pages?.length) {
  const rows = [...gsc.data.pages].sort((a, b) => b.impressions - a.impressions);
  facts.push('Page exposure: ' + rows.map((p) => `\`${p.page}\` ${p.impressions}/${p.clicks}`).join(' · ') + ' (impressions/clicks).');

  if (gscPrev?.data.pages?.length) {
    const before = new Map(gscPrev.data.pages.map((p) => [p.page, p.impressions]));
    for (const p of rows) {
      const b = before.get(p.page);
      if (b == null) continue;
      const delta = p.impressions - b;
      if (b >= 10 && delta / b >= T.impression_growth_material_pct / 100) {
        newBehaviour.push(`\`${p.page}\` exposure ${b} → ${p.impressions} (+${Math.round((delta / b) * 100)}%).`);
      }
    }
  }
}

/* --- CTR ---------------------------------------------------------------- */

if (gsc) {
  const { impressions, clicks, position } = gsc.data.totals;
  const c = ctrOpportunity({ impressions, clicks, position });
  if (c.meaningful) {
    risks.push(`Sitewide CTR ${fmtPct(c.actual)} against ~${fmtPct(c.expected)} expected at position ${position} — a snippet problem at usable volume.`);
  } else if (impressions < T.ctr_min_impressions_7d) {
    // Below the volume gate. Say so plainly rather than implying a verdict on
    // the CTR itself, which at this sample size we have not earned.
    interpretations.push(`CTR is not yet a usable signal: ${c.reason}. Reporting it as a KPI at this volume would be optimising against randomness.`);
  } else {
    interpretations.push(`CTR ${fmtPct(gsc.data.totals.ctr)} at position ${position} is within the normal band for that position — no snippet problem indicated. (Volume has cleared the ${T.ctr_min_impressions_7d}-impression gate, so this reading is now meaningful.)`);
  }
}

/* --- rankings ----------------------------------------------------------- */

if (serp?.data.results) {
  const s = serp.data.summary;
  facts.push(`Fixed SERP probe: ${s.in_top_20}/${s.measured} in top 20 · ${s.in_top_10} top 10 · ${s.in_top_3} top 3.`);

  const qImp = new Map((gsc?.data.queries ?? []).map((q) => [q.query.toLowerCase(), q.impressions]));
  for (const r of serp.data.results) {
    if (r.previous_position == null) continue;
    const chg = positionChange({
      from: r.previous_position,
      to: r.position,
      impressions: qImp.get(r.query.toLowerCase()) ?? 0,
    });
    if (chg.meaningful) {
      const line = `\`${r.query}\` ${r.previous_position} → ${r.position} (${chg.label})`;
      if (chg.label === 'declined' || chg.label === 'dropped_out') risks.push(line);
      else newBehaviour.push(line);
    }
  }
  // Aggregate distribution change against the previous probe.
  //
  // The per-query guard below suppresses movement on queries with too few
  // impressions, which is correct for distinguishing a real shift from SERP
  // weather. But it also hides discrete state changes — unranked to top 3 is
  // not volatility, and the COUNT of ranked queries has no small-sample problem
  // because it aggregates all 41. So the distribution is reported separately.
  const prevProbe = (() => {
    for (const d of dates.filter((d) => d < date).reverse()) {
      const b = loadSnapshot(d)?.sources?.serp_probe;
      if (b?.status === 'ok' && b.data?.summary) return { date: d, summary: b.data.summary };
    }
    return null;
  })();

  if (prevProbe) {
    const a = prevProbe.summary;
    const b = s;
    if (a.in_top_20 !== b.in_top_20 || a.in_top_10 !== b.in_top_10 || a.in_top_3 !== b.in_top_3) {
      newBehaviour.push(
        `**Ranking distribution moved since ${prevProbe.date}:** top 20 ${a.in_top_20} → ${b.in_top_20} · ` +
          `top 10 ${a.in_top_10} → ${b.in_top_10} · top 3 ${a.in_top_3} → ${b.in_top_3} (of ${b.measured} fixed queries).`,
      );
    }
    const entered = serp.data.results.filter((r) => r.movement_label === 'entered');
    const dropped = serp.data.results.filter((r) => r.movement_label === 'dropped_out');
    for (const r of entered) {
      newBehaviour.push(
        `\`${r.query}\` entered the measured range at position **${r.position}** (was unranked). ` +
          `Entering from outside the top 20 is a discrete change, not volatility — but Search Console ` +
          `discloses little or no impression volume behind it yet, so it is an observation, not yet a result.`,
      );
    }
    for (const r of dropped) {
      risks.push(`\`${r.query}\` dropped out of the top 20 (was ${r.previous_position}).`);
    }
  }

  const noisy = serp.data.results.filter(
    (r) => r.movement_label === 'improved' || r.movement_label === 'declined',
  ).length;
  if (noisy) {
    interpretations.push(`${noisy} probe position(s) moved but did not clear the evidence guards (needs ≥${T.ranking_min_impressions} impressions behind the query and a ≥${T.position_material_move}-place move). Treated as SERP volatility, not ranking change.`);
  }
}

/* --- indexation coverage ------------------------------------------------- */

// "All pages return 200" and "all pages are indexed" are different claims, and
// only the first is checkable by fetching. Search Console knows the second, and
// the gap between them is exactly the kind of thing that stays invisible unless
// the two sources are compared explicitly.
if (gsc?.data.indexed_pages != null && tech?.data.sitemap?.entries) {
  const indexed = gsc.data.indexed_pages;
  const inSitemap = tech.data.sitemap.entries;
  facts.push(`Indexation: **${indexed} of ${inSitemap} sitemap URLs indexed** (Search Console, through ${latestCovered}).`);
  if (indexed < inSitemap) {
    const gap = inSitemap - indexed;
    risks.push(
      `**${gap} of ${inSitemap} sitemap URLs are not indexed.** All ${inSitemap} return 200, so this is a ` +
        `Google inclusion decision rather than a site defect — but an unindexed page cannot rank, and ` +
        `\`/sources\` is among the candidates while also being the lead backlink asset. ` +
        `${gsc.data.coverage_notes ? 'Coverage detail: ' + gsc.data.coverage_notes : 'Check the Page indexing report for the stated reasons.'}`,
    );
  }
}

/* --- device split (first-class watch metric) ------------------------------ */

// Promoted to a standing watch metric on 2026-08-17: mobile averaged position
// 7.7 against desktop's 17.3 on a tenth of the volume. Reported every day so
// persistence is visible — explicitly NOT to be optimised against until the
// mobile denominator is meaningful.
if (gsc?.data.devices?.length) {
  const mob = gsc.data.devices.find((d) => /mobile/i.test(d.device ?? ''));
  const desk = gsc.data.devices.find((d) => /desktop/i.test(d.device ?? ''));
  if (mob && desk && mob.position != null && desk.position != null) {
    const gap = Math.round((desk.position - mob.position) * 10) / 10;
    const share = gsc.data.totals.impressions ? mob.impressions / gsc.data.totals.impressions : 0;
    facts.push(
      `Device split: mobile ${mob.impressions} impr at position **${mob.position}** · ` +
        `desktop ${desk.impressions} impr at position **${desk.position}** ` +
        `(gap ${gap > 0 ? '+' : ''}${gap} in mobile's favour, mobile = ${fmtPct(share, 0)} of impressions).`,
    );
    if (gap >= 5 && mob.impressions < T.ctr_min_impressions_7d) {
      interpretations.push(
        `Mobile continues to rank ${gap} places better than desktop, on ${mob.impressions} impressions — ` +
          `below the ${T.ctr_min_impressions_7d}-impression bar, so this is a **watch metric, not an actionable one**. ` +
          `A gap this size on a denominator this small is as likely to be which queries happened to fire on mobile ` +
          `as it is a real device-level difference. Do not optimise for it yet.`,
      );
    } else if (gap >= 5) {
      interpretations.push(
        `Mobile ranks ${gap} places better than desktop on ${mob.impressions} impressions, which now clears the ` +
          `${T.ctr_min_impressions_7d}-impression bar. Worth diagnosing at the weekly gate.`,
      );
    }
  }
}

/* --- discovery probe (SEPARATE from the benchmark) ------------------------ */

if (disc) {
  const ds = disc.data.summary;
  facts.push(
    `**Discovery** probe (evolving set v${ds.set_version}, NOT the benchmark): ` +
      `${ds.in_top_20}/${ds.measured} in top 20 · ${ds.in_top_10} top 10. ` +
      `Per-cluster: ${Object.entries(ds.by_cluster).map(([c, v]) => `${c} ${v.in_top_20}/${v.measured}`).join(' · ')}.`,
  );
  const moved = (disc.data.results ?? []).filter((r) =>
    ['improved', 'declined', 'entered', 'dropped_out'].includes(r.movement_label),
  );
  for (const r of moved) {
    const line = `Discovery: \`${r.query}\` ${r.previous_position} → ${r.position} (${r.movement_label}), ${r.observations} observations.`;
    if (r.movement_label === 'declined' || r.movement_label === 'dropped_out') risks.push(line);
    else newBehaviour.push(line);
  }
  if (ds.in_top_20 === 0 && gsc) {
    interpretations.push(
      `The discovery probe sees us nowhere in the top 20 for any of its ${ds.measured} queries, while Search Console ` +
        `reports impressions for several of them at positions 9–47. Both can be true: Search Console positions are ` +
        `averages across a window, the probe is one point-in-time read from one location, and most of those positions ` +
        `are beyond the top 20 the probe measures. **Search Console remains authoritative.**`,
    );
  }
}

/* --- cannibalisation ----------------------------------------------------- */

const cannibal = detectCannibalisation(
  (gsc?.data.queries ?? []).filter((q) => q.page).map((q) => ({ query: q.query, page: q.page, impressions: q.impressions })),
);
for (const c of cannibal) {
  risks.push(`Cannibalisation: \`${c.query}\` (${c.impressions} impressions) split across ${c.pages.map((p) => `${p.page} (${p.impressions})`).join(' and ')}.`);
}

/* --- structure: internal links and page speed --------------------------- */

/**
 * Structural findings.
 *
 * This is the block that replaces roadway.tools' behavioural analysis, and the
 * substitution is deliberate rather than a fallback. That site can read real
 * user behaviour from Analytics Engine; this one cannot, because Vercel Web
 * Analytics has no API. But this site has something the other does not: 28 URLs
 * in a real information architecture, where internal linking is fully under our
 * control and fully measurable without a single visitor.
 *
 * At near-zero organic volume, that is the difference between a report that can
 * recommend something and a report that can only say "keep waiting". An orphan
 * page is actionable on day one. A CTR reading on 3 impressions is not.
 *
 * Findings become opportunities so they accumulate evidence across days rather
 * than being rediscovered, and so a fix can be seen to have worked.
 */
const structuralFindings = [];

if (linkg) {
  const d = linkg.data;
  facts.push(`Internal link graph: ${d.crawled}/${d.sitemap_urls} sitemap URLs crawled · ${d.orphans.length} orphan(s) · max click depth ${d.max_depth}.`);

  for (const path of d.orphans) {
    structuralFindings.push({
      id: opportunityId('structure', `${path}-orphan`),
      topic: `${path}: orphan page`,
      page: path,
      metric: 'inbound_internal_links',
      value: 0,
      denominator: d.crawled,
      signal: 'STRUCTURAL',
      finding: `Nothing on the site links to ${path}. It is in the sitemap, so Google can find it, but it is being told the site does not consider it important.`,
      hypothesis: 'Add a contextual internal link from a related page. This is fully within our control and needs no traffic to justify.',
    });
  }

  for (const path of d.unreachable ?? []) {
    structuralFindings.push({
      id: opportunityId('structure', `${path}-unreachable`),
      topic: `${path}: unreachable from the homepage`,
      page: path,
      metric: 'click_depth',
      value: null,
      denominator: d.crawled,
      signal: 'STRUCTURAL',
      finding: `${path} cannot be reached from / by following internal links.`,
      hypothesis: 'Either it should be linked from the navigation or a hub page, or it should not be in the sitemap.',
    });
  }

  // A page with exactly one inbound link is not an orphan, but on a site this
  // small it is close enough to warrant naming.
  const thin = Object.entries(d.inbound ?? {})
    .filter(([path, n]) => n === 1 && path !== '/')
    .map(([path]) => path);
  if (thin.length) {
    interpretations.push(`${thin.length} page(s) have exactly one inbound internal link: ${thin.slice(0, 8).join(', ')}${thin.length > 8 ? ', …' : ''}. Not a defect, but the cheapest available relevance signal is going unused.`);
  }

  if (d.off_sitemap_links?.length) {
    interpretations.push(`${d.off_sitemap_links.length} internal link(s) point at URLs absent from the sitemap. Read the list before acting: blog posts and legal pages are legitimately linked this way.`);
  }
} else if (cur?.sources?.internal_links?.status === 'error') {
  risks.push('The internal link crawl failed, so orphan and depth findings are unavailable today.');
}

if (psi) {
  const pages = Object.entries(psi.data.pages ?? {}).filter(([, v]) => v.lab);
  if (pages.length) {
    const avg = (k) => Math.round((pages.reduce((n, [, v]) => n + (v.lab[k] ?? 0), 0) / pages.length) * 100);
    facts.push(`PageSpeed (${psi.data.strategy}, ${pages.length} sampled page(s)): performance ${avg('performance')} · SEO ${avg('seo')} · accessibility ${avg('accessibility')}.`);

    for (const [path, v] of pages) {
      if (v.lab.seo != null && v.lab.seo < 0.9) {
        structuralFindings.push({
          id: opportunityId('structure', `${path}-lighthouse-seo`),
          topic: `${path}: Lighthouse SEO below 90`,
          page: path,
          metric: 'lighthouse_seo',
          value: v.lab.seo,
          denominator: 1,
          signal: 'STRUCTURAL',
          finding: `Lighthouse SEO score ${Math.round(v.lab.seo * 100)} on ${path}.`,
          hypothesis: 'Lighthouse SEO failures are almost always mechanical (missing meta, unlinked text, tap targets) and cheap to fix. Open the report to see which audit failed.',
        });
      }
    }

    const withField = pages.filter(([, v]) => v.field_url);
    if (withField.length) {
      facts.push(`CrUX field data available for ${withField.length} URL(s) — real Chrome users, 28-day rolling window.`);
    } else {
      interpretations.push('No per-URL CrUX field data yet. Chrome needs a minimum traffic volume before it will report a URL, so this is a traffic statement, not a performance one.');
    }
  }
} else if (cur?.sources?.page_speed?.status === 'pending') {
  interpretations.push('PageSpeed is unavailable today because the shared anonymous quota was exhausted. Set PAGESPEED_API_KEY in .env for a dedicated free quota. Nothing is wrong with the site.');
}

if (deploys?.data.days_since_deploy != null) {
  // Floor at 0. The snapshot date is a calendar date at midnight while the
  // deploy carries a real timestamp, so a deploy later the same day subtracts
  // to -1 and reads as though it happened tomorrow.
  const age = Math.max(0, deploys.data.days_since_deploy);
  facts.push(`Last production deploy: ${deploys.data.latest_production_deploy?.slice(0, 10)} (${age === 0 ? 'today' : `${age}d ago`}) — "${deploys.data.deployments?.[0]?.commit_message ?? 'n/a'}".`);
}

/* --- technical ----------------------------------------------------------- */

const criticalIssues = (tech?.data.issues ?? []).filter((i) => i.severity === 'critical' || i.severity === 'high');
if (tech) {
  if (!tech.data.issues.length) {
    facts.push(`Technical: all ${CONFIG.pages.length} tracked pages 200, canonical self-referential, no noindex, robots.txt and sitemap.xml serving (${tech.data.sitemap?.entries ?? '?'} entries).`);
  } else {
    // ROOT CAUSE COLLAPSING. When the site is serving one un-prerendered shell,
    // every page also reports a missing canonical, zero h1s, an identical title
    // and an identical description — 64 findings on the first run, all of them
    // the same fact restated. Listing them individually buries the one finding
    // that matters under its own symptoms, and a report nobody finishes reading
    // is a report that does not work.
    //
    // So while the shell condition holds, the derived per-page findings are
    // counted rather than enumerated. They come back automatically once
    // prerendering lands, at which point they are genuinely per-page.
    const shellDerived = new Set(['no canonical link', 'h1 elements', 'title is', 'meta description is', 'duplicate <title>']);
    const isDerived = (i) => tech.data.prerendered === false && [...shellDerived].some((m) => i.issue.includes(m));

    const suppressed = tech.data.issues.filter(isDerived);
    for (const i of tech.data.issues.filter((x) => !isDerived(x))) {
      const line = `\`${i.path}\` — ${i.issue} (${i.severity})`;
      if (i.severity === 'critical' || i.severity === 'high') risks.push(`**TECHNICAL** ${line}`);
      else interpretations.push(`Minor technical note: ${line}`);
    }
    if (suppressed.length) {
      interpretations.push(
        `${suppressed.length} further per-page findings (missing canonical, zero h1, identical title and description) are ` +
        `suppressed because they are all downstream of the un-prerendered shell above, not independent defects. ` +
        `They will resolve together when the shell does, and they are listed in full in ` +
        `\`docs/seo/data/daily/${date}.json\` under technical.data.issues.`,
      );
    }
  }
}

/* --- RUM ---------------------------------------------------------------- */

if (traffic) {
  const d = traffic.data;
  const ch = d.traffic?.by_channel ?? {};
  const searchReferred = d.search_referred_human_pageloads ?? d.search_referred?.total ?? 0;

  // The organic traffic-side KPI leads. Total human pageloads is reported
  // afterwards and explicitly as context, because it mixes our own testing,
  // internal navigation and JS-executing scanners into one number that answers
  // no question we are actually asking.
  facts.push(`**Search-referred pageviews: ${searchReferred}** (${ch.google ?? 0} Google, ${ch.bing ?? 0} Bing, ${ch.other_search ?? 0} other search) via web analytics through ${traffic.represents.end}, a DIFFERENT window from Search Console.`);
  facts.push(`Traffic by channel: search ${searchReferred} · direct ${ch.direct ?? 0} · other referral ${ch.other_referral ?? 0} · internal ${ch.internal ?? 0}. Total pageviews ${d.pageviews ?? 'n/a'}.`);

  const srDevice = d.search_referred?.by_device ?? {};
  const srCountry = d.search_referred?.by_country ?? {};
  const srPath = d.search_referred?.by_path ?? {};
  if (searchReferred > 0) {
    facts.push(`Search-referred by device: ${Object.entries(srDevice).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}. By country: ${Object.entries(srCountry).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}.`);
    const topPaths = Object.entries(srPath).sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (topPaths.length) facts.push(`Search-referred landing pages: ${topPaths.map(([k, v]) => `\`${k}\` ${v}`).join(' · ')}.`);
  }

  // Trend the KPI itself, not the total. Iterate over every day in the RUM
  // window rather than the days that happen to have arrivals — a day with zero
  // search arrivals has no key, and omitting it would read as "no data" when it
  // actually means "nobody arrived from search".
  const srByDay = d.search_referred?.by_day ?? {};
  const windowDays = Object.keys(d.pageloads_by_day ?? {}).sort();
  const srSeries = windowDays.map((k) => srByDay[k]?.total ?? 0);
  if (windowDays.length) {
    facts.push(`Search-referred pageloads/day: ${windowDays.map((k, i) => `${k.slice(5)} ${srSeries[i]}`).join(' · ')} (zero means nobody arrived from search that day, not missing data).`);
  }

  // A KPI that has gone to zero on the most recent days matters even when the
  // cumulative figure is positive.
  const trailing = srSeries.slice(-3);
  if (srSeries.length >= 3 && trailing.every((v) => v === 0)) {
    risks.push(`**Search-referred pageviews have been zero for the last ${trailing.length} days** (${windowDays.slice(-3).map((d2) => d2.slice(5)).join(', ')}), against ${searchReferred} cumulative. Exposure is still growing in Search Console, so this is arrival-side, not exposure-side. Watch rather than act — the daily counts are small enough that a run of zeros is not yet distinguishable from noise.`);
  }

  // Separate a decline in OUR OWN direct testing from a decline in organic
  // arrivals. Conflating them is what made "sessions are declining" read as a
  // worrying signal when it was mostly launch testing tapering off.
  const days = Object.entries(d.pageloads_by_day ?? {}).sort();
  const humanSeries = days.map(([, v]) => v.human);
  const hm = momentum(humanSeries);
  const directSeries = days.map(([day]) => d.traffic?.by_channel_by_day?.[day]?.direct ?? 0);
  const dm = momentum(directSeries);

  if (hm.meaningful && hm.falling) {
    if (dm.meaningful && dm.falling) {
      interpretations.push(`Total pageviews are falling (${humanSeries.join(', ')}), but that decline is **direct** traffic (${directSeries.join(', ')}), not search. Direct is unattributed and at this stage is dominated by our own testing tapering off after launch. It is not an organic signal and should not be read as one.`);
    } else {
      interpretations.push(`Total pageviews are falling (${humanSeries.join(', ')}). Channel breakdown does not attribute this to a decline in direct traffic — worth a closer look at ${traffic.represents.end}.`);
    }
  }

  if (searchReferred === 0) {
    interpretations.push(`**No search-referred pageloads recorded in this window.** At this volume that is not yet alarming — Search Console shows exposure is growing — but search-referred pageloads is the traffic-side KPI, and it currently reads zero for the most recent days.`);
  } else if (impMomentum.meaningful && impMomentum.rising) {
    interpretations.push(`Impressions are rising while search-referred pageviews sit at ${searchReferred}. Exposure is expanding faster than arrivals, which is the expected early shape — but exposure without visits is not yet an acquisition channel.`);
  }

  if (gsc && searchReferred > 0) {
    interpretations.push(`Search Console reports ${gsc.data.totals.clicks} clicks through ${latestCovered}; web analytics shows ${searchReferred} search-referred pageviews through ${traffic.represents.end}. **These windows do not align**, and a pageload is not a click — one visitor reading several pages produces several pageloads. Indicative only.`);
  }

  const mobileSearch = srDevice.mobile ?? 0;
  const nonUS = Object.entries(srCountry).filter(([k]) => k !== 'US').reduce((a, [, v]) => a + v, 0);
  if (mobileSearch > 0 || nonUS > 0) {
    newBehaviour.push(`Search-referred arrivals outside our own testing profile: ${mobileSearch} mobile, ${nonUS} non-US. Recorded as a population-level observation — no attempt is made to attribute any individual pageload.`);
  }
}

/* --- feedback ------------------------------------------------------------ */

// roadway.tools reads a D1 feedback table here for voluntary engagement. This
// site has no equivalent first-party signal; /contact conversions live in GTM,
// which this system does not read. Left as an explicit gap rather than removed,
// because "we cannot see conversions" is itself a finding worth restating.
if (false) {
  const f = {};
}

/* ================================================== opportunity update === */

const db = loadOpportunities();
const touched = [];

// 7-day query aggregation across snapshots, so an opportunity's volume figure
// reflects accumulated evidence rather than one day's reading.
const windowStart = new Date(date); windowStart.setDate(windowStart.getDate() - 7);
const recent = snaps.filter((s) => new Date(s.date) >= windowStart);
const qAgg = new Map();
for (const s of recent) {
  const b = ok(s, 'search_console');
  for (const q of b?.data.queries ?? []) {
    const k = q.query.toLowerCase();
    const e = qAgg.get(k) ?? { query: q.query, impressions: 0, clicks: 0, positions: [], pages: new Set(), days: 0, topicality: q.topicality };
    // Snapshots report cumulative-to-window figures, so take the MAXIMUM
    // observed rather than summing — summing would multiply the same
    // impressions by the number of days they were observed on.
    e.impressions = Math.max(e.impressions, q.impressions);
    e.clicks = Math.max(e.clicks, q.clicks);
    if (q.position != null) e.positions.push(q.position);
    if (q.page) e.pages.add(q.page);
    e.days++;
    qAgg.set(k, e);
  }
}

for (const e of qAgg.values()) {
  const target = [...e.pages][0] ?? null;
  // A real query→page mapping wins; otherwise infer from the wording so a
  // clearly on-cluster query is not scored as if it strengthened nothing.
  const cluster = target ? clusterForPath(target) : inferCluster(e.query);
  const clusterInferred = !target && cluster != null;
  const trendSeries = recent
    .map((s) => ok(s, 'search_console')?.data.queries?.find((q) => q.query.toLowerCase() === e.query.toLowerCase())?.impressions)
    .filter((v) => v != null);
  const m = momentum(trendSeries, 2);

  const o = upsert(db, {
    id: opportunityId('query', e.query),
    query_or_topic: e.query,
    kind: 'query',
    cluster,
    target_page: target ?? (cluster ? CONFIG.clusters[cluster]?.primary_page : null),
    cluster_inferred: clusterInferred,
    topicality: e.topicality,
    impressions_7d: e.impressions,
    clicks_7d: e.clicks,
    ctr: e.impressions ? e.clicks / e.impressions : 0,
    average_position: e.positions.length ? e.positions.reduce((a, b) => a + b, 0) / e.positions.length : null,
    impression_trend: m.rising ? 'rising' : m.falling ? 'falling' : 'flat',
    source: 'search_console',
  }, date);
  touched.push(o);
}

// Structural findings become opportunities so they accumulate evidence across
// days rather than being rediscovered, and so that a fix is visibly a fix. A
// finding present on one day only is exactly the kind of thing that produces a
// confident redesign of a problem that was never there.
for (const f of structuralFindings) {
  const o = upsert(db, {
    id: f.id,
    query_or_topic: f.topic,
    kind: 'structure',
    cluster: f.page ? clusterForPath(f.page) : 'sitewide',
    target_page: f.page,
    topicality: 'on_topic',
    impressions_7d: 0,
    ux_signal: f.signal,
    ux_finding: f.finding,
    ux_metric: f.metric,
    ux_value: f.value,
    ux_denominator: f.denominator,
    ux_hypothesis: f.hypothesis,
    source: 'internal_links',
  }, date);
  touched.push(o);
}

// A verified technical defect becomes an opportunity in its own right so it is
// tracked to resolution rather than living only in one day's prose.
for (const i of criticalIssues) {
  const o = upsert(db, {
    id: opportunityId('technical', `${i.path}-${i.issue}`),
    query_or_topic: `${i.path}: ${i.issue}`,
    kind: 'technical',
    cluster: clusterForPath(i.path),
    target_page: i.path,
    topicality: 'on_topic',
    impressions_7d: 0,
    technical_issue: i.issue,
    source: 'technical',
  }, date);
  touched.push(o);
}

if (!dryRun) saveOpportunities(db);

const leaderboard = [...db.opportunities]
  .filter((o) => o.status === 'WATCHING' || o.status === 'READY')
  .sort((a, b) => b.score - a.score)
  .slice(0, 8);
const ready = db.opportunities.filter((o) => o.status === 'READY');

/* ======================================================== the verdict === */

let verdict = 'HOLD';
let verdictWhy = 'No opportunity has accumulated enough evidence to justify a production change.';

if (criticalIssues.length) {
  verdict = 'TECHNICAL — investigate now';
  verdictWhy = `${criticalIssues.length} technical issue(s) at high/critical severity. This is the one category that may justify same-day remediation.`;
} else if (ready.length) {
  verdict = 'CANDIDATE FOR WEEKLY GATE';
  verdictWhy = `${ready.length} opportunit${ready.length === 1 ? 'y has' : 'ies have'} reached READY. They do not authorise a change — they queue for the weekly decision gate.`;
}

/* ========================================================== the report === */

const bullets = (xs, empty) => (xs.length ? xs.map((x) => `- ${x}`).join('\n') : `- ${empty}`);

const report = `# Daily SEO Intelligence — ${date}

Domain age: ${domainAge(date)} days · Generated by \`scripts/seo/analyze.mjs\` · Read-only toward production.

> **Reporting windows do not align, by nature.** Search Console covers through
> **${latestCovered ?? 'n/a'}** (lag ${lagDays ?? '?'}d); web analytics covers through
> **${traffic?.represents.end ?? 'n/a'}**. Any comparison across the two is indicative only.

## Snapshot

| Source | Window | Key figures |
|---|---|---|
| Search Console | ${gsc ? `${gsc.represents.start} → ${gsc.represents.end}` : '—'} | ${gsc ? `${gsc.data.totals.impressions} impressions · ${gsc.data.totals.clicks} clicks · CTR ${fmtPct(gsc.data.totals.ctr)} · pos ${gsc.data.totals.position} · ${gsc.data.disclosed_query_count} disclosed queries` : '_not collected — needs the authenticated browser session_'} |
| Web analytics | ${traffic ? `${traffic.represents.start} → ${traffic.represents.end}` : 'n/a'} | ${traffic ? `**${traffic.data.search_referred?.total ?? 0} search-referred** · ${traffic.data.pageviews ?? 0} pageviews` : '_browser-gated; not collected_'} |
| Internal links | ${linkg ? date : 'n/a'} | ${linkg ? `${linkg.data.crawled}/${linkg.data.sitemap_urls} crawled · ${linkg.data.orphans.length} orphan(s) · depth ${linkg.data.max_depth}` : '_not collected_'} |
| PageSpeed / CrUX | ${psi ? date : 'n/a'} | ${psi ? `${Object.keys(psi.data.pages ?? {}).length} page(s) sampled (${psi.data.strategy})` : `_${cur?.sources?.page_speed?.status ?? 'not collected'}_`} |
| Deployments | ${deploys ? date : 'n/a'} | ${deploys ? `last production deploy ${Math.max(0, deploys.data.days_since_deploy)}d ago` : '_not collected_'} |
| SERP probe (benchmark, ${QUERY_SET.queries.length} queries) | ${serp?.status === 'ok' ? serp.represents.end : '—'} | ${serp?.status === 'ok' ? `${serp.data.summary.in_top_20}/${serp.data.summary.measured} top 20 · ${serp.data.summary.in_top_10} top 10 · ${serp.data.summary.in_top_3} top 3` : '_not collected — needs the attached Chrome_'} |
| Discovery probe (evolving set) | ${disc?.status === 'ok' ? disc.represents.end : '—'} | ${disc?.status === 'ok' ? `${disc.data.summary.in_top_20}/${disc.data.summary.measured} top 20 · set v${disc.data.summary.set_version} — **not comparable to the benchmark**` : '_not collected_'} |
| Technical | ${tech ? date : '—'} | ${tech ? `${tech.data.pages.filter((p) => p.status === 200).length}/${CONFIG.pages.length} pages 200 · ${tech.data.issues.length} issue(s)` : '_not collected_'} |

## Facts

${bullets(facts, 'No data collected this run.')}

## Interpretation

${bullets(interpretations, 'Nothing to interpret beyond the facts above.')}

## New search behaviour

${bullets(newBehaviour, 'No new queries, pages, geographies or devices this run.')}

## Opportunities

${leaderboard.length
  ? `| Score | Opportunity | Cluster | Impr 7d | Pos | Days | Confidence | Action | Status |\n|---|---|---|---|---|---|---|---|---|\n` +
    leaderboard
      .map((o) => `| ${o.score} | \`${o.query_or_topic}\` | ${o.cluster ?? '—'} | ${o.impressions_7d ?? 0} | ${o.average_position ?? '—'} | ${o.days_seen} | ${o.confidence} | ${o.recommended_action} | ${o.status} |`)
      .join('\n')
  : '_No opportunities in the register yet._'}

${ready.length ? `**${ready.length} READY for the weekly gate:**\n${ready.map((o) => `- \`${o.query_or_topic}\` — ${o.recommendation_why}`).join('\n')}` : '_Nothing has reached READY. HOLD remains correct._'}

## Risks and issues

${bullets(risks, 'None. No technical defect, no material ranking loss, no cannibalisation detected.')}

## Recommendation today

**${verdict}** — ${verdictWhy}

## Production action

**${criticalIssues.length ? 'INVESTIGATE — see technical risks above.' : 'None.'}**

${criticalIssues.length
  ? 'A verified technical defect is the only condition under which this system may touch production on a daily run. Confirm the defect manually before changing anything.'
  : 'Daily runs do not modify production. Rankings moving is not a reason to change a page; only accumulated evidence at the weekly gate, or a verified technical defect, is.'}
`;

if (dryRun) {
  console.log(report);
  log(`\n[dry run] ${touched.length} opportunities would be updated; nothing written.`);
} else {
  const path = join(DAILY_REPORT_DIR, `${date}.md`);
  writeText(path, report);
  log(`\nWrote docs/seo/daily/${date}.md`);
  log(`  ${touched.length} opportunities updated · ${db.opportunities.length} in register · ${ready.length} READY`);
  log(`  Verdict: ${verdict}`);
}
