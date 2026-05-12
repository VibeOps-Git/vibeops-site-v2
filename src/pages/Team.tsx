// src/pages/Team.tsx

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import AnimatedContent from "../components/AnimatedContent";
import { ScrambleText } from "@/components/ScrambleText";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard } from "../components/ui/VibeCard";

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  image: string;
  email: string;
  bio: string;
  linkedin?: string;
};

const coFounders: TeamMember[] = [
  {
    name: "Zander Dent",
    role: "Co-Founder & CEO",
    focus: "Civil Engineering Workflows",
    image: "/team/zander-optimized.jpg",
    email: "zander@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/zander-dent/",
    bio: `Civil engineering student turned software founder, focused on killing manual reporting in consulting firms. Zander leads product vision and works directly with engineers and partners to make sure Reportly fits real project workflows, not theoretical ones.`,
  },
  {
    name: "Félix Stewart",
    role: "Co-Founder: Sales & Operations",
    focus: "Strategy & Partnerships",
    image: "/team/felix-optimized.jpg",
    email: "felix@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/felix-stewart-67007219a/",
    bio: `Felix works with principals and firm leaders to map the business upside of automation, time saved, risk reduced, and new services unlocked. He helps translate “we waste time on reports” into concrete ROI and partnership structures.`,
  },
  {
    name: "Gabriel Comla",
    role: "Co-Founder & CMO",
    focus: "Storytelling for Engineers",
    image: "/team/gabriel-optimized.jpg",
    email: "gabriel@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/gabrielcomla/",
    bio: `Gabe makes sure the story stays grounded in reality: engineers, projects, and outcomes. He helps communicate what VibeOps actually does for firms, less formatting, fewer errors, and more time spent on real engineering.`,
  },
  {
    name: "Eric Balanecki",
    role: "Co-Founder & CTO",
    focus: "Architecture & Automation Engine",
    image: "/team/eric-optimized.jpg",
    email: "eric@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/eric-balanecki/",
    bio: `Eric leads the technical architecture behind Reportly’s automation engine, from template parsing to document generation. He focuses on reliability, versioning, and making sure the system behaves like real infrastructure, not a toy app.`,
  },
  {
    name: "Qazi Omair Ahmed",
    role: "Co-Founder & Head of Engineering",
    focus: "Systems Design & Product Delivery",
    image: "/team/omair-optimized.jpg",
    email: "omair@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/qazi-omair-ahmed/",
    bio: `Omair designs and implements the technical architecture behind what VibeOps builds. He takes the team's and clients' vision and turns it into industry-leading solutions from scoping to system design to delivery. With Reportly, he replaces prebuilt reporting workflows that firms rely on with faster and more reliable client-specific automation.`,
  },
  {
    name: "Hrudai Rajesh",
    role: "Co-Founder",
    focus: "Implementation & Delivery",
    image: "/team/hrudai-optimized.jpg",
    email: "hrudai@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/hrudai-rajesh/",
    bio: `Hrudai helped coordinate delivery, timelines, and implementation during the first year so firms could adopt automation without disrupting active projects. From onboarding templates to rollout planning, he helped make early changes more controlled, traceable, and predictable.`,
  },
];

const contributors: TeamMember[] = [
  {
    name: "Sam Khalil",
    role: "Contributor · Sales & Outreach",
    focus: "Sales, Partnerships & Growth",
    image: "/team/sam.PNG",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/sam-khalil-41ab6635b/",
    bio: `Sam is a Civil Engineering student at the University of Waterloo who supports VibeOps’ sales management and outreach. He focuses on building strong relationships, connecting technical insight with business strategy, and helping identify growth opportunities with prospective customers and partners.`,
  },
  {
    name: "Edmund Zhang",
    role: "Contributor · Creative & Video",
    focus: "Content, Media & Growth",
    image: "/team/edmund-optimized.jpg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/edmund-zhang-business/",
    bio: `Edmund supports VibeOps’ media production and helps turn technical work into clear, compelling visuals and campaigns. He contributes to promotional content, demos, and brand storytelling that helps communicate what we’re building.`,
  },
  {
    name: "Diego Boilley",
    role: "Contributor · Sales & Marketing",
    focus: "Business Development & Industry Outreach",
    image: "/team/diego-optimized.png",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/diego-boilley-2b269728b/",
    bio: `Diego supports VibeOps’ growth by helping connect our engineering automation tools with the firms that need them most. With a background in civil engineering and hands-on construction experience, he contributes to outreach, proposal development, and customer discovery.`,
  },
  {
    name: "Ahnaf Chowdhury",
    role: "Contributor · Marketing Content",
    focus: "Content Creation & Campaign Support",
    image: "/team/ahnaf.jpeg",
    email: "team@vibeops.ca",
    linkedin: "https://www.linkedin.com/in/ahnafchowdhury107/",
    bio: `Ahnaf supports VibeOps’ marketing efforts by helping create and refine content that communicates complex engineering software in a clear and engaging way. He contributes to campaign development, social media content, and messaging that helps translate what we’re building into material engineers and industry partners can quickly understand.`,
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
        title="Team"
        description="Meet the team building VibeOps. We build custom software for engineering and construction teams—reports, dashboards, field data tools, and internal applications."
        canonical="https://www.vibeops.ca/team"
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-16 px-4">
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="container mx-auto text-center max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-accent mb-4">
              Our Team
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              <ScrambleText text="Meet the Team Building Your Tools" trigger="mount" />
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We build custom software for engineering and construction teams—reports,
              dashboards, field data tools, and internal applications that fit how you
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
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,20,0.85)]"
              data-testid="team-banner"
            >
              <TeamBannerImage />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-[#0a0a0f] to-transparent md:block" />

              <div className="px-5 pb-5 pt-4 md:hidden">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
                    VibeOps Technologies Inc.
                  </p>
                  <p className="text-xl font-semibold text-white">
                    Building software for engineering teams.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-accent px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-accent/90"
                >
                  Talk to the Team
                </Link>
              </div>

              <div className="absolute inset-x-8 bottom-8 hidden flex-row items-end justify-between gap-4 md:flex">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
                    VibeOps Technologies Inc.
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    Building software for engineering teams.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="rounded-full bg-emerald-accent px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-accent/90"
                >
                  Talk to the Team
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
            <p className="text-gray-400 mb-4">
              We've seen how much time engineering teams lose to repetitive documentation,
              manual data entry, fragmented tools, and workflows that haven't changed in decades.
            </p>
            <p className="text-gray-400">
              VibeOps exists to build{" "}
              <span className="font-semibold text-white">focused software</span>{" "}
              that fits real workflows—so teams can spend more time on actual engineering
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
              <h2 className="text-2xl font-semibold text-white mb-2"><ScrambleText text="Co-Founders" /></h2>
              <p className="text-gray-400 text-sm">
                The core team behind VibeOps and Reportly. <span className="text-emerald-accent/70">Built in Vancouver, Canada.</span>
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

      <SectionDivider className="mx-auto max-w-5xl" />

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
              <h2 className="text-2xl font-semibold text-white mb-2"><ScrambleText text="Contributors" /></h2>
              <p className="text-gray-400 text-sm">
                People who helped build, shape, and support VibeOps along the way.
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
                <TeamCard member={member} />
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
                title="Join the Team"
                subtitle="We're looking for engineers and builders who want to ship real infrastructure tools."
                ctaLabel="Work with VibeOps"
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
              <h2 className="text-2xl font-semibold text-white mb-2"><ScrambleText text="Advisory Board" /></h2>
              <p className="text-gray-400 text-sm">
                Educators and engineers who help us align with real-world civil workflows.
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
                <TeamCard member={advisor} onOpen={() => setSelectedMember(advisor)} />
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
                title="Become an Advisor"
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
            <VibeCard variant="gradient" className="p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3"><ScrambleText text="Our Approach" /></h2>
                  <p className="text-gray-400 mb-6">
                    We build custom software for engineering teams—reports, dashboards,
                    workflow tools, and internal applications. One focused solution at a time.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold text-white mb-1">Mission</p>
                      <p className="text-gray-400">
                        Make engineering teams faster by building software that fits real workflows.
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold text-white mb-1">Expertise</p>
                      <p className="text-gray-400">
                        Report generation, dashboards, data pipelines, and custom internal tools.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <p className="text-sm text-gray-400">
                    Need software built for your team?
                  </p>
                  <Link
                    to="/contact"
                    className="px-5 py-2 rounded-full bg-emerald-accent text-black font-semibold text-sm hover:bg-emerald-accent/90 transition-colors"
                  >
                    Talk to the Team
                  </Link>
                  <p className="text-xs text-gray-500">
                    Bring your workflow. We'll build the software to support it.
                  </p>
                </div>
              </div>
            </VibeCard>
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
}: {
  member: TeamMember;
  onOpen?: () => void;
}) {
  const contactHref = `/contact?mode=email&contact=${encodeURIComponent(member.email)}`;

  return (
    <VibeCard
      variant="glow"
      className="group h-full p-6 flex flex-col items-center text-center"
    >
      <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-emerald-accent/40 bg-white/5 mb-4">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
      <p className="text-gray-400 mt-1 text-sm font-medium">{member.role}</p>

      <div className="inline-block px-3 py-1 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 mt-2">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-accent font-medium">
          {member.focus}
        </p>
      </div>

      <p className="text-sm text-gray-300 mt-4 flex-1 leading-relaxed">
        {member.bio}
      </p>

      <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3">
        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-accent/20 bg-gradient-to-r from-emerald-accent/15 to-emerald-deep/10 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-accent/50 hover:bg-emerald-accent/15 hover:text-emerald-accent hover:shadow-lg hover:shadow-emerald-accent/10"
          >
            View Profile
          </button>
        )}

        <Link
          to={contactHref}
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-accent/40 hover:bg-emerald-accent/10 hover:text-emerald-accent"
        >
          Get in Touch
        </Link>

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${member.name} on LinkedIn`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-accent/20 bg-gradient-to-r from-emerald-accent/15 to-emerald-deep/10 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-accent/50 hover:bg-emerald-accent/15 hover:text-emerald-accent hover:shadow-lg hover:shadow-emerald-accent/10"
          >
            LinkedIn
          </a>
        )}
      </div>
    </VibeCard>
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
    <VibeCard
      variant="default"
      className="h-full p-6 flex flex-col items-center justify-center text-center border-dashed hover:border-emerald-accent/40 transition-all"
    >
      <div className="inline-block px-3 py-1.5 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 mb-3">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-emerald-accent font-medium">
          We're Growing
        </p>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-6 max-w-xs leading-relaxed">{subtitle}</p>
      <Link
        to={ctaHref}
        className="px-6 py-2.5 rounded-full bg-emerald-accent text-black font-semibold text-sm hover:bg-emerald-accent/90 transition-colors shadow-lg shadow-emerald-accent/20"
      >
        {ctaLabel}
      </Link>
    </VibeCard>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-emerald-accent/20 bg-[#0a0a12] p-6 md:p-8 shadow-2xl shadow-emerald-accent/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-gray-300 transition-colors hover:border-emerald-accent/40 hover:text-emerald-accent"
          aria-label="Close profile modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
          <div className="relative h-28 w-28 shrink-0 rounded-full overflow-hidden border-2 border-emerald-accent/40 bg-white/5">
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-accent mb-2">
              Team Profile
            </p>
            <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
            <p className="text-gray-400 mt-1">{member.role}</p>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 mt-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-accent font-medium">
                {member.focus}
              </p>
            </div>

            <p className="mt-5 text-sm md:text-base leading-relaxed text-gray-300">
              {member.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={`mailto:${member.email}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-accent/40 hover:bg-emerald-accent/10 hover:text-emerald-accent"
              >
                {member.email}
              </a>

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-accent/20 bg-gradient-to-r from-emerald-accent/15 to-emerald-deep/10 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-accent/50 hover:bg-emerald-accent/15 hover:text-emerald-accent hover:shadow-lg hover:shadow-emerald-accent/10"
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
    <div className="relative w-full px-4 pt-4 md:h-[500px] md:px-0 md:pt-0">
      <div className="relative aspect-[1280/736] w-full overflow-hidden rounded-[1.25rem] md:h-full md:rounded-none">
        <img
          src="/team/full-team-pic-placeholder.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full bg-[rgba(10,10,20,0.85)] object-cover object-center scale-105 blur-sm transition-opacity duration-500 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src="/team/full-team-pic-optimized.jpg"
          alt="VibeOps founding team"
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 h-full w-full bg-[rgba(10,10,20,0.85)] object-cover object-center transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
