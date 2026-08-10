import { FileText, MapPin, Wrench, Shield, Lock, Server, Check, ArrowRight, CreditCard, Repeat, Lightbulb } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeCard } from '../components/ui/VibeCard';
import { VibeLinkButton } from '@/components/ui/VibeButton';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const buildBuckets = [
  {
    icon: FileText,
    label: 'Reporting',
    title: 'Report & Document Automation',
    description: 'Report automation built around your firm\'s Word, Excel, and PDF templates, your writing rules, your QA workflows, and your approval chains.',
    features: [
      'Your firm\'s writing and formatting rules',
      'Word, Excel, and PDF engineering templates',
      'QA checklists and multi-stage approvals',
      'Internal document generation and report assembly',
      'Photos, field data, tables, and measurements placed for you',
    ],
  },
  {
    icon: MapPin,
    label: 'Code Intelligence',
    title: 'Building Code Lookup',
    description: 'Type a project address and get every federal, provincial, and municipal code that applies, pulled from our Canadian building code library and ready to cite.',
    features: [
      'Code lookup by project address, anywhere in Canada',
      'Federal, provincial, and municipal codes resolved together',
      'Code references dropped straight into your report drafts',
      'CSA, ASTM, and ISO standards included',
      'Codes, standards, and bylaws covered',
    ],
  },
  {
    icon: Wrench,
    label: 'Custom',
    title: 'Custom Engineering Software',
    description: 'Tools built for your firm: dashboards, automators, and report systems that connect to the documents, templates, and project data you already have.',
    features: [
      'Firm-specific workflows and interfaces',
      'Connects to SharePoint, Drive, Bluebeam, or internal databases',
      'Compliance trackers, asset dashboards, and calculators',
      'Project data handled privately, with access you control',
      'CRM, project management, and document system connectors',
    ],
  },
];

const useCases = [
  'Private AI report editor for internal engineering reports',
  'Automated civil and construction report generation from your Word template',
  'Building code search and citation assistant for project teams',
  'Report writing assistant trained on your approved language and templates',
  'Private install for firms with confidential project data or government clients',
  'Report QA assistant for formatting, structure, completeness, and consistency',
  'Internal building-code workflow tied to project location and report generation',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function Anim({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <AnimatedContent
      distance={50}
      direction="vertical"
      duration={0.7}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      threshold={0.15}
      delay={delay}
    >
      {children}
    </AnimatedContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Services() {
  return (
    <>
      <SEO
        title="Custom AE Workflow Software & Consulting"
        description="VibeOps is an engineering software consultancy for AE firms: report automation, building code lookup, and firm-specific tools built around how your team works."
        canonical="https://www.vibeops.ca/services"
      />
      <div className="pt-24">

        {/* ── Hero ── */}
        <section className="py-20 px-4">
          <Anim>
            <div className="container mx-auto text-center max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-primary mb-4 font-semibold">
                VibeOps Consulting
              </p>
              <h1 className="text-4xl md:text-[2.8rem] font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
                Private engineering software, built around how your firm already works
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                We're an engineering software consultancy. We build and deploy private systems for your firm, running on your templates, your code requirements, your security rules, and your reporting process.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a Consulting Call
                </VibeLinkButton>
                <VibeLinkButton href="/case-studies" variant="outline" size="lg">
                  See Our Work
                </VibeLinkButton>
              </div>
            </div>
          </Anim>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── What We Actually Build ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <Anim>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                What We Build
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                Three ways we work with AE firms.
              </h2>
              <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed mb-14">
                Every engagement starts from working engineering software we've already built and tested, then gets shaped around your firm's templates, codes, and reporting process. You're not paying for something to be built from scratch.
              </p>
            </Anim>

            <div className="grid md:grid-cols-3 gap-5">
              {buildBuckets.map((bucket, i) => (
                <Anim key={bucket.title} delay={i * 0.08}>
                  <div className="flex flex-col p-7 rounded-2xl border border-border bg-card shadow-sm h-full">
                    <span className="self-start text-[9px] font-semibold text-primary uppercase tracking-[0.22em] mb-5">
                      {bucket.label}
                    </span>
                    <div className="flex items-center gap-2.5 mb-1">
                      <bucket.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{bucket.title}</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mt-3 mb-6">{bucket.description}</p>
                    <ul className="space-y-2.5 flex-1">
                      {bucket.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── Not Generic AI Consulting ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              <Anim>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                    You start from something that works
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight leading-tight">
                    Not generic AI consulting.
                  </h2>
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-4 max-w-lg">
                    Most AI consultants show up with a slide deck and some automation ideas. We show up with a working codebase that already does engineering report automation, with Canadian building code lookup built in.
                  </p>
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-lg">
                    Then we set it up around your firm's workflows. It's faster to get running, lower risk, and built for engineering work specifically, not borrowed from generic business software.
                  </p>
                </div>
              </Anim>

              <Anim delay={0.1}>
                <div className="lg:w-[420px] flex-shrink-0 w-full">
                  <div className="rounded-2xl border border-border bg-card shadow-sm p-7">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-6">What you start with vs. a blank page</p>
                    <div className="space-y-5">
                      {[
                        { label: 'Engineering document editing and report assembly', done: true },
                        { label: 'Civil engineering writing, formatting, and QA logic', done: true },
                        { label: 'Building code search, retrieval, and jurisdiction detection', done: true },
                        { label: 'Code-aware AI generation with RAG and vector search', done: true },
                        { label: 'Template mapping and approval workflow engine', done: true },
                        { label: 'Your firm-specific setup', done: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          {item.done ? (
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-[13px] text-foreground">{item.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.done ? 'Already built' : 'Added during your engagement'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── Built for Sensitive Engineering Work ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <Anim>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                Private Deployment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight leading-tight">
                Built for sensitive engineering work.
              </h2>
              <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed mb-14">
                Plenty of firms can't put active project work through public AI tools, especially when the documents involve government clients, confidential reports, or regulated data. Everything we build is deployed privately, so your project information never leaves the environment you approve.
              </p>
            </Anim>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Server, title: 'Private Installation', description: 'Runs on your own servers or a dedicated private environment. Your data doesn\'t touch shared systems.' },
                { icon: Shield, title: 'PIPEDA-Aware Workflows', description: 'Built to support privacy-conscious workflows and help you meet internal and client data-handling rules.' },
                { icon: Lock, title: 'Controlled Data Handling', description: 'Sensitive project data stays inside the environment you approve. Nothing leaks out to public AI tools.' },
                { icon: Lightbulb, title: 'Government & Infrastructure Ready', description: 'Fits firms working on municipal, provincial, federal, and confidential infrastructure projects.' },
              ].map((item, i) => (
                <Anim key={item.title} delay={i * 0.06}>
                  <div className="p-6 rounded-2xl border border-border bg-card shadow-sm h-full">
                    <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── Implementation + Monthly License ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              <Anim>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                    How Pricing Works
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight leading-tight">
                    Setup fee, then a monthly license.
                  </h2>
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-4 max-w-lg">
                    We build around your templates, workflows, and reporting process, put it in the environment your security team signs off on, and keep you running through a monthly license.
                  </p>
                  <p className="text-muted-foreground text-[15px] leading-relaxed max-w-lg">
                    You're not just buying consulting hours. You're getting working software, set up and maintained for your firm.
                  </p>
                </div>
              </Anim>

              <Anim delay={0.1}>
                <div className="lg:w-[400px] flex-shrink-0 w-full space-y-4">
                  {[
                    { icon: CreditCard, step: '01', title: 'Upfront Setup Fee', description: 'We scope it, build it, and configure it around your templates, workflows, and security requirements.' },
                    { icon: Repeat, step: '02', title: 'Monthly Software License', description: 'Ongoing access to what we built for you. Includes updates, hosting where you need it, and standard support.' },
                    { icon: Wrench, step: '03', title: 'Optional Ongoing Development', description: 'Extra custom work, new integrations, more report types, or additional code workflows, scoped when you need them.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                      <div className="flex-shrink-0">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.22em]">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Anim>
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── Example Use Cases ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <Anim>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                Example Use Cases
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight leading-tight">
                What firms are building with us.
              </h2>
              <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed mb-12">
                Every engagement is a bit different, but the work usually lands in one of these.
              </p>
            </Anim>

            <div className="grid md:grid-cols-2 gap-3">
              {useCases.map((uc, i) => (
                <Anim key={uc} delay={i * 0.04}>
                  <div className="flex items-start gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary transition-colors">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[13.5px] text-foreground">{uc}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* ── CTA ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <Anim>
              <VibeCard variant="gradient" hover={false} className="text-center p-8 md:p-12">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 font-semibold">
                  Get started
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                  Tell us what your firm needs.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
                  Book a 30-minute call. We'll look at the report that eats the most of your team's time, the compliance checks you want tightened up, and what an engagement would look like for your firm.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <VibeLinkButton href="/contact" variant="primary" size="lg">
                    Book a Consulting Call
                  </VibeLinkButton>
                  <VibeLinkButton href="/case-studies" variant="outline" size="lg">
                    See Our Work
                  </VibeLinkButton>
                </div>
              </VibeCard>
            </Anim>
          </div>
        </section>
      </div>
    </>
  );
}
