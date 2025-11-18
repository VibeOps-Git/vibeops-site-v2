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

export default function Blog() {
  const posts = getAllPosts();

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
      <div className="container mx-auto px-4 py-20 relative z-10">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="section-title py-1">Blog</h1>
          <p className="section-subtitle mx-auto">
            Practical examples and ideas from our prototypes, estimators, and automation tests.
          </p>
        </section>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="h-full">
                <Card className="h-full bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm line-clamp-3">
                      {post.excerpt || "Read more..."}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-md border border-border/80">
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  We&apos;re preparing valuable content for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our blog is being prepared with insightful articles about automation and civil
                  tools.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
