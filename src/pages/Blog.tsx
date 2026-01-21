// src/pages/Blog.tsx
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blogs";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";

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
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 px-4">
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="container mx-auto text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              Lab Notes
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Blog
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                    <VibeCard variant="gradient" className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#00ffcc]/40 bg-[#00ffcc]/10 px-3 py-1 uppercase tracking-[0.2em] text-[#00ffcc]">
                              Featured
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-semibold text-white group-hover:text-[#00ffcc] transition-colors">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="text-gray-400 max-w-xl">
                              {featured.excerpt}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Click for the full breakdown.
                          </p>
                        </div>
                        <div className="w-full md:w-[240px] shrink-0">
                          <div className="relative h-32 rounded-xl border border-white/10 bg-gradient-to-br from-[#00ffcc]/10 via-transparent to-transparent overflow-hidden">
                            <div className="absolute inset-4 flex flex-col justify-center">
                              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 mb-1">
                                From the Lab
                              </p>
                              <p className="text-xs text-gray-400">
                                Real implementation notes.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </VibeCard>
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
                    <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500">
                      All Posts
                    </h2>
                    <p className="text-xs text-gray-500">
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
                        <VibeCard variant="default" className="h-full">
                          <VibeCardHeader>
                            <VibeCardTitle className="text-base group-hover:text-[#00ffcc] transition-colors line-clamp-2">
                              {post.title}
                            </VibeCardTitle>
                            <VibeCardDescription className="mt-2 text-sm line-clamp-3">
                              {post.excerpt || "Read more..."}
                            </VibeCardDescription>
                          </VibeCardHeader>
                        </VibeCard>
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
                <VibeCard variant="glass">
                  <VibeCardHeader>
                    <VibeCardTitle>Coming Soon</VibeCardTitle>
                    <VibeCardDescription>
                      We're preparing valuable content for you.
                    </VibeCardDescription>
                  </VibeCardHeader>
                  <VibeCardContent>
                    <p className="text-gray-400">
                      Our blog is being prepared with insightful articles about
                      automation, estimators, and the tools we're building.
                    </p>
                  </VibeCardContent>
                </VibeCard>
              </div>
            </AnimatedContent>
          </section>
        )}
      </div>
    </div>
  );
}
