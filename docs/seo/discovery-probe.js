/*
 * DISCOVERY probe — vibeops.ca.
 *
 * A SEPARATE instrument from probe.js. Read this before using it.
 *
 *   probe.js            the BENCHMARK. 48 queries, frozen once, never
 *                       changes. Measures the same thing every week so a trend
 *                       is real. Its whole value is that it can show us we were
 *                       wrong.
 *
 *   discovery-probe.js   this file. Reads an EVOLVING set from
 *                       discovery-queries.json. Measures what Google actually
 *                       associates with each page. Its set changes, so its
 *                       totals are NOT a trend series.
 *
 * The two never mix. Results land in different source blocks
 * (`serp_probe` vs `serp_discovery`) and are labelled separately in every
 * report. A discovery query is never promoted into the benchmark — doing so
 * retroactively would manufacture an improvement out of a query we already
 * ranked for.
 *
 * Why this exists: the benchmark was written from our own positioning, in the
 * vocabulary that came out of discovery interviews with AE professionals. That
 * is a deliberate bet on intent match over search volume, and it may be wrong.
 * Search Console will eventually disclose the queries Google ACTUALLY shows
 * these pages for, and where those diverge from the benchmark, the divergence
 * is the finding. Discovery queries are how that divergence gets measured
 * without touching the frozen set.
 *
 * On roadway.tools this instrument was built after exactly that happened: a page
 * took 121 impressions while ranking for none of its 17 benchmark queries,
 * because every query Google showed it for was conceptual and every benchmark
 * query was transactional. Expect the same class of surprise here.
 *
 * Seed a discovery query only from EVIDENCE — a query Search Console disclosed,
 * or a phrase a real prospect used. Never from a guess; that is what the
 * benchmark already is.
 */

// __DISCOVERY_QUERIES__ — generated; do not hand-edit.
const DISCOVERY_QUERIES = [

];

function domainsInOrder(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const seen = [];
  for (const a of doc.querySelectorAll('a[href]')) {
    let h = a.getAttribute('href');
    if (h.startsWith('/url?q=')) h = decodeURIComponent(h.slice(7).split('&')[0]);
    if (!h.startsWith('http')) continue;
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
  for (const q of queries) {
    try {
      const r = await fetch(
        'https://www.google.com/search?num=20&q=' + encodeURIComponent(q),
        { credentials: 'include' },
      );
      const d = domainsInOrder(await r.text());
      const i = d.indexOf('vibeops.ca');
      rows.push({ q, pos: i >= 0 ? i + 1 : 0, top3: d.slice(0, 3).join(', ') });
    } catch {
      rows.push({ q, pos: -1, top3: 'ERROR' });
    }
    await new Promise((res) => setTimeout(res, 1400));
    if (typeof window !== 'undefined' && window.__voDiscovery) window.__voDiscovery.done_count++;
  }
  return rows;
}

// Detached, for the same reason probe.js is: the run exceeds the timeout of an
// agent's JS-evaluation boundary, so awaiting it at the top level loses the
// result even though the probe completed.
window.__voDiscovery = {
  done: false,
  done_count: 0,
  total: DISCOVERY_QUERIES.length,
  result: null,
  error: null,
};

(async () => {
  try {
    const rows = await probe(DISCOVERY_QUERIES);
    const errors = rows.filter((r) => r.pos === -1).length;
    const ranked = rows.filter((r) => r.pos > 0);
    console.log(
      `Discovery: ${ranked.length}/${rows.length} in top 20 · ` +
        `${rows.filter((r) => r.pos > 0 && r.pos <= 10).length} top 10 · ` +
        `${rows.filter((r) => r.pos > 0 && r.pos <= 3).length} top 3` +
        (errors ? ` · ${errors} ERRORED — re-run before recording` : ''),
    );
    window.__voDiscovery.result = { probed_at: new Date().toISOString(), errors, rows };
  } catch (e) {
    window.__voDiscovery.error = String(e);
  } finally {
    window.__voDiscovery.done = true;
  }
})();

`discovery probe started — ${DISCOVERY_QUERIES.length} queries. Poll window.__voDiscovery.done`;
