import { FileText, FileSpreadsheet, Upload, CheckCircle, Sparkles } from "lucide-react";

interface IPadScreenProps {
  sceneIndex: number;
}

export function IPadScreen({ sceneIndex }: IPadScreenProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] overflow-hidden">
      {sceneIndex === 0 && <UploadScreen />}
      {sceneIndex === 1 && <TransformScreen />}
      {sceneIndex === 2 && <OutputScreen />}
    </div>
  );
}

function UploadScreen() {
  return (
    <div className="w-full h-full p-3 sm:p-4 flex flex-col">
      {/* App Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#00ffcc]/20 flex items-center justify-center">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ffcc]" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-white">Reportly</span>
      </div>

      {/* Upload Zone */}
      <div className="flex-1 border-2 border-dashed border-[#00ffcc]/30 rounded-xl bg-[#00ffcc]/5 flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
        {/* Animated upload icon */}
        <div className="relative mb-3 sm:mb-4">
          <div className="absolute inset-0 bg-[#00ffcc]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-3 sm:p-4 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#00ffcc]" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-white font-medium mb-1">Drop your templates</p>
        <p className="text-[10px] sm:text-xs text-gray-500">Word, Excel, PDF</p>

        {/* Floating file previews */}
        <div className="absolute -bottom-2 -left-2 sm:bottom-2 sm:left-2 transform rotate-[-8deg] animate-float-slow">
          <FilePreview type="word" name="Report_Q4.docx" />
        </div>
        <div className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-2 transform rotate-[6deg] animate-float-delayed">
          <FilePreview type="excel" name="Data_2024.xlsx" />
        </div>
      </div>

      {/* Recent uploads hint */}
      <div className="mt-3 sm:mt-4">
        <p className="text-[10px] sm:text-xs text-gray-500 mb-2">Recent templates</p>
        <div className="flex gap-2">
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
    <div className="w-full h-full p-3 sm:p-4 flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#00ffcc]/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ffcc]" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-white">Processing...</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-[10px] sm:text-xs text-amber-400">In Progress</span>
        </div>
      </div>

      {/* Transformation visualization */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-3">
        {/* Source document */}
        <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-[10px] sm:text-xs text-gray-400">Source Data</span>
          </div>
          <div className="space-y-1">
            <DataRow label="Project" value="Site Analysis" />
            <DataRow label="Client" value="ACME Corp" />
            <DataRow label="Date" value="Jan 2025" highlight />
          </div>
        </div>

        {/* Transformation arrows */}
        <div className="flex items-center justify-center py-1 sm:py-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ffcc] animate-pulse" />
            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/30" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ffcc]/50 animate-pulse delay-100" />
            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-[#00ffcc]/30 to-[#00ffcc]/10" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ffcc]/30 animate-pulse delay-200" />
          </div>
        </div>

        {/* Output preview */}
        <div className="flex-1 bg-white/5 rounded-lg p-2 sm:p-3 border border-[#00ffcc]/20">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ffcc]" />
            <span className="text-[10px] sm:text-xs text-gray-400">Building Report...</span>
          </div>
          {/* Animated placeholder lines */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-2 sm:h-2.5 bg-white/10 rounded w-3/4 animate-shimmer" />
            <div className="h-2 sm:h-2.5 bg-white/10 rounded w-full animate-shimmer delay-75" />
            <div className="h-2 sm:h-2.5 bg-white/10 rounded w-5/6 animate-shimmer delay-150" />
            <div className="h-6 sm:h-8 bg-[#00ffcc]/10 rounded mt-2 sm:mt-3 animate-shimmer delay-200" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between text-[10px] sm:text-xs mb-1">
          <span className="text-gray-500">Applying formatting rules...</span>
          <span className="text-[#00ffcc]">67%</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function OutputScreen() {
  return (
    <div className="w-full h-full p-3 sm:p-4 flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#00ffcc]/20 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ffcc]" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-white">Report Ready</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/30">
          <span className="text-[10px] sm:text-xs text-[#00ffcc]">Complete</span>
        </div>
      </div>

      {/* Document preview */}
      <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-lg relative">
        {/* Document header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-2 sm:p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded bg-[#00ffcc] flex items-center justify-center">
              <span className="text-[8px] sm:text-[10px] font-bold text-black">AC</span>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-white">ACME Corporation</p>
              <p className="text-[8px] sm:text-[10px] text-gray-400">Engineering Report</p>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-800 mb-1">Site Analysis Report</p>
            <p className="text-[8px] sm:text-[10px] text-gray-500 leading-relaxed">
              Quarterly assessment Q4 2024
            </p>
          </div>

          {/* Mini table */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-[8px] sm:text-[10px] font-medium text-gray-600">
              <div className="p-1 sm:p-1.5 border-r border-gray-200">Metric</div>
              <div className="p-1 sm:p-1.5 border-r border-gray-200">Value</div>
              <div className="p-1 sm:p-1.5">Status</div>
            </div>
            <TableRow metric="Load" value="94%" status="pass" />
            <TableRow metric="Stress" value="87%" status="pass" />
            <TableRow metric="Safety" value="100%" status="pass" />
          </div>

          {/* Signature line */}
          <div className="pt-2 sm:pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded opacity-60" />
              <p className="text-[8px] sm:text-[10px] text-gray-400">Certified Engineer</p>
            </div>
          </div>
        </div>

        {/* Branded watermark */}
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 opacity-30">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-slate-800 flex items-center justify-center">
            <span className="text-[8px] sm:text-[10px] font-bold text-white">AC</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 sm:mt-4 flex gap-2">
        <button className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#00ffcc] text-black text-[10px] sm:text-xs font-medium">
          Download
        </button>
        <button className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 text-white text-[10px] sm:text-xs font-medium border border-white/20">
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
    <div className="bg-white rounded-lg shadow-lg p-2 sm:p-2.5 w-20 sm:w-28">
      <div className={`w-full h-12 sm:h-16 rounded mb-1.5 sm:mb-2 flex items-center justify-center ${
        isWord ? "bg-blue-50" : "bg-green-50"
      }`}>
        {isWord ? (
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        ) : (
          <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
        )}
      </div>
      <p className="text-[8px] sm:text-[10px] text-gray-600 truncate">{name}</p>
    </div>
  );
}

function MiniFile({ type }: { type: "word" | "excel" }) {
  const isWord = type === "word";
  return (
    <div className={`w-8 h-10 sm:w-10 sm:h-12 rounded-md flex items-center justify-center ${
      isWord ? "bg-blue-500/20" : "bg-green-500/20"
    }`}>
      {isWord ? (
        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
      ) : (
        <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
      )}
    </div>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] sm:text-xs text-gray-500">{label}</span>
      <span className={`text-[10px] sm:text-xs ${highlight ? "text-[#00ffcc]" : "text-white"}`}>{value}</span>
    </div>
  );
}

function TableRow({ metric, value, status }: { metric: string; value: string; status: "pass" | "fail" }) {
  return (
    <div className="grid grid-cols-3 text-[8px] sm:text-[10px] border-t border-gray-200">
      <div className="p-1 sm:p-1.5 border-r border-gray-200 text-gray-600">{metric}</div>
      <div className="p-1 sm:p-1.5 border-r border-gray-200 text-gray-800 font-medium">{value}</div>
      <div className="p-1 sm:p-1.5">
        <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
          status === "pass" ? "bg-green-500" : "bg-red-500"
        }`} />
      </div>
    </div>
  );
}
