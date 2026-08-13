/// <reference types="vitest" />
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";
import { readdirSync, writeFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

function htmlEnvPlugin(): Plugin {
  return {
    name: "html-env",
    transformIndexHtml(html) {
      return html.replace(/%(\w+)%/g, (_, key) => process.env[key] || "");
    },
  };
}

function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const SITE_URL = "https://www.vibeops.ca";

      const staticRoutes = [
        "/",
        "/what-we-solve",
        "/what-we-solve/secure-ai",
        "/what-we-solve/document-production",
        "/what-we-solve/systems-integration",
        "/what-we-solve/internal-tools",
        "/what-we-solve/institutional-knowledge",
        "/what-we-solve/ai-governance",
        "/how-we-work",
        "/security",
        "/proof",
        "/contact",
        "/team",
        "/blog",
        "/privacy",
        "/terms",
      ];

      // Get blog slugs from blog files
      const blogsDir = path.resolve(__dirname, "src/pages/blogs");
      const blogFiles = readdirSync(blogsDir).filter((f) => f.endsWith(".mdx"));
      const blogRoutes = blogFiles.map(
        (f) => `/blog/${f.replace(".mdx", "")}`
      );

      const allRoutes = [...staticRoutes, ...blogRoutes];
      const today = new Date().toISOString().split("T")[0];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route.startsWith("/blog/") ? "0.7" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), sitemap);
      console.log("Sitemap generated successfully!");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mdx(),
    react(),
    mode === "development" && componentTagger(),
    htmlEnvPlugin(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**",
      ],
    },
  },
}));
