import { Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import AnimatedContent from "../components/AnimatedContent";
import { SectionDivider } from "../components/ui/Section";
import { VibeCard } from "../components/ui/VibeCard";
import { VibeLinkButton } from "@/components/ui/VibeButton";

type Review = {
  name: string;
  role: string;
  context: string;
  quote: string;
  image: string;
};

const reviews: Review[] = [
  {
    "name": "Jonathan Stacey",
    "role": "Co-Founder, GrantFundPro",
    "context": "Bubble + Stripe checkout customization and responsive scaling support",
    "quote": "VibeOps helped us rapidly implement and customize a scalable checkout workflow within our platform. Their team was extremely responsive, solved several technical integration challenges quickly, and delivered a clean, functional implementation that allowed us to move forward without delays. We appreciated their ability to work collaboratively with our developers and translate requirements into practical solutions.",
    "image": "/clients/jonathan.jpg"
  },
  {
    name: "Steve Lisle",
    role: "CEO & Founder, Effortlo",
    context: "Automated Outlook follow-up system for missed leads",
    quote:
      "VibeOps built an Outlook follow-up system that flags leads I haven’t replied to and reminds me to re-engage. They were extremely professional and incredibly fast on both communication and turnaround.",
    image: "/clients/steve.png",
  },
  {
    name: "Ryan Snair",
    role: "Owner, Pro Painting LLC",
    context: "Landing page for Pro Painting LLC",
    quote:
      "They created a clean, effective landing page for my painting business that makes it easy for customers to understand what we do and reach out. The process was smooth, responsive, and dialed in to what I actually needed.",
    image: "/clients/ryan.jpg",
  },
];


export default function CaseStudies() {
  return (
    <>
      <SEO
        title="Client Work & Case Studies"
        description="Engineering automation, construction reporting tools, and workflow software built by VibeOps for real clients. See our portfolio and client outcomes."
        canonical="https://www.vibeops.ca/case-studies"
      />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-20 px-4">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.15}
        >
          <div className="container mx-auto text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Case Studies
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              What we've shipped
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A look at the work we've done and what clients had to say about it.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Reviews section */}
        <section className="py-16">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground mb-3">What Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real feedback from teams we've built automation and software for.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <AnimatedContent
                key={review.name}
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.3}
                delay={idx * 0.1}
              >
                <div className="h-full p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-border bg-secondary flex-shrink-0">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{review.name}</h3>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        {review.role}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-primary font-medium">
                      {review.context}
                    </p>

                    <p className="text-muted-foreground leading-relaxed italic">
                      "{review.quote}"
                    </p>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>

          <p className="text-sm text-center text-muted-foreground mt-8">
            Longer write-ups are coming as we wrap up pilots and get the okay to share details.
          </p>
        </section>

        <SectionDivider />

        {/* CTA */}
        <section className="py-16">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <VibeCard variant="gradient" hover={false} className="text-center p-10 md:p-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Want to be the next one?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Let's scope a pilot with a clear before and after, and real time saved. We'll start with the workflow that's slowing your team down the most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a Vibe Check
                </VibeLinkButton>
                <VibeLinkButton href="/services" variant="outline" size="lg">
                  See Our Services
                </VibeLinkButton>
              </div>
            </VibeCard>
          </AnimatedContent>
        </section>
        </div>
      </div>
    </>
  );
}
