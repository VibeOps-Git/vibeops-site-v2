import { FileText, CheckCircle } from "lucide-react";

export function ReportlyHomepagePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] rounded-xl overflow-hidden border border-[#00ffcc]/20">
      {/* App Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00ffcc]/20 flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ffcc]" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-white">Report Ready</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc]/30">
          <span className="text-[10px] sm:text-xs text-[#00ffcc]">Complete</span>
        </div>
      </div>

      {/* Document preview */}
      <div className="p-3 sm:p-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl">
          {/* Document header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-2.5 sm:p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#00ffcc] flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] font-bold text-black">AC</span>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-white">ACME Corporation</p>
                <p className="text-[8px] sm:text-[10px] text-gray-400">Engineering Report</p>
              </div>
            </div>
          </div>

          {/* Document content */}
          <div className="p-2.5 sm:p-3 space-y-2 sm:space-y-3">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-800 mb-0.5">Site Analysis Report</p>
              <p className="text-[8px] sm:text-[10px] text-gray-500">Quarterly assessment Q4 2024</p>
            </div>

            {/* Mini table */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 text-[8px] sm:text-[10px] font-medium text-gray-600">
                <div className="p-1.5 border-r border-gray-200">Metric</div>
                <div className="p-1.5 border-r border-gray-200">Value</div>
                <div className="p-1.5">Status</div>
              </div>
              <TableRow metric="Load" value="94%" status="pass" />
              <TableRow metric="Stress" value="87%" status="pass" />
              <TableRow metric="Safety" value="100%" status="pass" />
            </div>

            {/* Signature line */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 sm:w-10 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded opacity-60" />
                <p className="text-[8px] sm:text-[10px] text-gray-400">Certified Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 px-3 py-1.5 sm:py-2 rounded-lg bg-[#00ffcc] text-black text-[10px] sm:text-xs font-semibold text-center">
            Download
          </div>
          <div className="flex-1 px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 text-white text-[10px] sm:text-xs font-semibold border border-white/20 text-center">
            Share
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ metric, value, status }: { metric: string; value: string; status: "pass" | "fail" }) {
  return (
    <div className="grid grid-cols-3 text-[8px] sm:text-[10px] border-t border-gray-200">
      <div className="p-1.5 border-r border-gray-200 text-gray-600">{metric}</div>
      <div className="p-1.5 border-r border-gray-200 text-gray-800 font-medium">{value}</div>
      <div className="p-1.5 flex items-center">
        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
          status === "pass" ? "bg-green-500" : "bg-red-500"
        }`} />
      </div>
    </div>
  );
}
