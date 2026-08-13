// src/pages/Security.tsx
//
// Step 3 of the journey. A principal has forwarded this to IT or security, and
// that reviewer will never book a call — they want a document.
//
// Written as direct answers to the questions AE firms actually raised in
// discovery. Deliberately contains no certification claims we do not hold and
// no guarantees we cannot honour: an IT reviewer spots invented compliance
// language instantly, and it costs more credibility than it buys.

import { Link } from 'react-router-dom';
import { ShieldCheck, Server, EyeOff, FileLock2, Users, ScrollText } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeLinkButton } from '@/components/ui/VibeButton';

function Anim({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <AnimatedContent distance={45} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.15} delay={delay}>
      {children}
    </AnimatedContent>
  );
}

const PRINCIPLES = [
  {
    icon: Server,
    title: 'Deployed where you say',
    detail:
      'Your cloud tenancy, your own infrastructure, or a dedicated environment scoped to your firm. The deployment model is a decision your security team makes during Discovery, before anything is built — not a constraint we hand you afterwards.',
  },
  {
    icon: EyeOff,
    title: 'Your data does not train anything',
    detail:
      'Project material is not used to train or fine-tune models, and it is not pooled across clients. What belongs to your firm and your clients stays scoped to your deployment.',
  },
  {
    icon: FileLock2,
    title: 'Data residency is a requirement, not a preference',
    detail:
      'Firms working on government, healthcare, defence and regulated infrastructure told us residency is a hard gate. Where your contracts or policies require data to remain in a specific jurisdiction, that becomes a documented constraint on the architecture.',
  },
  {
    icon: Users,
    title: 'Access follows your rules',
    detail:
      'Role-based access aligned to how your firm already separates project teams, disciplines and clients. Where you need integration with your existing identity provider, that is scoped in Discovery.',
  },
  {
    icon: ScrollText,
    title: 'Everything is written down before it is built',
    detail:
      'Every engagement produces a data governance, security and usage plan and an integration and dependency checklist as Discovery deliverables. Your team approves them in writing before development starts.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditable by design',
    detail:
      'Systems record what was generated, from which source, reviewed by whom and when. If a deliverable is challenged later, the record exists.',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Does our project data leave our environment?',
    a: 'That is determined by the deployment model you choose during Discovery. We support deployment into your own cloud tenancy or infrastructure so that project data remains inside your boundary. Where a component calls an external model provider, that path is documented explicitly in the data governance plan — including what is sent, what is retained, and what alternatives exist — so your team is approving a known architecture rather than a black box.',
  },
  {
    q: 'Is our data used to train AI models?',
    a: 'No. Your project material is not used to train or fine-tune models, and it is not pooled with other clients’ data. Where we build on third-party model providers, we configure the integration so that submitted content is not retained for training by that provider.',
  },
  {
    q: 'Can this run entirely on our own infrastructure?',
    a: 'Yes, and several firms have told us this is the only arrangement they can approve. Self-hosted and dedicated-environment deployments are a supported model. The trade-offs — infrastructure cost, update cadence, and what your team takes on operationally — are scoped honestly in Discovery rather than glossed over.',
  },
  {
    q: 'What about client confidentiality and contractual obligations?',
    a: 'Engineering firms hold project material under client confidentiality terms, and in many cases past reports are client property that cannot be shared externally at all. We treat those obligations as a design constraint. Discovery identifies which material can be used, under what conditions, and what must remain out of scope, and that is recorded before any build.',
  },
  {
    q: 'How do we know the AI output is accurate enough to rely on?',
    a: 'Where an engagement depends on AI performing a specific task, we evaluate it against your real documents and verified human ground truth at a proof-of-concept gate before the build begins. We measure performance, document the limitations in writing, and confirm the acceptance criteria still hold. Everything we build assumes a qualified engineer reviews and signs the output — the system accelerates and evidences that review, it does not replace it.',
  },
  {
    q: 'Who owns what you build for us?',
    a: 'On acceptance, your firm owns the delivered platform and its commercial rights: the application codebase, your firm-specific workflows, prompts, architecture, configuration and related documentation developed under the engagement. We retain ownership of our pre-existing background tooling and license it to you as embedded within what we delivered.',
  },
  {
    q: 'What happens to our systems if we stop working with you?',
    a: 'You keep what you own. Because the delivered codebase, configuration and documentation transfer to you on acceptance, the system does not stop being yours if the relationship ends. Hosting, support and ongoing development run under a separate agreement precisely so that continuing with us stays a choice rather than a dependency.',
  },
  {
    q: 'Are you certified against a specific security standard?',
    a: 'We are a small engineering firm and we are not going to claim certifications we do not hold. What we do is work to the standard your security team sets, produce the documentation your review process requires, and put the architecture, data flows and dependencies in front of your reviewers before we build. If your procurement process requires a specific certification, tell us early — it is better established at the start than discovered at contract stage.',
  },
  {
    q: 'Our IT department has blocked AI tools before. How is this different?',
    a: 'Most general-purpose AI tools ask a firm to make an exception to its own policy. We start from the policy instead. The deployment model, data handling, access control and retention are scoped with your IT team as Discovery deliverables and approved in writing before development. IT is a stakeholder in the design, not an obstacle encountered at rollout.',
  },
  {
    q: 'How is this different from the Microsoft Copilot licence we already have?',
    a: 'General assistants are broad and shallow: useful for email and meeting notes, and typically blocked at the boundary of actual project data — which is where firms told us the value was. We build systems that run on your templates, your standards and your project material inside the boundary your security team approved, and that are evaluated for accuracy on your documents before you depend on them. Several firms we work with have Copilot deployed and still cannot use it for the work described on this site.',
  },
];

export default function Security() {
  return (
    <>
      <SEO
        title="Security & Data Handling"
        description="How VibeOps deploys AI inside the boundary your security team approves: deployment models, data residency, model training, ownership, and the questions IT departments at engineering firms actually ask."
        canonical="https://www.vibeops.ca/security"
        faq={FAQ}
        breadcrumbs={[{ name: 'Security & Data Handling', url: '/security' }]}
      />
      <div className="pt-24">
        {/* Hero — speaks directly to the reviewer */}
        <section className="px-4 py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
                Security &amp; Data Handling
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2.8rem]">
                Written for the person who has to approve this
              </h1>
              <p className="mb-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                If someone at your firm forwarded you this link, you are probably the
                IT, security or risk reviewer. This page exists so you can evaluate
                what we do without booking a call or sitting through a demo.
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Engineering firms told us the same thing over and over during
                discovery: the technology was never the blocker, the approval was. So
                we design for your approval process from the first week of an
                engagement.
              </p>
            </div>
          </Anim>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Principles */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <Anim>
              <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                How we handle your data
              </h2>
            </Anim>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <Anim key={p.title} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary">
                      <p.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="mb-2 text-[14.5px] font-semibold text-foreground">{p.title}</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{p.detail}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* FAQ — the actual review questions */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-3xl">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Review questions
              </p>
              <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                The questions we get asked
              </h2>
            </Anim>
            <div className="space-y-4">
              {FAQ.map((f, i) => (
                <Anim key={f.q} delay={Math.min(i, 6) * 0.04}>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
                    <h3 className="mb-3 text-[16px] font-semibold leading-snug text-foreground">
                      {f.q}
                    </h3>
                    <p className="text-[14px] leading-[1.75] text-muted-foreground">{f.a}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* CTA — low friction, no form */}
        <section className="px-4 py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Have a question this does not answer?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Send it to us directly. If your review process needs specific
                documentation, tell us at the start of the conversation rather than at
                contract stage — it is much easier to design for.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Ask us directly
                </VibeLinkButton>
                <VibeLinkButton href="/how-we-work" variant="outline" size="lg">
                  How an engagement runs
                </VibeLinkButton>
              </div>
              <p className="mt-8 text-[13px] text-muted-foreground">
                Also relevant:{' '}
                <Link to="/what-we-solve/secure-ai" className="text-primary hover:underline">
                  AI on confidential data
                </Link>{' '}
                and{' '}
                <Link to="/what-we-solve/ai-governance" className="text-primary hover:underline">
                  oversight and governance
                </Link>
                .
              </p>
            </div>
          </Anim>
        </section>
      </div>
    </>
  );
}
