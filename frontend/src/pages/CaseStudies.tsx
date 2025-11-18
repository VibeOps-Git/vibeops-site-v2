import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Aurora from "../components/Aurora";

type Review = {
  name: string;
  role: string;
  context: string;
  quote: string;
  image: string;
};

const reviews: Review[] = [
  {
    name: "Steve Lisle",
    role: "CEO & Founder, Effortlo",
    context: "Automated Outlook follow-up system for missed leads",
    quote:
      "VibeOps built an Outlook follow-up system that flags leads I haven’t replied to and reminds me to re-engage. They were extremely professional and incredibly fast on both communication and turnaround.",
    image: "/clients/steve.png",
  },
  {
    name: "Ryan Snair",
    role: "Owner, Pro Painting LLC",
    context: "Landing page for Pro Painting LLC",
    quote:
      "They created a clean, effective landing page for my painting business that makes it easy for customers to understand what we do and reach out. The process was smooth, responsive, and dialed in to what I actually needed.",
    image: "/clients/ryan.png",
  },
];

const REPORTLY_LOGIN_URL =
  import.meta.env.VITE_REPORTLY_LOGIN_URL || "http://localhost:5014/reportly";

const openReportly = () => {
  window.open(REPORTLY_LOGIN_URL, "_blank", "noopener,noreferrer");
};

const legacyWebProjects = [
  {
    title: "Castaway Crew – Desktop",
    caption: "Bold, conversion-focused landing page for a boat cleaning business in Minnesota.",
    youtubeId: "trIZD2Lwe4s",
    link: "https://www.castawaycrewmn.com/",
  },
  {
    title: "Castaway Crew – Mobile",
    caption: "Mobile-first experience that keeps booking effortless on small screens.",
    youtubeId: "eJlnI9NCQuU",
    link: "https://www.castawaycrewmn.com/",
  },
  {
    title: "EaZy Visuals",
    caption: "Dynamic, high-contrast site for a visual media and content studio.",
    youtubeId: "ArMIzD2MoeY",
    link: "https://www.eazy-visuals.com/",
  },
];

export default function CaseStudies() {
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
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="section-title">Client Outcomes &amp; Case Studies</h1>
          <p className="section-subtitle mx-auto">
            A snapshot of how teams use VibeOps to do business faster.
          </p>
        </section>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* Outcomes Summary / Coming Soon */}
          <Card className="border-2 bg-card/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl">Case Studies in Progress</CardTitle>
              <CardDescription className="text-base">
                We&apos;re actively documenting live deployments and pilots with our partners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Most of our work today is with engineering, and construction teams who
                want to automate reporting, follow-ups, and documentation without hiring a full-time
                developer. Our upcoming deep-dive case studies will walk through real projects,
                from initial pain points to automated workflows and long-term impact.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="font-semibold mb-1">Civil &amp; Construction</p>
                  <p className="text-muted-foreground">
                    Report and template automation, dashboards, and focused internal tools around
                    existing workflows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews section with avatars */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What Our Clients Say</h2>
              <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                Real feedback from teams we&apos;ve helped with automation and software — the same
                level of support your team will get.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <Card
                  key={idx}
                  className="bg-card/80 backdrop-blur-md border border-border/80 hover:border-primary/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-20 rounded-full overflow-hidden border border-border/60 bg-background/60">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm">{review.name}</CardTitle>
                        <CardDescription className="text-[0.7rem] uppercase tracking-[0.18em]">
                          {review.role}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-[0.75rem] text-primary/80 font-medium tracking-[0.16em] uppercase">
                      {review.context}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Longer-form, named case studies are coming soon as we wrap pilots and get formal
              approvals — but the workflows are live today.
            </p>
          </section>

          {/* Legacy web projects as visual proof */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Selected Past Web Projects</h2>
              <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                Before specializing in report automation and civil tooling, we shipped marketing and
                brand sites for small businesses. These projects show the level of polish we bring
                to internal tools, dashboards, and client-facing flows today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {legacyWebProjects.map((proj) => (
                <Card
                  key={proj.title}
                  className="bg-card/70 backdrop-blur-md border border-border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="pt-4 space-y-3">
                    {/* Clickable thumbnail that opens YouTube in a new tab */}
                    <a
                      href={`https://www.youtube.com/watch?v=${proj.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden group relative"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${proj.youtubeId}/hqdefault.jpg`}
                        alt={proj.title}
                        className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1">
                          <span className="inline-block h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-white" />
                          <span className="text-xs font-medium text-white">Watch demo</span>
                        </div>
                      </div>
                    </a>

                    <div>
                      <h3 className="font-semibold text-sm mb-1">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{proj.caption}</p>
                      <div className="flex flex-col gap-1 text-xs">
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary/80 underline underline-offset-4"
                        >
                          View live site →
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Like what you see here? We apply the same care to tools your clients never see but
              your team uses every day.
            </p>
          </section>

          {/* Demos – clearly basic examples */}
          <Card className="bg-card/60 backdrop-blur-md border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Basic Demo Tools</CardTitle>
              <CardDescription className="text-base">
                These are simple, non-production demos built to show how we think about workflows —
                not the full VibeOps / Reportly experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/construction-tracker"
                  className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <h3 className="font-bold mb-1">Construction Tracker</h3>
                  <p className="text-sm text-muted-foreground">
                    A basic view of how construction tasks, schedules, and dependencies can live in
                    a single interface.
                  </p>
                </a>
                <a
                  href="/ai-report-generator"
                  className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <h3 className="font-bold mb-1">Reportly-Style Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    A stripped-down example of filling parts of a report template from structured
                    inputs instead of manual copy-paste.
                  </p>
                </a>
                <a
                  href="/pipeline"
                  className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <h3 className="font-bold mb-1">Pipeline Estimator</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple pipeline cost and configuration demo to illustrate engineering
                    calculators.
                  </p>
                </a>
                <a
                  href="/roof-demo"
                  className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <h3 className="font-bold mb-1">Roofing Estimator</h3>
                  <p className="text-sm text-muted-foreground">
                    Lightweight address-based estimating example, showing how we can wrap logic in a
                    clean UI.
                  </p>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                For real projects, we connect to your templates, data sources, and QA processes —
                not these sandbox tools.
              </p>
            </CardContent>
          </Card>

          {/* Funnels */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-3">Try Reportly With Your Templates</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Log in or create an account to start generating reports using the Word and Excel
                templates your team already relies on.
              </p>
              <button
                onClick={openReportly}
                className="btn-primary inline-block text-base px-6 py-2.5"
              >
                Try Reportly
              </button>
            </div>

            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-3">Become Our Next Case Study</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                If you&apos;re considering a custom automation or dashboard build, we can scope a
                pilot with a clear before/after and measurable time savings for your team.
              </p>
              <a
                href="/contact"
                className="inline-block rounded-lg border border-border px-6 py-2.5 text-base hover:border-primary/60 hover:text-primary transition-colors"
              >
                Book a Custom Software Call
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
