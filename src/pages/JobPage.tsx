// src/pages/JobPage.tsx
// One template, six problems. Adding a seventh job means adding a data object,
// not a page. Every job page ends by pointing at the same three destinations:
// how we work, what we've built, and how IT gets comfortable.

import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Quote } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeLinkButton } from '@/components/ui/VibeButton';
import { getJob, JOBS } from '@/data/jobs';
import { workForJob } from '@/data/work';

function Anim({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <AnimatedContent distance={45} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.15} delay={delay}>
      {children}
    </AnimatedContent>
  );
}

export default function JobPage() {
  const { slug } = useParams<{ slug: string }>();
  const job = slug ? getJob(slug) : undefined;

  if (!job) return <Navigate to="/what-we-solve" replace />;

  const related = job.related.map(getJob).filter(Boolean);
  const proof = workForJob(job.id);

  return (
    <>
      <SEO
        title={job.seoTitle}
        description={job.seoDescription}
        canonical={`https://www.vibeops.ca/what-we-solve/${job.id}`}
        service={{ name: job.seoTitle, serviceType: job.navLabel }}
        breadcrumbs={[
          { name: 'What We Solve', url: '/what-we-solve' },
          { name: job.navLabel, url: `/what-we-solve/${job.id}` },
        ]}
      />
      <div className="pt-24">
        {/* Hero — the problem, in their words */}
        <section className="px-4 py-16 md:py-20">
          <Anim>
            <div className="container mx-auto max-w-3xl">
              <Link
                to="/what-we-solve"
                className="mb-8 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                ← What we solve
              </Link>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary">
                <job.icon className="h-5 w-5 text-primary" />
              </div>
              <h1 className="mb-6 text-[2rem] font-bold leading-[1.12] tracking-tight text-foreground md:text-[2.7rem]">
                “{job.headline}”
              </h1>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                {job.summary}
              </p>
              <p className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                Usually felt by: <span className="text-foreground">{job.feltBy}</span>
              </p>
            </div>
          </Anim>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* The situation */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-3xl">
            <Anim>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                What we hear
              </p>
              <div className="space-y-5">
                {job.situation.map((p, i) => (
                  <p key={i} className="text-[15px] leading-[1.8] text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </Anim>

            <Anim delay={0.1}>
              <figure className="mt-12 rounded-2xl border border-border bg-card p-7 shadow-sm">
                <Quote className="mb-4 h-5 w-5 text-primary" />
                <blockquote className="text-[16px] italic leading-relaxed text-foreground">
                  “{job.evidence.quote}”
                </blockquote>
                <figcaption className="mt-4 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  {job.evidence.attribution}
                </figcaption>
              </figure>
            </Anim>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* What it costs */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-3xl">
            <Anim>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                What it costs you
              </p>
              <ul className="space-y-4">
                {job.cost.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-[15px] leading-[1.7] text-muted-foreground">{c}</span>
                  </li>
                ))}
              </ul>
            </Anim>
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* What we do */}
        <section className="px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <Anim>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                What we do about it
              </p>
              <h2 className="mb-12 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                How we solve this as your engineering team
              </h2>
            </Anim>
            <div className="grid gap-5 md:grid-cols-2">
              {job.whatWeDo.map((w, i) => (
                <Anim key={w.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-3 flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <h3 className="text-[15px] font-semibold text-foreground">{w.title}</h3>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                      {w.detail}
                    </p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        {/* Proof for this specific job */}
        {proof.length > 0 && (
          <>
            <SectionDivider className="mx-auto max-w-5xl" />
            <section className="px-4 py-16 md:py-20">
              <div className="container mx-auto max-w-5xl">
                <Anim>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                    Work on this problem
                  </p>
                  <h2 className="mb-10 text-3xl font-bold tracking-tight text-foreground">
                    What we have built here
                  </h2>
                </Anim>
                <div className="grid gap-4 md:grid-cols-2">
                  {proof.map((w, i) => (
                    <Anim key={w.id} delay={i * 0.06}>
                      <Link
                        to="/proof"
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                            {w.status}
                          </span>
                        </div>
                        <h3 className="mb-1.5 text-[16px] font-bold text-foreground">{w.title}</h3>
                        <p className="mb-3 text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
                          {w.client}
                        </p>
                        <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
                          {w.built}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                          See the work
                          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </Anim>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <SectionDivider className="mx-auto max-w-5xl" />

        {/* CTA ladder — three commitment levels, incl. the one for IT */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-3xl">
            <Anim>
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                  Is this your firm?
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  We start every engagement by scoping the real problem, in writing,
                  before anyone commits to a build.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <VibeLinkButton href="/contact" variant="primary" size="lg">
                    Book a call
                  </VibeLinkButton>
                  <VibeLinkButton href="/how-we-work" variant="outline" size="lg">
                    See how we work
                  </VibeLinkButton>
                  <VibeLinkButton href="/security" variant="outline" size="lg">
                    Read our data handling
                  </VibeLinkButton>
                </div>
              </div>
            </Anim>

            {related.length > 0 && (
              <Anim delay={0.1}>
                <div className="mt-14">
                  <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Firms with this problem usually also have
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <Link
                        key={r!.id}
                        to={`/what-we-solve/${r!.id}`}
                        className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
                      >
                        <p className="mb-1.5 text-[14.5px] font-semibold leading-snug text-foreground">
                          “{r!.headline}”
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11.5px] text-primary">
                          Read more
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Anim>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export { JOBS };
