// src/lib/blogs.ts
import { ComponentType } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  /**
   * The compiled MDX body. Typed to accept MDX's `components` override map so
   * callers can remap intrinsic elements — BlogPost.tsx uses it to demote the
   * body's leading `# Title` from <h1> to <h2>, keeping one <h1> per page.
   * `ComponentType` alone rejects the prop, which vite does not catch because
   * it does not typecheck, but `tsc` and CI do.
   */
  Content: ComponentType<{ components?: Record<string, ComponentType<Record<string, unknown>>> }>;
  ogImage?: string;
};

interface BlogMeta {
  title: string;
  description: string;
  ogImage?: string;
}

interface BlogModule {
  default: ComponentType;
  meta: BlogMeta;
}

const blogModules = import.meta.glob<BlogModule>("../pages/blogs/*.mdx", {
  eager: true,
});

function slugifyFilename(filename: string): string {
  return filename
    .replace(/\.mdx$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const allPosts: BlogPost[] = Object.entries(blogModules).map(
  ([path, module]) => {
    const filename = path.split("/").pop() || "post.mdx";
    const slug = slugifyFilename(filename);
    const { meta, default: Content } = module;

    const excerpt =
      meta.description.slice(0, 220) +
      (meta.description.length > 220 ? "..." : "");

    return {
      slug,
      title: meta.title,
      metaDescription: meta.description,
      excerpt,
      Content,
      ogImage: meta.ogImage,
    };
  }
);

export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}
