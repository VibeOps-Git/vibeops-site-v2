// src/lib/blogs.ts
export type BlogPost = {
  slug: string;
  title: string;
  content: string;  // full HTML body only
  excerpt: string;
  metaDescription: string;
  ogImage?: string;
};

const blogModules = import.meta.glob("../pages/blogs/*.html", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

function slugifyFilename(filename: string): string {
  return filename
    .replace(/\.html$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pull out <body>…</body>
function extractBodyHtml(fullHtml: string): string {
  const match = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Fallback if file somehow has no <body>
  return fullHtml.trim();
}

// Only used for EXCERPT, not for `content`
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Use <title>, then <h1>, then filename
function extractTitle(fullHtml: string, fallback: string): string {
  const titleMatch = fullHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch?.[1]) return titleMatch[1].trim();

  const h1Match = fullHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match?.[1]) return h1Match[1].trim();

  return fallback;
}

// Extract meta description from HTML head
function extractMetaDescription(fullHtml: string, fallback: string): string {
  // Try name="description" content="..."
  const match = fullHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (match?.[1]) return match[1].trim();

  // Try content="..." name="description" (alternate order)
  const altMatch = fullHtml.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  if (altMatch?.[1]) return altMatch[1].trim();

  return fallback;
}

// Extract og:image from HTML head
function extractOgImage(fullHtml: string): string | undefined {
  const match = fullHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (match?.[1]) return match[1].trim();

  // Try content first (alternate order)
  const altMatch = fullHtml.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  if (altMatch?.[1]) return altMatch[1].trim();

  return undefined;
}

const allPosts: BlogPost[] = Object.entries(blogModules).map(
  ([path, fullHtml]) => {
    const filename = path.split("/").pop() || "post.html";
    const slug = slugifyFilename(filename);
    const bodyHtml = extractBodyHtml(fullHtml);
    const title = extractTitle(fullHtml, filename.replace(/\.html$/i, ""));
    const excerptPlain = stripHtml(bodyHtml);
    const excerpt =
      excerptPlain.slice(0, 220) + (excerptPlain.length > 220 ? "..." : "");
    const metaDescription = extractMetaDescription(fullHtml, excerpt);
    const ogImage = extractOgImage(fullHtml);

    return {
      slug,
      title,
      content: bodyHtml, // ⬅ important: body HTML, not stripped
      excerpt,
      metaDescription,
      ogImage,
    };
  }
);

export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}
