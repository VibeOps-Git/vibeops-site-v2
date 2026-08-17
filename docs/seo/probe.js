/*
 * Fixed SERP probe — vibeops.ca weekly review.
 *
 * Run from the page context of an open google.com tab in the attached Chrome
 * session. Reports the position of the first vibeops.ca result for each query
 * in the fixed set, or 0 if it is not in the top 20.
 *
 * This file is version-controlled so the measurement stays identical week to
 * week. If it has to change, note the change in that week's report — a
 * methodology change breaks comparability with every prior week.
 *
 * The MEASUREMENT here is carried over unchanged from the roadway.tools probe
 * that has been in weekly use since 2026-08-10: same fetch, same URL shape,
 * same parse, same 1400 ms pacing. Only the query set and the target domain
 * differ. That matters because the pacing and the parse were both arrived at by
 * hitting real failures, described below.
 *
 * Limitation, restated in every report: results are personalised and
 * geolocated, and this scripted read has disagreed with the rendered SERP by
 * 6 places on the same query on the same day, because the rendered DOM mixes in
 * People Also Ask and image-block links. Trend signal only. Search Console is
 * authoritative and wins every disagreement.
 *
 * DO NOT EDIT THE QUERY ARRAY BY HAND. It is generated from
 * docs/seo/queries.json by `npm run seo:sync-probe`, and scripts/seo/verify.mjs
 * fails the daily run if the two drift apart.
 */

/* --- BEGIN GENERATED QUERIES (npm run seo:sync-probe) --- */
const QUERIES = [
  { q: 'vibeops', cluster: 'sitewide' },
  { q: 'vibeops ca', cluster: 'sitewide' },
  { q: 'vibeops technologies', cluster: 'sitewide' },
  { q: 'vibeops engineering', cluster: 'sitewide' },
  { q: 'ai engineering team for ae firms', cluster: 'sitewide' },
  { q: 'ai consultant for engineering firms', cluster: 'sitewide' },
  { q: 'ai consulting architecture engineering', cluster: 'sitewide' },
  { q: 'forward deployed engineer consulting', cluster: 'sitewide' },
  { q: 'ai adoption for engineering firms', cluster: 'sitewide' },
  { q: 'private ai for engineering firms', cluster: 'secure-ai' },
  { q: 'secure ai confidential project data', cluster: 'secure-ai' },
  { q: 'ai on confidential client data', cluster: 'secure-ai' },
  { q: 'self hosted ai for engineering firm', cluster: 'secure-ai' },
  { q: 'ai data residency engineering firm', cluster: 'secure-ai' },
  { q: 'it approval for ai engineering firm', cluster: 'secure-ai' },
  { q: 'ai without training on our data', cluster: 'secure-ai' },
  { q: 'engineering report automation', cluster: 'document-production' },
  { q: 'automated engineering reports', cluster: 'document-production' },
  { q: 'civil engineering report automation', cluster: 'document-production' },
  { q: 'ai engineering report writing', cluster: 'document-production' },
  { q: 'engineering document automation software', cluster: 'document-production' },
  { q: 'ai report generation for engineering firms', cluster: 'document-production' },
  { q: 'specification automation engineering', cluster: 'document-production' },
  { q: 'engineering software integration', cluster: 'systems-integration' },
  { q: 'aec software integration services', cluster: 'systems-integration' },
  { q: 'connect engineering software systems', cluster: 'systems-integration' },
  { q: 'bim systems integration consultant', cluster: 'systems-integration' },
  { q: 'civil 3d custom integration', cluster: 'systems-integration' },
  { q: 'procore custom integration development', cluster: 'systems-integration' },
  { q: 'custom software for engineering firms', cluster: 'internal-tools' },
  { q: 'custom internal tools engineering firm', cluster: 'internal-tools' },
  { q: 'software development for aec firms', cluster: 'internal-tools' },
  { q: 'bespoke software architecture engineering firm', cluster: 'internal-tools' },
  { q: 'custom dashboard for engineering firm', cluster: 'internal-tools' },
  { q: 'field data capture app engineering', cluster: 'internal-tools' },
  { q: 'replace spreadsheet with custom software engineering', cluster: 'internal-tools' },
  { q: 'engineering document search ai', cluster: 'institutional-knowledge' },
  { q: 'search past engineering projects', cluster: 'institutional-knowledge' },
  { q: 'institutional knowledge engineering firm', cluster: 'institutional-knowledge' },
  { q: 'ai document intelligence construction', cluster: 'institutional-knowledge' },
  { q: 'engineering drawing search software', cluster: 'institutional-knowledge' },
  { q: 'knowledge management for aec firms', cluster: 'institutional-knowledge' },
  { q: 'ai governance for engineering firms', cluster: 'ai-governance' },
  { q: 'ai oversight engineering deliverables', cluster: 'ai-governance' },
  { q: 'ai audit trail engineering', cluster: 'ai-governance' },
  { q: 'ai quality control engineering firm', cluster: 'ai-governance' },
  { q: 'ai policy for engineering firms', cluster: 'ai-governance' },
  { q: 'stamping ai generated engineering work', cluster: 'ai-governance' },
];
/* --- END GENERATED QUERIES --- */

const TARGET_DOMAIN = 'vibeops.ca';

const CLUSTER_LABELS = {
  sitewide: 'Sitewide, brand and category',
  'secure-ai': 'AI on confidential data',
  'document-production': 'Document production',
  'systems-integration': 'Systems integration',
  'internal-tools': 'Custom internal software',
  'institutional-knowledge': 'Institutional knowledge',
  'ai-governance': 'AI governance and oversight',
};

/**
 * Pull result hostnames out of the raw SERP html in the order they appear.
 *
 * Deliberately reads hrefs from the raw response rather than querying the
 * rendered DOM. The rendered DOM interleaves People Also Ask and image blocks,
 * which do not represent organic position and were the source of the 6-place
 * disagreement noted above. Google, gstatic and schema.org hosts are dropped
 * because they are chrome, not results.
 */
function domainsInOrder(html) {
  const seen = [];
  for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    const h = m[1];
    let d;
    try {
      d = new URL(h).hostname.replace(/^www\./, '');
    } catch {
      continue;
    }
    if (/google\.|gstatic|schema\.org/.test(d)) continue;
    if (!seen.includes(d)) seen.push(d);
  }
  return seen;
}

async function probe(queries) {
  const rows = [];
  for (const { q, cluster } of queries) {
    try {
      const r = await fetch(
        'https://www.google.com/search?num=20&q=' + encodeURIComponent(q),
        { credentials: 'include' },
      );
      const d = domainsInOrder(await r.text());
      const i = d.indexOf(TARGET_DOMAIN);
      // Comma-separated, not pipe: this string goes straight into a markdown
      // table cell and pipes would split it into extra columns.
      rows.push({ q, cluster, pos: i >= 0 ? i + 1 : 0, top3: d.slice(0, 3).join(', ') });
    } catch {
      rows.push({ q, cluster, pos: -1, top3: 'ERROR' });
    }
    // Pacing. Too fast and Google starts returning empty result sets, which
    // silently reads as "position 0" and corrupts the week's numbers. This is
    // the single most important line in the file.
    await new Promise((res) => setTimeout(res, 1400));
    if (typeof window !== 'undefined' && window.__voProbe) window.__voProbe.done_count++;
  }
  return rows;
}

function toMarkdown(title, rows) {
  const lines = ['| Query | Pos | Top competitors |', '|---|---|---|'];
  for (const r of rows) lines.push(`| ${r.q} | ${r.pos} | ${r.top3} |`);
  const ranked = rows.filter((r) => r.pos > 0);
  return (
    `### ${title}\n\n` +
    lines.join('\n') +
    `\n\nIn top 20: ${ranked.length}/${rows.length}` +
    ` · top 10: ${rows.filter((r) => r.pos > 0 && r.pos <= 10).length}` +
    ` · top 3: ${rows.filter((r) => r.pos > 0 && r.pos <= 3).length}\n`
  );
}

// Usage: run from the page context of an open google.com tab.
//
// The run is started DETACHED and its state published on `window.__voProbe`,
// because 48 queries at 1400 ms is roughly 70 s, which exceeds the timeout of
// the JS-evaluation boundary used to run this from an agent session. Awaiting
// the whole run at the top level times out and loses the result even though the
// probe itself completed.
//
// Poll `window.__voProbe.done`, then read `.result`. Progress is `.done_count`
// of `.total`. A human in devtools sees no difference: the markdown still
// prints via console.log when it finishes.
//
// `.result.rows` is the payload for scripts/seo/ingest-serp.mjs, which computes
// movement against the previous probe and writes it into the daily snapshot.
// `.result.markdown` is for pasting into the weekly report.
window.__voProbe = {
  done: false,
  done_count: 0,
  total: QUERIES.length,
  result: null,
  error: null,
};

(async () => {
  try {
    const rows = await probe(QUERIES);
    const errors = rows.filter((r) => r.pos === -1).length;
    const order = Object.keys(CLUSTER_LABELS);
    const markdown =
      order
        .map((c) => [c, rows.filter((r) => r.cluster === c)])
        .filter(([, rs]) => rs.length)
        .map(([c, rs]) => toMarkdown(CLUSTER_LABELS[c], rs))
        .join('\n') +
      (errors ? `\n**${errors} queries errored — re-run before recording.**\n` : '');
    console.log(markdown);
    window.__voProbe.result = {
      probed_at: new Date().toISOString(),
      target_domain: TARGET_DOMAIN,
      errors,
      markdown,
      rows,
    };
  } catch (e) {
    window.__voProbe.error = String(e);
  } finally {
    window.__voProbe.done = true;
  }
})();

`probe started — ${QUERIES.length} queries at 1400 ms pacing, ~${Math.round(QUERIES.length * 1.4)} s. Poll window.__voProbe.done`;
