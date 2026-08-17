#!/usr/bin/env node
/**
 * Generate static trend charts from the historical dataset.
 *
 *   node scripts/seo/charts.mjs
 *
 * Writes standalone SVGs to docs/seo/data/charts/ plus an index.md that embeds
 * them. Hand-rolled SVG on purpose: no charting dependency, no build step, no
 * hosted analytics app. The output is a committed static artefact that renders
 * in GitHub and in any markdown viewer.
 *
 * Regenerated wholesale on every run, like the CSVs.
 */

import { join } from 'node:path';
import { DATA_DIR, readJSON, writeText, log } from './lib/core.mjs';

const CHART_DIR = join(DATA_DIR, 'charts');
const history = readJSON(join(DATA_DIR, 'history.json'));
if (!history) {
  console.error('No history.json — run scripts/seo/history.mjs first.');
  process.exit(1);
}

const W = 720;
const H = 260;
const PAD = { top: 24, right: 20, bottom: 40, left: 52 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A line/bar chart with a light/dark-neutral palette.
 *
 * Colours are chosen to stay legible on both a white and a dark GitHub
 * background, since these SVGs are viewed in both and an SVG cannot know which
 * it landed on. Hence mid-tone strokes and no filled backgrounds.
 */
function chart({ title, subtitle, points, series, yLabel, kind = 'line' }) {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const values = series.flatMap((s) => s.values.filter((v) => v != null));
  const yMax = Math.max(1, ...values) * 1.15;
  const n = points.length;

  const x = (i) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => PAD.top + plotH - (v / yMax) * plotH;

  // Y gridlines at readable round numbers.
  const step = Math.max(1, Math.ceil(yMax / 4 / 5) * 5);
  const gridVals = [];
  for (let v = 0; v <= yMax; v += step) gridVals.push(v);

  const grid = gridVals
    .map(
      (v) =>
        `<line x1="${PAD.left}" y1="${y(v).toFixed(1)}" x2="${W - PAD.right}" y2="${y(v).toFixed(1)}" stroke="#8888" stroke-width="0.5"/>` +
        `<text x="${PAD.left - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#888">${v}</text>`,
    )
    .join('');

  // Label every date if there is room, otherwise thin them out.
  const every = Math.max(1, Math.ceil(n / 10));
  const xLabels = points
    .map((p, i) =>
      i % every === 0 || i === n - 1
        ? `<text x="${x(i).toFixed(1)}" y="${H - PAD.bottom + 16}" text-anchor="middle" font-size="10" fill="#888">${esc(p.slice(5))}</text>`
        : '',
    )
    .join('');

  const body = series
    .map((s) => {
      if (kind === 'bar') {
        const bw = Math.max(2, (plotW / Math.max(n, 1)) * 0.6);
        return s.values
          .map((v, i) =>
            v == null
              ? ''
              : `<rect x="${(x(i) - bw / 2).toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(PAD.top + plotH - y(v)).toFixed(1)}" fill="${s.color}" opacity="0.85"/>`,
          )
          .join('');
      }
      // Break the path at gaps rather than interpolating across missing days —
      // a straight line through a day we have no data for would invent a
      // reading. Gaps in this dataset are meaningful (Search Console lag).
      const segments = [];
      let run = [];
      s.values.forEach((v, i) => {
        if (v == null) {
          if (run.length) segments.push(run);
          run = [];
        } else run.push([x(i), y(v)]);
      });
      if (run.length) segments.push(run);

      const paths = segments
        .map((seg) =>
          seg.length === 1
            ? `<circle cx="${seg[0][0].toFixed(1)}" cy="${seg[0][1].toFixed(1)}" r="3" fill="${s.color}"/>`
            : `<polyline points="${seg.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>`,
        )
        .join('');
      const dots = s.values
        .map((v, i) => (v == null ? '' : `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" fill="${s.color}"/>`))
        .join('');
      return paths + dots;
    })
    .join('');

  const legend = series.length > 1
    ? series
        .map((s, i) =>
          `<rect x="${PAD.left + i * 130}" y="${H - 12}" width="10" height="3" fill="${s.color}"/>` +
          `<text x="${PAD.left + i * 130 + 15}" y="${H - 8}" font-size="10" fill="#888">${esc(s.label)}</text>`,
        )
        .join('')
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui, -apple-system, sans-serif" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  <text x="${PAD.left}" y="14" font-size="13" font-weight="600" fill="#888">${esc(title)}</text>
  ${subtitle ? `<text x="${W - PAD.right}" y="14" text-anchor="end" font-size="10" fill="#999">${esc(subtitle)}</text>` : ''}
  ${grid}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + plotH}" stroke="#8888" stroke-width="1"/>
  <line x1="${PAD.left}" y1="${PAD.top + plotH}" x2="${W - PAD.right}" y2="${PAD.top + plotH}" stroke="#8888" stroke-width="1"/>
  ${body}
  ${xLabels}
  ${legend}
  <text x="10" y="${PAD.top + plotH / 2}" font-size="10" fill="#888" transform="rotate(-90 10 ${PAD.top + plotH / 2})" text-anchor="middle">${esc(yLabel)}</text>
</svg>
`;
}

const byDay = history.by_day;
const byObs = history.by_observation;
const num = (v) => (v === '' || v == null ? null : Number(v));

const charts = [
  {
    file: 'impressions-daily.svg',
    title: 'Search Console impressions per day',
    subtitle: 'gaps = days not yet published (reporting lag)',
    points: byDay.map((r) => r.date),
    yLabel: 'impressions',
    kind: 'bar',
    series: [{ label: 'impressions', color: '#4c8dd9', values: byDay.map((r) => num(r.gsc_impressions)) }],
  },
  {
    file: 'clicks-daily.svg',
    title: 'Search Console clicks per day',
    subtitle: 'gaps = days not yet published',
    points: byDay.map((r) => r.date),
    yLabel: 'clicks',
    kind: 'bar',
    series: [{ label: 'clicks', color: '#2fa37c', values: byDay.map((r) => num(r.gsc_clicks)) }],
  },
  {
    file: 'pageloads-daily.svg',
    title: 'Web analytics pageviews per day',
    subtitle: 'beacon-based; non-JS crawlers never appear',
    points: byDay.map((r) => r.date),
    yLabel: 'pageloads',
    series: [
      { label: 'human', color: '#4c8dd9', values: byDay.map((r) => num(r.human_pageloads)) },
      { label: 'bot-classified', color: '#c98b2e', values: byDay.map((r) => num(r.bot_pageloads)) },
    ],
  },
  {
    // The traffic-side organic KPI, charted on its own so it is never read off
    // the same axis as total pageloads — which is an order of magnitude larger
    // and dominated by our own testing.
    file: 'search-referred-daily.svg',
    title: 'Search-referred human pageloads — the organic traffic KPI',
    subtitle: 'a pageload is not a session',
    points: byDay.map((r) => r.date),
    yLabel: 'pageloads',
    kind: 'bar',
    series: [{ label: 'search-referred', color: '#2fa37c', values: byDay.map((r) => num(r.search_referred_human_pageloads)) }],
  },
  {
    file: 'search-referrals-by-engine.svg',
    title: 'Search-referred pageloads by engine',
    subtitle: 'Web analytics',
    points: byDay.map((r) => r.date),
    yLabel: 'pageloads',
    series: [
      { label: 'Google', color: '#4c8dd9', values: byDay.map((r) => num(r.google_referred_pageloads)) },
      { label: 'Bing', color: '#a06fd0', values: byDay.map((r) => num(r.bing_referred_pageloads)) },
      { label: 'other search', color: '#c98b2e', values: byDay.map((r) => num(r.other_search_pageloads)) },
    ],
  },
  {
    file: 'traffic-by-channel.svg',
    title: 'Human pageloads by acquisition channel',
    subtitle: 'direct = unattributed, not brand demand',
    points: byDay.map((r) => r.date),
    yLabel: 'pageloads',
    series: [
      { label: 'search', color: '#2fa37c', values: byDay.map((r) => num(r.search_referred_human_pageloads)) },
      { label: 'direct', color: '#8a8a8a', values: byDay.map((r) => num(r.direct_pageloads)) },
      { label: 'other referral', color: '#a06fd0', values: byDay.map((r) => num(r.other_referral_pageloads)) },
      { label: 'internal', color: '#c98b2e', values: byDay.map((r) => num(r.internal_pageloads)) },
    ],
  },
  {
    file: 'query-breadth.svg',
    title: 'Disclosed query breadth and topicality',
    subtitle: 'per observation date, not per calendar day',
    points: byObs.map((r) => r.observed_on),
    yLabel: 'queries',
    series: [
      { label: 'disclosed', color: '#4c8dd9', values: byObs.map((r) => num(r.disclosed_query_count)) },
      { label: 'on-topic', color: '#2fa37c', values: byObs.map((r) => num(r.on_topic_query_count)) },
    ],
  },
  {
    file: 'average-position.svg',
    title: 'Average position (lower is better)',
    subtitle: 'impression-weighted; noisy at small samples',
    points: byObs.map((r) => r.observed_on),
    yLabel: 'position',
    series: [{ label: 'avg position', color: '#c96f6f', values: byObs.map((r) => num(r.avg_position)) }],
  },
  {
    file: 'cluster-impressions.svg',
    title: 'Cumulative impressions by cluster',
    subtitle: 'per observation date',
    points: byObs.map((r) => r.observed_on),
    yLabel: 'impressions',
    series: [
      { label: 'vertical curve', color: '#4c8dd9', values: byObs.map((r) => num(r.vertical_curve_impressions)) },
      { label: 'SSD', color: '#2fa37c', values: byObs.map((r) => num(r.ssd_impressions)) },
    ],
  },
  {
    file: 'ranking-distribution.svg',
    title: 'Fixed-probe ranking distribution',
    subtitle: 'queries in top 20 / 10 / 3',
    points: byObs.map((r) => r.observed_on),
    yLabel: 'queries',
    series: [
      { label: 'top 20', color: '#4c8dd9', values: byObs.map((r) => num(r.serp_top_20)) },
      { label: 'top 10', color: '#2fa37c', values: byObs.map((r) => num(r.serp_top_10)) },
      { label: 'top 3', color: '#c98b2e', values: byObs.map((r) => num(r.serp_top_3)) },
    ],
  },
];

let written = 0;
const embeds = [];
for (const c of charts) {
  const hasData = c.series.some((s) => s.values.some((v) => v != null));
  if (!hasData) {
    embeds.push(`### ${c.title}\n\n_No data yet._\n`);
    continue;
  }
  writeText(join(CHART_DIR, c.file), chart(c));
  embeds.push(`### ${c.title}\n\n![${c.title}](./${c.file})\n\n${c.subtitle ? `_${c.subtitle}_\n` : ''}`);
  written++;
}

writeText(
  join(CHART_DIR, 'index.md'),
  `# SEO trend charts\n\n` +
    `Generated by \`scripts/seo/charts.mjs\` from \`docs/seo/data/history.json\`.\n` +
    `Regenerated wholesale on each run — do not hand-edit. Static SVG, no dependencies,\n` +
    `no hosted analytics.\n\n` +
    `Generated: ${history.generated_at}\n\n` +
    `> Charts sourced from Search Console and from web analytics represent **different\n` +
    `> windows**. Do not read across them as if they shared a timeline.\n\n` +
    embeds.join('\n'),
);

log(`Wrote ${written} chart(s) to docs/seo/data/charts/`);
