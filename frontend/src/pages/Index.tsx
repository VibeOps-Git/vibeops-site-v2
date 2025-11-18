// src/pages/Index.tsx

import React from "react";
import Aurora from "../components/Aurora";
import AnimatedContent from "../components/AnimatedContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-page Aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
        <Aurora
          colorStops={["#00ffcc", "#0092b7", "#00ffcc"]}
          blend={0.45}
          amplitude={1.0}
          speed={0.6}
        />
      </div>

      {/* Foreground content */}
      <div className="container mx-auto px-4 py-20 relative z-10 space-y-20">
        {/* Top section: hero + image */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
          {/* Hero */}
          <AnimatedContent
            distance={120}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.25}
          >
            <div className="relative overflow-hidden rounded-[28px] border border-border bg-[rgb(5,10,20)]/90 p-6 md:p-8 lg:p-10 backdrop-blur-md">
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  ABOUT VIBEOPS
                </p>
                <h1 className="section-title mb-4">
                  From Civil Engineering Spreadsheets to{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Report Automation Infrastructure
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
                  VibeOps is a small team of engineer-founders building tools
                  that turn manual reporting into stable, auditable automation —
                  starting with <span className="font-semibold">Reportly</span>,
                  our engine for generating Word and PDF deliverables from the
                  templates firms already use.
                </p>
                <p className="text-muted-foreground max-w-2xl mb-8">
                  We grew out of civil engineering coursework, consulting
                  internships, and side projects where we kept seeing the same
                  pattern: brilliant engineers spending late nights fixing
                  headings, page breaks, and references in client reports.
                  VibeOps exists to remove that drag, without forcing firms to
                  rebuild their entire tech stack.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild className="btn-primary">
                    <a href="/contact">Book a Vibe Check</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/70 bg-background/60"
                  >
                    <a href="/case-studies">See Client Outcomes</a>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Vertical team image */}
          <AnimatedContent
            distance={120}
            direction="vertical"
            reverse
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.25}
            delay={0.1}
          >
            <Card className="bg-card/70 border border-border/70 overflow-hidden shadow-xl shadow-black/30">
              <div className="relative h-[420px] sm:h-[500px] md:h-[560px] lg:h-[640px]">
                <img
                  src="/team/team-2.jpg"
                  alt="VibeOps founding team"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <p className="font-semibold tracking-[0.16em] uppercase">
                      The VibeOps Team
                    </p>
                    <p className="text-muted-foreground max-w-xs">
                      Engineer-operators building automation that behaves like
                      infrastructure, not a toy app.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[0.7rem] tracking-[0.16em] uppercase text-primary">
                    Reportly · VibeOps
                  </span>
                </div>
              </div>
            </Card>
          </AnimatedContent>
        </section>

        {/* What we actually do */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedContent
            distance={80}
            direction="vertical"
            duration={0.9}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.96}
            threshold={0.3}
          >
            <Card className="bg-card/70 border border-border/70">
              <CardHeader>
                <CardTitle className="text-base">Reportly Engine</CardTitle>
                <CardDescription>
                  The core automation layer for your existing templates.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We plug into the Word and Excel templates your teams already
                  trust, then wire them to structured data — from spreadsheets,
                  databases, or APIs.
                </p>
                <p>
                  The output looks exactly like what you send clients today,
                  just generated in minutes instead of hours.
                </p>
              </CardContent>
            </Card>
          </AnimatedContent>

          <AnimatedContent
            distance={80}
            direction="vertical"
            duration={0.9}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.96}
            threshold={0.3}
            delay={0.08}
          >
            <Card className="bg-card/70 border border-border/70">
              <CardHeader>
                <CardTitle className="text-base">
                  Civil &amp; Infrastructure DNA
                </CardTitle>
                <CardDescription>
                  Built by people who actually read drawings and specs.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Our background spans civil engineering, transportation,
                  geotechnical, and construction workflows — not just SaaS
                  demos.
                </p>
                <p>
                  That means we design around real constraints: QA sign-off,
                  sealed documents, audit trails, and client-specific quirks.
                </p>
              </CardContent>
            </Card>
          </AnimatedContent>

          <AnimatedContent
            distance={80}
            direction="vertical"
            duration={0.9}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.96}
            threshold={0.3}
            delay={0.16}
          >
            <Card className="bg-card/70 border border-border/70">
              <CardHeader>
                <CardTitle className="text-base">Custom Internal Tools</CardTitle>
                <CardDescription>
                  Light dashboards and calculators around your core reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Once reporting is automated, we help teams wrap it with simple
                  interfaces: quote calculators, status dashboards, and internal
                  portals that stay close to reality.
                </p>
                <p>
                  No “one more platform” bloat — just focused tools for your
                  project managers and engineers.
                </p>
              </CardContent>
            </Card>
          </AnimatedContent>
        </section>

        {/* How we work */}
        <section className="max-w-5xl mx-auto">
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.97}
            threshold={0.3}
          >
            <Card className="bg-card/70 border border-border/70">
              <CardHeader>
                <CardTitle>How We Work With Teams</CardTitle>
                <CardDescription>
                  Small, opinionated, and focused on getting one important
                  workflow right at a time.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  duration={0.8}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={0.98}
                  threshold={0.4}
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">
                      01 · Discovery
                    </p>
                    <p className="font-medium text-foreground">
                      Start from real deliverables
                    </p>
                    <p>
                      We review example reports, templates, and existing
                      spreadsheets to understand how work actually gets done —
                      not just the “ideal” process.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  duration={0.8}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={0.98}
                  threshold={0.4}
                  delay={0.08}
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">
                      02 · Prototype
                    </p>
                    <p className="font-medium text-foreground">
                      Wire up a thin slice
                    </p>
                    <p>
                      We build and demo a narrow but end-to-end flow: ingest
                      data, generate a real report, and walk it through your
                      review and QA process.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  duration={0.8}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={0.98}
                  threshold={0.4}
                  delay={0.16}
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">
                      03 · Rollout
                    </p>
                    <p className="font-medium text-foreground">
                      Expand carefully, not chaotically
                    </p>
                    <p>
                      Once the first workflow is trusted, we extend to more
                      templates and teams, with proper versioning, access
                      control, and documentation.
                    </p>
                  </div>
                </AnimatedContent>
              </CardContent>
            </Card>
          </AnimatedContent>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto">
          <AnimatedContent
            distance={90}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.97}
            threshold={0.35}
          >
            <Card className="bg-gradient-to-r from-primary/10 via-card to-accent/10 border border-primary/30">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">
                  Want Your Next Report to Be the Last One You Build by Hand?
                </CardTitle>
                <CardDescription className="text-base">
                  We usually start with one painful template — monitoring
                  reports, bridge inspections, dam instrumentation summaries, or
                  similar — and prove out the value there.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button asChild className="btn-primary px-8">
                  <a href="/contact">Book a Vibe Check</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border/70 bg-background/70"
                >
                  <a href="/services">See What We Build</a>
                </Button>
              </CardContent>
            </Card>
          </AnimatedContent>
        </section>
      </div>
    </div>
  );
};

export default Index;
