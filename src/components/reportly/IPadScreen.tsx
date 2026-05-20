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
    <div className="w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] overflow-hidden relative">
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
      {/* App icon with glow */}
      <div className="relative mb-4 sm:mb-6 md:mb-8 will-change-transform">
        <div
          className="absolute inset-0 bg-[#00ffcc]/30 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl will-change-[opacity,transform]"
          style={{
            opacity: 0.3 + progress * 0.5,
            transform: `scale(${1 + progress * 0.3}) translateZ(0)`,
            transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
          }}
        />
        <div
          className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00ffcc]/20 to-[#00ffcc]/5 border border-[#00ffcc]/30 flex items-center justify-center will-change-transform"
          style={{
            transform: `scale(${0.9 + progress * 0.1}) translateZ(0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <FileText className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#00ffcc]" />
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
            className="h-full bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full"
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
  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* App Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 md:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
        </div>
        <span className="text-xs sm:text-sm md:text-base font-medium text-white">Reportly</span>
      </div>

      {/* Upload Zone */}
      <div className="flex-1 border-2 border-dashed border-[#00ffcc]/30 rounded-xl sm:rounded-2xl bg-[#00ffcc]/5 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Animated upload icon */}
        <div className="relative mb-2 sm:mb-4 md:mb-6">
          <div className="absolute inset-0 bg-[#00ffcc]/20 rounded-full blur-lg sm:blur-xl animate-pulse" />
          <div className="relative p-2 sm:p-4 md:p-5 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30">
            <Upload className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#00ffcc]" />
          </div>
        </div>
        <p className="text-[10px] sm:text-sm md:text-base text-white font-medium mb-0.5 sm:mb-1">Drop your templates</p>
        <p className="text-[8px] sm:text-xs md:text-sm text-gray-500">Word, Excel, PDF</p>

        {/* Floating file previews - hidden on very small screens */}
        <div className="hidden sm:block absolute bottom-4 left-4 transform rotate-[-8deg] animate-float-slow">
          <FilePreview type="word" name="Report_Q4.docx" />
        </div>
        <div className="hidden sm:block absolute bottom-4 right-4 transform rotate-[6deg] animate-float-delayed">
          <FilePreview type="excel" name="Data_2024.xlsx" />
        </div>
      </div>

      {/* Recent uploads */}
      <div className="mt-2 sm:mt-4 md:mt-6">
        <p className="text-[8px] sm:text-xs md:text-sm text-gray-500 mb-1.5 sm:mb-3">Recent templates</p>
        <div className="flex gap-1.5 sm:gap-3">
          <MiniFile type="word" />
          <MiniFile type="excel" />
          <MiniFile type="word" />
        </div>
      </div>
    </div>
  );
}

// Scene 1: Add Project Data
function ProjectDataScreen() {
  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <Database className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-[10px] sm:text-sm md:text-base font-medium text-white">Project Data</span>
        </div>
        <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/30">
          <span className="text-[8px] sm:text-xs md:text-sm text-[#00ffcc]">Ingesting</span>
        </div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {[
          { label: 'IMG_4821.jpg', gps: '49.28°N' },
          { label: 'IMG_4822.jpg', gps: '49.28°N' },
          { label: 'IMG_4823.jpg', gps: '49.28°N' },
        ].map((photo) => (
          <div key={photo.label} className="rounded-lg bg-white/5 border border-white/10 aspect-square flex flex-col items-center justify-center p-1">
            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded bg-blue-500/20 flex items-center justify-center mb-1">
              <span className="text-[6px] sm:text-[8px] text-blue-400">IMG</span>
            </div>
            <p className="text-[5px] sm:text-[7px] text-gray-500 truncate w-full text-center">{photo.label}</p>
            <p className="text-[5px] sm:text-[7px] text-[#00ffcc]/60">{photo.gps}</p>
          </div>
        ))}
      </div>

      {/* Measurement table */}
      <div className="flex-1 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 border-b border-white/10">
          <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          <span className="text-[8px] sm:text-xs text-gray-400">Inspection_Measurements.xlsx · 847 rows</span>
        </div>
        <div className="p-1.5 sm:p-2 space-y-1">
          {[
            { field: 'Span Length', val: '24.6 m', mapped: true },
            { field: 'Deck Thickness', val: '220 mm', mapped: true },
            { field: 'Bearing Capacity', val: '94%', mapped: true },
          ].map((row) => (
            <div key={row.field} className="flex items-center justify-between px-1.5 py-1 rounded bg-white/[0.03] border border-white/5">
              <span className="text-[7px] sm:text-[10px] text-gray-400">{row.field}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] sm:text-[10px] text-white font-medium">{row.val}</span>
                {row.mapped && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ffcc]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPS indicator */}
      <div className="mt-2 sm:mt-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#00ffcc]/5 border border-[#00ffcc]/20">
        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00ffcc] flex-shrink-0" />
        <span className="text-[7px] sm:text-[10px] text-[#00ffcc]/70">24 photos GPS-tagged · Site data mapped to template</span>
      </div>
    </div>
  );
}

// Scene 2: Building Code Grounding
function BuildingCodesScreen() {
  const codes = [
    { abbr: 'NBCC 2020', name: 'National Building Code', level: 'Federal', color: '#60a5fa' },
    { abbr: 'BCBC 2024', name: 'BC Building Code', level: 'Provincial', color: '#34d399' },
    { abbr: 'VBL 12511', name: 'Vancouver By-law', level: 'Municipal', color: '#00ffcc' },
  ];
  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-[10px] sm:text-sm md:text-base font-medium text-white">Code Grounding</span>
        </div>
        <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#60a5fa]/20 border border-[#60a5fa]/30">
          <span className="text-[8px] sm:text-xs text-[#60a5fa]">Grounded</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-2 sm:mb-3">
        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#34d399] flex-shrink-0" />
        <span className="text-[7px] sm:text-[10px] text-white/60">800 Robson St, Vancouver, BC</span>
      </div>

      {/* Code stack */}
      <div className="flex-1 space-y-1.5 sm:space-y-2">
        <p className="text-[7px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Jurisdiction Stack - 3 codes matched</p>
        {codes.map((code) => (
          <div
            key={code.abbr}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border"
            style={{ background: `${code.color}08`, borderColor: `${code.color}25` }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ background: code.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[7px] sm:text-[10px] font-semibold text-white/80 truncate">{code.name}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span
                className="text-[6px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ color: code.color, background: `${code.color}14`, border: `1px solid ${code.color}28` }}
              >
                {code.abbr}
              </span>
              <span className="text-[6px] sm:text-[7px] text-gray-500 uppercase tracking-wide hidden sm:block">{code.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Governing brief banner */}
      <div className="mt-2 sm:mt-3 px-2 py-1.5 sm:py-2 rounded-lg text-center bg-[#00ffcc]/5 border border-[#00ffcc]/20">
        <p className="text-[7px] sm:text-[10px] font-bold text-[#00ffcc]/70">AI Governing Brief generated · Ready for Reportly</p>
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
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-[10px] sm:text-sm md:text-base font-medium text-white">Civil AI Generating…</span>
        </div>
        <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-[8px] sm:text-xs text-amber-400">In Progress</span>
        </div>
      </div>

      {/* Report sections */}
      <div className="flex-1 flex flex-col gap-1 sm:gap-1.5">
        {sections.map((s) => (
          <div
            key={s.num}
            className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/8"
            style={{ background: s.status === 'done' ? 'rgba(0,255,204,0.04)' : s.status === 'writing' ? 'rgba(251,191,36,0.04)' : 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[6px] sm:text-[8px] text-gray-600 font-black flex-shrink-0">{s.num}</span>
              <p className="text-[8px] sm:text-[11px] font-medium text-white/70 truncate">{s.title}</p>
            </div>
            <div className="flex-shrink-0 ml-2">
              {s.status === 'done' && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/40 flex items-center justify-center">
                  <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#00ffcc]" />
                </div>
              )}
              {s.status === 'writing' && (
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"
                      style={{ animationDelay: `${k * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
              {s.status === 'pending' && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/15" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shimmer lines for current section being written */}
      <div className="mt-2 sm:mt-3 bg-white/5 rounded-lg border border-white/8 p-2">
        <p className="text-[6px] sm:text-[8px] text-gray-500 mb-1.5">Generating Code References section…</p>
        <div className="space-y-1 sm:space-y-1.5">
          <div className="h-1.5 sm:h-2 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-1.5 sm:h-2 bg-white/10 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="h-1.5 sm:h-2 bg-white/10 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-2 sm:mt-3">
        <div className="flex justify-between text-[7px] sm:text-[10px] mb-1">
          <span className="text-gray-500">Draft generation</span>
          <span className="text-[#00ffcc]">67%</span>
        </div>
        <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full" />
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
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-[10px] sm:text-sm md:text-base font-medium text-white">QA Checklist</span>
        </div>
        <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-[8px] sm:text-xs text-amber-400">1 Flag</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 space-y-1 sm:space-y-1.5 overflow-hidden">
        {checks.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1 sm:py-1.5 rounded-lg border"
            style={{
              background: c.status === 'pass' ? 'rgba(0,255,204,0.03)' : 'rgba(251,191,36,0.05)',
              borderColor: c.status === 'pass' ? 'rgba(0,255,204,0.15)' : 'rgba(251,191,36,0.25)',
            }}
          >
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: c.status === 'pass' ? 'rgba(0,255,204,0.15)' : 'rgba(251,191,36,0.2)',
                border: `1px solid ${c.status === 'pass' ? 'rgba(0,255,204,0.35)' : 'rgba(251,191,36,0.4)'}`,
              }}
            >
              {c.status === 'pass' ? (
                <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#00ffcc]" />
              ) : (
                <span className="text-[6px] sm:text-[8px] text-amber-400 font-black">!</span>
              )}
            </div>
            <p className="text-[7px] sm:text-[10px] text-white/65 truncate">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Flag notice */}
      <div className="mt-2 sm:mt-3 px-2 py-1.5 rounded-lg bg-amber-500/8 border border-amber-500/25">
        <p className="text-[7px] sm:text-[9px] text-amber-400/80 font-semibold">1 item flagged for engineer review</p>
        <p className="text-[6px] sm:text-[8px] text-amber-400/50 mt-0.5">Professional judgment required - system flags, you decide.</p>
      </div>
    </div>
  );
}

// Scene 5: Export & Deliver
function ExportScreen() {
  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-[10px] sm:text-sm md:text-base font-medium text-white">Report Ready</span>
        </div>
        <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/30">
          <span className="text-[8px] sm:text-xs md:text-sm text-[#00ffcc]">Complete</span>
        </div>
      </div>

      {/* Document preview */}
      <div className="flex-1 bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl relative">
        {/* Document header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-2 sm:p-3 md:p-4">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-[#00ffcc] flex items-center justify-center">
              <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-black">AC</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-xs md:text-sm font-semibold text-white">ACME Corporation</p>
              <p className="text-[6px] sm:text-[10px] md:text-xs text-gray-400">Bridge Inspection Report · NBCC 2020 · BCBC 2024</p>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
          <div>
            <p className="text-[8px] sm:text-xs md:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">Structural Assessment Report</p>
            <p className="text-[6px] sm:text-[10px] md:text-xs text-gray-500 leading-relaxed">
              Bridge Inspection 2024 · Vancouver, BC · Code-compliant draft
            </p>
          </div>

          {/* Mini table */}
          <div className="border border-gray-200 rounded-md sm:rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-[6px] sm:text-[10px] md:text-xs font-medium text-gray-600">
              <div className="p-1 sm:p-2 border-r border-gray-200">Metric</div>
              <div className="p-1 sm:p-2 border-r border-gray-200">Value</div>
              <div className="p-1 sm:p-2">Status</div>
            </div>
            <TableRow metric="Load" value="94%" status="pass" />
            <TableRow metric="Stress" value="87%" status="pass" />
            <TableRow metric="Safety" value="100%" status="pass" />
          </div>

          {/* Signature line */}
          <div className="pt-2 sm:pt-3 md:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="w-8 sm:w-10 md:w-14 h-3 sm:h-4 md:h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded opacity-60" />
              <p className="text-[6px] sm:text-[10px] md:text-xs text-gray-400">P.Eng. Certified</p>
            </div>
          </div>
        </div>

        {/* Branded watermark */}
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 opacity-30">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-slate-800 flex items-center justify-center">
            <span className="text-[6px] sm:text-[10px] md:text-xs font-bold text-white">AC</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-2 sm:mt-4 md:mt-6 flex gap-1.5 sm:gap-3">
        <button className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-[#00ffcc] text-black text-[8px] sm:text-xs md:text-sm font-semibold hover:bg-[#00ffcc]/90 transition-colors flex items-center justify-center gap-1">
          <Download className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          Download DOCX
        </button>
        <button className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-white/10 text-white text-[8px] sm:text-xs md:text-sm font-semibold border border-white/20 hover:bg-white/20 transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  );
}

// Helper Components
function FilePreview({ type, name }: { type: "word" | "excel"; name: string }) {
  const isWord = type === "word";
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 w-24 sm:w-32">
      <div className={`w-full h-14 sm:h-20 rounded-lg mb-2 flex items-center justify-center ${
        isWord ? "bg-blue-50" : "bg-green-50"
      }`}>
        {isWord ? (
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        ) : (
          <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        )}
      </div>
      <p className="text-[10px] sm:text-xs text-gray-600 truncate">{name}</p>
    </div>
  );
}

function MiniFile({ type }: { type: "word" | "excel" }) {
  const isWord = type === "word";
  return (
    <div className={`w-7 h-8 sm:w-10 sm:h-12 md:w-12 md:h-14 rounded-md sm:rounded-lg flex items-center justify-center ${
      isWord ? "bg-blue-500/20" : "bg-green-500/20"
    }`}>
      {isWord ? (
        <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400" />
      ) : (
        <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400" />
      )}
    </div>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[8px] sm:text-xs md:text-sm text-gray-500">{label}</span>
      <span className={`text-[8px] sm:text-xs md:text-sm ${highlight ? "text-[#00ffcc]" : "text-white"}`}>{value}</span>
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
