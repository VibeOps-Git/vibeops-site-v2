// src/pages/Proof.tsx
//
// Step 2 of the journey: the page a champion forwards to a principal.
//
// Leads with engineering evidence — implementations, the discovery base, the
// advisory board. Earlier client work in adjacent industries is kept, because
// it is legitimate, but placed below and labelled honestly so a principal at an
// AE firm is not evaluating us on a landing page for a painting company.
//
// Client names and commercial terms are deliberately absent. See the rules at
// the top of src/data/work.ts.

import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeLinkButton } from '@/components/ui/VibeButton';
import { WORK } from '@/data/work';
import { getJob } from '@/data/jobs';

function Anim({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <AnimatedContent distance={45} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.15} delay={delay}>
      {children}
    </AnimatedContent>
  );
}

const EARLIER_WORK = [
  {
    name: 'Jonathan Stacey',
    role: 'Co-Founder, GrantFundPro',
    context: 'Checkout workflow customisation and responsive scaling support',
    quote:
      'VibeOps helped us rapidly implement and customize a scalable checkout workflow within our platform. Their team was extremely responsive, solved several technical integration challenges quickly, and delivered a clean, functional implementation that allowed us to move forward without delays.',
    image: '/clients/jonathan.jpg',
  },
  {
    name: 'Steve Lisle',
    role: 'CEO & Founder, Effortlo',
    context: 'Automated follow-up system for missed leads',
    quote:
      'VibeOps built an Outlook follow-up system that flags leads I haven’t replied to and reminds me to re-engage. They were extremely professional and incredibly fast on both communication and turnaround.',
    image: '/clients/steve.png',
  },
];

export default function Proof() {
  return (
    <>
      <SEO
        title="Our Work With Engineering Firms"
        description="Implementations VibeOps has delivered for architecture and engineering firms — submittal intelligence, report production, and jurisdictional code intelligence — plus the discovery base behind them."
        canonical="https://www.vibeops.ca/proof"
        breadcrumbs={[{ name: 'Our Work', url: '/proof' }]}
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="px-4 py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
                Our Work
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2.8rem]">
                What we have actually built
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Real engagements with engineering and construction firms. Client names
                and commercial terms are held back until those clients tell us
                otherwise — the work is described honestly enough that you can judge it
                either way.
              </p>
            </div>
          </Anim>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Implementations */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              {WORK.map((w, i) => (
                <Anim key={w.id} delay={i * 0.06}>
                  <article className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-9">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                        {w.status}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {w.client}
                      </span>
                    </div>

                    <h2 className="mb-5 text-[22px] font-bold leading-snug tracking-tight text-foreground md:text-[26px]">
                      {w.title}
                    </h2>

                    <div className="mb-6 space-y-4">
                      <div>
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          The problem
                        </p>
                        <p className="text-[14px] leading-[1.75] text-muted-foreground">{w.problem}</p>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          What we built
                        </p>
                        <p className="text-[14px] leading-[1.75] text-muted-foreground">{w.built}</p>
                      </div>
                    </div>

                    <ul className="mb-6 space-y-2 border-t border-border pt-5">
                      {w.detail.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {w.jobs.map((jid) => {
                        const job = getJob(jid);
                        if (!job) return null;
                        return (
                          <Link
                            key={jid}
                            to={`/what-we-solve/${jid}`}
                            className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                          >
                            {job.navLabel}
                          </Link>
                        );
                      })}
                    </div>
                  </article>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* The discovery base — this is real, distinctive evidence */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-4xl">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                How we know
              </p>
              <h2 className="mb-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                Every problem on this site came from a conversation, not a whiteboard
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground">
                Before writing software for this industry we ran 260 documented
                discovery conversations with engineers, principals, digital leads and
                operations managers across architecture, engineering, construction and
                public infrastructure — from two-person consultancies to firms of
                35,000. The six problems we work on are the ones that kept recurring.
              </p>
            </Anim>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { stat: '260', label: 'Documented discovery conversations with AE and construction professionals' },
                { stat: '6', label: 'Recurring problems those conversations converged on' },
                { stat: '2', label: 'UBC engineering faculty advisors on our advisory board' },
              ].map((s, i) => (
                <Anim key={s.label} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                    <p className="mb-2 text-4xl font-black tracking-tight text-foreground">{s.stat}</p>
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">{s.label}</p>
                  </div>
                </Anim>
              ))}
            </div>
            <Anim delay={0.15}>
              <p className="mt-8 text-center text-[13px] text-muted-foreground">
                We are civil engineers who write software.{' '}
                <Link to="/team" className="text-primary hover:underline">
                  Meet the team
                </Link>
                .
              </p>
            </Anim>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* Earlier work — kept, but honestly framed and clearly secondary */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-4xl">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Earlier work
              </p>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
                Before we focused on engineering firms
              </h2>
              <p className="mb-10 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                We built software for clients in other industries first. It is not
                engineering work and we are not going to present it as though it were,
                but it is what these clients said about working with us.
              </p>
            </Anim>
            <div className="grid gap-5 md:grid-cols-2">
              {EARLIER_WORK.map((r, i) => (
                <Anim key={r.name} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
                        <img src={r.image} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-foreground">{r.name}</h3>
                        <p className="mb-1.5 text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
                          {r.role}
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, k) => (
                            <Star key={k} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mb-3 text-[11.5px] font-medium text-primary">{r.context}</p>
                    <p className="text-[13px] italic leading-relaxed text-muted-foreground">“{r.quote}”</p>
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
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Your firm could be the next one
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Every engagement starts the same way: we scope the real problem in
                writing before anyone commits to building anything.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a call
                </VibeLinkButton>
                <VibeLinkButton href="/how-we-work" variant="outline" size="lg">
                  See how we work
                </VibeLinkButton>
              </div>
              <p className="mt-8 text-[13px] text-muted-foreground">
                Not sure where you fit?{' '}
                <Link to="/what-we-solve" className="inline-flex items-center gap-1 text-primary hover:underline">
                  Start with the six problems <ArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </Anim>
        </section>
      </div>
    </>
  );
}
