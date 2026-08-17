// src/pages/HowWeWork.tsx
// Step 2 of the journey: the champion has forwarded a link to a principal.
// This page answers what a principal actually asks: what does it cost, what do
// we own, how long, and what happens if it doesn't work. Grounded in the
// engagement structure we actually contract under.
//
// The model is forward deployed and it should read that way here: our engineers
// work inside the client's projects, and what we learn there becomes capability
// we carry to the next firm. That is stated as a client benefit, never as our
// business model.

import { Search, FileCheck, Hammer, Repeat, KeyRound, HandshakeIcon, ArrowRight } from 'lucide-react';
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

const PHASES = [
  {
    icon: Search,
    step: '01',
    title: 'Discovery',
    lead: 'We sit with your team before we write a line of code.',
    detail:
      'Our engineers work alongside yours, on your real files and your real projects, and turn what they learn into a confirmed technical and functional plan. Discovery is a paid, scoped phase with defined deliverables. It isn’t a free sales call.',
    outputs: [
      'Technical development plan',
      'Domain knowledge memorandum',
      'Workflow charts and functional descriptions',
      'Data governance, security and usage plan',
      'Integration and dependency checklist',
      'Prioritised build backlog and confirmed scope',
      'Risk, assumptions and open questions register',
    ],
  },
  {
    icon: FileCheck,
    step: '02',
    title: 'Proof of concept gate',
    lead: 'We prove the hard part works on your material before you fund the build.',
    detail:
      'Some engagements hang on AI doing one specific thing: extracting requirements, reading drawings, drafting to your standard. We evaluate that against your real documents and verified human ground truth, measure it, write down where it is weak, and confirm the acceptance criteria still make sense. If it does not clear the bar, you find out here rather than three months in.',
    outputs: [
      'Evaluation against representative project material',
      'Measured accuracy, with limitations documented in writing',
      'Acceptance criteria confirmed or revised before build',
      'You approve Discovery in writing before development begins',
    ],
  },
  {
    icon: Hammer,
    step: '03',
    title: 'Build',
    lead: 'Fixed scope, fixed fee, milestone-based.',
    detail:
      'We build to the backlog you approved, against defined acceptance tests covering function, workflow, performance and security. You are not buying an open-ended hourly engagement, and the scope does not drift without a written change.',
    outputs: [
      'Fixed build fee payable across defined milestones',
      'Acceptance testing against criteria agreed up front',
      'Written change control for anything outside scope',
    ],
  },
  {
    icon: Repeat,
    step: '04',
    title: 'Pilot and revision',
    lead: 'Real users, real projects, before anyone commits further.',
    detail:
      'You run it inside your firm on live work and give consolidated feedback through structured revision periods. It is accepted when the defined tests pass and you approve it in writing, not when we declare it finished.',
    outputs: [
      'Internal pilot on live project work',
      'Structured revision periods with consolidated feedback',
      'Acceptance on your written approval',
    ],
  },
  {
    icon: KeyRound,
    step: '05',
    title: 'Handover and ongoing capability',
    lead: 'You own what we built. We stay as the team behind it.',
    detail:
      'On acceptance you own the delivered platform and its commercial rights: the application codebase, your workflows, prompts, architecture, configuration and documentation. We keep only the background tooling we brought with us, licensed to you as embedded in what we delivered. Hosting, support and continued development run under a separate agreement, because keeping us should be your choice.',
    outputs: [
      'You own the delivered codebase, workflows and documentation',
      'Ongoing hosting, support and development under a separate agreement',
      'No lock-in dressed up as a partnership',
    ],
  },
];

export default function HowWeWork() {
  return (
    <>
      <SEO
        title="How We Work With Engineering Firms"
        description="Discovery, a proof-of-concept gate, fixed-fee build, internal pilot, then handover. How VibeOps embeds with AE firms as their AI engineering team, and what you own at the end."
        canonical="https://www.vibeops.ca/how-we-work"
        breadcrumbs={[{ name: 'How We Work', url: '/how-we-work' }]}
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="px-4 py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl text-center 3xl:max-w-4xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
                How We Work
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2.8rem]">
                We deploy into your firm, not into a ticket queue
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Your firm has engineering capacity and no software team. We become that
                team, and we do it from inside: our engineers work on your projects,
                with your people, on your real files. Then we prove the hard part on
                your own material, build to a fixed scope, and hand you something you
                own.
              </p>
            </div>
          </Anim>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* The five phases */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-[min(92vw,1500px)]">
            <Anim>
              <h2 className="mb-14 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                What an engagement looks like
              </h2>
            </Anim>
            <div className="space-y-5">
              {PHASES.map((p, i) => (
                <Anim key={p.step} delay={i * 0.05}>
                  <div className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="flex-shrink-0 md:w-44 3xl:w-56">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
                          <p.icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                          {p.step}
                        </p>
                        <h3 className="mt-1 text-[17px] font-bold text-foreground">{p.title}</h3>
                      </div>
                      <div className="flex-1">
                        <p className="mb-3 text-[15px] font-semibold text-foreground">{p.lead}</p>
                        <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
                          {p.detail}
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {p.outputs.map((o) => (
                            <li key={o} className="flex items-start gap-2 text-[12.5px] text-muted-foreground">
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* The principle that governs everything */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-[min(92vw,1500px)]">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                The rule we build to
              </p>
              <h2 className="mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                AI drafts and accelerates. A licensed professional decides.
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground">
                This is written into how we scope work, not added as a disclaimer.
                Everything we build assumes a qualified engineer reviews and signs
                what goes out the door. In a profession where somebody stamps the
                deliverable and carries the liability, a system that cannot be
                checked is not an asset.
              </p>
            </Anim>
            <div className="grid gap-4 md:grid-cols-3 3xl:gap-6">
              {[
                {
                  title: 'Never an unchecked decision-maker',
                  detail:
                    'AI drafts and accelerates. It doesn’t make engineering decisions on its own.',
                },
                {
                  title: 'Traceable to source',
                  detail:
                    'Outputs tie back to the field data, prior work or standard they came from, so review is verification rather than rework.',
                },
                {
                  title: 'Auditable by design',
                  detail:
                    'User validation, auditability and transparency around processing and data handling are core design principles in every build.',
                },
              ].map((c, i) => (
                <Anim key={c.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-[14.5px] font-semibold text-foreground">{c.title}</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{c.detail}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Who we are and aren't */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-[min(92vw,1500px)]">
            <Anim>
              <h2 className="mb-10 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                What we are, and what we are not
              </h2>
            </Anim>
            <div className="grid gap-5 md:grid-cols-2">
              <Anim>
                <div className="h-full rounded-2xl border border-primary/25 bg-primary/[0.04] p-7">
                  <div className="mb-4 flex items-center gap-2">
                    <HandshakeIcon className="h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                      What we are
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'The AI engineering capability your firm has not hired',
                      'Civil engineers who also write the software',
                      'Embedded in your projects rather than briefed from a distance',
                      'Accountable for a working outcome, not for hours logged',
                      'Working inside the security boundary your IT team sets',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Anim>
              <Anim delay={0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    What we are not
                  </p>
                  <ul className="space-y-3">
                    {[
                      'A software product you buy seats of',
                      'A strategy consultancy that delivers a slide deck',
                      'An AI training or upskilling provider',
                      'A staffing agency billing bodies by the hour',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Anim>
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Why the model works this way. The compounding argument, stated as a
            client benefit rather than as our business model. */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-[min(92vw,1500px)]">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Why we work this way
              </p>
              <h2 className="mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                The second firm pays for less of it than the first
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground">
                Working embedded is slower to start and much better at the finish. It
                is also how we build things we can use again. A code lookup, a document
                extraction pipeline, a review workflow: each one comes out of a real
                problem at a real firm, and each one arrives at the next engagement
                already working. You get the benefit of every project before yours, and
                you still own everything we build for you.
              </p>
            </Anim>
            <div className="grid gap-4 md:grid-cols-3 3xl:gap-6">
              {[
                {
                  title: 'We already know the industry',
                  detail:
                    'We’re civil engineers. You aren’t funding six weeks of us working out what a submittal is, or why the stamp matters.',
                },
                {
                  title: 'We bring working parts, not slides',
                  detail:
                    'Where something we have already built fits your problem, it starts the engagement rather than getting quoted into it.',
                },
                {
                  title: 'You own your side of it',
                  detail:
                    'The platform we deliver, and its commercial rights, are yours. Our background tooling stays ours and comes licensed inside what you own.',
                },
              ].map((c, i) => (
                <Anim key={c.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-[14.5px] font-semibold text-foreground">{c.title}</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{c.detail}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* CTA */}
        <section className="px-4 py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl text-center 3xl:max-w-4xl">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Start with the problem, not the solution
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Bring us the workflow that costs your firm the most and we&rsquo;ll tell
                you honestly whether it&rsquo;s worth building software for. Sometimes
                the answer is no.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a call
                </VibeLinkButton>
                <VibeLinkButton href="/proof" variant="outline" size="lg">
                  See what we have built
                </VibeLinkButton>
                <VibeLinkButton href="/security" variant="outline" size="lg">
                  Read our data handling
                </VibeLinkButton>
              </div>
            </div>
          </Anim>
        </section>
      </div>
    </>
  );
}
