// scripts/routes.mjs
//
// The single source of truth for "which URLs does this site have".
//
// Three things need this list and they must never disagree: the sitemap
// generator in vite.config.ts, the prerenderer in scripts/prerender.mjs, and
// the SEO system's docs/seo/config.json. Before this file existed the list was
// inline in vite.config.ts under a comment calling it the "prerender route
// list", which it was not — nothing prerendered, it only generated the sitemap.
// That gap is exactly the kind of thing a shared module prevents.

import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

export const SITE_URL = 'https://www.vibeops.ca';

/** Routes defined by the router, in navigation order. */
export const STATIC_ROUTES = [
  '/',
  '/what-we-solve',
  '/what-we-solve/secure-ai',
  '/what-we-solve/document-production',
  '/what-we-solve/systems-integration',
  '/what-we-solve/internal-tools',
  '/what-we-solve/institutional-knowledge',
  '/what-we-solve/ai-governance',
  '/how-we-work',
  '/security',
  '/proof',
  '/contact',
  '/team',
  '/blog',
  '/privacy',
  '/terms',
];

/** Blog routes, derived from the .mdx files so a new post is never forgotten. */
export function blogRoutes() {
  return readdirSync(resolve(ROOT, 'src/pages/blogs'))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => `/blog/${f.replace('.mdx', '')}`)
    .sort();
}

export function allRoutes() {
  return [...STATIC_ROUTES, ...blogRoutes()];
}
