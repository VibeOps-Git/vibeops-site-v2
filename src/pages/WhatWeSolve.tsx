// src/pages/WhatWeSolve.tsx
// The spine of the site: the six problems firms recognise, stated as problems.
// A visitor should find themselves here without knowing anything about AI.

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import AnimatedContent from '../components/AnimatedContent';
import { SectionDivider } from '../components/ui/Section';
import { VibeLinkButton } from '@/components/ui/VibeButton';
import { JOBS } from '@/data/jobs';

export default function WhatWeSolve() {
  return (
    <>
      <SEO
        title="What We Solve for Engineering Firms"
        description="The six problems AE firms hire VibeOps to solve: AI on confidential data, document production, disconnected systems, tools that don't exist, knowledge locked in past projects, and oversight."
        canonical="https://www.vibeops.ca/what-we-solve"
        breadcrumbs={[{ name: 'What We Solve', url: '/what-we-solve' }]}
      />
      <div className="pt-24">
        <section className="py-20 px-4">
          <AnimatedContent distance={50} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.15}>
            <div className="container mx-auto max-w-3xl text-center 3xl:max-w-4xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-primary mb-4 font-semibold">
                What We Solve
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2.8rem] 3xl:text-[3.6rem]">
                Six problems we hear in almost every firm
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                These came out of documented conversations with more than a hundred
                architecture, engineering and construction professionals. You don&rsquo;t
                need a view on AI to recognise them. Find the one that sounds like your
                firm.
              </p>
            </div>
          </AnimatedContent>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        <section className="py-16 px-4">
          <div className="container mx-auto grid max-w-5xl gap-5 md:grid-cols-2 max-w-[min(92vw,1600px)] 3xl:grid-cols-3 3xl:gap-6">
            {JOBS.map((job, i) => (
              <AnimatedContent key={job.id} distance={40} direction="vertical" duration={0.6} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.2} delay={i * 0.06}>
                <Link
                  to={`/what-we-solve/${job.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-colors hover:border-primary/40"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
                    <job.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h2 className="mb-3 text-[19px] font-bold leading-snug text-foreground">
                    “{job.headline}”
                  </h2>
                  <p className="mb-6 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    {job.summary}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                    How we solve it
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </section>

        <SectionDivider className="mx-auto max-w-5xl" />

        <section className="py-20 px-4">
          <AnimatedContent distance={50} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.25}>
            <div className="container mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                None of these quite fit?
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">
                That happens a lot, and it usually means the problem is worth a
                conversation rather than a web page. Tell us what your firm is actually
                dealing with.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a call
                </VibeLinkButton>
                <VibeLinkButton href="/how-we-work" variant="outline" size="lg">
                  See how we work
                </VibeLinkButton>
              </div>
            </div>
          </AnimatedContent>
        </section>
      </div>
    </>
  );
}
