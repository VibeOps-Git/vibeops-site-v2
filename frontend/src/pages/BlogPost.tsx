// src/pages/BlogPost.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getPostBySlug } from "@/lib/blogs";
import Aurora from "../components/Aurora";
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
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">
            The blog post you&apos;re looking for doesn&apos;t exist or was moved.
          </p>
          <Link to="/blog" className="btn-primary inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
        <Aurora
          colorStops={["#00ffcc", "#4DD0E1", "#00ffcc"]}
          blend={0.45}
          amplitude={1.0}
          speed={0.6}
        />
      </div>

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
                className="text-xs uppercase tracking-[0.22em] text-primary/80 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                ← Back to all posts
              </Link>

              <div className="space-y-3">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground/80">
                  VibeOps · Field Notes
                </p>

                <h1 className="text-4xl md:text-5xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-primary/80 to-white/90 drop-shadow-xl">
                  {post.title}
                </h1>

                <div className="h-[2px] w-24 bg-gradient-to-r from-primary/60 to-accent/40 rounded-full" />
              </div>
            </header>

            {/* Article */}
            <Card className="bg-card/70 backdrop-blur-md border border-border/80 p-6 sm:p-10 relative overflow-hidden blogpost-card">
              {/* Glow accents */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 opacity-60" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 bg-primary/10 blur-[90px] rounded-full" />
              <div className="pointer-events-none absolute -left-10 -bottom-20 h-48 w-48 bg-accent/10 blur-[100px] rounded-full" />

              <article
                className="blog-article prose prose-invert max-w-none text-sm sm:text-base leading-relaxed tracking-[0.01em]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Card>
          </div>
        </div>
      </AnimatedContent>

      {/* Back to Top button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-40 rounded-full p-3 sm:p-4 bg-primary/20 backdrop-blur-md border border-primary/40 text-primary shadow-[0_0_20px_rgba(0,255,204,0.25)] hover:shadow-[0_0_35px_rgba(0,255,204,0.45)] hover:bg-primary/30 transition-all duration-300 flex items-center justify-center
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

        .blogpost-card {
          transition: box-shadow 0.4s ease, transform 0.4s ease;
        }
        .blogpost-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 28px 60px rgba(0,0,0,0.55);
        }
      `}</style>
    </div>
  );
}
