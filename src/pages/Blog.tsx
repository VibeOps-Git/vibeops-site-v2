// src/pages/Blog.tsx
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blogs";
import { SEO } from "@/components/SEO";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";

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
    <>
      <SEO
        title="Lab Notes - Engineering Automation & AEC Workflow"
        description="Practical notes, implementation guides, and experiments in engineering report automation, building code compliance, and AEC workflow software."
        canonical="https://www.vibeops.ca/blog"
      />
      <div className="pt-24">
        {/* Hero */}
      <section className="py-20 px-4">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.15}
        >
          <div className="container mx-auto text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Lab Notes
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Notes from the lab
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Practical examples, implementation notes, and experiments from our
              prototypes, estimators, and automation tests.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      <div className="container mx-auto px-4 max-w-6xl pb-20">
        {hasPosts ? (
          <>
            {/* Featured Post */}
            {featured && (
              <section className="py-16">
                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  duration={0.7}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.3}
                >
                  <Link to={`/blog/${featured.slug}`} className="block group">
                    <div className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm transition-colors hover:border-primary/40">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="uppercase tracking-[0.2em] text-primary">
                              Featured
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="text-muted-foreground max-w-xl">
                              {featured.excerpt}
                            </p>
                          )}
                          <p className="text-sm text-primary font-medium">
                            Read the full breakdown
                          </p>
                        </div>
                        <div className="w-full md:w-[240px] shrink-0">
                          <div className="relative h-32 rounded-xl border border-border bg-secondary overflow-hidden">
                            <div className="absolute inset-4 flex flex-col justify-center">
                              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                From the Lab
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Real implementation notes.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedContent>
              </section>
            )}

            <SectionDivider />

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <section className="py-16">
                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  duration={0.7}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.3}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      All Posts
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {rest.length + 1} posts
                    </p>
                  </div>
                </AnimatedContent>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, index) => (
                    <AnimatedContent
                      key={post.slug}
                      distance={50}
                      direction="vertical"
                      duration={0.6}
                      ease="power3.out"
                      initialOpacity={0}
                      animateOpacity
                      threshold={0.3}
                      delay={index * 0.08}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block h-full group"
                      >
                        <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40">
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt || "Read more..."}
                          </p>
                        </div>
                      </Link>
                    </AnimatedContent>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="py-16">
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
            >
              <div className="max-w-xl mx-auto">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Coming soon</h3>
                  <p className="mt-2 text-muted-foreground">
                    We're preparing valuable content for you.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Our blog is being prepared with insightful articles about
                    automation, estimators, and the tools we're building.
                  </p>
                </div>
              </div>
            </AnimatedContent>
          </section>
        )}
        </div>
      </div>
    </>
  );
}
