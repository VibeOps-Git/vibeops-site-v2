// src/pages/Team.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import Aurora from "../components/Aurora";
import AnimatedContent from "../components/AnimatedContent";

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  image: string;
  email: string;
  bio: string;
};

const foundingTeam: TeamMember[] = [
  {
    name: "Zander Dent",
    role: "Founder & CEO",
    focus: "Civil Engineering Workflows",
    image: "/team/zander.JPG",
    email: "zander@vibeops.ca",
    bio: `Civil engineering student turned software founder, focused on killing manual reporting in consulting firms. Zander leads product vision and works directly with engineers and partners to make sure Reportly fits real project workflows, not theoretical ones.`,
  },
  {
    name: "Hrudai Rajesh",
    role: "Co-Founder & COO",
    focus: "Implementation & Delivery",
    image: "/team/rudy.jpeg",
    email: "hrudai@vibeops.ca",
    bio: `Hrudai coordinates delivery, timelines, and implementation so firms can adopt automation without disrupting active projects. From onboarding templates to rollout across teams, he makes sure changes are controlled, traceable, and predictable.`,
  },
  {
    name: "Eric Balanecki",
    role: "Co-Founder & CTO",
    focus: "Architecture & Automation Engine",
    image: "/team/eric.jpg",
    email: "eric@vibeops.ca",
    bio: `Eric leads the technical architecture behind Reportly’s automation engine—from template parsing to document generation. He focuses on reliability, versioning, and making sure the system behaves like real infrastructure, not a toy app.`,
  },
  {
    name: "Felix Stewart",
    role: "Co-Founder & Head of Sales",
    focus: "Strategy & Partnerships",
    image: "/team/felix.png",
    email: "felix@vibeops.ca",
    bio: `Felix works with principals and firm leaders to map the business upside of automation—time saved, risk reduced, and new services unlocked. He helps translate “we waste time on reports” into concrete ROI and partnership structures.`,
  },
  {
    name: "Gabriel Comla",
    role: "Co-Founder & CMO",
    focus: "Storytelling for Engineers",
    image: "/team/gabe.jpeg",
    email: "gabriel@vibeops.ca",
    bio: `Gabe makes sure the story stays grounded in reality: engineers, projects, and outcomes. He helps communicate what VibeOps actually does for firms—less formatting, fewer errors, and more time spent on real engineering.`,
  },
];

const advisoryBoard: TeamMember[] = [
  {
    name: "Dr. Tamara Etmannski",
    role: "Advisor · Entrepreneurship & Engineering Leadership",
    focus: "Innovation, pedagogy, and venture building",
    image: "/team/tamara.jpeg",
    email: "tamara.etmannski@ubc.ca",
    bio: `Assistant Professor of Teaching in Civil Engineering and Co-Director of Environmental Engineering at UBC. Tamara advises VibeOps on venture strategy, leadership, and making sure our tools actually support how students and practitioners learn, work, and adopt new tech.`,
  },
  {
    name: "Dr. Noboru Yonemitsu",
    role: "Advisor · Hydrotechnical & Design Education",
    focus: "Hydrotechnical workflows & civil design",
    image: "/team/nobo.jpg",
    email: "noboru@civil.ubc.ca",
    bio: `Associate Professor of Teaching in Hydrotechnical Engineering at UBC with decades of experience across research, consulting, and teaching CIVL design projects. Nobo guides VibeOps on real project workflows, technical rigor, and how automation can fit cleanly into existing QA processes.`,
  },
  // Future advisors can be added back here when confirmed
];

export default function Team() {
  const [heroLoaded, setHeroLoaded] = useState(false);

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
      <div className="container mx-auto px-4 py-20 relative z-10 space-y-20">
        {/* Hero */}
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.3}
        >
          <section className="max-w-5xl mx-auto text-center">
            <h1 className="section-title py-1">
              Your Civil Engineering Software Team
            </h1>
            <p className="section-head py-1">
              Built by engineers, for engineers. We’re modernizing civil
              engineering workflows by automating the reporting work nobody
              went to school for.
            </p>
          </section>
        </AnimatedContent>

        {/* Full-width banner image with smoother load */}
        <AnimatedContent
          distance={90}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.3}
        >
          <section className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-[28px] border border-border bg-background/40 backdrop-blur-sm">
              {/* Skeleton / shimmer while big image loads */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  heroLoaded
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 animate-pulse"
                }`}
              >
                <div className="h-full w-full bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-900/70" />
              </div>

              <img
                src="/team/full-team-pic.png"
                alt="VibeOps founding team"
                loading="lazy"
                decoding="async"
                onLoad={() => setHeroLoaded(true)}
                className={`
                  w-full
                  h-[320px]
                  sm:h-[360px]
                  md:h-[460px]
                  lg:h-[540px]
                  object-cover
                  object-center
                  transition-all
                  duration-700
                  ease-out
                  will-change-transform
                  ${
                    heroLoaded
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-[1.04] blur-sm"
                  }
                `}
              />

              {/* Top subtle depth overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

              {/* Bottom fade: from about halfway down to the bottom */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{
                  height: "55%",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(5,10,20,0.7) 40%, rgb(5,10,20) 100%)",
                }}
              />

              {/* Caption + CTA */}
              <div className="absolute inset-x-4 md:inset-x-8 bottom-6 md:bottom-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="text-left drop-shadow-sm">
                  <p className="text-[0.65rem] md:text-xs uppercase tracking-[0.25em] text-muted-foreground/90">
                    VibeOps Technologies Inc.
                  </p>
                  <p className="text-lg md:text-2xl lg:text-3xl font-semibold text-foreground">
                    Automating civil engineering workflows in an aging industry.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center justify-center px-6 py-2 text-sm md:text-base"
                >
                  Talk to the Team
                </Link>
              </div>
            </div>
          </section>
        </AnimatedContent>

        {/* Context */}
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.35}
        >
          <section className="max-w-4xl mx-auto text-center">
            <p className="text-lg mb-4 text-muted-foreground">
              We’ve seen firsthand how much time civil engineers lose to copying
              between Word and Excel, fixing broken templates, and wrestling
              with formatting when specs change mid-project.
            </p>
            <p className="text-lg text-muted-foreground">
              VibeOps exists so engineers can spend their time on{" "}
              <span className="font-semibold text-foreground">
                design, analysis, and judgment
              </span>
              —not on document gymnastics. Our focus is simple:{" "}
              <span className="font-semibold text-foreground">
                automate civil engineering report generation, safely and
                on-brand.
              </span>
            </p>
          </section>
        </AnimatedContent>

        {/* Founding Team */}
        <section className="max-w-6xl mx-auto">
          <AnimatedContent
            distance={70}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.4}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">Founding Team</h2>
                <p className="text-sm text-muted-foreground">
                  Five founders, one goal: make civil engineering firms faster,
                  sharper, and less bogged down in paperwork.
                </p>
              </div>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foundingTeam.map((member, idx) => (
              <AnimatedContent
                key={member.email}
                distance={60}
                direction="vertical"
                duration={0.75}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.97}
                threshold={0.45}
                delay={idx * 0.05}
              >
                <TeamCard member={member} />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.75}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={0.97}
              threshold={0.45}
              delay={foundingTeam.length * 0.05}
            >
              <JoinCard
                title="Join the Team"
                subtitle="We’re always looking for engineers, builders, and operators who want to ship real infrastructure tools."
                ctaLabel="Work with VibeOps"
                ctaHref="/contact"
              />
            </AnimatedContent>
          </div>
        </section>

        {/* Advisory Board */}
        <section className="max-w-6xl mx-auto">
          <AnimatedContent
            distance={70}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.4}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">Advisory Board</h2>
                <p className="text-sm text-muted-foreground">
                  Seasoned educators and engineers who help us align Reportly
                  with real-world civil workflows, leadership, and engineering
                  education.
                </p>
              </div>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisoryBoard.map((advisor, idx) => (
              <AnimatedContent
                key={advisor.email}
                distance={60}
                direction="vertical"
                duration={0.75}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.97}
                threshold={0.45}
                delay={idx * 0.05}
              >
                <TeamCard member={advisor} />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.75}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={0.97}
              threshold={0.45}
              delay={advisoryBoard.length * 0.05}
            >
              <JoinCard
                title="Become an Advisor"
                subtitle="Interested in shaping how civil engineering firms adopt automation? We’d love to talk."
                ctaLabel="Talk about advising"
                ctaHref="/contact"
              />
            </AnimatedContent>
          </div>
        </section>

        {/* Our Vibe / CTA */}
        <AnimatedContent
          distance={90}
          direction="vertical"
          duration={0.85}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.4}
        >
          <section className="max-w-5xl mx-auto">
            <div className="bg-card/80 border border-border rounded-2xl p-8 md:p-10 grid gap-8 md:grid-cols-[1.5fr,1fr] items-center backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-bold mb-3">Our Vibe</h2>
                <p className="text-muted-foreground mb-4">
                  We’re not trying to be a generic AI platform. We’re focused on
                  one thing: automating civil and construction engineering
                  reports using the templates firms already trust.
                </p>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <p className="font-semibold mb-1">Mission</p>
                    <p className="text-muted-foreground">
                      Modernize civil engineering workflows so engineers spend
                      more time engineering, not formatting.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <p className="font-semibold mb-1">Expertise</p>
                    <p className="text-muted-foreground">
                      Report automation, template parsing, civil-specific
                      workflows, and integrations that respect existing QA and
                      branding standards.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4">
                <p className="text-sm text-muted-foreground">
                  Curious what Reportly would look like with your firm’s
                  templates and reports?
                </p>
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Book a Report Workflow Review
                </Link>
                <p className="text-xs text-muted-foreground">
                  Bring a real report, a template, and 30 minutes. We’ll walk
                  through how much of it can be automated today—and what’s next.
                </p>
              </div>
            </div>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group bg-card/60 border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-accent/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border border-accent/40 bg-background/50 mb-4">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <h3 className="text-lg md:text-xl font-semibold">{member.name}</h3>
      <p className="text-muted-foreground mt-1 text-sm font-medium">
        {member.role}
      </p>
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground mt-1">
        {member.focus}
      </p>
      <p className="text-sm text-muted-foreground mt-4">{member.bio}</p>
      <a
        href={`mailto:${member.email}`}
        className="py-5 text-[0.7rem] uppercase tracking-[0.22em] mt-1 font-medium text-accent hover:underline"
      >
        {member.email}
      </a>
    </article>
  );
}

function JoinCard({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <article className="bg-card/40 border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <p className="text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        We’re Growing
      </p>
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">{subtitle}</p>
      <Link
        to={ctaHref}
        className="btn-primary inline-flex items-center justify-center px-5 py-2 text-sm"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
