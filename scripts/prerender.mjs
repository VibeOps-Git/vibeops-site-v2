#!/usr/bin/env node
/**
 * Post-build prerenderer.
 *
 *   node scripts/prerender.mjs   (runs automatically as part of `npm run build`)
 *
 * WHY THIS EXISTS
 *
 * Before this, every URL on vibeops.ca served a byte-identical copy of
 * dist/index.html: same md5, the fallback <title>, zero <a> tags. Measured
 * 2026-08-17. On a crawler's first pass — before it decides whether a URL is
 * worth the expense of rendering — all 28 URLs looked like the same page.
 * Search Console agreed independently, reporting 5 pages as "Duplicate without
 * user-selected canonical".
 *
 * Google does execute JavaScript, so the site was indexed anyway. But rendering
 * is a separate, slower, rationed queue: it delays indexing, spends crawl budget
 * on apparent duplicates, and makes every per-page title, description and
 * canonical invisible on first contact.
 *
 * This walks the real routes in a real browser and writes what React actually
 * produced to dist/<route>/index.html. Vercel serves a matching static file
 * before falling through to the SPA rewrite, so those URLs now return real HTML.
 *
 * WHY PLAYWRIGHT RATHER THAN A PRERENDER PLUGIN
 *
 * Playwright is already a devDependency here for the e2e tests, so this adds no
 * new dependency and no new browser download. react-snap and
 * vite-plugin-prerender would each pull in their own puppeteer.
 *
 * WHAT IS DELIBERATELY NOT DONE
 *
 * The client still mounts with createRoot, not hydrateRoot. Hydration would be
 * the textbook choice, but this app reads window.matchMedia, localStorage and
 * scroll position during render, so hydration mismatches are close to certain
 * and a mismatch degrades into a silent client re-render anyway. createRoot
 * clears and re-renders, which costs a frame and buys total safety. The SEO
 * benefit is identical either way: it lives entirely in the bytes we serve.
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allRoutes } from './routes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4179;

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[prerender] dist/index.html not found. Run the build first.');
  process.exit(1);
}

/* ------------------------------------------------------- static server --- */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

// Mirrors the Vercel rewrite: try the filesystem, otherwise serve the SPA shell.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const candidate = join(DIST, path);
  let file = null;
  if (extname(path) && existsSync(candidate)) file = candidate;
  else if (existsSync(join(candidate, 'index.html'))) file = join(candidate, 'index.html');
  else file = join(DIST, 'index.html');
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

/* ------------------------------------------------------------- render --- */

const { chromium } = await import('@playwright/test');

await new Promise((r) => server.listen(PORT, r));

/**
 * Launch chromium, installing it first if the binary is absent.
 *
 * Vercel installs devDependencies, so @playwright/test is present on the
 * builder, but the BROWSER BINARIES are a separate download that only
 * `playwright install` fetches. Without this the build gets past bundling and
 * dies at the first launch() with "Executable doesn't exist".
 *
 * Done here rather than in the build script so a local run stays fast: the
 * install is attempted only when the launch actually fails, and locally the
 * browser is already there from the e2e suite. On Vercel it costs one download
 * on a cold cache.
 *
 * Deliberately NOT wrapped in a fallback that skips prerendering. Shipping the
 * un-prerendered shell is the exact regression this whole script exists to
 * prevent, so if the browser cannot be obtained the build must fail.
 */
async function launchChromium() {
  try {
    return await chromium.launch();
  } catch (err) {
    if (!/Executable doesn't exist|please run|browserType.launch/i.test(String(err.message))) throw err;
    console.log('[prerender] chromium not present, installing it (expected on a cold CI builder)…');
    const { execFileSync } = await import('node:child_process');
    execFileSync('npx', ['--yes', 'playwright', 'install', 'chromium'], { stdio: 'inherit' });
    return await chromium.launch();
  }
}

const browser = await launchChromium();

// Light colour scheme so the theme script does not stamp class="dark" into
// every prerendered file. See the stripping step below, which is the actual
// guarantee — this only reduces how much there is to strip.
const context = await browser.newContext({
  colorScheme: 'light',
  viewport: { width: 1280, height: 900 },
  userAgent: 'VibeOpsPrerender/1.0 (+https://www.vibeops.ca)',
});

const routes = allRoutes();
const results = [];
let failures = 0;

for (const route of routes) {
  const page = await context.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 45000 });

    // Wait for React to have produced something. The shell is what we are
    // trying to stop shipping, so an empty #root is a failure, not a result.
    await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, { timeout: 20000 });
    await page.waitForFunction(() => document.title && !/^VibeOps \| The AI Engineering Team for Architecture/.test(document.title) || true, { timeout: 1000 }).catch(() => {});

    // Scroll the whole page so every framer-motion `whileInView` reveal fires.
    // Without this, everything below the fold is captured mid-animation at
    // opacity: 0 — present in the DOM, but written into the file as invisible.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    const html = await page.evaluate(() => {
      // 1. Never bake in the theme. The no-flash script in index.html adds
      //    class="dark" from localStorage or the OS preference. Captured into a
      //    static file it becomes everyone's theme, and the inline script has no
      //    code path that removes it — a light-mode visitor would get a dark
      //    page. This is the single most important line in the file.
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('style');

      // 2. Clear animation end-state that framer-motion left inline. Anything
      //    still at opacity 0 or mid-transform would ship that way.
      for (const el of document.querySelectorAll('[style]')) {
        const s = el.getAttribute('style') ?? '';
        if (/opacity:\s*0(\.\d+)?\s*(;|$)/.test(s) || /filter:\s*blur/.test(s)) {
          el.style.removeProperty('opacity');
          el.style.removeProperty('filter');
          el.style.removeProperty('transform');
          if (!el.getAttribute('style')) el.removeAttribute('style');
        }
      }

      // 3. Drop the scroll spacer's fixed-overlay hero state. It is a
      //    scroll-position artifact, meaningless in a static file.
      for (const el of document.querySelectorAll('[data-testid="hero-device-stage"] [style*="opacity"]')) {
        el.style.removeProperty('opacity');
      }

      return '<!doctype html>\n' + document.documentElement.outerHTML;
    });

    const title = await page.title();
    const outDir = route === '/' ? DIST : join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);

    results.push({ route, bytes: html.length, title });
  } catch (err) {
    failures++;
    results.push({ route, error: String(err.message).split('\n')[0].slice(0, 120) });
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

/* ------------------------------------------------------------ report --- */

const ok = results.filter((r) => !r.error);
const titles = new Set(ok.map((r) => r.title));

console.log(`\n[prerender] ${ok.length}/${routes.length} routes written to dist/`);
console.log(`[prerender] ${titles.size} distinct <title> across ${ok.length} pages`);

for (const r of results.filter((x) => x.error)) {
  console.error(`[prerender] FAILED ${r.route}: ${r.error}`);
}

// The whole point was to stop shipping one page under many URLs. If the output
// still has one title everywhere, prerendering ran but achieved nothing, and
// that must fail the build rather than quietly ship.
if (ok.length > 1 && titles.size === 1) {
  console.error('[prerender] FAILED: every prerendered page has an identical <title>. React did not produce per-route markup.');
  process.exit(1);
}
if (failures) {
  console.error(`[prerender] ${failures} route(s) failed.`);
  process.exit(1);
}
console.log('[prerender] done\n');
