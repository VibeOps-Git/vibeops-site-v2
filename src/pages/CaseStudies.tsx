import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";
import { VibeLinkButton } from "@/components/ui/VibeButton";

type Review = {
  name: string;
  role: string;
  context: string;
  quote: string;
  image: string;
};

type PortfolioProject = {
  title: string;
  caption: string;
  description: string;
  youtubeId: string;
  link: string;
  features: string[];
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


const portfolioProjects = [
  {
    title: "Castaway Crew – Desktop",
    caption:
      "Bold, conversion-focused landing page for a boat cleaning business in Minnesota.",
    description: "Complete brand refresh with a focus on conversion optimization. Features include pricing calculator, service area maps, and streamlined booking flow. Built with React and optimized for performance.",
    youtubeId: "trIZD2Lwe4s",
    link: "https://www.castawaycrewmn.com/",
    features: [
      "Conversion-optimized design",
      "Interactive pricing display",
      "Service area visuals",
      "Mobile-responsive layout",
    ],
  },
  {
    title: "Castaway Crew – Mobile",
    caption:
      "Mobile-first experience that keeps booking effortless on small screens.",
    description: "Optimized mobile experience with touch-friendly interfaces and streamlined navigation. Features quick-book functionality and location-based service detection.",
    youtubeId: "eJlnI9NCQuU",
    link: "https://www.castawaycrewmn.com/",
    features: [
      "Touch-optimized interface",
      "Quick-book functionality",
      "Streamlined navigation",
      "Progressive web app features",
    ],
  },
  {
    title: "EaZy Visuals",
    caption:
      "Dynamic, high-contrast site for a visual media and content studio.",
    description: "High-impact portfolio site for a visual media studio. Features video showcase grid, dynamic transitions, and portfolio filtering. Built to showcase creative work with maximum visual impact.",
    youtubeId: "ArMIzD2MoeY",
    link: "https://www.eazy-visuals.com/",
    features: [
      "Video showcase grid",
      "Dynamic transitions",
      "Portfolio filtering",
      "Optimized media loading",
    ],
  },
];

// Portfolio Section Component with Liquid Glass Cards
function PortfolioSection({ projects }: { projects: PortfolioProject[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedIndex !== null) {
        setExpandedIndex(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Lock body scroll when modal is open
    if (expandedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [expandedIndex]);

  return (
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-3">Portfolio Projects</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Web apps and sites showing the level of polish we bring to internal tools and dashboards.
          </p>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <AnimatedContent
            key={project.title}
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
            delay={idx * 0.1}
          >
            <div
              className="h-full cursor-pointer"
              onClick={() => setExpandedIndex(idx)}
            >
              <VibeCard
                variant="default"
                className="h-full overflow-hidden group hover:border-[#00ffcc]/40 transition-all"
              >
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex items-center gap-2 rounded-full bg-[#00ffcc] px-4 py-2 shadow-lg shadow-[#00ffcc]/50">
                      <span className="inline-block h-0 w-0 border-y-4 border-y-transparent border-l-[8px] border-l-black" />
                      <span className="text-sm font-semibold text-black">View Details</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pointer-events-none">
                  <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-[#00ffcc] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{project.caption}</p>
                </div>
              </VibeCard>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Expanded Modal */}
      {expandedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 pb-8 px-4 overflow-y-auto"
          onClick={() => setExpandedIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <VibeCard variant="glow" className="p-8">
              {/* Close button */}
              <button
                onClick={() => setExpandedIndex(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video embed */}
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${projects[expandedIndex].youtubeId}?autoplay=1`}
                  title={projects[expandedIndex].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Content */}
              <h2 className="text-3xl font-bold text-white mb-3">
                {projects[expandedIndex].title}
              </h2>

              <p className="text-gray-300 leading-relaxed mb-6">
                {projects[expandedIndex].description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects[expandedIndex].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="inline-block w-1.5 h-1.5 bg-[#00ffcc] rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live site link */}
              <a
                href={projects[expandedIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* ESC hint */}
              <div className="mt-8 pt-6 border-t border-[#00ffcc]/20 flex items-center gap-2 text-[#00ffcc]/50 text-sm">
                <kbd className="px-2 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded text-xs">
                  ESC
                </kbd>
                <span>Press to close</span>
              </div>
            </VibeCard>
          </div>
        </div>
      )}

      <p className="text-sm text-center text-gray-500 mt-8">
        We apply the same care to internal tools your team uses every day.
      </p>
    </section>
  );
}

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
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-3">What Our Clients Say</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
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
                <VibeCard variant="glow" className="h-full p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#00ffcc]/40 bg-white/5 flex-shrink-0">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{review.name}</h3>
                      <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                        {review.role}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#00ffcc] text-[#00ffcc]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1.5 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20">
                      <p className="text-xs text-[#00ffcc] font-medium">
                        {review.context}
                      </p>
                    </div>

                    <p className="text-gray-300 leading-relaxed italic">
                      "{review.quote}"
                    </p>
                  </div>
                </VibeCard>
              </AnimatedContent>
            ))}
          </div>

          <p className="text-sm text-center text-gray-500 mt-8">
            Longer-form case studies coming soon as we wrap pilots and get formal approvals.
          </p>
        </section>

        <SectionDivider />

        {/* Portfolio Projects */}
        <PortfolioSection projects={portfolioProjects} />

        <SectionDivider />

        {/* CTA */}
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
            <VibeCard variant="gradient" hover={false} className="text-center p-10 md:p-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Become a Case Study?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Scope a pilot with clear before/after and measurable time savings. We'll help you automate the workflow that's slowing your team down the most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a Vibe Check
                </VibeLinkButton>
                <VibeLinkButton href="/services" variant="outline" size="lg">
                  Explore Our Services
                </VibeLinkButton>
              </div>
            </VibeCard>
          </AnimatedContent>
        </section>
      </div>
    </div>
  );
}
