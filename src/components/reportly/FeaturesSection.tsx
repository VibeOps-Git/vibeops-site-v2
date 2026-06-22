import { Check, Cog, Brain, FileText, Calculator, Wand2, HardHat } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const features = [
  {
    icon: FileText,
    title: "Your Templates, Automated",
    description: "Upload your existing Word template and drop in your project data (PDF, Excel, or Word). Reportly maps your fields and produces reports in your exact format.",
    highlight: true,
  },
  {
    icon: Brain,
    title: "Accurate References",
    description: "Correct code editions, municipal bylaws, and standards, automatically cited for the right jurisdiction. No more outdated references.",
    highlight: true,
  },
  {
    icon: Cog,
    title: "Photos & Data Embedded",
    description: "Field photos, measurements, tables, and inspection data placed into your report without breaking the layout.",
    highlight: true,
  },
  {
    icon: Calculator,
    title: "Executive Summaries",
    description: "Auto-generated executive summaries and key findings, with adjustable report length so the output matches the scope.",
    highlight: true,
  },
  {
    icon: Wand2,
    title: "No Workflow Changes",
    description: "No new tools to learn. No IT approval headaches. Works alongside Word, Excel, SharePoint, and Bluebeam.",
    highlight: true,
  },
  {
    icon: HardHat,
    title: "Built for AEC Teams",
    description: "Inspection reports, EAs, O&M manuals, compliance docs, and asset assessments. Purpose-built for civil, construction, and environmental work.",
    highlight: true,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Why Reportly
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Built for{" "}
              <span className="text-primary">civil engineering</span>, not generic docs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reportly is shaped around the way civil and construction engineers actually write reports.
            </p>
          </div>
        </AnimatedContent>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <AnimatedContent
              key={feature.title}
              distance={40}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={Math.min(index * 0.08, 0.4)}
            >
              <div className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300 hover:border-primary/40 h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary border border-border mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>

                {/* Check badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Comparison table hint */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.4}
        >
          <div className="text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
              <span className="text-sm text-muted-foreground">Compared to:</span>
              {["Domo", "Jaspersoft", "Autodesk CC", "Power BI"].map((name) => (
                <span
                  key={name}
                  className="text-sm text-muted-foreground"
                >
                  {name}
                </span>
              ))}
              <span className="text-sm text-primary font-medium">
                Only Reportly does all of it.
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
