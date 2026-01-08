import { FileText, Wrench, BarChart3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";
import { SectionWithHeader, SectionDivider } from "../components/ui/Section";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";

export default function Services() {
  const services = [
    {
      icon: <FileText className="w-12 h-12 text-primary service-icon-float" />,
      title: "Report Automation (Reportly)",
      description:
        "Transform hours of manual formatting into minutes of audit-ready, on-brand reporting using your existing Word and Excel templates.",
      features: [
        "Word & Excel template automation",
        "Charts, tables & summaries from live data",
        "Automated inspection photo appendices",
        "Brand-consistent, QA-ready output",
      ],
    },
    {
      icon: <Wrench className="w-12 h-12 text-primary service-icon-float" />,
      title: "Custom Workflow Automation",
      description:
        "We build software that removes repetitive documentation and data-handling from engineering, construction, and inspection workflows.",
      features: [
        "Field data ingestion & cleaning",
        "Inspection checklist automation",
        "Construction & site documentation flows",
        "White-labeled internal tooling",
      ],
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary service-icon-float" />,
      title: "Engineering Dashboards",
      description:
        "Turn raw technical data into actionable insight — without hiring a full-time developer or maintaining internal software.",
      features: [
        "Instrumentation dashboards (inclinometers, piezometers, VWs)",
        "Construction & inspection data tracking",
        "Map-based outage & condition views",
        "Live, shareable dashboards for field ops",
      ],
    },
    {
      icon: <Layers className="w-12 h-12 text-primary service-icon-float" />,
      title: "Lightweight Web Apps",
      description:
        "Rapid engineering tools and calculators that mirror your existing workflows, without the overhead of a full custom platform.",
      features: [
        "Cost estimators & calculators",
        "Tracking systems for teams & assets",
        "Pilot tools to validate ROI fast",
        "Secure deployment & long-term support",
      ],
    },
  ];

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
              Services
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              What We Build
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Custom automation software for engineering, construction, and
              inspection teams — with Reportly at the core and bespoke tools
              where you need them.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Service Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <AnimatedContent
                key={service.title}
                distance={60}
                direction="vertical"
                duration={0.7}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={index * 0.1}
              >
                <VibeCard variant="default" className="h-full">
                  <VibeCardHeader>
                    <div className="mb-4 text-[#00ffcc]">{service.icon}</div>
                    <VibeCardTitle className="text-xl">{service.title}</VibeCardTitle>
                    <VibeCardDescription className="text-gray-400 mt-2">
                      {service.description}
                    </VibeCardDescription>
                  </VibeCardHeader>
                  <VibeCardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-gray-400 text-sm"
                        >
                          <span className="text-[#00ffcc] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </VibeCardContent>
                </VibeCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Demo Apps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
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
                <VibeCardTitle className="text-2xl">Demo Sandbox Tools</VibeCardTitle>
                <VibeCardDescription className="text-gray-400">
                  Simple demos — not production tools — built to show how we turn
                  engineering workflows into software.
                </VibeCardDescription>
              </VibeCardHeader>
              <VibeCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/construction-tracker"
                    className="block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-2">Construction Tracker</h3>
                    <p className="text-sm text-gray-400">
                      A basic schedule and task tracking demo.
                    </p>
                  </Link>
                  <Link
                    to="/ai-report-generator"
                    className="block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-2">Reportly-Style Generator</h3>
                    <p className="text-sm text-gray-400">
                      Filling report templates from structured inputs.
                    </p>
                  </Link>
                  <Link
                    to="/pipeline"
                    className="block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-2">Pipeline Estimator</h3>
                    <p className="text-sm text-gray-400">
                      Simple pipeline cost and configuration demo.
                    </p>
                  </Link>
                  <Link
                    to="/roof-demo"
                    className="block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00ffcc]/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-white mb-2">Roofing Estimator</h3>
                    <p className="text-sm text-gray-400">
                      Address-based estimating example.
                    </p>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  In real deployments, we connect to your actual templates, data sources, and QA processes.
                </p>
              </VibeCardContent>
            </VibeCard>
          </AnimatedContent>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* CTAs */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
            >
              <VibeCard variant="glow" className="text-center p-8">
                <h2 className="text-xl font-semibold text-white mb-3">Reportly</h2>
                <p className="text-gray-400 mb-6">
                  Our flagship report automation engine. Coming soon.
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
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={0.1}
            >
              <VibeCard variant="default" className="text-center p-8">
                <h2 className="text-xl font-semibold text-white mb-3">Custom Software</h2>
                <p className="text-gray-400 mb-6">
                  Dashboards, calculators, or internal tools for your team.
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
        </div>
      </section>
    </div>
  );
}
