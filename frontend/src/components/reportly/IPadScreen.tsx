import { useState, useEffect } from "react";
import { FileText, FileSpreadsheet, Upload, CheckCircle, Sparkles } from "lucide-react";

interface IPadScreenProps {
  sceneIndex: number;
  launchProgress?: number; // 0-1, when provided shows launch screen
}

export function IPadScreen({ sceneIndex, launchProgress }: IPadScreenProps) {
  const [displayIndex, setDisplayIndex] = useState(sceneIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (sceneIndex !== displayIndex) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayIndex(sceneIndex);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [sceneIndex, displayIndex]);

  // Show launch screen during intro
  if (launchProgress !== undefined && launchProgress < 1) {
    return <LaunchScreen progress={launchProgress} />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] overflow-hidden relative">
      <div
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: `scale(${isTransitioning ? 0.95 : 1})`,
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
        className="w-full h-full"
      >
        {displayIndex === 0 && <UploadScreen />}
        {displayIndex === 1 && <TransformScreen />}
        {displayIndex === 2 && <OutputScreen />}
      </div>
    </div>
  );
}

function LaunchScreen({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0a0f] to-[#0f1115] flex flex-col items-center justify-center p-8">
      {/* App icon with glow */}
      <div className="relative mb-8">
        <div
          className="absolute inset-0 bg-[#00ffcc]/30 rounded-3xl blur-2xl"
          style={{
            opacity: 0.3 + progress * 0.5,
            transform: `scale(${1 + progress * 0.3})`,
          }}
        />
        <div
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#00ffcc]/20 to-[#00ffcc]/5 border border-[#00ffcc]/30 flex items-center justify-center"
          style={{
            transform: `scale(${0.9 + progress * 0.1})`,
          }}
        >
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ffcc]" />
        </div>
      </div>

      {/* App name */}
      <h3
        className="text-xl sm:text-2xl font-bold text-white mb-2"
        style={{ opacity: 0.5 + progress * 0.5 }}
      >
        Reportly
      </h3>
      <p
        className="text-xs sm:text-sm text-gray-500 mb-8"
        style={{ opacity: 0.3 + progress * 0.7 }}
      >
        Automated Report Generation
      </p>

      {/* Progress bar */}
      <div className="w-48 sm:w-56">
        <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          {progress < 0.3 ? "Initializing..." :
           progress < 0.6 ? "Loading assets..." :
           progress < 0.9 ? "Preparing workspace..." :
           "Ready!"}
        </p>
      </div>
    </div>
  );
}

function UploadScreen() {
  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col">
      {/* App Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc]" />
        </div>
        <span className="text-sm sm:text-base font-medium text-white">Reportly</span>
      </div>

      {/* Upload Zone */}
      <div className="flex-1 border-2 border-dashed border-[#00ffcc]/30 rounded-2xl bg-[#00ffcc]/5 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Animated upload icon */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-[#00ffcc]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-4 sm:p-5 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#00ffcc]" />
          </div>
        </div>
        <p className="text-sm sm:text-base text-white font-medium mb-1">Drop your templates</p>
        <p className="text-xs sm:text-sm text-gray-500">Word, Excel, PDF</p>

        {/* Floating file previews */}
        <div className="absolute bottom-4 left-4 transform rotate-[-8deg] animate-float-slow">
          <FilePreview type="word" name="Report_Q4.docx" />
        </div>
        <div className="absolute bottom-4 right-4 transform rotate-[6deg] animate-float-delayed">
          <FilePreview type="excel" name="Data_2024.xlsx" />
        </div>
      </div>

      {/* Recent uploads */}
      <div className="mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm text-gray-500 mb-3">Recent templates</p>
        <div className="flex gap-3">
          <MiniFile type="word" />
          <MiniFile type="excel" />
          <MiniFile type="word" />
        </div>
      </div>
    </div>
  );
}

function TransformScreen() {
  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Processing...</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-xs sm:text-sm text-amber-400">In Progress</span>
        </div>
      </div>

      {/* Transformation visualization */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4">
        {/* Source document */}
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-xs sm:text-sm text-gray-400">Source Data</span>
          </div>
          <div className="space-y-2">
            <DataRow label="Project" value="Site Analysis" />
            <DataRow label="Client" value="ACME Corp" />
            <DataRow label="Date" value="Jan 2025" highlight />
          </div>
        </div>

        {/* Transformation arrows */}
        <div className="flex items-center justify-center py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00ffcc] animate-pulse" />
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/30" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00ffcc]/50 animate-pulse delay-100" />
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-[#00ffcc]/30 to-[#00ffcc]/10" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00ffcc]/30 animate-pulse delay-200" />
          </div>
        </div>

        {/* Output preview */}
        <div className="flex-1 bg-white/5 rounded-xl p-3 sm:p-4 border border-[#00ffcc]/20">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc]" />
            <span className="text-xs sm:text-sm text-gray-400">Building Report...</span>
          </div>
          {/* Animated placeholder lines */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4 animate-shimmer" />
            <div className="h-3 sm:h-4 bg-white/10 rounded w-full animate-shimmer delay-75" />
            <div className="h-3 sm:h-4 bg-white/10 rounded w-5/6 animate-shimmer delay-150" />
            <div className="h-8 sm:h-10 bg-[#00ffcc]/10 rounded mt-3 sm:mt-4 animate-shimmer delay-200" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 sm:mt-6">
        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <span className="text-gray-500">Applying formatting rules...</span>
          <span className="text-[#00ffcc]">67%</span>
        </div>
        <div className="h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function OutputScreen() {
  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#00ffcc]/20 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-sm sm:text-base font-medium text-white">Report Ready</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/30">
          <span className="text-xs sm:text-sm text-[#00ffcc]">Complete</span>
        </div>
      </div>

      {/* Document preview */}
      <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl relative">
        {/* Document header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#00ffcc] flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-black">AC</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">ACME Corporation</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Engineering Report</p>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Site Analysis Report</p>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
              Quarterly assessment Q4 2024
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
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-14 h-4 sm:h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded opacity-60" />
              <p className="text-[10px] sm:text-xs text-gray-400">Certified Engineer</p>
            </div>
          </div>
        </div>

        {/* Branded watermark */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-30">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold text-white">AC</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 sm:mt-6 flex gap-3">
        <button className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-[#00ffcc] text-black text-xs sm:text-sm font-semibold hover:bg-[#00ffcc]/90 transition-colors">
          Download
        </button>
        <button className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-semibold border border-white/20 hover:bg-white/20 transition-colors">
          Share
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
    <div className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg flex items-center justify-center ${
      isWord ? "bg-blue-500/20" : "bg-green-500/20"
    }`}>
      {isWord ? (
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
      )}
    </div>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs sm:text-sm text-gray-500">{label}</span>
      <span className={`text-xs sm:text-sm ${highlight ? "text-[#00ffcc]" : "text-white"}`}>{value}</span>
    </div>
  );
}

function TableRow({ metric, value, status }: { metric: string; value: string; status: "pass" | "fail" }) {
  return (
    <div className="grid grid-cols-3 text-[10px] sm:text-xs border-t border-gray-200">
      <div className="p-2 border-r border-gray-200 text-gray-600">{metric}</div>
      <div className="p-2 border-r border-gray-200 text-gray-800 font-medium">{value}</div>
      <div className="p-2 flex items-center">
        <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
          status === "pass" ? "bg-green-500" : "bg-red-500"
        }`} />
      </div>
    </div>
  );
}
