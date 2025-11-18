// src/pages/BlogPost.tsx
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getPostBySlug } from "@/lib/blogs";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">
            The blog post you&apos;re looking for doesn&apos;t exist or was
            moved.
          </p>
          <Link to="/blog" className="btn-primary inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            VibeOps Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {post.title}
          </h1>
          <Link
            to="/blog"
            className="text-sm text-primary underline underline-offset-4"
          >
            ← Back to all posts
          </Link>
        </header>

        <div className="blog-wrapper">
          <Card className="no-blog-border">
            <article
              className="blog-article text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />          
          </Card>
        </div>
      </div>
    </div>
  );
}
