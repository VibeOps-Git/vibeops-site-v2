import { useEffect, useState } from "react";
import { Download, Monitor, Smartphone, Globe, Clock } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

interface PlatformEntry {
  label: string;
  filename: string | null;
  path: string | null;
  checksum: string | null;
  available: boolean;
  note: string;
}

interface DownloadManifest {
  version: string;
  date: string | null;
  status: string;
  signed: boolean;
  platforms: Record<string, PlatformEntry>;
}

const PLATFORM_ICONS: Record<string, typeof Monitor> = {
  "darwin-aarch64": Monitor,
  "darwin-x86_64": Monitor,
  "windows-x86_64": Monitor,
};

function statusLabel(status: string): { text: string; className: string } {
  switch (status) {
    case "beta":
      return { text: "Beta", className: "text-primary" };
    case "beta-unsigned":
      return { text: "Beta · Internal", className: "text-yellow-500" };
    default:
      return { text: "Coming Soon", className: "text-muted-foreground" };
  }
}

export function DownloadSection() {
  const [manifest, setManifest] = useState<DownloadManifest | null>(null);

  useEffect(() => {
    fetch("/downloads/reportly-manifest.json")
      .then((r) => r.json())
      .then(setManifest)
      .catch(() => {});
  }, []);

  const macPrimary = manifest?.platforms["darwin-aarch64"];
  const status = manifest ? statusLabel(manifest.status) : statusLabel("coming-soon");
  const available = macPrimary?.available ?? false;

  return (
    <section className="relative py-20 px-4 border-t border-border">
      <div className="container mx-auto max-w-5xl relative z-10">
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold mb-4 text-muted-foreground">
              <Download className="w-3.5 h-3.5" />
              Desktop App
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Reportly for{" "}
              <span className="text-primary">desktop</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The full Reportly workflow in a native macOS app: native file
              dialogs, drag-and-drop uploads, keyboard shortcuts, and one-click
              export to Word or PDF.
            </p>
          </div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* macOS Apple Silicon - primary */}
            <div className="md:col-span-2 relative p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary border border-border">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">macOS</p>
                    <p className="text-xs text-muted-foreground">Apple Silicon · Intel</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${status.className}`}>
                  {status.text}
                </span>
              </div>

              <div className="text-sm text-muted-foreground leading-relaxed">
                Needs macOS 12 Monterey or later. Same login, same reports, in a
                native window.
              </div>

              {available && macPrimary?.path ? (
                <a
                  href={macPrimary.path}
                  download
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download for macOS
                  {manifest?.version && (
                    <span className="text-xs opacity-60 font-normal">
                      v{manifest.version}
                    </span>
                  )}
                </a>
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary border border-border text-muted-foreground text-sm cursor-not-allowed select-none">
                  <Clock className="w-4 h-4" />
                  <span>Signed build coming soon</span>
                </div>
              )}

              {macPrimary?.note && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {macPrimary.note}
                </p>
              )}
            </div>

            {/* Coming soon platforms */}
            <div className="flex flex-col gap-4">
              {[
                { icon: Monitor, label: "Windows", sub: "Coming soon" },
                { icon: Smartphone, label: "iOS / Android", sub: "Available now", href: "https://reportly.ca" },
                { icon: Globe, label: "Web", sub: "Available now", href: "https://reportly.ca" },
              ].map(({ icon: Icon, label, sub, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-secondary border border-border">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        {sub}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Native file picker",
              "Drag-and-drop upload",
              "One-click Word / PDF export",
              "Open exports in Finder",
              "Keyboard shortcuts",
              "Native window menus",
              "Auto-update",
              "Same Reportly account",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
