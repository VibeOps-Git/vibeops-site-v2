// src/pages/Blog.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts } from "@/lib/blogs";
import Aurora from "../components/Aurora";
import AnimatedContent from "../components/AnimatedContent";

export default function Blog() {
  const posts = getAllPosts();
  const hasPosts = posts && posts.length > 0;

  // --- Randomize featured post ---
  let featured = null as (typeof posts)[number] | null;
  let rest: typeof posts = [];

  if (hasPosts) {
    const featuredIndex = Math.floor(Math.random() * posts.length);
    featured = posts[featuredIndex];
    rest = posts.filter((_, i) => i !== featuredIndex);
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-page Aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
        <Aurora
          colorStops={["#00ffcc", "#4DD0E1", "#00ffcc"]}
          blend={0.45}
          amplitude={1.0}
          speed={0.6}
        />
      </div>

      {/* Foreground content */}
      <div className="container mx-auto px-4 py-20 relative z-10 space-y-16">
        {/* Hero */}
        <AnimatedContent
          distance={140}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.96}
          threshold={0.3}
        >
          <section className="text-center max-w-3xl mx-auto mb-4">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-primary/80 mb-3">
              LAB NOTES · VIBEOPS
            </p>
            <h1 className="section-title py-1">Blog</h1>
            <p className="section-subtitle mx-auto">
              Practical examples, implementation notes, and experiments from our
              prototypes, estimators, and automation tests.
            </p>
          </section>
        </AnimatedContent>

        {hasPosts ? (
          <>
            {/* Featured Post */}
            {featured && (
              <AnimatedContent
                distance={130}
                direction="vertical"
                duration={1}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.98}
                threshold={0.35}
              >
                <section className="max-w-5xl mx-auto">
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="block group featured-blog-card"
                  >
                    <div className="relative rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md overflow-hidden px-6 py-6 sm:px-10 sm:py-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                      {/* Gradient frame */}
                      <div className="pointer-events-none absolute inset-[1px] rounded-[22px] bg-gradient-to-r from-primary/10 via-background to-accent/10 opacity-60" />
                      <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 uppercase tracking-[0.2em] text-primary">
                              Featured
                            </span>
                            <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[0.65rem] tracking-[0.18em] text-muted-foreground">
                              Automation · Field-tested
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight group-hover:text-primary transition-colors">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                              {featured.excerpt}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground/80">
                            Click through for the full breakdown — screenshots,
                            edge cases, and what we&apos;d change next time.
                          </p>
                        </div>
                        {/* Right side visual */}
                        <div className="w-full md:w-[260px] lg:w-[300px] shrink-0">
                          <div className="relative h-32 sm:h-40 md:h-44 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-background to-accent/15 overflow-hidden">
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_0%,rgba(0,255,204,0.8),transparent_60%),radial-gradient(circle_at_80%_100%,rgba(77,208,225,0.8),transparent_60%)]" />
                            <div className="absolute inset-3 rounded-xl border border-primary/20 bg-background/40 backdrop-blur-sm flex flex-col justify-center px-4">
                              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                From the VibeOps Lab
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Real implementation notes — not marketing fluff.
                              </p>
                            </div>
                            {/* corner glow */}
                            <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>
              </AnimatedContent>
            )}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <section className="max-w-7xl mx-auto">
                <AnimatedContent
                  distance={90}
                  direction="vertical"
                  duration={0.9}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={0.98}
                  threshold={0.4}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                      All Posts
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {rest.length + 1} posts · experiments, estimators &amp;
                      internal tools
                    </p>
                  </div>
                </AnimatedContent>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {rest.map((post, index) => {
                    const badgeLabel =
                      index % 3 === 0
                        ? "Experiment"
                        : index % 3 === 1
                        ? "Playbook"
                        : "Field Note";

                    return (
                      <AnimatedContent
                        key={post.slug}
                        distance={80}
                        direction={index % 2 === 0 ? "vertical" : "horizontal"}
                        reverse={index % 4 === 1}
                        duration={0.85}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={0.95}
                        threshold={0.5}
                        delay={index * 0.06}
                      >
                        <Link
                          to={`/blog/${post.slug}`}
                          className="block h-full group"
                        >
                          <Card className="h-full bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/60 hover:-translate-y-1.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.6)] hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden blog-card">
                            {/* top accent line */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-accent/0 opacity-80" />
                            <CardHeader className="pb-3">
                                {/* removed slug text on the right to avoid weird overlay */}
                              <CardTitle className="text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="mt-2 text-xs sm:text-sm line-clamp-3">
                                {post.excerpt || "Read more..."}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      </AnimatedContent>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
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
            <div className="max-w-2xl mx-auto">
              <Card className="bg-card/80 backdrop-blur-md border border-border/80 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/10" />
                <CardHeader className="relative">
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    We&apos;re preparing valuable content for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground">
                    Our blog is being prepared with insightful articles about
                    automation, estimators, and the tools we&apos;re building
                    for civil and construction teams.
                  </p>
                </CardContent>
              </Card>
            </div>
          </AnimatedContent>
        )}
      </div>

      {/* Local micro-animations – shimmer removed, keep subtle float */}
      <style>{`
        @keyframes blogCardFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        .blog-card:hover {
          animation: blogCardFloat 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
