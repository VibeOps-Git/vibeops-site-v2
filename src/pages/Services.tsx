import { FileText, Wrench, BarChart3, Layers, Check, MapPin, ArrowRight, Database, Shield, Globe } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeCard } from '../components/ui/VibeCard';
import { GallerySection3D } from '../components/3d/sections/GallerySection3D';
import { VibeLinkButton } from '@/components/ui/VibeButton';

const reportlyFeatures = [
  'Works with the Word and Excel templates your team already has',
  'Pulls in photos, tables, charts, and field data automatically',
  'Outputs QA-ready, brand-consistent PDF and Word reports',
  'Supports firm-specific formatting and approval processes',
  'No workflow changes required for your team',
];

const services = [
  {
    icon: FileText,
    title: 'Report Automation',
    subtitle: 'Reportly, our flagship product',
    description:
      'Automate civil engineering report formatting using your existing Word and Excel templates. Feed in field data, photos, tables, and charts and get polished, QA-ready output in minutes. Works with your current approval process from day one.',
    features: [
      'Word and Excel template automation',
      'Photos, charts and tables from live project data',
      'QA-ready, brand-consistent output',
      'PDF and Word delivery in firm-specific formats',
      'No changes to your existing reporting workflow',
    ],
    highlight: true,
    href: '/reportly',
    cta: 'Explore Reportly',
  },
  {
    icon: Wrench,
    title: 'Custom Rollouts',
    subtitle: 'Implementation',
    description:
      "We adapt Reportly to your firm's exact templates, QA requirements, reporting standards, and approval workflow. Engineers adopt it without changing how they work.",
    features: [
      'Template library setup and mapping',
      'QA checklist and approval workflow integration',
      'Reporting format and standard compliance',
      'Onboarding, training, and documentation',
    ],
    cta: 'Learn more',
  },
  {
    icon: BarChart3,
    title: 'Data Integrations',
    subtitle: 'Workflow connections',
    description:
      'We connect Reportly to the tools your team already uses. Excel, SharePoint, Bluebeam, project management systems, inspection forms, and internal databases.',
    features: [
      'Excel, SharePoint and Bluebeam integrations',
      'Project management and CRM data pipelines',
      'Inspection and field data ingestion',
      'Custom API and database connectors',
    ],
    cta: 'Learn more',
  },
  {
    icon: Layers,
    title: 'Add-On Tools',
    subtitle: 'Custom development',
    description:
      'We build lightweight dashboards, calculators, and reporting add-ons that extend Reportly and support the broader engineering reporting workflow.',
    features: [
      'Instrumentation and construction dashboards',
      'Engineering calculators and estimators',
      'Reporting workflow add-ons',
      'Secure internal deployment',
    ],
    cta: 'Learn more',
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Services — Report Automation, Building Code Intelligence & Custom Engineering Tools"
        description="VibeOps builds Reportly and MapleCodes — AI report automation and building code intelligence for civil and construction teams. We implement, integrate, and build custom solutions powered by our proprietary code data layer."
        canonical="https://www.vibeops.ca/services"
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-20 px-4">
          <AnimatedContent
            distance={70}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <div className="container mx-auto text-center max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-emerald-400/75 mb-4 font-semibold">
                Product and Services
              </p>
              <h1 className="text-4xl md:text-[2.8rem] font-bold text-white mb-6 tracking-tight leading-[1.1]">
                Your reports. Your codes. Handled.
              </h1>
              <p className="text-white/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Reportly automates engineering reports. MapleCodes handles building code research. Together, they give civil and construction teams their hours back — and we customize both to fit exactly how your firm works.
              </p>
            </div>
          </AnimatedContent>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Reportly spotlight */}
        <section className="py-20 px-4">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.75}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.15}
          >
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                {/* Text */}
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                    Flagship SaaS Product
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                    Reportly
                  </h2>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-7 max-w-md">
                    Your engineers already have the templates and the data. Reportly connects the two — pulling in field photos, tables, charts, and project data to generate review-ready reports in minutes, not hours. No workflow changes. No learning curve.
                  </p>
                  <ul className="space-y-3 mb-9">
                    {reportlyFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[13.5px] text-white/60">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full border border-emerald-600/40 bg-emerald-950/60 flex items-center justify-center mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <VibeLinkButton href="https://reportly.ca" variant="primary" size="lg">
                      Try Reportly Free
                    </VibeLinkButton>
                    <VibeLinkButton href="/contact" variant="outline" size="lg">
                      Book a Demo
                    </VibeLinkButton>
                  </div>
                </div>

                {/* Image */}
                <div className="lg:w-[400px] xl:w-[440px] flex-shrink-0 w-full">
                  <div className="rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50">
                    <img
                      src="/app-preview.png"
                      alt="Reportly AI report automation software for civil engineering teams"
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* MapleCodes / Building Code Intelligence */}
        <section className="py-20 px-4">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.75}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.15}
          >
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                {/* Text */}
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#d92f37]/70 mb-3 font-semibold">
                    Building Code Intelligence
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                    MapleCodes
                  </h2>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-4 max-w-md">
                    Enter a Canadian address. Get every applicable building code — federal, provincial, and municipal — in seconds. 85+ codes, 375+ referenced standards, and 55+ municipal bylaws, all mapped to GIS jurisdiction boundaries.
                  </p>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-7 max-w-md">
                    That same intelligence layer is available as the foundation for custom tools we build for your firm. If it touches Canadian building codes, we've already done the hard part.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/maplecodes"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d92f37] text-white text-[13.5px] font-semibold hover:bg-[#e54950] transition-colors"
                    >
                      Explore MapleCodes <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <VibeLinkButton href="/contact" variant="outline" size="lg">
                      Discuss Custom Solutions
                    </VibeLinkButton>
                  </div>
                </div>

                {/* Proprietary IP card */}
                <div className="lg:w-[400px] xl:w-[440px] flex-shrink-0 w-full">
                  <div className="rounded-2xl overflow-hidden border border-[#d92f37]/15 bg-gradient-to-br from-[#d92f37]/8 to-transparent p-7">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#d92f37]/60 font-semibold mb-6">Proprietary Data Layer</p>
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <Database className="w-4 h-4 text-[#d92f37]/70 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-medium text-white/80">85+ building codes indexed</p>
                          <p className="text-[11px] text-white/35 mt-0.5">Federal, provincial, and municipal coverage across Canada</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-[#d92f37]/70 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-medium text-white/80">375+ referenced standards</p>
                          <p className="text-[11px] text-white/35 mt-0.5">CSA, ASTM, ULC, and other standards bodies mapped to code sections</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#d92f37]/70 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-medium text-white/80">GIS jurisdiction detection</p>
                          <p className="text-[11px] text-white/35 mt-0.5">Point-in-polygon matching against municipal, provincial, and federal boundaries</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-[#d92f37]/70 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-medium text-white/80">AI-powered code analysis</p>
                          <p className="text-[11px] text-white/35 mt-0.5">RAG pipeline with vector search for code-aware Q&A and governing briefs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How firms use the IP */}
              <div className="mt-16">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-6">
                  Three ways to use it
                </p>
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="p-6 rounded-xl border border-white/6 bg-white/[0.02] hover:border-[#d92f37]/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#d92f37]/10 border border-[#d92f37]/20 flex items-center justify-center mb-4">
                      <MapPin className="w-4 h-4 text-[#d92f37]/70" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-2">Use MapleCodes directly</h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed">
                      Instant building code lookups for any Canadian address. Know which codes, standards, and bylaws apply before the first drawing is stamped.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-white/6 bg-white/[0.02] hover:border-emerald-500/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <ArrowRight className="w-4 h-4 text-emerald-400/70" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-2">Feed codes into Reportly</h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed">
                      One-click handoff from code lookup to report generation. Your reports cite the right codes for the right jurisdiction automatically.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-white/6 bg-white/[0.02] hover:border-cyan-500/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                      <Wrench className="w-4 h-4 text-cyan-400/70" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-2">Custom solutions on our IP</h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed">
                      Compliance checkers, permit documentation, code cross-referencing — whatever your firm needs, built on our indexed code intelligence layer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Services section header */}
        <section className="pt-20 pb-4 px-4">
          <div className="container mx-auto max-w-5xl">
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                How We Work With Your Firm
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                How we actually work with firms.
              </h2>
              <p className="text-white/40 max-w-2xl text-[15px] leading-relaxed">
                Every firm runs differently — different templates, different approval chains, different tools. We handle the full rollout, from mapping your templates to connecting your existing systems to building whatever custom pieces your workflow needs.
              </p>
            </AnimatedContent>
          </div>
        </section>

        {/* Service cards */}
        <section className="pb-10 px-4">
          <div className="container mx-auto max-w-5xl">
            <GallerySection3D items={services} />
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
            >
              <VibeCard variant="gradient" hover={false} className="text-center p-8 md:p-12">
                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                  Get started
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Start with the report that takes the longest.
                </h2>
                <p className="text-white/40 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
                  Tell us which report eats the most hours. We'll scope an automation around your actual templates, build a working prototype, and walk it through your QA process. If it works — and it will — we keep going.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <VibeLinkButton href="/contact" variant="primary" size="lg">
                    Book a Discovery Call
                  </VibeLinkButton>
                  <VibeLinkButton href="https://reportly.ca" variant="outline" size="lg">
                    Try Reportly Free
                  </VibeLinkButton>
                </div>
              </VibeCard>
            </AnimatedContent>
          </div>
        </section>
      </div>

      {/* Hidden SEO content targeting high-intent civil engineering search queries */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        <h2>Are Civil Engineers Still in High Demand?</h2>
        <p>
          Yes, civil engineers are still in high demand across infrastructure, construction, and environmental sectors. Firms that invest in automation tools like Reportly help their civil engineers spend less time on report formatting and more time on high-value technical work, making them more competitive when hiring and retaining top engineers.
        </p>
        <h2>How Much Does It Cost to Hire a Civil Engineer?</h2>
        <p>
          The cost to hire a civil engineer varies by region, experience, and project scope, but engineering firms can significantly reduce overhead by automating report generation and documentation workflows. Tools like Reportly cut civil engineering report time by over 80 percent, reducing the billable hours spent on formatting and letting firms deliver more value per project.
        </p>
        <h2>How to Choose the Right Civil Engineer for Your Project</h2>
        <p>
          When choosing a civil engineering firm, look for teams with strong QA processes, clear documentation workflows, and modern reporting tools. Firms using civil engineering report automation software like Reportly deliver faster turnarounds, more consistent outputs, and QA-ready reports across every project type.
        </p>
        <a href="/reportly">AI report automation software for civil engineers</a>
        <a href="/services">Civil engineering consulting and report automation services</a>
        <a href="/contact">Book a civil engineering automation demo</a>
      </div>
    </>
  );
}
