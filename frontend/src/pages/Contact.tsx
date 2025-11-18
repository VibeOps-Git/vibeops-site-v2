import { useEffect, useState } from "react";
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

type ContactChannel = {
  label: string;
  person: string;
  email: string;
  blurb: string;
  subject: string;
  body: string;
};

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

  // Load Calendly widget script once
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
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
        <section className="max-w-6xl mx-auto">
          <h1 className="section-title text-center py-1">
            Book a Free Strategy Call
          </h1>
          <p className="section-subtitle text-center mx-auto">
            Grab 30 minutes with us via Calendly, or email the person who best
            fits your question.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 mt-12">
            {/* Calendly side */}
            <Card className="bg-card/70 border border-border overflow-hidden backdrop-blur-md">
              <CardHeader>
                <CardTitle>Schedule a 30-Minute Vibe Check</CardTitle>
                <CardDescription>
                  We&apos;ll walk through your current workflow, where time is
                  being burned, and what a VibeOps or Reportly build could look
                  like.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className="calendly-inline-widget w-full h-[960px] md:h-[1100px]"
                  data-url="https://calendly.com/zander-vibeops/30min?primary_color=00ffcc&text_color=e5e7eb&background_color=0f1115&hide_gdpr_banner=1"
                  style={{ minWidth: 320 }}
                />
              </CardContent>
            </Card>

            {/* Email routing + composer */}
            <div className="space-y-6">
              <Card className="bg-card/70 border border-border backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Email the Right Person</CardTitle>
                  <CardDescription>
                    Skip forms. Pick who you want to talk to — we&apos;ll open a
                    prefilled draft you can tweak before sending.
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
                        className="rounded-xl border border-border/70 bg-background/60 p-4 space-y-3"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/90">
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

                        {isActive && (
                          <Card className="bg-card/80 border border-primary/40 mt-3">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">
                                Compose Email to {selectedChannel.person}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Edit the subject and message below. Clicking
                                “Open in Email Client” will launch your email
                                app with this content.
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
                    Not sure who to pick? Zander or Felix are good defaults if
                    you&apos;re just exploring options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
