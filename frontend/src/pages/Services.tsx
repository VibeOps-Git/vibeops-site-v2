import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Wrench, BarChart3, Layers } from "lucide-react";
import Aurora from "../components/Aurora";
import AnimatedContent from "../components/AnimatedContent";

const REPORTLY_LOGIN_URL =
  import.meta.env.VITE_REPORTLY_LOGIN_URL || "http://localhost:5014/reportly";

const openReportly = () => {
  window.open(REPORTLY_LOGIN_URL, "_blank", "noopener,noreferrer");
};

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
      <div className="container mx-auto px-4 py-20 relative z-10 space-y-16">
        {/* Hero */}
        <AnimatedContent
          distance={140}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.96}
          threshold={0.3}
        >
          <section className="text-center max-w-3xl mx-auto">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-primary/80 mb-3">
              SERVICES · VIBEOPS
            </p>
            <h1 className="section-title">What We Build</h1>
            <p className="section-subtitle mx-auto">
              Custom automation software for engineering, construction, and
              inspection teams — with Reportly at the core and bespoke tools
              where you need them.
            </p>
          </section>
        </AnimatedContent>

        {/* Service Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <AnimatedContent
              key={service.title}
              distance={100}
              direction={index % 2 === 0 ? "vertical" : "horizontal"}
              reverse={index % 2 === 1}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={0.95}
              threshold={0.4}
              delay={index * 0.08}
            >
              <Card className="border-2 border-border/80 hover:border-primary/70 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 bg-card/70 backdrop-blur-md relative overflow-hidden">
                {/* glowing gradient edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/70 to-accent/0 opacity-60" />
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-muted-foreground text-sm"
                      >
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </section>

        {/* Demo Apps – framed as simple examples */}
        <AnimatedContent
          distance={120}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.4}
        >
          <section className="max-w-4xl mx-auto">
            <Card className="bg-card/60 backdrop-blur-md border border-border/80 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10" />
              <CardHeader className="relative">
                <CardTitle className="text-3xl">
                  Demo Sandbox Tools
                </CardTitle>
                <CardDescription className="text-base">
                  These are simple demos — not production tools — built to give
                  you a feel for how we turn engineering workflows into
                  software.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatedContent
                    distance={60}
                    direction="horizontal"
                    duration={0.75}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={0.98}
                    threshold={0.6}
                  >
                    <a
                      href="/construction-tracker"
                      className="block p-6 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors hover:-translate-y-1 hover:shadow-lg duration-200"
                    >
                      <h3 className="font-bold text-lg mb-2">
                        Construction Tracker
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        A basic schedule and task tracking demo to show how we
                        handle project data.
                      </p>
                    </a>
                  </AnimatedContent>

                  <AnimatedContent
                    distance={60}
                    direction="horizontal"
                    reverse
                    duration={0.75}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={0.98}
                    threshold={0.6}
                  >
                    <a
                      href="/ai-report-generator"
                      className="block p-6 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors hover:-translate-y-1 hover:shadow-lg duration-200"
                    >
                      <h3 className="font-bold text-lg mb-2">
                        Reportly-Style Generator
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        A stripped-down example of filling report templates
                        from structured inputs.
                      </p>
                    </a>
                  </AnimatedContent>

                  <AnimatedContent
                    distance={60}
                    direction="horizontal"
                    duration={0.75}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={0.98}
                    threshold={0.6}
                  >
                    <a
                      href="/pipeline"
                      className="block p-6 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors hover:-translate-y-1 hover:shadow-lg duration-200"
                    >
                      <h3 className="font-bold text-lg mb-2">
                        Pipeline Estimator
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Simple pipeline cost and configuration demo to showcase
                        engineering calculators.
                      </p>
                    </a>
                  </AnimatedContent>

                  <AnimatedContent
                    distance={60}
                    direction="horizontal"
                    reverse
                    duration={0.75}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={0.98}
                    threshold={0.6}
                  >
                    <a
                      href="/roof-demo"
                      className="block p-6 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors hover:-translate-y-1 hover:shadow-lg duration-200"
                    >
                      <h3 className="font-bold text-lg mb-2">
                        Roofing Estimator
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Lightweight example of address-based estimating and
                        material logic.
                      </p>
                    </a>
                  </AnimatedContent>
                </div>

                <p className="text-xs text-muted-foreground">
                  These demos are intentionally simple. In real deployments, we
                  connect to your actual templates, data sources, and QA
                  processes.
                </p>
              </CardContent>
            </Card>
          </section>
        </AnimatedContent>

        {/* Main Funnels */}
        <section className="max-w-3xl mx-auto mt-4 text-center space-y-10">
          {/* Funnel 1 – Reportly account */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            duration={0.95}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.97}
            threshold={0.45}
          >
            <div className="bg-card/80 border border-border rounded-xl p-8 backdrop-blur-md hover:border-primary/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-bold mb-3">Start Using Reportly</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Log in to generate reports using your own templates, or create
                an account to get onboarded to Reportly.
              </p>
              <button
                onClick={openReportly}
                className="btn-primary inline-block text-base px-6 py-2.5"
              >
                Try Reportly
              </button>
            </div>
          </AnimatedContent>

          {/* Funnel 2 – Custom software call */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse
            duration={0.95}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.97}
            threshold={0.45}
          >
            <div className="bg-card/80 border border-border rounded-xl p-8 backdrop-blur-md hover:border-primary/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-bold mb-3">
                Talk About Custom Software
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                If you&apos;re looking for something beyond Reportly —
                dashboards, calculators, or custom internal tools — we&apos;ll
                map out what a tailored build could look like for your team.
              </p>
              <a
                href="/contact"
                className="inline-block rounded-lg border border-border px-8 py-3 text-lg hover:border-primary/60 hover:text-primary transition-colors"
              >
                Book a Custom Software Call
              </a>
            </div>
          </AnimatedContent>
        </section>
      </div>

      {/* Local float animation for icons */}
      <style>{`
        @keyframes serviceIconFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .service-icon-float {
          animation: serviceIconFloat 5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
