import { FileText, Upload, Database, Zap, CheckCircle, Table, BarChart2, Image, Loader2 } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface SceneProps {
  progress: number; // 0 to 1 progress within this scene
}

// =============================================================================
// Shared Components
// =============================================================================

function ScreenHeader({ title, status, statusColor = "cyan" }: { title: string; status: string; statusColor?: "cyan" | "yellow" | "green" }) {
  const colors = {
    cyan: "bg-[#00ffcc]/10 text-[#00ffcc] border-[#00ffcc]/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#00ffcc]/10">
          <FileText className="w-4 h-4 text-[#00ffcc]" />
        </div>
        <span className="text-sm font-semibold text-white">Reportly</span>
      </div>
      <div className={`px-3 py-1 rounded-full border ${colors[statusColor]}`}>
        <span className="text-xs">{status}</span>
      </div>
    </div>
  );
}

function SidebarCard({ label, title, subtitle, variant = "default", icon: Icon, animate }: {
  label: string;
  title: string;
  subtitle?: string;
  variant?: "default" | "highlight" | "loading";
  icon?: typeof Upload;
  animate?: boolean;
}) {
  const baseClasses = "p-3 rounded-xl transition-all duration-500";
  const variantClasses = {
    default: "bg-white/5 border border-white/10",
    highlight: "bg-[#00ffcc]/5 border border-[#00ffcc]/20",
    loading: "bg-yellow-500/5 border border-yellow-500/20",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <p className={`text-[0.6rem] uppercase tracking-wider mb-2 ${
        variant === "highlight" ? "text-[#00ffcc]" : variant === "loading" ? "text-yellow-400" : "text-gray-500"
      }`}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className={`w-4 h-4 ${animate ? "animate-spin" : ""} ${
            variant === "highlight" ? "text-[#00ffcc]" : variant === "loading" ? "text-yellow-400" : "text-gray-400"
          }`} />
        )}
        <p className="text-xs text-white font-medium">{title}</p>
      </div>
      {subtitle && <p className="text-[0.6rem] text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function PreviewPanel({ children, title = "Report Preview" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
      <p className="text-[0.6rem] uppercase tracking-wider text-gray-500 mb-3">{title}</p>
      {children}
    </div>
  );
}

function DataRow({ filled = false, delay = 0, progress = 1 }: { filled?: boolean; delay?: number; progress?: number }) {
  const opacity = Math.max(0, Math.min(1, (progress - delay) / 0.3));

  return (
    <div
      className="grid grid-cols-4 gap-1 transition-all duration-300"
      style={{ opacity: filled ? opacity : 0.3 }}
    >
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded ${filled ? "bg-[#00ffcc]/30" : "bg-white/10"}`}
          style={{
            width: filled ? "100%" : `${60 + Math.random() * 40}%`,
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Scene 0: Empty Template
// =============================================================================

function EmptyTemplateScene({ progress }: SceneProps) {
  return (
    <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
      <ScreenHeader title="Reportly" status="No Template" statusColor="yellow" />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <div
            className="p-4 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 transition-all duration-500"
            style={{ opacity: 0.5 + progress * 0.5 }}
          >
            <Upload className="w-6 h-6 text-gray-500" />
            <p className="text-[0.6rem] text-gray-500 text-center">Drop your template here</p>
          </div>
          <SidebarCard label="Template" title="None uploaded" />
          <SidebarCard label="Data Source" title="Not connected" />
        </div>

        {/* Empty preview */}
        <PreviewPanel>
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div
              className="p-4 rounded-2xl bg-white/5 mb-4 transition-all duration-500"
              style={{ opacity: 0.5 + progress * 0.5, transform: `scale(${0.9 + progress * 0.1})` }}
            >
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No template loaded</p>
            <p className="text-[0.6rem] text-gray-600">Upload a Word or Excel template to begin</p>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}

// =============================================================================
// Scene 1: Template Uploaded, Connecting Data
// =============================================================================

function DataLoadingScene({ progress }: SceneProps) {
  const recordsLoaded = Math.floor(progress * 147);

  return (
    <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
      <ScreenHeader title="Reportly" status="Loading Data" statusColor="yellow" />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <SidebarCard label="Template" title="Annual Monitoring Report" subtitle="v2.4 • Word + Excel" variant="highlight" icon={FileText} />
          <SidebarCard
            label="Data Source"
            title={progress < 1 ? "Connecting..." : "Connected"}
            subtitle={`${recordsLoaded} records loaded`}
            variant={progress < 1 ? "loading" : "highlight"}
            icon={progress < 1 ? Loader2 : Database}
            animate={progress < 1}
          />
          <SidebarCard label="Status" title="Loading data..." variant="loading" />
        </div>

        {/* Preview with loading state */}
        <PreviewPanel>
          <div className="space-y-3">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/5" />
            </div>

            {/* Loading indicator in center */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#00ffcc]/20 border-t-[#00ffcc] animate-spin" />
                <Database className="absolute inset-0 m-auto w-5 h-5 text-[#00ffcc]/50" />
              </div>
              <p className="text-xs text-gray-500 mt-4">Loading {recordsLoaded} of 147 records...</p>

              {/* Progress bar */}
              <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#00ffcc] rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}

// =============================================================================
// Scene 2: Data Populated
// =============================================================================

function PopulatedScene({ progress }: SceneProps) {
  const barHeights = [40, 65, 45, 80, 55, 70, 50, 75, 60];

  return (
    <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
      <ScreenHeader title="Reportly" status="Ready to Generate" statusColor="cyan" />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <SidebarCard label="Template" title="Annual Monitoring Report" subtitle="v2.4 • Word + Excel" variant="highlight" icon={FileText} />
          <SidebarCard label="Data Source" title="Connected" subtitle="147 records loaded" variant="highlight" icon={Database} />
          <SidebarCard label="Status" title="Ready to Generate" variant="highlight" />
        </div>

        {/* Populated preview */}
        <PreviewPanel>
          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-2" style={{ opacity: Math.min(1, progress * 2) }}>
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/5" />
            </div>

            {/* Table section */}
            <div
              className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300"
              style={{ opacity: Math.max(0, Math.min(1, (progress - 0.1) / 0.3)) }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Table className="w-3 h-3 text-[#00ffcc]/60" />
                <span className="text-[0.6rem] text-gray-500">Instrumentation Data</span>
              </div>
              <div className="space-y-1">
                {[0, 1, 2].map((row) => (
                  <DataRow key={row} filled progress={progress} delay={0.1 + row * 0.1} />
                ))}
              </div>
            </div>

            {/* Chart section */}
            <div
              className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300"
              style={{ opacity: Math.max(0, Math.min(1, (progress - 0.3) / 0.3)) }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-3 h-3 text-[#00ffcc]/60" />
                <span className="text-[0.6rem] text-gray-500">Piezometer Readings</span>
              </div>
              <div className="flex items-end gap-1 h-8">
                {barHeights.map((h, i) => {
                  const barProgress = Math.max(0, Math.min(1, (progress - 0.3 - i * 0.05) / 0.3));
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#00ffcc]/40 to-[#00ffcc]/20 transition-all duration-300"
                      style={{ height: `${h * barProgress}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Photos section */}
            <div
              className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300"
              style={{ opacity: Math.max(0, Math.min(1, (progress - 0.5) / 0.3)) }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-3 h-3 text-[#00ffcc]/60" />
                <span className="text-[0.6rem] text-gray-500">Photo Appendix</span>
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => {
                  const photoProgress = Math.max(0, Math.min(1, (progress - 0.5 - i * 0.1) / 0.2));
                  return (
                    <div
                      key={i}
                      className="flex-1 aspect-square rounded bg-white/10 transition-all duration-300"
                      style={{ opacity: photoProgress, transform: `scale(${0.8 + photoProgress * 0.2})` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}

// =============================================================================
// Scene 3: Generating
// =============================================================================

function GeneratingScene({ progress }: SceneProps) {
  const step = Math.floor(progress * 4);
  const steps = ["Compiling data...", "Generating charts...", "Formatting tables...", "Finalizing report..."];

  return (
    <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
      <ScreenHeader title="Reportly" status="Generating..." statusColor="yellow" />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <SidebarCard label="Template" title="Annual Monitoring Report" subtitle="v2.4 • Word + Excel" variant="default" icon={FileText} />
          <SidebarCard label="Data Source" title="Connected" subtitle="147 records" variant="default" icon={Database} />
          <SidebarCard label="Status" title="Generating..." variant="loading" icon={Loader2} animate />
        </div>

        {/* Generating animation */}
        <PreviewPanel title="Generating Report">
          <div className="flex flex-col items-center justify-center h-full py-8">
            {/* Animated icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#00ffcc]/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#00ffcc] animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-[#00ffcc]/20 animate-ping" style={{ animationDuration: "2s" }} />
            </div>

            {/* Steps */}
            <div className="space-y-2 text-center">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`text-xs transition-all duration-300 ${
                    i === step ? "text-[#00ffcc]" : i < step ? "text-gray-500" : "text-gray-700"
                  }`}
                >
                  {i < step && "✓ "}{s}
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-[0.6rem] text-gray-500 mt-2">{Math.floor(progress * 100)}% complete</p>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}

// =============================================================================
// Scene 4: Complete
// =============================================================================

function CompleteScene({ progress }: SceneProps) {
  return (
    <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
      <ScreenHeader title="Reportly" status="Complete" statusColor="green" />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <SidebarCard label="Template" title="Annual Monitoring Report" subtitle="v2.4 • Word + Excel" variant="highlight" icon={FileText} />
          <SidebarCard label="Data Source" title="Connected" subtitle="147 records" variant="highlight" icon={Database} />
          <SidebarCard label="Generated" title="Report Ready" subtitle="2.4 MB • 47 pages" variant="highlight" icon={CheckCircle} />
        </div>

        {/* Complete state */}
        <PreviewPanel title="Report Generated">
          <div className="flex flex-col items-center justify-center h-full py-8">
            {/* Success animation */}
            <div
              className="relative mb-6 transition-all duration-500"
              style={{ opacity: Math.min(1, progress * 2), transform: `scale(${0.8 + progress * 0.2})` }}
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2" style={{ opacity: Math.min(1, progress * 1.5) }}>
              Report Complete!
            </h3>
            <p className="text-xs text-gray-500 mb-6" style={{ opacity: Math.min(1, (progress - 0.2) * 1.5) }}>
              Annual Monitoring Report • 47 pages
            </p>

            {/* Download button */}
            <button
              className="px-6 py-2 rounded-full bg-[#00ffcc] text-black text-sm font-semibold transition-all duration-300 hover:bg-[#00ffcc]/90"
              style={{ opacity: Math.min(1, (progress - 0.4) * 2), transform: `translateY(${(1 - Math.min(1, (progress - 0.4) * 2)) * 10}px)` }}
            >
              Download Report
            </button>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}

// =============================================================================
// Scene Renderer
// =============================================================================

export const REPORTLY_SCENES = [
  { id: "template", label: "Upload Template" },
  { id: "loading", label: "Connect Data" },
  { id: "populated", label: "Preview Report" },
  { id: "generating", label: "Generate" },
  { id: "complete", label: "Download" },
];

export function ReportlySceneRenderer({ sceneIndex, progress }: { sceneIndex: number; progress: number }) {
  switch (sceneIndex) {
    case 0:
      return <EmptyTemplateScene progress={progress} />;
    case 1:
      return <DataLoadingScene progress={progress} />;
    case 2:
      return <PopulatedScene progress={progress} />;
    case 3:
      return <GeneratingScene progress={progress} />;
    case 4:
      return <CompleteScene progress={progress} />;
    default:
      return <CompleteScene progress={1} />;
  }
}
