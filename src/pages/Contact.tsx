import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, User, Zap, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
- What I'm interested in (round details, traction, product, etc.):

Looking forward to chatting.

Best,
[Your Name]
[Role]
[Company]`,
  },
];

type ContactMode = "initial" | "calendar" | "email";

export default function Contact() {
  const [mode, setMode] = useState<ContactMode>("initial");
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(null);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [connecting, setConnecting] = useState(false);


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
    <div className="pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 204, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 204, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated Circuit Lines */}
      <motion.div
        className="fixed top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/50 to-transparent pointer-events-none z-0"
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/50 to-transparent pointer-events-none z-0"
        animate={{
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Signal className="w-5 h-5 text-[#00ffcc] animate-pulse" />
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc]">
              Communication Channel
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Establish Connection
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Select your preferred communication protocol
          </p>
        </motion.div>

        {/* Connection Loader */}
        <AnimatePresence>
          {connecting && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-[#00ffcc] animate-pulse" />
                  <p className="text-[#00ffcc] font-mono">ESTABLISHING CONNECTION</p>
                </div>
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00ffcc]"
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
                className="group relative p-6 md:p-8 rounded-xl border-2 border-[#00ffcc]/40 bg-gradient-to-br from-[#00ffcc]/15 via-[#00ffcc]/8 to-transparent hover:border-[#00ffcc]/70 hover:shadow-[0_0_30px_rgba(0,255,204,0.3)] transition-all duration-300 text-left overflow-hidden backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/25 rounded-full blur-3xl group-hover:bg-[#00ffcc]/35 transition-all" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00ffcc]/15 rounded-full blur-2xl group-hover:bg-[#00ffcc]/20 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <Calendar className="w-12 h-12 text-[#00ffcc] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 relative z-10">
                  Schedule Call
                </h3>
                <p className="text-gray-200 text-sm mb-5 relative z-10 leading-relaxed">
                  Book a 30-minute strategy session via Calendly
                </p>
                <div className="flex items-center gap-2 text-[#00ffcc] text-xs font-mono relative z-10 group-hover:gap-3 transition-all">
                  <span className="font-semibold">INITIATE SESSION</span>
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
                className="group relative p-6 md:p-8 rounded-xl border-2 border-[#00ffcc]/40 bg-gradient-to-br from-[#00ffcc]/15 via-[#00ffcc]/8 to-transparent hover:border-[#00ffcc]/70 hover:shadow-[0_0_30px_rgba(0,255,204,0.3)] transition-all duration-300 text-left overflow-hidden backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/25 rounded-full blur-3xl group-hover:bg-[#00ffcc]/35 transition-all" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00ffcc]/15 rounded-full blur-2xl group-hover:bg-[#00ffcc]/20 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <Mail className="w-12 h-12 text-[#00ffcc] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 relative z-10">
                  Direct Email
                </h3>
                <p className="text-gray-200 text-sm mb-5 relative z-10 leading-relaxed">
                  Contact specific team members directly
                </p>
                <div className="flex items-center gap-2 text-[#00ffcc] text-xs font-mono relative z-10 group-hover:gap-3 transition-all">
                  <span className="font-semibold">OPEN CHANNEL</span>
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
                className="mb-6 border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10"
              >
                ← Back to Options
              </Button>

              <div className="rounded-2xl border border-[#00ffcc]/20 bg-black/40 backdrop-blur-xl p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse" />
                  <p className="text-[#00ffcc] font-mono text-sm">LIVE SCHEDULING INTERFACE</p>
                </div>
                <iframe
                  src={CALENDLY_URL}
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule a call with VibeOps"
                  className="rounded-xl"
                />
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
                className="mb-6 border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10"
              >
                ← Back to Options
              </Button>

              <div className="rounded-2xl border border-[#00ffcc]/20 bg-black/40 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-[#00ffcc]" />
                  <p className="text-[#00ffcc] font-mono text-sm">SELECT TEAM MEMBER</p>
                </div>

                <div className="space-y-4">
                  {contactChannels.map((channel) => {
                    const firstName = channel.person.split(" ")[0];
                    const isActive = selectedChannel?.email === channel.email;

                    return (
                      <motion.div
                        key={channel.email}
                        className={`rounded-xl p-5 border transition-all duration-300 ${
                          isActive
                            ? "border-[#00ffcc]/50 bg-[#00ffcc]/10"
                            : "border-[#00ffcc]/20 bg-white/5 hover:border-[#00ffcc]/40 hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#00ffcc] mb-1">
                              {channel.label}
                            </p>
                            <p className="font-semibold text-white">
                              {channel.person}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {channel.email}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                          {channel.blurb}
                        </p>

                        <Button
                          type="button"
                          size="sm"
                          className={`text-xs ${
                            isActive
                              ? "bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90"
                              : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }`}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => handleOpenComposer(channel)}
                        >
                          {isActive ? `Composing to ${firstName}` : `Contact ${firstName}`}
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
                              <div className="p-4 rounded-xl border border-[#00ffcc]/30 bg-black/40 space-y-4">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                                    TO
                                  </p>
                                  <p className="text-white font-mono text-sm">
                                    {selectedChannel.email}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                                    SUBJECT
                                  </p>
                                  <Input
                                    value={draftSubject}
                                    onChange={(e) => setDraftSubject(e.target.value)}
                                    className="bg-white/5 border-white/20 text-white font-mono"
                                  />
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                                    MESSAGE
                                  </p>
                                  <Textarea
                                    value={draftBody}
                                    onChange={(e) => setDraftBody(e.target.value)}
                                    rows={8}
                                    className="bg-white/5 border-white/20 text-white font-mono text-sm"
                                  />
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <Button
                                    type="button"
                                    className="flex-1 bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90 font-mono"
                                    onClick={handleSendEmail}
                                  >
                                    SEND →
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
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

                <p className="text-xs text-gray-500 text-center mt-6 font-mono">
                  Not sure who to contact? Zander or Felix are good defaults.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
