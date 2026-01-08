import { Link } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";

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


const legacyWebProjects = [
  {
    title: "Castaway Crew – Desktop",
    caption:
      "Bold, conversion-focused landing page for a boat cleaning business in Minnesota.",
    youtubeId: "trIZD2Lwe4s",
    link: "https://www.castawaycrewmn.com/",
  },
  {
    title: "Castaway Crew – Mobile",
    caption:
      "Mobile-first experience that keeps booking effortless on small screens.",
    youtubeId: "eJlnI9NCQuU",
    link: "https://www.castawaycrewmn.com/",
  },
  {
    title: "EaZy Visuals",
    caption:
      "Dynamic, high-contrast site for a visual media and content studio.",
    youtubeId: "ArMIzD2MoeY",
    link: "https://www.eazy-visuals.com/",
  },
];

export default function CaseStudies() {
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
              Case Studies
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Client Outcomes
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A snapshot of how teams use VibeOps to do business faster.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Coming Soon Card */}
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
            <VibeCard variant="gradient">
              <VibeCardHeader>
                <VibeCardTitle className="text-2xl">Case Studies in Progress</VibeCardTitle>
                <VibeCardDescription>
                  We're actively documenting live deployments and pilots with our partners.
                </VibeCardDescription>
              </VibeCardHeader>
              <VibeCardContent>
                <p className="text-gray-400 mb-6">
                  Most of our work today is with engineering and construction teams who want to
                  automate reporting, follow-ups, and documentation without hiring a full-time developer.
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 max-w-sm">
                  <p className="font-semibold text-white mb-1">Civil & Construction</p>
                  <p className="text-gray-400 text-sm">
                    Report automation, dashboards, and internal tools around existing workflows.
                  </p>
                </div>
              </VibeCardContent>
            </VibeCard>
          </AnimatedContent>
        </section>

        <SectionDivider />

        {/* Reviews section */}
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
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-2">What Our Clients Say</h2>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                Real feedback from teams we've helped with automation and software.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <AnimatedContent
                key={review.name}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.1}
              >
                <VibeCard variant="default" className="h-full">
                  <VibeCardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-[#00ffcc]/30 bg-white/5">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <VibeCardTitle className="text-base">{review.name}</VibeCardTitle>
                        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-gray-500">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </VibeCardHeader>
                  <VibeCardContent>
                    <p className="text-[0.7rem] text-[#00ffcc] font-medium tracking-[0.15em] uppercase mb-3">
                      {review.context}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      "{review.quote}"
                    </p>
                  </VibeCardContent>
                </VibeCard>
              </AnimatedContent>
            ))}
          </div>

          <p className="text-xs text-center text-gray-500 mt-6">
            Longer-form case studies coming soon as we wrap pilots and get formal approvals.
          </p>
        </section>

        <SectionDivider />

        {/* Legacy web projects */}
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
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-2">Past Web Projects</h2>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                Marketing and brand sites showing the level of polish we bring to internal tools and dashboards.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legacyWebProjects.map((proj, idx) => (
              <AnimatedContent
                key={proj.title}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.1}
              >
                <VibeCard variant="default" className="h-full">
                  <VibeCardContent className="pt-4">
                    <a
                      href={`https://www.youtube.com/watch?v=${proj.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden group relative mb-4"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${proj.youtubeId}/hqdefault.jpg`}
                        alt={proj.title}
                        className="w-full h-36 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1">
                          <span className="inline-block h-0 w-0 border-y-6 border-y-transparent border-l-[10px] border-l-white" />
                          <span className="text-xs font-medium text-white">Watch</span>
                        </div>
                      </div>
                    </a>
                    <h3 className="font-semibold text-white text-sm mb-1">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{proj.caption}</p>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00ffcc] hover:text-[#00ffcc]/80 transition-colors"
                    >
                      View live site →
                    </a>
                  </VibeCardContent>
                </VibeCard>
              </AnimatedContent>
            ))}
          </div>

          <p className="text-xs text-center text-gray-500 mt-6">
            We apply the same care to internal tools your team uses every day.
          </p>
        </section>

        <SectionDivider />

        {/* Demo Tools */}
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
            <VibeCard variant="glass">
              <VibeCardHeader>
                <VibeCardTitle className="text-xl">Demo Tools</VibeCardTitle>
                <VibeCardDescription>
                  Simple, non-production demos showing how we think about workflows.
                </VibeCardDescription>
              </VibeCardHeader>
              <VibeCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/construction-tracker"
                    className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-1">Construction Tracker</h3>
                    <p className="text-sm text-gray-400">Tasks, schedules, and dependencies.</p>
                  </Link>
                  <Link
                    to="/ai-report-generator"
                    className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-1">Report Generator</h3>
                    <p className="text-sm text-gray-400">Template filling from structured inputs.</p>
                  </Link>
                  <Link
                    to="/pipeline"
                    className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-1">Pipeline Estimator</h3>
                    <p className="text-sm text-gray-400">Cost and configuration demo.</p>
                  </Link>
                  <Link
                    to="/roof-demo"
                    className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-1">Roofing Estimator</h3>
                    <p className="text-sm text-gray-400">Address-based estimating example.</p>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  For real projects, we connect to your templates, data sources, and QA processes.
                </p>
              </VibeCardContent>
            </VibeCard>
          </AnimatedContent>
        </section>

        <SectionDivider />

        {/* CTAs */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
            >
              <VibeCard variant="glow" className="text-center p-8 h-full">
                <h2 className="text-xl font-semibold text-white mb-3">Reportly</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Automated reports from your existing Word and Excel templates. Coming soon.
                </p>
                <Link
                  to="/reportly"
                  className="inline-block px-6 py-3 rounded-full bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-colors"
                >
                  Learn More
                </Link>
              </VibeCard>
            </AnimatedContent>

            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={0.1}
            >
              <VibeCard variant="default" className="text-center p-8 h-full">
                <h2 className="text-xl font-semibold text-white mb-3">Become a Case Study</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Scope a pilot with clear before/after and measurable time savings.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-6 py-3 rounded-full border border-white/20 text-white hover:border-[#00ffcc]/50 hover:text-[#00ffcc] transition-colors"
                >
                  Book a Call
                </Link>
              </VibeCard>
            </AnimatedContent>
          </div>
        </section>
      </div>
    </div>
  );
}
