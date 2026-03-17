// src/pages/Team.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard } from "../components/ui/VibeCard";

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  image: string;
  email: string;
  bio: string;
};

const coFounders: TeamMember[] = [
  {
    name: "Zander Dent",
    role: "Co-Founder & CEO",
    focus: "Civil Engineering Workflows",
    image: "/team/zander-optimized.jpg",
    email: "zander@vibeops.ca",
    bio: `Civil engineering student turned software founder, focused on killing manual reporting in consulting firms. Zander leads product vision and works directly with engineers and partners to make sure Reportly fits real project workflows, not theoretical ones.`,
  },
  {
    name: "Félix Stewart",
    role: "Co-Founder: Sales & Operations",
    focus: "Strategy & Partnerships",
    image: "/team/felix-optimized.jpg",
    email: "felix@vibeops.ca",
    bio: `Felix works with principals and firm leaders to map the business upside of automation, time saved, risk reduced, and new services unlocked. He helps translate “we waste time on reports” into concrete ROI and partnership structures.`,
  },
  {
    name: "Gabriel Comla",
    role: "Co-Founder & CMO",
    focus: "Storytelling for Engineers",
    image: "/team/gabriel-optimized.jpg",
    email: "gabriel@vibeops.ca",
    bio: `Gabe makes sure the story stays grounded in reality: engineers, projects, and outcomes. He helps communicate what VibeOps actually does for firms, less formatting, fewer errors, and more time spent on real engineering.`,
  },
  {
    name: "Eric Balanecki",
    role: "Co-Founder & CTO",
    focus: "Architecture & Automation Engine",
    image: "/team/eric-optimized.jpg",
    email: "eric@vibeops.ca",
    bio: `Eric leads the technical architecture behind Reportly’s automation engine, from template parsing to document generation. He focuses on reliability, versioning, and making sure the system behaves like real infrastructure, not a toy app.`,
  },
  {
    name: "Qazi Omair Ahmed",
    role: "Co-Founder & Head of Engineering",
    focus: "Systems Design & Product Delivery",
    image: "/team/omair-optimized.jpg",
    email: "omair@vibeops.ca",
    bio: `Omair designs and implements the technical architecture behind what VibeOps builds. He takes the team's and clients' vision and turns it into industry-leading solutions from scoping to system design to delivery. With Reportly, he replaces prebuilt reporting workflows that firms rely on with faster and more reliable client-specific automation.`,
  },
  {
    name: "Hrudai Rajesh",
    role: "Co-Founder",
    focus: "Implementation & Delivery",
    image: "/team/hrudai-optimized.jpg",
    email: "hrudai@vibeops.ca",
    bio: `Hrudai helped coordinate delivery, timelines, and implementation during the first year so firms could adopt automation without disrupting active projects. From onboarding templates to rollout planning, he helped make early changes more controlled, traceable, and predictable.`,
  },
];

const contributors: TeamMember[] = [
  {
    name: "Edmund Zhang",
    role: "Contributor · Creative & Video",
    focus: "Content, Media & Growth",
    image: "/team/edmund-optimized.jpg",
    email: "team@vibeops.ca",
    bio: `Edmund supported VibeOps’ media production and helped turn technical work into clear, compelling visuals and campaigns. He contributed to promotional content, demos, and brand storytelling that helped communicate what we were building.`,
  },
  {
    name: "Diego Boilley",
    role: "Contributor · Sales & Marketing",
    focus: "Business Development & Industry Outreach",
    image: "/team/diego-optimized.png",
    email: "team@vibeops.ca",
    bio: `Diego supported VibeOps’ growth by helping connect our engineering automation tools with the firms that needed them most. With a background in civil engineering and hands-on construction experience, he contributed to outreach, proposal development, and customer discovery.`,
  },
  {
    name: "Ahnaf Chowdhury",
    role: "Contributor · Marketing Content",
    focus: "Content Creation & Campaign Support",
    image: "/team/ahnaf.jpeg",
    email: "team@vibeops.ca",
    bio: `Ahnaf supported VibeOps’ marketing efforts by helping create and refine content that communicates complex engineering software in a clear and engaging way. He contributed to campaign development, social media content, and messaging that helped translate what we were building into material engineers and industry partners could quickly understand.`
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
];

export default function Team() {
  return (
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
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              Our Team
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Meet the Team Building Your Tools
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
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#00ffcc] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#00ffcc]/90"
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
                  className="rounded-full bg-[#00ffcc] px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#00ffcc]/90"
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
              <h2 className="text-2xl font-semibold text-white mb-2">Co-Founders</h2>
              <p className="text-gray-400 text-sm">
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
              <h2 className="text-2xl font-semibold text-white mb-2">Contributors</h2>
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
              <h2 className="text-2xl font-semibold text-white mb-2">Advisory Board</h2>
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
                <TeamCard member={advisor} />
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
                  <h2 className="text-2xl font-semibold text-white mb-3">Our Approach</h2>
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
                    className="px-5 py-2 rounded-full bg-[#00ffcc] text-black font-semibold text-sm hover:bg-[#00ffcc]/90 transition-colors"
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
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <VibeCard
      variant="glow"
      className="group h-full p-6 flex flex-col items-center text-center"
    >
      <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-[#00ffcc]/40 bg-white/5 mb-4">
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
      <div className="inline-block px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20 mt-2">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#00ffcc] font-medium">
          {member.focus}
        </p>
      </div>
      <p className="text-sm text-gray-300 mt-4 flex-1 leading-relaxed">{member.bio}</p>
      <a
        href={`mailto:${member.email}`}
        className="mt-4 text-[0.7rem] uppercase tracking-[0.2em] font-medium text-[#00ffcc] hover:text-[#00ffcc]/80 transition-colors"
      >
        {member.email}
      </a>
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
      className="h-full p-6 flex flex-col items-center justify-center text-center border-dashed hover:border-[#00ffcc]/40 transition-all"
    >
      <div className="inline-block px-3 py-1.5 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20 mb-3">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[#00ffcc] font-medium">
          We're Growing
        </p>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-6 max-w-xs leading-relaxed">{subtitle}</p>
      <Link
        to={ctaHref}
        className="px-6 py-2.5 rounded-full bg-[#00ffcc] text-black font-semibold text-sm hover:bg-[#00ffcc]/90 transition-colors shadow-lg shadow-[#00ffcc]/20"
      >
        {ctaLabel}
      </Link>
    </VibeCard>
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
