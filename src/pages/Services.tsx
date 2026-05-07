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
    color: 'emerald',
    label: 'Reportly',
    title: 'Private Reportly Deployments',
    description: 'Custom report automation built around your firm\'s Word, Excel, and PDF templates, writing rules, QA workflows, and approval chains.',
    features: [
      'Firm-specific writing and formatting rules',
      'Word, Excel, and PDF-based engineering templates',
      'QA checklists and multi-stage approval workflows',
      'Internal document generation and report assembly',
      'Photos, field data, tables, and measurements embedded automatically',
    ],
  },
  {
    icon: MapPin,
    color: 'red',
    label: 'MapleCodes',
    title: 'Building Code AI Systems',
    description: 'Jurisdiction-specific code search, retrieval, and code-aware project workflows built on our indexed Canadian building code corpus.',
    features: [
      'Building code search by project address',
      'Federal, provincial, and municipal jurisdiction detection',
      'Code-aware project workflows and compliance checks',
      'Integration into reports, checklists, and internal knowledge systems',
      '85+ codes, 375+ standards, 55+ bylaws indexed',
    ],
  },
  {
    icon: Wrench,
    color: 'cyan',
    label: 'Custom',
    title: 'Custom Engineering AI Products',
    description: 'Internal tools and workflows built on top of our existing IP, connected to your document systems, templates, and project data.',
    features: [
      'Dedicated firm-specific workflows and interfaces',
      'Integration with SharePoint, Drive, Bluebeam, or internal databases',
      'Compliance trackers, asset dashboards, and engineering calculators',
      'Secure project-data handling with controlled access',
      'CRM, project management, and document system connectors',
    ],
  },
];

const useCases = [
  'Private AI report editor for internal engineering reports',
  'Automated civil and construction report generation from Word/Excel templates',
  'Building code search and citation assistant for project teams',
  'Firm-specific report writing assistant trained on approved language and templates',
  'On-premises document AI for confidential infrastructure or government projects',
  'Report QA assistant for formatting, structure, completeness, and consistency',
  'Internal building-code workflow connected to project location and report generation',
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

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  emerald: { border: 'border-emerald-500/20', bg: 'from-emerald-950/25', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  red:     { border: 'border-[#d92f37]/20', bg: 'from-[#d92f37]/10', text: 'text-[#d92f37]', dot: 'bg-[#d92f37]' },
  cyan:    { border: 'border-cyan-500/20', bg: 'from-cyan-950/25', text: 'text-cyan-400', dot: 'bg-cyan-400' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Services() {
  return (
    <>
      <SEO
        title="Consulting | Private Engineering AI Systems Built on VibeOps IP | VibeOps Technologies"
        description="VibeOps Consulting helps engineering, construction, and infrastructure firms deploy private, firm-specific AI systems using the technology behind Reportly and MapleCodes. Custom implementation, private deployment, monthly license. Built for sensitive engineering work."
        canonical="https://www.vibeops.ca/services"
      />
      <div className="pt-24">

        {/* ── Hero ── */}
        <section className="py-20 px-4">
          <Anim>
            <div className="container mx-auto text-center max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-emerald-400/75 mb-4 font-semibold">
                VibeOps Consulting
              </p>
              <h1 className="text-4xl md:text-[2.8rem] font-bold text-white mb-6 tracking-tight leading-[1.1]">
                Private Engineering AI Systems, Built Around Your Firm's Workflow
              </h1>
              <p className="text-white/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                We help engineering and infrastructure teams deploy custom versions of the technology behind Reportly and MapleCodes — tailored to their templates, code requirements, security needs, and internal reporting process.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a Consulting Call
                </VibeLinkButton>
                <VibeLinkButton href="/reportly" variant="outline" size="lg">
                  See Reportly
                </VibeLinkButton>
                <VibeLinkButton href="/maplecodes" variant="outline" size="lg">
                  Explore MapleCodes
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
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                What We Build
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                Three types of engagements. All built on VibeOps IP.
              </h2>
              <p className="text-white/40 max-w-2xl text-[15px] leading-relaxed mb-14">
                Every consulting engagement starts from working software — Reportly for report automation, MapleCodes for building code intelligence, or both. We customize and deploy it for your firm. You are not paying for a blank-page build.
              </p>
            </Anim>

            <div className="grid md:grid-cols-3 gap-5">
              {buildBuckets.map((bucket, i) => {
                const c = colorMap[bucket.color];
                return (
                  <Anim key={bucket.title} delay={i * 0.08}>
                    <div className={`flex flex-col p-7 rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} to-transparent h-full`}>
                      <span className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 border ${c.border} text-[9px] font-semibold ${c.text} uppercase tracking-[0.22em] mb-5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} /> {bucket.label}
                      </span>
                      <div className="flex items-center gap-2.5 mb-1">
                        <bucket.icon className={`w-5 h-5 ${c.text}`} />
                        <h3 className="text-lg font-bold text-white">{bucket.title}</h3>
                      </div>
                      <p className="text-[13px] text-white/45 leading-relaxed mt-3 mb-6">{bucket.description}</p>
                      <ul className="space-y-2.5 flex-1">
                        {bucket.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-white/55">
                            <Check className={`w-3.5 h-3.5 ${c.text} opacity-65 flex-shrink-0 mt-0.5`} /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Anim>
                );
              })}
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
                  <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                    Built on Proven IP
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                    Not generic AI consulting.
                  </h2>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-4 max-w-lg">
                    Most AI consulting starts with discovery decks and generic automation ideas. VibeOps starts with working IP: Reportly for engineering report automation and MapleCodes for building code intelligence.
                  </p>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-8 max-w-lg">
                    Consulting engagements customize and deploy that technology for your firm's specific workflows. Faster deployment, lower technical risk, more engineering-specific than anything built from scratch.
                  </p>
                </div>
              </Anim>

              <Anim delay={0.1}>
                <div className="lg:w-[420px] flex-shrink-0 w-full">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-7">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 font-semibold mb-6">What you get vs. a blank-page build</p>
                    <div className="space-y-5">
                      {[
                        { label: 'Engineering-specific document editing and report assembly', done: true },
                        { label: 'Civil engineering writing, formatting, and QA logic', done: true },
                        { label: 'Building code search, retrieval, and jurisdiction detection', done: true },
                        { label: 'Code-aware AI generation with RAG and vector search', done: true },
                        { label: 'Template mapping and approval workflow engine', done: true },
                        { label: 'Your firm-specific customizations', done: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          {item.done ? (
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-[13px] text-white/70">{item.label}</p>
                            <p className="text-[11px] text-white/30 mt-0.5">
                              {item.done ? 'Already built into VibeOps IP' : 'Added during your consulting engagement'}
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
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                Private Deployment
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                Built for sensitive engineering work.
              </h2>
              <p className="text-white/40 max-w-2xl text-[15px] leading-relaxed mb-14">
                Many engineering firms cannot use generic AI tools for active project work — especially when documents involve public infrastructure, government clients, confidential reports, or regulated data. VibeOps Consulting helps teams deploy private versions of our software so sensitive project information stays inside an approved environment.
              </p>
            </Anim>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Server, title: 'On-Premises & Dedicated Deployment', description: 'Run the full VibeOps stack in your own infrastructure or a dedicated private environment. No shared tenancy.' },
                { icon: Shield, title: 'PIPEDA-Aware Workflows', description: 'Designed to support privacy-conscious workflows and help firms meet internal and client data-handling requirements.' },
                { icon: Lock, title: 'Controlled Data Handling', description: 'Sensitive project data stays within your approved environment. No exposure to uncontrolled public AI tools.' },
                { icon: Lightbulb, title: 'Government & Infrastructure Ready', description: 'Suitable for firms working on municipal, provincial, federal, and confidential infrastructure projects.' },
              ].map((item, i) => (
                <Anim key={item.title} delay={i * 0.06}>
                  <div className="p-6 rounded-xl border border-white/6 bg-white/[0.02] h-full">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4">
                      <item.icon className="w-4.5 h-4.5 text-emerald-400/70" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed">{item.description}</p>
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
                  <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                    Commercial Model
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                    Implementation + monthly license.
                  </h2>
                  <p className="text-white/45 text-[15px] leading-relaxed mb-4 max-w-lg">
                    Our consulting model combines custom implementation with licensed access to VibeOps technology. We configure the system around your firm's workflows, deploy it in the environment that matches your security requirements, and provide ongoing access through a monthly software license.
                  </p>
                  <p className="text-white/45 text-[15px] leading-relaxed max-w-lg">
                    You are not just paying for hours. You are getting access to VibeOps-owned IP — customized, deployed, and maintained for your firm.
                  </p>
                </div>
              </Anim>

              <Anim delay={0.1}>
                <div className="lg:w-[400px] flex-shrink-0 w-full space-y-4">
                  {[
                    { icon: CreditCard, step: '01', title: 'Upfront Implementation Fee', description: 'We scope, configure, customize, and deploy the system around your firm\'s templates, workflows, and security requirements.' },
                    { icon: Repeat, step: '02', title: 'Monthly Software License', description: 'Ongoing access to the VibeOps IP and platform. Includes updates, hosting (if applicable), and standard support.' },
                    { icon: Wrench, step: '03', title: 'Optional Ongoing Development', description: 'Additional custom development, new integrations, expanded report types, or additional building code workflows scoped as needed.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-5 rounded-xl border border-white/6 bg-white/[0.02]">
                      <div className="flex-shrink-0">
                        <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.22em]">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-[12.5px] text-white/40 leading-relaxed">{item.description}</p>
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
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                Example Use Cases
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
                What firms are building with us.
              </h2>
              <p className="text-white/40 max-w-2xl text-[15px] leading-relaxed mb-12">
                Every engagement is different, but the work typically falls into these categories.
              </p>
            </Anim>

            <div className="grid md:grid-cols-2 gap-3">
              {useCases.map((uc, i) => (
                <Anim key={uc} delay={i * 0.04}>
                  <div className="flex items-start gap-3 p-5 rounded-xl border border-white/6 bg-white/[0.02] hover:border-emerald-500/15 transition-colors">
                    <Check className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                    <p className="text-[13.5px] text-white/60">{uc}</p>
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
                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 mb-3 font-semibold">
                  Get started
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Tell us what your firm needs.
                </h2>
                <p className="text-white/40 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
                  Book a 30-minute call. We'll look at the report that costs you the most hours, the compliance workflows you need to tighten, and whether a private VibeOps deployment makes sense for your team.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <VibeLinkButton href="/contact" variant="primary" size="lg">
                    Book a Consulting Call
                  </VibeLinkButton>
                  <VibeLinkButton href="/reportly" variant="outline" size="lg">
                    See Reportly
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
