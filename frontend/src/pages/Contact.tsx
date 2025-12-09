import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Aurora from "../components/Aurora";
import AnimatedContent from "../components/AnimatedContent";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (config: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
      initPopupWidget: (config: { url: string }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

type ContactChannel = {
  label: string;
  person: string;
  email: string;
  blurb: string;
  subject: string;
  body: string;
};

const CALENDLY_URL =
  "https://calendly.com/zander-vibeops/30min?primary_color=00ffcc&text_color=e5e7eb&background_color=0f1115&hide_gdpr_banner=1";

const contactChannels: ContactChannel[] = [
  {
    label: "Executive & Product Strategy",
    person: "Zander Dent",
    email: "zander@vibeops.ca",
    blurb:
      "Big-picture questions, partnerships, and how Reportly or custom tools could fit your firm.",
    subject: "VibeOps / Reportly — Strategy & Product Fit",
    body: `Hi Zander,

I'd like to connect about how VibeOps could fit into our workflows.

A bit of context:
- Firm / team:
- Type of work (e.g. bridges, dams, buildings, security, etc.):
- Where reporting / documentation hurts today:
- Timelines / urgency:

Thanks,
[Your Name]
[Role]
[Company]
[Phone]`,
  },
  {
    label: "Sales & Partnerships",
    person: "Felix Stewart",
    email: "felix@vibeops.ca",
    blurb:
      "Pricing, pilots, procurement, and mapping automation to business outcomes and ROI.",
    subject: "VibeOps — Sales / Partnership Inquiry",
    body: `Hi Felix,

I'm reaching out about a potential engagement with VibeOps.

Rough outline:
- What we're interested in (Reportly / dashboards / custom tools):
- Size of team / project:
- Key outcomes we care about:
- Budget / timing (if known):

Happy to share more details on a call.

Best,
[Your Name]
[Role]
[Company]
[Phone]`,
  },
  {
    label: "Architecture & Development",
    person: "Eric Balanecki",
    email: "eric@vibeops.ca",
    blurb:
      "Technical architecture, integrations, data flows, and how the automation engine works under the hood.",
    subject: "VibeOps — Technical / Integration Discussion",
    body: `Hi Eric,

I'd like to talk through technical details for a potential build.

Some context:
- Existing systems / tools:
- Data sources (files, databases, APIs, etc.):
- Tech constraints (security, hosting, stack):
- What we want the system to do:

Looking forward to digging into the architecture.

Best,
[Your Name]
[Role]
[Company]
[Phone]`,
  },
  {
    label: "Marketing & Storytelling",
    person: "Gabriel Comla",
    email: "gabriel@vibeops.ca",
    blurb:
      "Content, storytelling, case studies, and how we talk about real engineering outcomes.",
    subject: "VibeOps — Marketing / Storytelling",
    body: `Hi Gabe,

Reaching out about marketing / storytelling.

Context:
- What we're working on together or thinking about:
- Audience:
- Any links / assets:

Thanks,
[Your Name]
[Role]
[Company]`,
  },
  {
    label: "Fundraising & Investor Relations",
    person: "Hrudai Rajesh",
    email: "hrudai@vibeops.ca",
    blurb:
      "Investor conversations, fundraising, and how VibeOps is structuring growth and delivery.",
    subject: "VibeOps — Fundraising / Investor Inquiry",
    body: `Hi Hrudai,

I'd like to connect regarding VibeOps and your fundraising / investor plans.

Quick context:
- Who I am:
- How I heard about VibeOps:
- What I’m interested in (round details, traction, product, etc.):

Looking forward to chatting.

Best,
[Your Name]
[Role]
[Company]`,
  },
];

export default function Contact() {
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(
    null
  );
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const calendlyRef = useRef<HTMLDivElement | null>(null);

  // Ensure Calendly script is present and (re)initialize widget every time this page mounts
  useEffect(() => {
    let isMounted = true;

    const loadCalendly = async () => {
      if (!isMounted || !calendlyRef.current) return;

      // Load the script
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;

      script.onload = () => {
        if (isMounted && window.Calendly && calendlyRef.current) {
          try {
            // Clear the container first
            if (calendlyRef.current) {
              calendlyRef.current.innerHTML = "";
            }
            
            // Initialize the widget
            window.Calendly.initInlineWidget({
              url: CALENDLY_URL,
              parentElement: calendlyRef.current,
            });
            console.log("✓ Calendly widget loaded and initialized");
          } catch (error) {
            console.error("✗ Error initializing Calendly widget:", error);
          }
        }
      };

      script.onerror = () => {
        console.error("✗ Failed to load Calendly script from CDN");
      };

      // Check if script already exists to avoid duplicates
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );

      if (existingScript) {
        console.log("Calendly script already present, reinitializing...");
        if (window.Calendly && calendlyRef.current) {
          calendlyRef.current.innerHTML = "";
          window.Calendly.initInlineWidget({
            url: CALENDLY_URL,
            parentElement: calendlyRef.current,
          });
        }
      } else {
        document.head.appendChild(script);
      }
    };

    loadCalendly();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenComposer = (channel: ContactChannel) => {
    setSelectedChannel(channel);
    setDraftSubject(channel.subject);
    setDraftBody(channel.body);
  };

  const handleSendEmail = () => {
    if (!selectedChannel) return;

    const mailto =
      `mailto:${encodeURIComponent(selectedChannel.email)}` +
      `?subject=${encodeURIComponent(draftSubject)}` +
      `&body=${encodeURIComponent(draftBody)}`;

    window.location.href = mailto;
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-page Aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
        <Aurora
          colorStops={["#00ffcc", "#4DD0E1", "#00ffcc"]}
          blend={0.45}
          amplitude={1.0}
          speed={0.6}
        />
      </div>

      {/* Foreground content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <AnimatedContent
          distance={140}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.96}
          threshold={0.3}
        >
          <section className="max-w-6xl mx-auto text-center">
            <h1 className="section-title py-1">Book a Free Strategy Call</h1>
            <p className="section-subtitle mx-auto">
              Grab 30 minutes with us via Calendly, or email the person who best
              fits your question.
            </p>
          </section>
        </AnimatedContent>

        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.98}
          threshold={0.35}
        >
          <section className="max-w-6xl mx-auto mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8">
              {/* Calendly side */}
              <AnimatedContent
                distance={80}
                direction="horizontal"
                duration={0.9}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.98}
                threshold={0.4}
              >
                <Card className="bg-card/70 border border-border overflow-hidden backdrop-blur-md relative contact-calendly-card">
                  {/* soft gradient wash */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                  <CardHeader className="relative">
                    <CardTitle>Schedule a 30-Minute Vibe Check</CardTitle>
                    <CardDescription>
                      We&apos;ll walk through your current workflow, where time
                      is being burned, and what a VibeOps or Reportly build
                      could look like.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    {/* Calendly container – rebuilt on every mount */}
                    <div
                      ref={calendlyRef}
                      className="calendly-inline-widget w-full min-h-[960px] md:min-h-[1100px]"
                      style={{ display: "block" }}
                    />
                  </CardContent>
                </Card>
              </AnimatedContent>

              {/* Email routing + composer */}
              <AnimatedContent
                distance={80}
                direction="horizontal"
                reverse
                duration={0.9}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.98}
                threshold={0.4}
              >
                <div className="space-y-6">
                  <Card className="bg-card/70 border border-border backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Email the Right Person</CardTitle>
                      <CardDescription>
                        Skip forms. Pick who you want to talk to — we&apos;ll
                        open a prefilled draft you can tweak before sending.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {contactChannels.map((channel) => {
                        const firstName = channel.person.split(" ")[0];
                        const isActive =
                          selectedChannel &&
                          selectedChannel.email === channel.email;

                        return (
                          <div
                            key={channel.email}
                            className={`rounded-xl p-4 space-y-3 border backdrop-blur-sm transition-all duration-300 ${
                              isActive
                                ? "border-primary/70 bg-background/80 shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
                                : "border-border/70 bg-background/60 hover:border-primary/40 hover:bg-background/75 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.6)]"
                            }`}
                          >
                            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary/80">
                              {channel.label}
                            </p>
                            <p className="font-semibold text-sm">
                              {channel.person}{" "}
                              <span className="text-muted-foreground text-xs">
                                · {channel.email}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {channel.blurb}
                            </p>

                            <Button
                              type="button"
                              size="sm"
                              className="text-xs"
                              variant={isActive ? "default" : "outline"}
                              onClick={() => handleOpenComposer(channel)}
                            >
                              {isActive
                                ? `Editing email to ${firstName}`
                                : `Email ${firstName}`}
                            </Button>

                            {isActive && selectedChannel && (
                              <Card className="bg-card/80 border border-primary/40 mt-3">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">
                                    Compose Email to {selectedChannel.person}
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    Edit the subject and message below.
                                    Clicking "Open in Email Client" will launch
                                    your email app with this content.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                  <div>
                                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                                      To
                                    </p>
                                    <p className="text-foreground">
                                      {selectedChannel.email}
                                    </p>
                                  </div>

                                  <div className="space-y-1">
                                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                                      Subject
                                    </p>
                                    <Input
                                      value={draftSubject}
                                      onChange={(e) =>
                                        setDraftSubject(e.target.value)
                                      }
                                      className="text-sm"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                                      Message
                                    </p>
                                    <Textarea
                                      value={draftBody}
                                      onChange={(e) =>
                                        setDraftBody(e.target.value)
                                      }
                                      rows={8}
                                      className="text-sm"
                                    />
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      type="button"
                                      className="flex-1"
                                      onClick={handleSendEmail}
                                    >
                                      Open in Email Client
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => setSelectedChannel(null)}
                                    >
                                      Clear
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        );
                      })}

                      <p className="text-xs text-muted-foreground pt-2">
                        Not sure who to pick? Zander or Felix are good defaults
                        if you&apos;re just exploring options.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedContent>
            </div>
          </section>
        </AnimatedContent>
      </div>

      {/* Local micro-animations */}
      <style>{`
        @keyframes calendlyGlow {
          0% { box-shadow: 0 0 0 rgba(0,255,204,0); }
          50% { box-shadow: 0 0 32px rgba(0,255,204,0.25); }
          100% { box-shadow: 0 0 0 rgba(0,255,204,0); }
        }
        .contact-calendly-card:hover {
          animation: calendlyGlow 1.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
