import { FileText, FileSpreadsheet, Upload, CheckCircle, Sparkles, MapPin, Database, BookOpen, Shield, Download } from "lucide-react";

interface IPadScreenProps {
  sceneIndex: number;
  launchProgress?: number; // 0-1 for launch, 1+ for crossfade to step 1
}

export function IPadScreen({ sceneIndex, launchProgress }: IPadScreenProps) {
  // Calculate opacities for launch-to-step1 crossfade
  const showLaunch = launchProgress !== undefined;
  const launchOpacity = showLaunch
    ? (launchProgress <= 1 ? 1 : Math.max(0, 1 - (launchProgress - 1) * 2))
    : 0;
  const sceneOpacity = showLaunch
    ? (launchProgress <= 1 ? 0 : Math.min(1, (launchProgress - 1) * 2))
    : 1;

  return (
    <div className="dark w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] overflow-hidden relative text-white">
      {/* Launch screen - visible during intro, fades out during transition */}
      {showLaunch && (
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: launchOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <LaunchScreen progress={Math.min(1, launchProgress)} />
        </div>
      )}

      {/* Scene screens - crossfade between them */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: sceneIndex === i ? sceneOpacity : 0,
            transition: "opacity 0.4s ease-out",
            pointerEvents: sceneIndex === i && sceneOpacity > 0.5 ? "auto" : "none",
          }}
        >
          {i === 0 && <UploadScreen />}
          {i === 1 && <ProjectDataScreen />}
          {i === 2 && <BuildingCodesScreen />}
          {i === 3 && <GenerateScreen />}
          {i === 4 && <QualityControlScreen />}
          {i === 5 && <ExportScreen />}
        </div>
      ))}
    </div>
  );
}

function LaunchScreen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0a0f] to-[#0f1115] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* App icon */}
      <div className="relative mb-4 sm:mb-6 md:mb-8 will-change-transform">
        <div
          className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center will-change-transform"
          style={{
            transform: `scale(${0.9 + progress * 0.1}) translateZ(0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <FileText className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </div>

      {/* App name */}
      <h3
        className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
        style={{ opacity: 0.5 + progress * 0.5 }}
      >
        Reportly
      </h3>
      <p
        className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8"
        style={{ opacity: 0.3 + progress * 0.7 }}
      >
        Automated Report Generation
      </p>

      {/* Progress bar */}
      <div className="w-32 sm:w-48 md:w-56">
        <div className="h-1 sm:h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            style={{
              width: `${progress * 100}%`,
              transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
          {progress < 0.3 ? "Initializing..." :
           progress < 0.6 ? "Loading assets..." :
           progress < 0.9 ? "Preparing workspace..." :
           "Ready!"}
        </p>
      </div>
    </div>
  );
}

// Scene 0: Import Templates
function UploadScreen() {
  const templates = [
    { name: 'Bridge_Inspection.docx', meta: 'Word template · 12 pages' },
    { name: 'Structural_Report.docx', meta: 'Word template · 8 pages' },
    { name: 'Site_Assessment.docx', meta: 'Word template · 10 pages' },
  ];
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* App Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <span className="text-sm sm:text-base font-medium text-white">Import Template</span>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 px-4 mb-4 sm:mb-5">
        <div className="p-3 sm:p-4 rounded-full bg-primary/10 border border-primary/30 mb-3 sm:mb-4">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <p className="text-sm sm:text-base text-white font-medium mb-1">Drop your Word template</p>
        <p className="text-xs sm:text-sm text-gray-500">.docx</p>
      </div>

      {/* Template library */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Your templates</p>
      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5">
        {templates.map((t) => (
          <div key={t.name} className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white/90 truncate">{t.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">{t.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scene 1: Add Project Data
function ProjectDataScreen() {
  const sources = [
    { name: 'Inspection_Data.xlsx', meta: 'Excel · 847 rows', icon: 'excel' as const },
    { name: 'Field_Notes.pdf', meta: 'PDF · 18 pages', icon: 'pdf' as const },
    { name: 'Site_Survey.docx', meta: 'Word · 6 pages', icon: 'word' as const },
  ];
  const fields = [
    { field: 'Span Length', val: '24.6 m' },
    { field: 'Deck Thickness', val: '220 mm' },
    { field: 'Bearing Capacity', val: '94%' },
  ];
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Project Data</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
          <span className="text-[10px] sm:text-xs text-primary">3 sources</span>
        </div>
      </div>

      {/* Data sources */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Data sources</p>
      <div className="flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-5">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
            <DataIcon icon={s.icon} />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white/90 truncate">{s.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">{s.meta}</p>
            </div>
            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Mapped fields */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Mapped to template</p>
      <div className="flex-1 flex flex-col gap-2">
        {fields.map((row) => (
          <div key={row.field} className="flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs sm:text-sm text-gray-400">{row.field}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-white font-medium">{row.val}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* GPS indicator */}
      <div className="mt-4 sm:mt-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-[10px] sm:text-xs text-primary/80">24 photos GPS-tagged · Mapped to template</span>
      </div>
    </div>
  );
}

// Scene 2: Building Code Grounding
function BuildingCodesScreen() {
  const codes = [
    { abbr: 'NBCC 2020', name: 'National Building Code', level: 'Federal', color: '#60a5fa' },
    { abbr: 'BCBC 2024', name: 'BC Building Code', level: 'Provincial', color: '#34d399' },
    { abbr: 'VBL 12511', name: 'Vancouver By-law', level: 'Municipal', color: '#2dd4bf' },
  ];
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Code Grounding</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
          <span className="text-[10px] sm:text-xs text-primary">Grounded</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 mb-4 sm:mb-5">
        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-xs sm:text-sm text-white/70">800 Robson St, Vancouver, BC</span>
      </div>

      {/* Code stack */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Jurisdiction stack · 3 codes matched</p>
      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5">
        {codes.map((code) => (
          <div
            key={code.abbr}
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: code.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white/90 truncate">{code.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">{code.level}</p>
            </div>
            <span
              className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
              style={{ color: code.color, background: `${code.color}1a`, border: `1px solid ${code.color}33` }}
            >
              {code.abbr}
            </span>
          </div>
        ))}
      </div>

      {/* Governing brief banner */}
      <div className="mt-4 sm:mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-[10px] sm:text-xs text-primary/80">Governing brief generated · Ready for report</span>
      </div>
    </div>
  );
}

// Scene 3: Generate & Edit with Civil AI
function GenerateScreen() {
  const sections = [
    { num: '01', title: 'Executive Summary', status: 'done' },
    { num: '02', title: 'Inspection Findings', status: 'done' },
    { num: '03', title: 'Code References', status: 'writing' },
    { num: '04', title: 'Recommendations', status: 'pending' },
  ];
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Generating</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-[10px] sm:text-xs text-amber-400">In Progress</span>
        </div>
      </div>

      {/* Report sections */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Report sections</p>
      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5">
        {sections.map((s) => (
          <div
            key={s.num}
            className="flex items-center justify-between px-3 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] sm:text-xs text-gray-600 font-bold flex-shrink-0">{s.num}</span>
              <p className="text-xs sm:text-sm font-medium text-white/90 truncate">{s.title}</p>
            </div>
            <div className="flex-shrink-0 ml-2">
              {s.status === 'done' && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              )}
              {s.status === 'writing' && (
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"
                      style={{ animationDelay: `${k * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
              {s.status === 'pending' && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/15" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-4 sm:mt-5">
        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <span className="text-gray-500">Draft generation</span>
          <span className="text-primary font-medium">67%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Scene 4: Quality Control
function QualityControlScreen() {
  const checks = [
    { label: 'NBCC 2020 references verified', status: 'pass' },
    { label: 'BCBC 2024 section citations', status: 'pass' },
    { label: 'Formatting consistency', status: 'pass' },
    { label: 'Table completeness', status: 'pass' },
    { label: 'Signature block present', status: 'flag' },
    { label: 'Executive summary length', status: 'pass' },
  ];
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">QA Checklist</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-[10px] sm:text-xs text-amber-400">1 Flag</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5">
        {checks.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: c.status === 'pass' ? 'hsl(168 72% 50% / 0.15)' : 'rgba(251,191,36,0.2)',
                border: `1px solid ${c.status === 'pass' ? 'hsl(168 72% 50% / 0.35)' : 'rgba(251,191,36,0.4)'}`,
              }}
            >
              {c.status === 'pass' ? (
                <CheckCircle className="w-3 h-3 text-primary" />
              ) : (
                <span className="text-[10px] text-amber-400 font-black">!</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/80 truncate">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Flag notice */}
      <div className="mt-4 sm:mt-5 px-3 py-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/25">
        <p className="text-xs sm:text-sm text-amber-400/90 font-semibold">1 item flagged for engineer review</p>
        <p className="text-[10px] sm:text-xs text-amber-400/60 mt-1">System flags, you decide — professional judgment required.</p>
      </div>
    </div>
  );
}

// Scene 5: Export & Deliver
function ExportScreen() {
  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Report Ready</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
          <span className="text-[10px] sm:text-xs text-primary">Complete</span>
        </div>
      </div>

      {/* Document preview */}
      <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Document header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-black">AC</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">ACME Corporation</p>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">Bridge Inspection · NBCC 2020 · BCBC 2024</p>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Structural Assessment Report</p>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
              Bridge Inspection 2024 · Vancouver, BC · Code-compliant draft
            </p>
          </div>

          {/* Mini table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-[10px] sm:text-xs font-medium text-gray-600">
              <div className="p-2 border-r border-gray-200">Metric</div>
              <div className="p-2 border-r border-gray-200">Value</div>
              <div className="p-2">Status</div>
            </div>
            <TableRow metric="Load" value="94%" status="pass" />
            <TableRow metric="Stress" value="87%" status="pass" />
            <TableRow metric="Safety" value="100%" status="pass" />
          </div>

          {/* Signature line */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 sm:w-16 h-4 sm:h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded opacity-60" />
              <p className="text-[10px] sm:text-xs text-gray-400">P.Eng. Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 sm:mt-5 flex gap-2.5 sm:gap-3">
        <button className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl bg-primary text-black text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Download DOCX
        </button>
        <button className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-semibold border border-white/20 hover:bg-white/20 transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  );
}

// Helper Components
function DataIcon({ icon }: { icon: "word" | "excel" | "pdf" }) {
  const config = {
    word: { bg: "bg-blue-500/15", fg: "text-blue-400", Icon: FileText },
    excel: { bg: "bg-green-500/15", fg: "text-green-400", Icon: FileSpreadsheet },
    pdf: { bg: "bg-red-500/15", fg: "text-red-400", Icon: FileText },
  }[icon];
  const { Icon } = config;
  return (
    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.fg}`} />
    </div>
  );
}

function TableRow({ metric, value, status }: { metric: string; value: string; status: "pass" | "fail" }) {
  return (
    <div className="grid grid-cols-3 text-[6px] sm:text-[10px] md:text-xs border-t border-gray-200">
      <div className="p-1 sm:p-2 border-r border-gray-200 text-gray-600">{metric}</div>
      <div className="p-1 sm:p-2 border-r border-gray-200 text-gray-800 font-medium">{value}</div>
      <div className="p-1 sm:p-2 flex items-center">
        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full ${
          status === "pass" ? "bg-green-500" : "bg-red-500"
        }`} />
      </div>
    </div>
  );
}
