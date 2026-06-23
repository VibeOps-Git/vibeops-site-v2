// src/pages/Team.tsx

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";

type TeamMember = {
  name: string;
  role: string;
  focus?: string;
  image: string;
  email: string;
  bio?: string;
  linkedin?: string;
  headline?: string;
  hideContact?: boolean;
  owns?: string[];
  experience?: string[];
  previouslyAt?: string[];
};

const coFounders: TeamMember[] = [
  {
    name: "Zander Dent",
    role: "CEO & Co-Founder",
    focus: "Civil Engineering Workflows",
    image: "/team/zander-optimized.jpg",
    email: "zander@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/zander-dent/",
    bio: `Hey, I'm Zander. I started out in civil engineering at a City and saw just how much of the job was manual, repetitive work. I picked up software through freelancing in university, then landed my first engineering job in consulting, which is where I got hooked on helping clients fix their tools. VibeOps grew out of that.`,
    owns: ["Product", "Investor relations", "Customer discovery", "Design"],
    experience: [
      "Sales (5+ yrs)",
      "Municipal Engineering",
      "Software Engineering (@ Civil Firm)",
      "1st Place, UBC Civil Engineering Capstone 2026",
    ],
  },
  {
    name: "Félix Stewart",
    role: "Co-Founder & Co-Owner",
    focus: "Founding Team",
    image: "/team/felix-optimized.jpg",
    email: "felix@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/felix-stewart-67007219a/",
    bio: `Civil engineer and one of the people who helped get VibeOps off the ground. Félix holds an ownership stake but isn't part of the day-to-day team. Active development is led by Zander and Omair.`,
    experience: [
      "Geotechnical Engineering",
      "Advanced Structural Engineering",
      "Geosciences",
      "1st Place, UBC Civil Engineering Capstone 2026",
    ],
  },
  {
    name: "Qazi Omair Ahmed",
    role: "CTO & Co-Founder",
    focus: "Systems Design & Product Delivery",
    image: "/team/omair-optimized.jpg",
    email: "omair@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/qazi-omair-ahmed/",
    bio: `Omair builds the stack our product runs on. He started his first company at 16, got EB-1A approved at 20, and has shipped production AI systems at some serious places. He's the reason the hard parts actually work.`,
    owns: ["Architecture", "Parsing", "AI", "Deployment"],
    experience: [
      "Founded Fazper at 16 - scaled to $350K annual revenue",
      "3 peer-reviewed AI/ML papers · 310+ citations · 2 Clarivate Hot Papers",
      "Built production AI/data systems across xAI, Scale AI, and UBC CS",
    ],
  },
];

const contributors: TeamMember[] = [
  {
    name: "Olivia Butkus",
    role: "Contributor · Marketing Associate",
    focus: "Social Media, Marketing & Community",
    image: "/team/olivia-optimized.jpg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/olivia-butkus-712489310/",
    bio: `Olivia runs our social media, marketing, and community work. She's an Industrial Engineering student at the University of Wisconsin-Madison and likes mixing the creative side with the problem-solving side to help us grow.`,
  },
  {
    name: "Sofia Gibb",
    role: "Contributor · Marketing & Social Media",
    focus: "Brand, Marketing & Engagement",
    image: "/team/sofia.jpeg",
    email: "team@vibeops.ca",
    bio: `Sofia helps lead our marketing and social media, working to grow our brand presence and engagement. She's an Economics student with a Business Certificate at the University of Wisconsin-Madison, and she brings creativity, adaptability, and a strong work ethic to everything she takes on.`,
  },
  {
    name: "Edmund Zhang",
    role: "Contributor · Creative & Video",
    focus: "Content, Media & Growth",
    image: "/team/edmund.jpeg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/edmund-zhang-business/",
    bio: `Edmund handles our media and turns technical work into things people actually want to watch. Demos, promo content, the story of what we're building. That's him.`,
  },
  {
    name: "Sam Khalil",
    role: "Contributor · Sales & Outreach",
    focus: "Sales, Partnerships & Growth",
    image: "/team/sam.jpg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/sam-khalil-41ab6635b/",
    bio: `Sam is a Civil Engineering student at the University of Waterloo who runs a lot of our sales and outreach. He's good at building relationships and spotting where we can grow, and he keeps the engineering side and the business side talking to each other.`,
  },
  {
    name: "Gabriel Comla",
    role: "Co-Founder",
    image: "/team/gabriel-optimized.jpg",
    email: "gabriel@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/gabrielcomla/",
    hideContact: true,
  },
  {
    name: "Hrudai Rajesh",
    role: "Co-Founder",
    image: "/team/hrudai-optimized.jpg",
    email: "hrudai@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/hrudai-rajesh/",
    hideContact: true,
  },
  {
    name: "Eric Balanecki",
    role: "Co-Founder",
    image: "/team/eric-optimized.jpg",
    email: "eric@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/eric-balanecki/",
    hideContact: true,
  },
];

const advisoryBoard: TeamMember[] = [
  {
    name: "Dr. Tamara Etmannski",
    role: "Advisor · Entrepreneurship & Engineering Leadership",
    focus: "Innovation, pedagogy, and venture building",
    image: "/team/tamara.jpeg",
    email: "tamara.etmannski@ubc.ca",
    linkedin: "https://www.linkedin.com/in/tamara-r-e-2180632b/",
    bio: `Assistant Professor of Teaching in Civil Engineering and Co-Director of Environmental Engineering at UBC. Tamara helps us with strategy and leadership, and keeps us honest about whether our tools actually fit how students and practitioners learn and work.`,
  },
  {
    name: "Dr. Noboru Yonemitsu",
    role: "Advisor · Hydrotechnical & Design Education",
    focus: "Hydrotechnical workflows & civil design",
    image: "/team/nobo.jpg",
    email: "noboru@civil.ubc.ca",
    bio: `Associate Professor of Teaching in Hydrotechnical Engineering at UBC, with decades across research, consulting, and teaching CIVL design projects. Nobo keeps us grounded in how real projects run and where automation fits into existing QA without breaking it.`,
  },
  {
    name: "Hassan Pardawalla",
    role: "Advisor · Operations & Scaling",
    focus: "Culture, frameworks & operational scaling",
    image: "/team/hassan.jpeg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/hassanpardawalla/",
    bio: `Operations executive and fractional COO who helps SMBs and Series A/B startups grow without falling apart. With an Executive MBA and 20+ years building the systems and culture behind that growth, Hassan advises us on operations, go-to-market, and how to scale without breaking things.`,
  },
];

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('member');
    if (!name) return;
    const all = [...coFounders, ...contributors, ...advisoryBoard];
    const match = all.find((m) => m.name === decodeURIComponent(name));
    if (match) setSelectedMember(match);
  }, [searchParams]);

  return (
    <>
      <SEO
        title="Meet the Team"
        description="Meet the civil engineers and software builders behind Reportly and VibeOps. Built from 200+ discovery calls with AE firms across Canada."
        canonical="https://www.vibeops.ca/team"
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-16 px-4">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.15}
        >
          <div className="container mx-auto text-center max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Our Team
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              The People Building Your Tools
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We build software for engineering and construction teams: reports,
              dashboards, field data tools, and internal apps that fit how you
              actually work.
            </p>
          </div>
        </AnimatedContent>
      </section>

      {/* Team Image Banner */}
      <section className="px-4 pb-16">
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={1.0}
          ease="power2.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.15}
        >
          <div className="container mx-auto max-w-6xl">
            <div
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              data-testid="team-banner"
            >
              <TeamBannerImage />

              {/* Scrim so overlaid text stays readable over the photo in both themes */}
              <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              <div className="px-5 pb-5 pt-4 md:hidden">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                    VibeOps Technologies Inc.
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    Software for engineering teams.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Talk to the team
                </Link>
              </div>

              <div className="absolute inset-x-8 bottom-8 hidden flex-row items-end justify-between gap-4 md:flex">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-1">
                    VibeOps Technologies Inc.
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    Software for engineering teams.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Talk to the team
                </Link>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Context */}
      <section className="py-16 px-4">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.7}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.3}
        >
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground mb-4">
              We've watched engineering teams lose hours to repetitive documentation,
              manual data entry, scattered tools, and workflows that haven't changed in decades.
            </p>
            <p className="text-muted-foreground">
              VibeOps exists to build{" "}
              <span className="font-semibold text-foreground">focused software</span>{" "}
              that fits real workflows, so teams spend more time on actual engineering
              and less time fighting their tools.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Co-Founders */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <div className="mb-10">
              <p className="text-muted-foreground text-sm">
                The core team behind VibeOps and Reportly.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coFounders.map((member, idx) => (
              <AnimatedContent
                key={`${member.name}-${idx}`}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.08}
              >
                <TeamCard member={member} />
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Contributors</h2>
              <p className="text-muted-foreground text-sm">
                People who helped build and shape VibeOps along the way.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((member, idx) => (
              <AnimatedContent
                key={`${member.name}-${idx}`}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.08}
              >
                <TeamCard member={member} contactEmail="team@vibeops.ca" />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={contributors.length * 0.08}
            >
              <JoinCard
                title="Join the team"
                subtitle="We're after engineers and builders who want to ship real tools, not slideware."
                ctaLabel="Work with us"
                ctaHref="/contact"
              />
            </AnimatedContent>
          </div>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Advisory Board */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Advisory Board</h2>
              <p className="text-muted-foreground text-sm">
                Educators and engineers who keep us aligned with real civil workflows.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisoryBoard.map((advisor, idx) => (
              <AnimatedContent
                key={`${advisor.name}-${idx}`}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.08}
              >
                <TeamCard
                  member={advisor}
                  onPhotoOpen={() => setSelectedMember(advisor)}
                  contactEmail="team@vibeops.ca"
                />
              </AnimatedContent>
            ))}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={advisoryBoard.length * 0.08}
            >
              <JoinCard
                title="Become an advisor"
                subtitle="Help shape how civil engineering firms adopt automation."
                ctaLabel="Talk about advising"
                ctaHref="/contact"
              />
            </AnimatedContent>
          </div>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <div className="rounded-2xl border border-border bg-card shadow-sm p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-3">How we work</h2>
                  <p className="text-muted-foreground mb-6">
                    We build software for engineering teams: reports, dashboards,
                    workflow tools, and internal apps. One focused solution at a time.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div className="rounded-xl border border-border bg-secondary p-4">
                      <p className="font-semibold text-foreground mb-1">Mission</p>
                      <p className="text-muted-foreground">
                        Make engineering teams faster with software that fits real workflows.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary p-4">
                      <p className="font-semibold text-foreground mb-1">What we do</p>
                      <p className="text-muted-foreground">
                        Report generation, dashboards, data pipelines, and custom internal tools.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="text-sm text-muted-foreground">
                    Need software built for your team?
                  </p>
                  <Link
                    to="/contact"
                    className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Talk to the team
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Bring your workflow. We'll build the software around it.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>
      </div>
            <ProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}

function TeamCard({
  member,
  onOpen,
  onPhotoOpen,
  contactEmail,
}: {
  member: TeamMember;
  onOpen?: () => void;
  onPhotoOpen?: () => void;
  contactEmail?: string;
}) {
  const contactHref = `/contact?mode=email&contact=${encodeURIComponent(contactEmail ?? member.email)}`;

  return (
    <div className="group h-full p-6 flex flex-col items-center text-center rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40">
      {onPhotoOpen ? (
        <button
          type="button"
          onClick={onPhotoOpen}
          className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-primary/40 bg-secondary mb-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background"
          aria-label={`Open ${member.name} profile`}
        >
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        </button>
      ) : (
        <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-primary/40 bg-secondary mb-4">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
      <p className="text-muted-foreground mt-1 text-sm font-medium">{member.role}</p>

      {member.focus && (
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-primary font-medium mt-2">
          {member.focus}
        </p>
      )}

      {member.bio && (
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          {member.bio}
        </p>
      )}

      {(member.owns || member.experience || member.previouslyAt) && (
        <div className="mt-5 w-full text-left space-y-5">
          {member.owns && (
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground font-semibold mb-2">Owns</p>
              <p className="text-sm text-foreground leading-relaxed">{member.owns.join(" · ")}</p>
            </div>
          )}

          {member.experience && (
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground font-semibold mb-2">Experience</p>
              <ul className="space-y-1.5 text-sm text-foreground">
                {member.experience.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {member.previouslyAt && (
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground font-semibold mb-2">Previously At</p>
              <p className="text-sm text-foreground leading-relaxed">{member.previouslyAt.join(" · ")}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-6 flex w-full flex-wrap items-center justify-center gap-3">
        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            View profile
          </button>
        )}

        {!member.hideContact && (
          <Link
            to={contactHref}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Get in touch
          </Link>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${member.name} on LinkedIn`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
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
    <div className="h-full p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-card shadow-sm transition-colors hover:border-primary/40">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-primary font-medium mb-3">
        We're growing
      </p>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">{subtitle}</p>
      <Link
        to={ctaHref}
        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function ProfileModal({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-lg text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          aria-label="Close profile modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
          <div className="relative h-28 w-28 shrink-0 rounded-full overflow-hidden border-2 border-primary/40 bg-secondary">
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Team Profile
            </p>
            <h3 className="text-2xl font-semibold text-foreground">{member.name}</h3>
            <p className="text-muted-foreground mt-1">{member.role}</p>

            {member.focus && (
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-primary font-medium mt-4">
                {member.focus}
              </p>
            )}

            <p className="mt-5 text-sm md:text-base leading-relaxed text-muted-foreground">
              {member.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={`mailto:${member.email}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {member.email}
              </a>

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  View LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamBannerImage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full px-4 pt-4 md:px-0 md:pt-0">
      <div className="relative aspect-[1280/961] w-full overflow-hidden rounded-[1.25rem] md:rounded-none">
        <img
          src="/team/full-team-pic-placeholder.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full bg-secondary object-cover object-center scale-105 blur-sm transition-opacity duration-500 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src="/team/full-team-pic-optimized.jpg"
          alt="VibeOps founding team"
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 h-full w-full bg-secondary object-cover object-center transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
