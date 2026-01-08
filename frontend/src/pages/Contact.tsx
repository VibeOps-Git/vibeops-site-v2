import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimatedContent from "../components/AnimatedContent";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";

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
    <div className="pt-24">
      {/* Hero */}
      <section className="py-16 px-4">
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="container mx-auto text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Book a Free Strategy Call
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Grab 30 minutes with us via Calendly, or email the person who best
              fits your question.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8">
            {/* Calendly side */}
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
            >
              <VibeCard variant="glow" className="overflow-hidden">
                <VibeCardHeader>
                  <VibeCardTitle className="text-xl">Schedule a 30-Minute Vibe Check</VibeCardTitle>
                  <VibeCardDescription>
                    We'll walk through your current workflow and what a VibeOps build could look like.
                  </VibeCardDescription>
                </VibeCardHeader>
                <VibeCardContent className="pt-0">
                  <div
                    ref={calendlyRef}
                    className="calendly-inline-widget w-full min-h-[960px] md:min-h-[1100px]"
                    style={{ display: "block" }}
                  />
                </VibeCardContent>
              </VibeCard>
            </AnimatedContent>

            {/* Email routing + composer */}
            <AnimatedContent
              distance={60}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={0.1}
            >
              <VibeCard variant="default">
                <VibeCardHeader>
                  <VibeCardTitle className="text-xl">Email the Right Person</VibeCardTitle>
                  <VibeCardDescription>
                    Skip forms. Pick who you want to talk to.
                  </VibeCardDescription>
                </VibeCardHeader>
                <VibeCardContent className="space-y-4">
                  {contactChannels.map((channel) => {
                    const firstName = channel.person.split(" ")[0];
                    const isActive =
                      selectedChannel &&
                      selectedChannel.email === channel.email;

                    return (
                      <div
                        key={channel.email}
                        className={`rounded-xl p-4 space-y-3 border transition-all duration-300 ${
                          isActive
                            ? "border-[#00ffcc]/50 bg-white/10"
                            : "border-white/10 bg-white/5 hover:border-[#00ffcc]/30 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#00ffcc]">
                          {channel.label}
                        </p>
                        <p className="font-semibold text-white text-sm">
                          {channel.person}{" "}
                          <span className="text-gray-500 text-xs">
                            · {channel.email}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {channel.blurb}
                        </p>

                        <Button
                          type="button"
                          size="sm"
                          className={`text-xs ${isActive ? 'bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => handleOpenComposer(channel)}
                        >
                          {isActive
                            ? `Editing email to ${firstName}`
                            : `Email ${firstName}`}
                        </Button>

                        {isActive && selectedChannel && (
                          <div className="mt-4 p-4 rounded-xl border border-[#00ffcc]/30 bg-[rgba(0,255,204,0.05)]">
                            <h4 className="text-white font-semibold mb-1">
                              Compose Email to {selectedChannel.person}
                            </h4>
                            <p className="text-xs text-gray-400 mb-4">
                              Edit and click to open in your email app.
                            </p>

                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-gray-500 mb-1">To</p>
                                <p className="text-white">{selectedChannel.email}</p>
                              </div>

                              <div>
                                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-gray-500 mb-1">Subject</p>
                                <Input
                                  value={draftSubject}
                                  onChange={(e) => setDraftSubject(e.target.value)}
                                  className="text-sm bg-white/5 border-white/10 text-white"
                                />
                              </div>

                              <div>
                                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-gray-500 mb-1">Message</p>
                                <Textarea
                                  value={draftBody}
                                  onChange={(e) => setDraftBody(e.target.value)}
                                  rows={6}
                                  className="text-sm bg-white/5 border-white/10 text-white"
                                />
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button
                                  type="button"
                                  className="flex-1 bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90"
                                  onClick={handleSendEmail}
                                >
                                  Open in Email Client
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-xs border-white/20 text-white hover:bg-white/10"
                                  onClick={() => setSelectedChannel(null)}
                                >
                                  Clear
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <p className="text-xs text-gray-500 pt-2">
                    Not sure who to pick? Zander or Felix are good defaults.
                  </p>
                </VibeCardContent>
              </VibeCard>
            </AnimatedContent>
          </div>
        </div>
      </section>
    </div>
  );
}
