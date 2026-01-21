import { FileText, Table, BarChart2, Image } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface ReportlyPreviewProps {
  /** Scroll progress 0-1 for animations */
  progress?: number;
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

function PreviewHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#00ffcc]/10">
          <FileText className="w-4 h-4 text-[#00ffcc]" />
        </div>
        <span className="text-sm font-semibold text-white">Reportly</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20">
        <span className="text-xs text-[#00ffcc]">Dam Safety Report</span>
      </div>
    </div>
  );
}

function SidebarCard({
  label,
  title,
  subtitle,
  variant = "default",
  statusDot,
}: {
  label: string;
  title: string;
  subtitle?: string;
  variant?: "default" | "highlight";
  statusDot?: "green" | "yellow";
}) {
  const baseClasses = "p-3 rounded-xl";
  const variantClasses =
    variant === "highlight"
      ? "bg-[#00ffcc]/5 border border-[#00ffcc]/20"
      : "bg-white/5 border border-white/10";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <p
        className={`text-[0.6rem] uppercase tracking-wider mb-2 ${
          variant === "highlight" ? "text-[#00ffcc]" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <div className="flex items-center gap-2">
        {statusDot && (
          <div
            className={`w-2 h-2 rounded-full ${
              statusDot === "green" ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
        )}
        <p className="text-xs text-white font-medium">{title}</p>
      </div>
      {subtitle && <p className="text-[0.6rem] text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function PreviewSection({
  icon: Icon,
  label,
  children,
  delay = 0,
  progress = 1,
}: {
  icon: typeof Table;
  label: string;
  children: React.ReactNode;
  delay?: number;
  progress?: number;
}) {
  // Stagger animation based on progress and delay
  const sectionProgress = Math.max(0, Math.min(1, (progress - delay) / 0.3));
  const opacity = sectionProgress;
  const translateY = (1 - sectionProgress) * 10;

  return (
    <div
      className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3 h-3 text-[#00ffcc]/60" />
        <span className="text-[0.6rem] text-gray-500">{label}</span>
      </div>
      {children}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ReportlyPreview({ progress = 1, className = "" }: ReportlyPreviewProps) {
  // Animate bars based on progress
  const barHeights = [40, 65, 45, 80, 55, 70, 50, 75, 60];

  return (
    <div className={`aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] ${className}`}>
      <PreviewHeader />

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="col-span-1 space-y-3">
          <SidebarCard
            label="Template"
            title="Annual Monitoring Report"
            subtitle="v2.4 • Word + Excel"
          />
          <SidebarCard
            label="Data Source"
            title="Connected"
            subtitle="147 records loaded"
            statusDot="green"
          />
          <SidebarCard label="Status" title="Ready to Generate" variant="highlight" />
        </div>

        {/* Preview Panel */}
        <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
          <p className="text-[0.6rem] uppercase tracking-wider text-gray-500 mb-3">
            Report Preview
          </p>

          <div className="space-y-3">
            {/* Title skeleton */}
            <div
              className="space-y-2 transition-opacity duration-500"
              style={{ opacity: Math.min(1, progress * 2) }}
            >
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/5" />
            </div>

            {/* Table */}
            <PreviewSection icon={Table} label="Instrumentation Data" delay={0.1} progress={progress}>
              <div className="grid grid-cols-4 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-2 rounded bg-white/10" />
                ))}
              </div>
            </PreviewSection>

            {/* Chart */}
            <PreviewSection icon={BarChart2} label="Piezometer Readings" delay={0.3} progress={progress}>
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
            </PreviewSection>

            {/* Photos */}
            <PreviewSection icon={Image} label="Photo Appendix" delay={0.5} progress={progress}>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => {
                  const photoProgress = Math.max(0, Math.min(1, (progress - 0.5 - i * 0.1) / 0.2));
                  return (
                    <div
                      key={i}
                      className="flex-1 aspect-square rounded bg-white/10 transition-all duration-300"
                      style={{
                        opacity: photoProgress,
                        transform: `scale(${0.8 + photoProgress * 0.2})`,
                      }}
                    />
                  );
                })}
              </div>
            </PreviewSection>
          </div>
        </div>
      </div>
    </div>
  );
}
