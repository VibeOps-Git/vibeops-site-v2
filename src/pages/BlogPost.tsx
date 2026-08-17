// src/pages/BlogPost.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getPostBySlug } from "@/lib/blogs";
import { SEO } from "@/components/SEO";
import AnimatedContent from "../components/AnimatedContent";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Always open at top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  // Toggle "back to top" button visibility
  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) {
    return (
      <>
        <SEO
          title="Post Not Found"
          description="The blog post you're looking for doesn't exist."
          noindex={true}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Post not found</h1>
            <p className="text-muted-foreground">
              The blog post you&apos;re looking for doesn&apos;t exist or was moved.
            </p>
            <Link to="/blog" className="btn-primary inline-block">
              Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.metaDescription}
        canonical={`https://www.vibeops.ca/blog/${slug}`}
        ogType="article"
        ogImage={post.ogImage}
      />
      <div className="relative min-h-screen bg-background">
        {/* Main content */}
        <AnimatedContent
          distance={120}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.4}
        >
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-3xl mx-auto space-y-12">
              {/* Header */}
              <header className="space-y-6">
                <Link
                  to="/blog"
                  className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  ← Back to all posts
                </Link>

                <div className="space-y-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                    VibeOps · Field Notes
                  </p>

                  <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-foreground">
                    {post.title}
                  </h1>

                  <div className="h-[2px] w-24 bg-primary rounded-full" />
                </div>
              </header>

              {/* Article */}
              <Card className="bg-card border border-border p-6 sm:p-10">
                <article className="blog-article prose max-w-none text-sm sm:text-base leading-relaxed tracking-[0.01em]">
                  <post.Content />
                </article>
              </Card>

              {/* Category anchor: a post is many visitors' first page, and the
                  archive skews toward document production. Say plainly who we
                  are so the post cannot be mistaken for the whole business. */}
              <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                  Who writes this
                </p>
                <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
                  VibeOps is the AI engineering team your firm hasn’t hired
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  We are civil engineers who write software. Architecture and
                  engineering firms bring us the problems they have no software team
                  to solve: AI on confidential project data, systems that don’t talk,
                  internal tools nobody sells, and oversight of AI-assisted work.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/what-we-solve"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    See what we solve
                  </Link>
                  <Link
                    to="/how-we-work"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    How we work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Back to Top button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-40 rounded-full p-3 sm:p-4 bg-primary text-primary-foreground border border-border shadow-sm hover:bg-primary/90 transition-all duration-300 flex items-center justify-center
          ${showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Local micro-animations */}
        <style>{`
          /* Fade + slide-in for article children */
          .blog-article > * {
            animation: fadeSlideIn 0.6s ease forwards;
            opacity: 0;
            transform: translateY(8px);
          }
          .blog-article > *:nth-child(1) { animation-delay: 0.05s; }
          .blog-article > *:nth-child(2) { animation-delay: 0.1s; }
          .blog-article > *:nth-child(3) { animation-delay: 0.15s; }
          .blog-article > *:nth-child(4) { animation-delay: 0.2s; }
          .blog-article > *:nth-child(5) { animation-delay: 0.25s; }

          @keyframes fadeSlideIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
