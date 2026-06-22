import { MapPin, Layers, MessageSquare, FileText, ExternalLink } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

/*
 * Fake product UI showing real MapleCodes results for "800 Robson St, Vancouver, BC".
 * All data mirrors actual seed.json / addressAnalysis output so it looks authentic.
 */

const JURISDICTION_BADGES = [
  { level: "Federal", label: "Canada", color: "#3b82f6" },
  { level: "Provincial", label: "British Columbia", color: "#10b981" },
  { level: "Municipal", label: "City of Vancouver", color: "#a855f7" },
];

const CODE_ROWS = [
  { name: "National Building Code of Canada", edition: "2020", level: "federal", scope: "Canada", status: "In force" },
  { name: "National Fire Code of Canada", edition: "2020", level: "federal", scope: "Canada", status: "In force" },
  { name: "BC Building Code", edition: "2024", level: "provincial", scope: "British Columbia", status: "In force" },
  { name: "BC Fire Code", edition: "2024", level: "provincial", scope: "British Columbia", status: "In force" },
  { name: "Vancouver Building By-law No. 12511", edition: "2023", level: "municipal", scope: "Vancouver", status: "In force" },
];

const BYLAW_ROWS = [
  { name: "Zoning and Development By-law", number: "3575", subject: "zoning" },
  { name: "Building By-law", number: "12511", subject: "building" },
  { name: "Fire By-law", number: "12469", subject: "building" },
];

const STANDARD_ROWS = [
  { agency: "CSA", doc: "A23.3-19", title: "Design of concrete structures" },
  { agency: "CSA", doc: "O86-19", title: "Engineering design in wood" },
  { agency: "CSA", doc: "S16-19", title: "Design of steel structures" },
  { agency: "ASTM", doc: "E119", title: "Standard test methods for fire tests" },
];

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  federal: { bg: "bg-blue-500/10", text: "text-blue-400" },
  provincial: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  municipal: { bg: "bg-purple-500/10", text: "text-purple-400" },
};

const BRIEF_TEXT = `**Jurisdiction Stack:** This site at 800 Robson St, Vancouver falls under three overlapping jurisdiction levels. The **National Building Code of Canada 2020** applies as the federal baseline. British Columbia has adopted the **BC Building Code 2024** with province-specific amendments. The **City of Vancouver** enforces its own Building By-law No. 12511 which often exceeds provincial requirements.

**Key compliance considerations:**
- Vancouver Building By-law frequently imposes stricter energy efficiency requirements than the BC Building Code
- Projects in this zone are likely subject to the City's Green Buildings Policy for Rezonings
- Fire separation and egress requirements follow the BC Fire Code 2024 with Vancouver-specific amendments`;

export function ShowcaseSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-background">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#d92f37] mb-4">
              Product Demo
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              See what you get
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's what a real lookup returns for{" "}
              <span className="text-foreground">800 Robson St, Vancouver, BC</span>.
            </p>
          </div>
        </AnimatedContent>

        {/* === PRODUCT MOCKUP === */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-muted text-xs text-muted-foreground font-mono">
                <MapPin className="w-3 h-3 text-[#d92f37]" />
                MapleCodes
              </div>
            </div>
          </div>

          {/* === Result hero === */}
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.1}
          >
            <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-xs text-[#d92f37] uppercase tracking-widest mb-1">Lookup Result</p>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    800 Robson St, Vancouver, BC
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Matched to City of Vancouver. 49.28383, -123.12123
                  </p>
                </div>
                {/* Summary badges */}
                <div className="flex items-center gap-4 text-center">
                  <div className="px-4 py-2 rounded-xl bg-secondary border border-border">
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Jurisdictions</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-secondary border border-border">
                    <div className="text-2xl font-bold text-foreground">5</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Codes</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-secondary border border-border">
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Bylaws</div>
                  </div>
                </div>
              </div>

              {/* Jurisdiction badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {JURISDICTION_BADGES.map((j) => (
                  <span
                    key={j.level}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      borderColor: `${j.color}40`,
                      backgroundColor: `${j.color}10`,
                      color: j.color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: j.color }} />
                    {j.level}: {j.label}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedContent>

          {/* === Grid: Map + Codes Table === */}
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2}
          >
            <div className="grid md:grid-cols-5 gap-0 border-b border-border">
              {/* Fake map */}
              <div className="md:col-span-2 relative bg-muted min-h-[240px] border-b md:border-b-0 md:border-r border-border">
                {/* Roads */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/40" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-muted-foreground/40" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-px bg-muted-foreground/40" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-muted-foreground/20" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-muted-foreground/20" />
                </div>
                {/* Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-[#d92f37] border-2 border-background" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#d92f37]" />
                  </div>
                </div>
                {/* Jurisdiction zone overlays */}
                <div className="absolute top-[15%] left-[10%] right-[10%] bottom-[20%] rounded-lg border border-purple-500/30 bg-purple-500/5" />
                <div className="absolute top-[25%] left-[20%] right-[20%] bottom-[30%] rounded-lg border border-emerald-500/30 bg-emerald-500/5" />
                {/* Caption */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono bg-background/80 px-2 py-0.5 rounded">
                    49.28383, -123.12123
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                    OpenStreetMap
                  </span>
                </div>
              </div>

              {/* Codes table */}
              <div className="md:col-span-3 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d92f37]" />
                    <span className="text-sm font-medium text-foreground">Applicable Building Codes</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{CODE_ROWS.length} results</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                        <th className="px-4 py-2 font-medium">Code Name</th>
                        <th className="px-4 py-2 font-medium hidden sm:table-cell">Edition</th>
                        <th className="px-4 py-2 font-medium">Level</th>
                        <th className="px-4 py-2 font-medium hidden md:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CODE_ROWS.map((row) => {
                        const lc = LEVEL_COLORS[row.level];
                        return (
                          <tr key={row.name} className="border-b border-border hover:bg-secondary transition-colors">
                            <td className="px-4 py-2.5 text-sm text-foreground">{row.name}</td>
                            <td className="px-4 py-2.5 text-sm text-muted-foreground font-mono hidden sm:table-cell">{row.edition}</td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${lc.bg} ${lc.text}`}>
                                {row.level}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-sm text-emerald-500 hidden md:table-cell">{row.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* === Row: Bylaws + Standards === */}
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.3}
          >
            <div className="grid md:grid-cols-2 gap-0 border-b border-border">
              {/* Bylaws */}
              <div className="border-b md:border-b-0 md:border-r border-border">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-foreground">Municipal Bylaws</span>
                  <span className="text-xs text-muted-foreground ml-auto">{BYLAW_ROWS.length}</span>
                </div>
                <div className="p-4 space-y-2">
                  {BYLAW_ROWS.map((b) => (
                    <div
                      key={b.number}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border"
                    >
                      <div>
                        <p className="text-sm text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">No. {b.number}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400">
                        {b.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards */}
              <div>
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d92f37]" />
                  <span className="text-sm font-medium text-foreground">Referenced Standards</span>
                  <span className="text-xs text-muted-foreground ml-auto">{STANDARD_ROWS.length}</span>
                </div>
                <div className="p-4 space-y-2">
                  {STANDARD_ROWS.map((s) => (
                    <div
                      key={s.doc}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {s.agency} {s.doc}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#d92f37]/10 text-[#d92f37] flex-shrink-0 ml-3">
                        {s.agency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* === AI Governing Brief === */}
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.4}
          >
            <div className="border-b border-border">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d92f37]" />
                <span className="text-sm font-medium text-foreground">AI Governing Brief</span>
                <span className="text-xs text-muted-foreground ml-2">Auto-generated</span>
              </div>
              <div className="px-6 md:px-8 py-6">
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed text-sm">
                  {BRIEF_TEXT.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j} className="text-foreground font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : part.startsWith("- ") ? (
                          <span key={j} className="block pl-4 text-muted-foreground">
                            {part}
                          </span>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* === Chat preview + Reportly CTA === */}
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.5}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Chat mockup */}
              <div className="border-b md:border-b-0 md:border-r border-border">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d92f37]" />
                  <span className="text-sm font-medium text-foreground">Chat with the Codes</span>
                </div>
                <div className="p-4 space-y-3">
                  {/* User message */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                      U
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-sm text-foreground">
                        What are the setback requirements for this lot?
                      </p>
                    </div>
                  </div>
                  {/* AI message */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d92f37]/20 flex items-center justify-center text-[10px] text-[#d92f37] font-bold">
                      AI
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-secondary border border-border">
                      <p className="text-sm text-muted-foreground">
                        For 800 Robson St in the C-5 zone, the Vancouver Zoning By-law requires a
                        0 ft front setback, 0 ft side setback, and a height limit based on view cone
                        analysis. Refer to Section 5.9 of the Zoning and Development By-law No. 3575...
                      </p>
                    </div>
                  </div>
                  {/* Input */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-border">
                    <span className="text-sm text-muted-foreground flex-1">
                      Ask follow-up questions about this site...
                    </span>
                    <span className="px-3 py-1 rounded bg-[#d92f37]/10 text-[#d92f37] text-xs font-medium">
                      Ask
                    </span>
                  </div>
                </div>
              </div>

              {/* Reportly handoff CTA */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <ExternalLink className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Create a report from these codes
                </h4>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                  One click drops the verified jurisdiction stack and code references straight
                  into Reportly. Nothing to re-type.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                  <FileText className="w-4 h-4" />
                  Prepare Report Context
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Part of the VibeOps suite: MapleCodes + Reportly
                </p>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}