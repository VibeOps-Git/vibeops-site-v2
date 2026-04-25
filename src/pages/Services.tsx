import { FileText, Wrench, BarChart3, Layers, Check } from 'lucide-react';
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
        title="Services — Report Automation and Engineering Implementation"
        description="VibeOps builds Reportly, an AI-powered report automation platform for civil and construction engineering teams. We implement it, integrate it with your existing tools, and build add-ons that fit your workflow."
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
                Engineering report automation, built for civil and construction.
              </h1>
              <p className="text-white/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Reportly is our flagship product for automating engineering reports. We also implement
                it for your firm, connect it to your existing tools, and build add-ons where needed.
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
                    AI-powered report automation for civil and construction engineering teams. Connect
                    your existing Word templates and project data and get review-ready reports in
                    minutes, not hours.
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
                From product to full deployment.
              </h2>
              <p className="text-white/40 max-w-2xl text-[15px] leading-relaxed">
                Every firm has different templates, approval processes, and data sources. We handle
                the full rollout from mapping your templates to connecting your existing tools and
                building any add-ons your workflow needs.
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
                  Start with your biggest reporting bottleneck.
                </h2>
                <p className="text-white/40 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
                  We scope the first automation, ship a working prototype against your actual
                  templates, and walk it through your QA process. Usually takes a few weeks.
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
