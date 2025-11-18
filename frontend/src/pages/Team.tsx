// src/pages/Team.tsx (or wherever this lives)

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
  {
    name: "Dr. Puyan A. Zadeh",
    role: "Advisor · Project & Construction Innovation",
    focus: "BIM, VDC, and construction innovation workflows",
    image: "/team/puyan.jpeg",
    email: "info@pyramooninnovations.com",
    bio: `Building innovation specialist, founder of Pyramoon Innovations, and Research Associate with UBC’s Project & Construction Management group. Puyan advises VibeOps on BIM-based coordination, IPD/Lean practices, and how AI-driven tools can plug into real AECO and VDC workflows.`,
  },
  {
    name: "Dr. Yahya Nazhat",
    role: "Advisor · Geotechnical & Computational Tools",
    focus: "Geotechnical design and CIVL computational workflows",
    image: "/team/nazhat.jpg",
    email: "ynazhat@civil.ubc.ca",
    bio: `Lecturer in Geotechnical Engineering at UBC with decades of industry experience on major infrastructure projects. Nazhat supports VibeOps on geotechnical workflows, ground improvement and foundation design, and how automation can respect existing CIVL 303/410/445 computational practices.`,
  },
];

export default function Team() {
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
          distance={120}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.96}
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

        {/* Full-width banner image with extended fade into background */}
        <AnimatedContent
          distance={140}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.98}
          threshold={0.35}
        >
          <section className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-[28px] border border-border bg-background/40 backdrop-blur-sm">
              <img
                src="/team/full-team-pic.png"
                alt="VibeOps founding team"
                className="
                  w-full
                  h-[360px]
                  md:h-[480px]
                  lg:h-[560px]
                  object-cover
                  object-center
                "
              />

              {/* Top subtle depth overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

              {/* Bottom fade: from about halfway down to the bottom */}
              <div
                className="
                  pointer-events-none
                  absolute inset-x-0 bottom-0
                "
                style={{
                  height: "55%",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(5,10,20,0.7) 40%, rgb(5,10,20) 100%)",
                }}
              />

              {/* Caption + CTA */}
              <div
                className="
                  absolute inset-x-4 md:inset-x-8 
                  bottom-6 md:bottom-10 
                  flex flex-col md:flex-row md:items-end md:justify-between 
                  gap-4
                "
              >
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
          distance={100}
          direction="vertical"
          duration={0.9}
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
            distance={80}
            direction="vertical"
            duration={0.9}
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
                distance={70}
                direction="vertical"
                duration={0.85}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.96}
                threshold={0.45}
                delay={idx * 0.06}
              >
                <TeamCard member={member} />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={70}
              direction="vertical"
              duration={0.85}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={0.96}
              threshold={0.45}
              delay={foundingTeam.length * 0.06}
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
            distance={80}
            direction="vertical"
            duration={0.9}
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
                distance={70}
                direction="vertical"
                duration={0.85}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.96}
                threshold={0.45}
                delay={idx * 0.06}
              >
                <TeamCard member={advisor} />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={70}
              direction="vertical"
              duration={0.85}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={0.96}
              threshold={0.45}
              delay={advisoryBoard.length * 0.06}
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
          distance={100}
          direction="vertical"
          duration={1}
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
