import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, User } from "lucide-react";
import { SEO } from "@/components/SEO";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactChannel = {
  label: string;
  person: string;
  role?: string;
  about?: string;
  email: string;
  blurb: string;
  subject: string;
  body: string;
};

const CALENDLY_URL =
  "https://calendly.com/zander-vibeops/30min?primary_color=00ffcc&text_color=e5e7eb&background_color=0f1115&hide_gdpr_banner=1";

const contactChannels: ContactChannel[] = [
  {
    label: "Strategy & Scoping",
    person: "Zander Dent",
    role: "CEO & Co-Founder",
    about:
      "Civil engineer turned founder. Runs engagements, client discovery, and most of our scoping conversations.",
    email: "zander@vibeops.ca",
    blurb:
      "Big-picture questions, partnerships, and scoping what a custom build would look like for your firm.",
    subject: "VibeOps | Strategy & Engagement Fit",
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
    label: "Engagements & Partnerships",
    person: "Felix Stewart",
    role: "Director of Sales and Partnerships",
    about:
      "Civil engineer and co-owner. Runs client engagements, pilots and delivery.",
    email: "felix@vibeops.ca",
    blurb:
      "Scoping an engagement, pilots, procurement, and what it takes to get started.",
    subject: "VibeOps | Engagement Inquiry",
    body: `Hi Felix,

I'm reaching out about a potential engagement with VibeOps.

Rough outline:
- What we're interested in (report automation / dashboards / custom tools):
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
    label: "Contact the Team",
    person: "VibeOps Team",
    email: "team@vibeops.ca",
    blurb:
      "General questions, or anything that doesn't map neatly to one person.",
    subject: "VibeOps | Team Inquiry",
    body: `Hi VibeOps Team,

I'm reaching out with a general question and wanted to find the right person on your side.

Context:
- Firm / team:
- What we're looking for:
- Timeline:

Thanks,
[Your Name]
[Role]
[Company]
[Phone]`,
  },
];

type ContactMode = "initial" | "calendar" | "email";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const contactParam = searchParams.get("contact");
  const modeParam = searchParams.get("mode");

  const initialChannel = contactParam
    ? (contactChannels.find((c) => c.email === contactParam) ?? null)
    : null;

  const [mode, setMode] = useState<ContactMode>(
    modeParam === "email" ? "email" : modeParam === "calendar" ? "calendar" : "initial"
  );
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(initialChannel);
  const [draftSubject, setDraftSubject] = useState(initialChannel?.subject ?? "");
  const [draftBody, setDraftBody] = useState(initialChannel?.body ?? "");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (mode !== "email" || !selectedChannel) return;

    const targetId = `contact-channel-${selectedChannel.email}`;
    const el = document.getElementById(targetId);
    if (!el) return;

    const raf = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(raf);
  }, [mode, selectedChannel]);

  const handleModeSwitch = (newMode: ContactMode) => {
    setConnecting(true);
    setTimeout(() => {
      setMode(newMode);
      setConnecting(false);
    }, 600);
  };

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
    <>
      <SEO
        title="Talk to Your AI Engineering Team"
        description="Book a 30-minute call with VibeOps. Bring the workflow costing your engineering firm the most, and we'll tell you honestly whether it's worth building software for."
        canonical="https://www.vibeops.ca/contact"
      />
      <div className="pt-24 pb-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Get in touch
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Bring us the workflow that costs you the most
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            We'll tell you honestly whether it's worth building software for, and if it
            is, what an engagement would actually involve.
          </p>
        </motion.div>

        {/* Connection Loader */}
        <AnimatePresence>
          {connecting && (
            <motion.div
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <p className="text-primary font-medium mb-4">Connecting you...</p>
                <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {mode === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Calendar Option */}
              <motion.button
                onClick={() => handleModeSwitch("calendar")}
                className="group p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors text-left"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Book a call
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  Grab 30 minutes with us on Calendly.
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Pick a time</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-base"
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>

              {/* Email Option */}
              <motion.button
                onClick={() => handleModeSwitch("email")}
                className="group p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors text-left"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Send us a message
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  Email a specific person on the team directly.
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Write a message</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-base"
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>
          )}

          {mode === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Button
                onClick={() => handleModeSwitch("initial")}
                variant="outline"
                className="mb-6 border-border text-foreground hover:bg-secondary"
              >
                ← Back to options
              </Button>

              <div className="rounded-2xl border border-border bg-card shadow-sm p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <p className="text-foreground text-sm font-medium">Pick a time that works</p>
                  </div>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Open in new tab →
                  </a>
                </div>
                <div className="relative">
                  <iframe
                    src={CALENDLY_URL}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    title="Schedule a call with VibeOps"
                    className="rounded-xl block"
                    style={{ minHeight: 700 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {mode === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() => handleModeSwitch("initial")}
                variant="outline"
                className="mb-6 border-border text-foreground hover:bg-secondary"
              >
                ← Back to options
              </Button>

              <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <p className="text-foreground text-sm font-medium">Pick who to write to</p>
                </div>

                <div className="space-y-4">
                  {contactChannels.map((channel) => {
                    const firstName = channel.person.split(" ")[0];
                    const isActive = selectedChannel?.email === channel.email;

                    return (
                      <motion.div
                        key={channel.email}
                        id={`contact-channel-${channel.email}`}
                        className={`rounded-xl p-5 border transition-colors duration-300 ${
                          isActive
                            ? "border-primary/50 bg-primary/10"
                            : "border-border bg-secondary hover:border-primary/40"
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">
                              {channel.label}
                            </p>
                            <p className="font-semibold text-foreground">
                              {channel.person}
                            </p>
                            {channel.role && (
                              <p className="text-xs text-muted-foreground">
                                {channel.role}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {channel.email}
                            </p>
                          </div>
                        </div>

                        {channel.about && (
                          <p className="text-sm text-foreground/80 mb-3">
                            {channel.about}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground mb-4">
                          {channel.blurb}
                        </p>

                        <Button
                          type="button"
                          size="sm"
                          className={`text-xs ${
                            isActive
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-secondary text-foreground border-border hover:bg-secondary/80"
                          }`}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => handleOpenComposer(channel)}
                        >
                          {isActive ? `Writing to ${firstName}` : `Contact ${firstName}`}
                        </Button>

                        <AnimatePresence>
                          {isActive && selectedChannel && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                                    To
                                  </p>
                                  <p className="text-foreground text-sm">
                                    {selectedChannel.email}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                                    Subject
                                  </p>
                                  <Input
                                    value={draftSubject}
                                    onChange={(e) => setDraftSubject(e.target.value)}
                                    className="bg-secondary border-border text-foreground"
                                  />
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                                    Message
                                  </p>
                                  <Textarea
                                    value={draftBody}
                                    onChange={(e) => setDraftBody(e.target.value)}
                                    rows={8}
                                    className="bg-secondary border-border text-foreground text-sm"
                                  />
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <Button
                                    type="button"
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={handleSendEmail}
                                  >
                                    Send message →
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary"
                                    onClick={() => setSelectedChannel(null)}
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  Not sure who to write to? Zander or Felix are safe bets.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </>
  );
}
