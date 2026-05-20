// ReportlyScrollStory.tsx
// Bounded workflow section - desktop: 2-col grid, sticky visual right.
// Active step driven by useInView per copy card.
// v2: Problem step shows the broken legacy workflow before Reportly is introduced.

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Check, ArrowRight, FileText, Camera, ClipboardList,
  BarChart3, MapPin, Download, Shield, AlertCircle,
  Database, Cpu, CheckSquare,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

type StepId = 'problem' | 'templates' | 'data' | 'codes' | 'generate' | 'qc' | 'export';

const STEPS = [
  {
    id: 'problem' as StepId,
    num: '00', label: 'The Problem',
    eyebrow: 'The Reality',
    heading: '3-5 months per engineer, gone to manual work.',
    body: 'Word templates. Excel sheets. Field photos. Site notes. Code PDFs. All assembled by hand, on every project. 175+ AE firms told us the same thing.',
    accent: '#ef4444',
  },
  {
    id: 'templates' as StepId,
    num: '01', label: 'Templates',
    eyebrow: 'Step 1 - Templates',
    heading: 'Your firm\'s templates, loaded once.',
    body: 'Upload your existing Word and Excel report templates. Reportly learns your firm\'s structure, headings, and formatting - no redesign, no migration.',
    accent: '#34d399',
  },
  {
    id: 'data' as StepId,
    num: '02', label: 'Project Data',
    eyebrow: 'Step 2 - Project Data',
    heading: 'Field data, photos, notes - all pulled in.',
    body: 'Connect inspection data, field photographs with GPS tags, site observations, measurements, and Excel tables. Reportly maps them to your template structure automatically.',
    accent: '#34d399',
  },
  {
    id: 'codes' as StepId,
    num: '03', label: 'Building Codes',
    eyebrow: 'Step 3 - Building Codes',
    heading: 'Every applicable code, grounded to the address.',
    body: 'Reportly resolves the full regulatory stack per project address - federal, provincial, and municipal. Code references are grounded and cited automatically in the draft.',
    accent: '#34d399',
  },
  {
    id: 'generate' as StepId,
    num: '04', label: 'Generate & Edit',
    eyebrow: 'Step 4 - Generate & Edit',
    heading: 'First draft in 3 minutes. Civil-specific AI.',
    body: 'Embedded photos, code citations, executive summary, consistent formatting - generated in minutes by AI trained on civil engineering language, structure, and terminology.',
    accent: '#34d399',
  },
  {
    id: 'qc' as StepId,
    num: '05', label: 'Quality Control',
    eyebrow: 'Step 5 - Quality Control',
    heading: 'QA built into the workflow, not bolted on after.',
    body: "Formatting standards, code citation checks, and QA checklists applied to your firm's requirements. Flag issues, add comments, and run sign-off approvals - all in one place.",
    accent: '#60a5fa',
  },
  {
    id: 'export' as StepId,
    num: '06', label: 'Export',
    eyebrow: 'Step 6 - Export',
    heading: 'Client-ready output. Your format, your branding.',
    body: '70% faster. 100% your templates. DOCX or PDF - code-compliant, professionally formatted, and ready for client delivery the way your firm has always done it.',
    accent: '#34d399',
    cta: { label: 'Try Reportly', href: '/reportly' },
  },
];

const STEP_ICONS: Record<StepId, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  problem:   AlertCircle,
  templates: FileText,
  data:      Database,
  codes:     MapPin,
  generate:  Cpu,
  qc:        CheckSquare,
  export:    Download,
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared report row
// ─────────────────────────────────────────────────────────────────────────────

function ReportRow({
  num, title, codeRef, checked, lines = 3,
}: {
  num: string; title: string; codeRef?: string; checked?: boolean; lines?: number;
}) {
  return (
    <div className="py-3 border-b border-white/6 last:border-0">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[8px] text-white/22 font-black flex-shrink-0">{num}</span>
          <p className="text-[11px] font-semibold text-white/65 truncate">{title}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {codeRef && (
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7.5px] font-semibold whitespace-nowrap"
              style={{ color: '#f08080', border: '1px solid rgba(217,47,55,0.28)', background: 'rgba(217,47,55,0.10)' }}
            >
              <MapPin className="w-2 h-2 flex-shrink-0" style={{ color: '#34d399' }} />
              {codeRef}
            </span>
          )}
          {checked && (
            <div className="w-4 h-4 rounded-full border border-emerald-500/40 bg-emerald-950/70 flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full"
            style={{ width: i === lines - 1 ? '62%' : i % 2 === 0 ? '100%' : '82%', background: 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App chrome top bar - changes to match the active step's context
// ─────────────────────────────────────────────────────────────────────────────

function AppChrome({ step }: { step: StepId }) {
  const isProblem = step === 'problem';

  const STATUS: Record<StepId, { text: string; color: string }> = {
    problem:   { text: 'Manual workflow',    color: '#ef4444' },
    templates: { text: 'Templates loaded',   color: '#34d399' },
    data:      { text: 'Data ingested',      color: '#34d399' },
    codes:     { text: 'Grounding codes…',   color: '#34d399' },
    generate:  { text: 'Generating draft…',  color: '#34d399' },
    qc:        { text: 'QA review',          color: '#60a5fa' },
    export:    { text: 'Export ready',       color: '#34d399' },
  };
  const s = STATUS[step];

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border-b border-white/8 flex-shrink-0"
      style={{ background: isProblem ? '#070c18' : '#0b1422' }}
    >
      <div className="flex gap-1.5 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 mx-2 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={isProblem ? 'problem-bar' : 'reportly-bar'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-md px-2 py-1 text-center text-[9px] tracking-wide border truncate"
            style={
              isProblem
                ? { background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.18)', color: 'rgba(248,113,113,0.65)' }
                : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)' }
            }
          >
            {isProblem ? 'Final_Report_v7_REVISED.docx' : 'Reportly - Structural Assessment 2024'}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="text-[8.5px] font-bold uppercase tracking-[0.14em] whitespace-nowrap flex-shrink-0"
          style={{ color: s.color }}
        >
          {s.text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Problem visual - the broken legacy workflow (before Reportly)
// ─────────────────────────────────────────────────────────────────────────────

function ProblemVisual() {
  return (
    <div className="space-y-3">

      {/* Main messy legacy document */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: '#080e1c', borderColor: 'rgba(239,68,68,0.18)' }}
      >
        {/* Doc header - bad filename, unsaved state */}
        <div
          className="flex items-center gap-2 px-3 py-2 border-b"
          style={{ background: '#060b16', borderColor: 'rgba(239,68,68,0.12)' }}
        >
          <div
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ background: '#2b5ce6', opacity: 0.65 }}
          />
          <span className="text-[8px] font-mono text-white/40 flex-1 truncate">
            Final_Report_v7_REVISED.docx
          </span>
          <span
            className="text-[7px] font-bold text-red-400/80 px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)' }}
          >
            ⚠ UNSAVED
          </span>
        </div>

        <div className="p-3 space-y-2.5">

          {/* Version chaos - competing file versions */}
          <div
            className="rounded-lg p-2"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-[6.5px] uppercase tracking-[0.15em] mb-1.5 font-semibold" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Recent versions - 5 conflicts
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              {[
                { name: 'Report_Draft_Feb.docx',     active: false },
                { name: 'Report_v3_JA.docx',         active: false },
                { name: 'Final_v5.docx',              active: false },
                { name: 'Final_v7_REVISED.docx',     active: true  },
              ].map(({ name, active }) => (
                <div key={name} className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-1 h-1 rounded-full flex-shrink-0 ${active ? 'bg-red-400' : 'bg-white/10'}`} />
                  <span
                    className="text-[6.5px] font-mono truncate"
                    style={{ color: active ? 'rgba(248,113,113,0.85)' : 'rgba(255,255,255,0.2)', fontWeight: active ? 700 : 400 }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inconsistent heading block */}
          <div className="pl-2 py-1 border-l-2" style={{ borderColor: '#2b5ce6' }}>
            <div className="h-2 rounded-full mb-1" style={{ width: '80%', background: 'rgba(255,255,255,0.14)' }} />
            <p className="text-[7px] italic" style={{ color: 'rgba(239,68,68,0.65)' }}>
              ← v7 revision - use THIS not v6. ask John for correct template
            </p>
          </div>

          {/* Pasted photo placeholder with loose note */}
          <div
            className="rounded-lg p-2 flex items-center gap-2.5 border border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.01)' }}
          >
            <div
              className="w-10 h-8 rounded border flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Camera className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[7.5px] font-mono text-white/35 truncate">IMG_4821_final (1).jpg</p>
              <p className="text-[7px] italic mt-0.5" style={{ color: 'rgba(239,68,68,0.6)' }}>
                ← add GPS coords from John's v3 spreadsheet
              </p>
            </div>
          </div>

          {/* Copy-pasted data table with bad values */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div
              className="px-2 py-1 border-b"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <p className="text-[6.5px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                TABLE_4_loadings_v3(old).xlsx - copy-paste
              </p>
            </div>
            <div className="grid grid-cols-3">
              {['Location', 'Load (kN)', 'Note'].map((h, i) => (
                <div
                  key={h}
                  className="px-2 py-1 text-[6.5px] font-bold border-b border-r last:border-r-0"
                  style={{ color: i === 2 ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  {h}
                </div>
              ))}
              {['Pier 4A', '234', 'SEE BELOW*'].map((c, i) => (
                <div
                  key={c + '0'}
                  className="px-2 py-1 text-[6.5px] border-b border-r last:border-r-0"
                  style={{ color: i === 2 ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.22)', borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  {c}
                </div>
              ))}
              {['Pier 4B', '???', 'UPDATE THIS'].map((c, i) => (
                <div
                  key={c + '1'}
                  className="px-2 py-1 text-[6.5px] border-r last:border-r-0"
                  style={{
                    color: i === 1 ? 'rgba(239,68,68,0.65)' : i === 2 ? 'rgba(251,191,36,0.65)' : 'rgba(255,255,255,0.22)',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Inline review comment */}
          <div className="flex gap-2 pl-2 border-l-2" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
            <div className="min-w-0">
              <p className="text-[7px] font-bold" style={{ color: 'rgba(239,68,68,0.8)' }}>J. Anderson - Comment</p>
              <p className="text-[6.5px] italic mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                "Which code year applies here? BCBC 2018 or 2024? Needs to be verified before client delivery."
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Cost stat */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <p
          className="text-[7.5px] uppercase tracking-[0.16em] px-2 whitespace-nowrap"
          style={{ color: 'rgba(239,68,68,0.55)' }}
        >
          $475K / firm / year in lost engineering hours
        </p>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ingest visual - Reportly begins organizing the inputs
// ─────────────────────────────────────────────────────────────────────────────

function IngestVisual() {
  const inputs = [
    { label: 'Structural Template',  sub: 'Word · .docx',          color: '#2b5ce6', Icon: FileText,      rotate: -6, pos: { top: 0, left: 0 } as React.CSSProperties },
    { label: 'Inspection Data',      sub: 'Excel · 847 rows',      color: '#16a34a', Icon: BarChart3,     rotate: 5,  pos: { top: 0, right: 0 } as React.CSSProperties },
    { label: 'Field Photos',         sub: '24 images · GPS tagged', color: '#7c3aed', Icon: Camera,        rotate: 3,  pos: { bottom: 0, left: 0 } as React.CSSProperties },
    { label: 'Site Observations',    sub: '3 pages · field notes',  color: '#d97706', Icon: ClipboardList, rotate: -4, pos: { bottom: 0, right: 0 } as React.CSSProperties },
  ];
  return (
    <div className="relative" style={{ minHeight: 300 }}>
      {/* Center: Reportly ingestion hub - clear product branding */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-2.5 px-6 py-4 rounded-2xl border"
          style={{ background: 'rgba(52,211,153,0.06)', borderColor: 'rgba(52,211,153,0.22)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.22em]">Reportly</span>
          </div>
          <p className="text-[7.5px] text-center" style={{ color: 'rgba(52,211,153,0.55)' }}>
            Ingesting your workflow…
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.55)' }}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating input cards */}
      {inputs.map((inp, i) => (
        <motion.div
          key={inp.label}
          className="absolute flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{
            ...inp.pos,
            rotate: inp.rotate,
            maxWidth: 180,
            borderColor: `${inp.color}28`,
            background: `linear-gradient(135deg, ${inp.color}0e 0%, rgba(8,14,26,0.96) 100%)`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${inp.color}14`, border: `1px solid ${inp.color}28` }}
          >
            <inp.Icon className="w-3 h-3 flex-shrink-0" style={{ color: inp.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/85 truncate leading-tight">{inp.label}</p>
            <p className="text-[8.5px] leading-tight mt-0.5 font-medium" style={{ color: `${inp.color}99` }}>{inp.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Remaining step visuals (Ground, Generate, QA, Ship)
// ─────────────────────────────────────────────────────────────────────────────

function GroundVisual() {
  const chips = ['NBCC 2020', 'BCBC 2024', 'CSA S6-19', 'City of Vancouver'];
  return (
    <div>
      <div className="mb-3 pb-3 border-b border-white/8">
        <p className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-500/70 font-bold mb-0.5">Reportly · Grounding</p>
        <p className="text-[13px] font-bold text-white leading-tight">Structural Assessment Report</p>
        <p className="text-[9px] text-white/35 mt-0.5">Bridge Inspection 2024 · Vancouver, BC</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8.5px] font-semibold"
            style={{ color: '#f08080', border: '1px solid rgba(217,47,55,0.28)', background: 'rgba(217,47,55,0.10)' }}
          >
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#34d399' }} />
            {chip}
          </motion.span>
        ))}
      </div>
      <ReportRow num="01" title="Executive Summary"    codeRef="NBCC 2020" />
      <ReportRow num="02" title="Inspection Findings"  codeRef="CSA S6-19" />
      <ReportRow num="03" title="Code References"      codeRef="BCBC 2024" />
    </div>
  );
}

function GenerateVisual() {
  return (
    <div>
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/8">
        <div>
          <p className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-500/70 font-bold mb-0.5">Reportly · Generating</p>
          <p className="text-[13px] font-bold text-white leading-tight">Structural Assessment Report</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/28 bg-emerald-950/60 flex-shrink-0 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[7px] font-bold text-emerald-400 uppercase tracking-[0.15em]">Building</p>
        </div>
      </div>
      <ReportRow num="01" title="Executive Summary"    codeRef="NBCC 2020" lines={2} />
      <ReportRow num="02" title="Inspection Findings"  codeRef="CSA S6-19" lines={3} />
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[8px] text-white/22 font-black">03</span>
          <p className="text-[11px] font-semibold text-white/40">Code References</p>
          <div className="flex-1 h-0.5 rounded-full bg-white/8 overflow-hidden ml-1">
            <motion.div
              className="h-full rounded-full bg-emerald-500/70"
              initial={{ width: '0%' }}
              animate={{ width: '68%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-white/5 w-full" />
          <div className="h-1.5 rounded-full bg-white/5 w-3/4" />
        </div>
      </div>
    </div>
  );
}

function QAVisual() {
  return (
    <div>
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/8">
        <div>
          <p className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-500/70 font-bold mb-0.5">Reportly · Review</p>
          <p className="text-[13px] font-bold text-white leading-tight">Structural Assessment Report</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-blue-500/28 bg-blue-950/40 flex-shrink-0 ml-2">
          <Shield className="w-2.5 h-2.5 text-blue-400" />
          <p className="text-[7px] font-bold text-blue-400 uppercase tracking-[0.15em]">QA Review</p>
        </div>
      </div>
      <ReportRow num="01" title="Executive Summary"    codeRef="NBCC 2020" checked />
      <ReportRow num="02" title="Inspection Findings"  codeRef="CSA S6-19" checked />
      <ReportRow num="03" title="Code References"      codeRef="BCBC 2024" checked />
      <ReportRow num="04" title="Recommendations"      checked />
    </div>
  );
}

function ShipVisual() {
  return (
    <div>
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/8">
        <div>
          <p className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-500/70 font-bold mb-0.5">Reportly · Complete</p>
          <p className="text-[13px] font-bold text-white leading-tight">Structural Assessment Report</p>
          <p className="text-[9px] text-white/35 mt-0.5">Bridge Inspection 2024 · Vancouver, BC</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center flex-shrink-0 ml-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
      <ReportRow num="01" title="Executive Summary"    codeRef="NBCC 2020" checked lines={2} />
      <ReportRow num="02" title="Inspection Findings"  codeRef="CSA S6-19" checked lines={2} />
      <ReportRow num="03" title="Code References"      checked lines={2} />
      <div className="pt-4">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(52,211,153,0.06)' }}
        >
          <Download className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate">Structural_Bridge_Report_Final.docx</p>
            <p className="text-[8.5px] text-emerald-400 mt-0.5 font-medium">QA-ready · Code-compliant · 3 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowVisual - sticky right panel
// ─────────────────────────────────────────────────────────────────────────────

// embedded=true → renders flat (no card wrapper) for use inside WorkflowLaptopFrame
// ─────────────────────────────────────────────────────────────────────────────
// Templates visual - firm's Word/Excel templates loaded
// ─────────────────────────────────────────────────────────────────────────────
function TemplatesVisual() {
  const templates = [
    { name: 'Structural_Assessment_Template.docx', type: 'Word', color: '#2b5ce6', sections: ['Executive Summary', 'Inspection Findings', 'Code References', 'Recommendations'] },
    { name: 'Bridge_Inspection_v4.docx', type: 'Word', color: '#2b5ce6', sections: ['Site Overview', 'Structural Condition', 'Load Analysis'] },
    { name: 'QA_Checklist_Standard.xlsx', type: 'Excel', color: '#16a34a', sections: ['Pre-submission QA', 'Code Verification', 'Sign-off'] },
  ];
  return (
    <div className="space-y-2.5">
      <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-emerald-400/70 mb-2">Firm Templates Loaded</p>
      {templates.map((t) => (
        <div key={t.name} className="rounded-xl border p-3" style={{ background: `${t.color}07`, borderColor: `${t.color}22` }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}18` }}>
              <FileText className="w-2.5 h-2.5" style={{ color: t.color }} />
            </div>
            <p className="text-[9px] font-mono text-white/55 truncate">{t.name}</p>
            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${t.color}18`, color: t.color }}>{t.type}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {t.sections.map((s) => (
              <span key={s} className="text-[7px] px-1.5 py-0.5 rounded border border-white/8 text-white/35">{s}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 h-px bg-white/8" />
        <p className="text-[7.5px] text-emerald-400/60 font-semibold">3 templates · 10 sections mapped</p>
        <div className="flex-1 h-px bg-white/8" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Data visual - photos, notes, tables ingested
// ─────────────────────────────────────────────────────────────────────────────
function ProjectDataVisual() {
  const sources = [
    { label: 'Field Photos', count: '24 images · GPS tagged', color: '#7c3aed', Icon: Camera },
    { label: 'Inspection Data', count: 'Excel · 847 rows', color: '#16a34a', Icon: BarChart3 },
    { label: 'Site Observations', count: '3 pages · field notes', color: '#d97706', Icon: ClipboardList },
    { label: 'Measurements', count: '62 data points', color: '#0891b2', Icon: FileText },
  ];
  return (
    <div className="space-y-2.5">
      <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-purple-400/70 mb-2">Project Data Detected</p>
      {sources.map((s) => (
        <div key={s.label} className="rounded-xl border p-2.5 flex items-center gap-2.5" style={{ background: `${s.color}08`, borderColor: `${s.color}22` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
            <s.Icon className="w-4 h-4" style={{ color: s.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-white/75">{s.label}</p>
            <p className="text-[8.5px] text-white/35 mt-0.5">{s.count}</p>
          </div>
          <div className="w-4 h-4 rounded-full border border-emerald-500/40 bg-emerald-950/70 flex items-center justify-center flex-shrink-0">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quality Control visual
// ─────────────────────────────────────────────────────────────────────────────
function QualityControlVisual() {
  const checks = [
    { label: 'Code citations verified', status: 'pass', detail: 'NBCC 2020 · BCBC 2024 · CSA S6-19' },
    { label: 'Formatting consistency', status: 'pass', detail: 'All headers match template style' },
    { label: 'Photo placement verified', status: 'pass', detail: '24 images placed and captioned' },
    { label: 'Executive summary complete', status: 'pass', detail: 'Scope, findings, recommendations' },
    { label: 'QA sign-off pending', status: 'pending', detail: 'Awaiting P.Eng review' },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-blue-400/70">QA Checklist</p>
        <span className="text-[7.5px] font-bold text-blue-400">4/5 passed</span>
      </div>
      {checks.map((c) => (
        <div key={c.label} className="rounded-xl border p-2.5 flex items-start gap-2.5"
          style={{ background: c.status === 'pass' ? 'rgba(52,211,153,0.04)' : 'rgba(251,191,36,0.04)', borderColor: c.status === 'pass' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.2)' }}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${c.status === 'pass' ? 'border-emerald-500/40 bg-emerald-950/70' : 'border-amber-400/40 bg-amber-950/70'}`}>
            {c.status === 'pass'
              ? <Check className="w-2.5 h-2.5 text-emerald-400" />
              : <span className="text-[8px] text-amber-400 font-bold">!</span>
            }
          </div>
          <div className="min-w-0">
            <p className="text-[9.5px] font-semibold text-white/75">{c.label}</p>
            <p className="text-[8px] text-white/30 mt-0.5">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Export visual (renamed from ShipVisual alias)
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowVisual({ activeStep, embedded = false }: { activeStep: StepId; embedded?: boolean }) {
  const VISUALS: Record<StepId, React.ReactNode> = {
    problem:   <ProblemVisual />,
    templates: <TemplatesVisual />,
    data:      <ProjectDataVisual />,
    codes:     <GroundVisual />,
    generate:  <GenerateVisual />,
    qc:        <QualityControlVisual />,
    export:    <ShipVisual />,
  };

  const inner = (
    <>
      <AppChrome step={activeStep} />
      <div className="relative" style={{ minHeight: embedded ? 260 : 320 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            className="p-4"
            initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {VISUALS[activeStep]}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Progress bar */}
      <div className="px-4 py-2.5 border-t border-white/6 flex items-center gap-1.5">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className="flex-1 h-0.5 rounded-full transition-all duration-500"
            style={{ background: s.id === activeStep ? s.accent : 'rgba(255,255,255,0.10)' }}
          />
        ))}
        <p className="text-[7px] text-white/22 uppercase tracking-[0.12em] whitespace-nowrap ml-1 flex-shrink-0">
          {STEPS.findIndex((s) => s.id === activeStep) + 1}/{STEPS.length}
        </p>
      </div>
    </>
  );

  if (embedded) {
    return <div className="relative flex flex-col w-full">{inner}</div>;
  }

  return (
    <div className="relative w-full max-w-[420px]">
      <div
        aria-hidden="true"
        className="absolute -inset-10 pointer-events-none"
        style={{
          background: activeStep === 'problem'
            ? 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(52,211,153,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0a1220',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {inner}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowStepCard - left column, tracks inView
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowStepCard({
  step, isActive, setActive,
}: {
  step: typeof STEPS[number];
  isActive: boolean;
  setActive: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="py-14 border-b border-white/6 last:border-0">
      <p
        className="text-[9px] font-black uppercase tracking-[0.35em] mb-3 leading-none transition-colors duration-500"
        style={{ color: isActive ? step.accent : 'rgba(255,255,255,0.22)' }}
      >
        {step.eyebrow}
      </p>
      <h3
        className="font-black text-white leading-[1.05] tracking-[-0.035em] mb-4 transition-opacity duration-500"
        style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.3rem)', opacity: isActive ? 1 : 0.38 }}
      >
        {step.heading}
      </h3>
      <p
        className="text-[14px] leading-[1.75] max-w-sm transition-opacity duration-500"
        style={{ color: 'rgba(255,255,255,0.52)', opacity: isActive ? 1 : 0.5 }}
      >
        {step.body}
      </p>
      {'cta' in step && step.cta && isActive && (
        <motion.a
          href={step.cta.href}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: EASE }}
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[13px] font-bold"
          style={{ boxShadow: '0 12px 32px rgba(52,211,153,0.25)' }}
        >
          {step.cta.label} <ArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowSection - main desktop export
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Laptop chrome frame - wraps WorkflowVisual so it lives "inside" a device
// ─────────────────────────────────────────────────────────────────────────────
function WorkflowLaptopFrame({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="w-full" style={{ perspective: 1200 }}>
      {/* Screen lid */}
      <div
        className="relative"
        style={{
          border: '4px solid #2e3240',
          borderRadius: '8px 8px 2px 2px',
          background: 'linear-gradient(180deg,#32363e,#252830 40%,#1e2128)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Rubber corner bumpers */}
        <div className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 rounded-br-lg bg-[#181a1f] z-10" />
        <div className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 rounded-bl-lg bg-[#181a1f] z-10" />
        <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 rounded-tr-md bg-[#181a1f] z-10" />
        <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 rounded-tl-md bg-[#181a1f] z-10" />

        <div className="p-2.5 pt-2">
          {/* Webcam */}
          <div className="flex justify-center mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#12141a] ring-1 ring-[#3a3d44]" />
          </div>
          {/* Screen area */}
          <div
            className="relative overflow-hidden rounded-sm"
            style={{ border: '1.5px solid #0d0f14', background: '#070d1a' }}
          >
            {/* Active step accent glow on screen edge */}
            <div
              className="absolute inset-x-0 top-0 h-0.5 transition-colors duration-500"
              style={{ background: accent }}
            />
            {children}
          </div>
          {/* Brand tag */}
          <div className="flex justify-center mt-1">
            <span className="text-[5px] font-bold tracking-[0.3em] uppercase text-white/10 select-none">Reportly</span>
          </div>
        </div>
        {/* Hinge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t bg-[#181a1f]" />
      </div>

      {/* Base */}
      <div
        className="relative mx-auto w-full sm:w-[103%] sm:-ml-[1.5%] overflow-hidden"
        style={{
          height: 'clamp(28px,3vw,40px)',
          border: '4px solid #2e3240',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          background: 'linear-gradient(180deg,#1e2128,#252830 50%,#2e3240)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
        }}
      >
        <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 rounded-tr-md bg-[#181a1f] z-10" />
        <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 rounded-tl-md bg-[#181a1f] z-10" />
        {/* Trackpad */}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[14%] h-[40%] rounded bg-[#1a1d22] border border-[#32363e]/30" />
        {/* LEDs */}
        <div className="absolute top-[20%] right-[4%] flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
          <div className="w-1 h-1 rounded-full bg-amber-400/25" />
        </div>
      </div>

      {/* Ground shadow */}
      <div className="mx-auto h-1 w-[85%] rounded-b-full" style={{ background: 'rgba(0,0,0,0.2)', filter: 'blur(4px)' }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowSection - main desktop export
// Uses useScroll on the section ref for deterministic, reversible step switching
// ─────────────────────────────────────────────────────────────────────────────

export function WorkflowSection() {
  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Framer useScroll: progress 0 = section top at viewport center,
  // progress 1 = section bottom at viewport center. Reversible and scrub-safe.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  // Map 0-1 progress to one of 6 step indices deterministically
  const N = STEPS.length; // 6
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
      setActiveIdx(idx);
    });
  }, [scrollYProgress, N]);

  const activeStep = STEPS[activeIdx].id;
  const activeAccent = STEPS[activeIdx].accent;

  return (
    <>
      {/* ── Desktop ── */}
      <section ref={sectionRef} className="hidden md:block border-t border-white/6 bg-[#060b14]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          {/* Section header */}
          <div className="pt-20 pb-12 border-b border-white/6">
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.35em] mb-3">Before &amp; After</p>
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <h2
                className="font-bold text-white tracking-[-0.025em] leading-[1.06]"
                style={{ fontSize: 'clamp(1.9rem, 3vw, 2.9rem)' }}
              >
                From manual chaos<br />
                <span className="text-emerald-400">to clean report in minutes.</span>
              </h2>
              <p className="text-[14px] text-white/40 max-w-xs leading-[1.7]">
                The only workflow built for AE reporting - from scattered legacy inputs to code-compliant, client-ready reports.
              </p>
            </div>
          </div>

          {/* Two-column layout - use items-stretch (default) so sticky has room */}
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 pb-24">
            {/* LEFT - step cards */}
            <div>
              {STEPS.map((step, i) => (
                <WorkflowStepCard
                  key={step.id}
                  step={step}
                  isActive={activeIdx === i}
                  setActive={() => {}} // display only; scroll drives state
                />
              ))}
            </div>

            {/* RIGHT - sticky visual inside laptop chrome */}
            <div className="hidden lg:block">
              <div className="sticky pt-10" style={{ top: 'max(4rem, calc(50vh - 300px))' }}>
                {rm ? (
                  <StaticVisual />
                ) : (
                  <WorkflowLaptopFrame accent={activeAccent}>
                    <WorkflowVisual activeStep={activeStep} embedded />
                  </WorkflowLaptopFrame>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile ── */}
      <ReportlyMobileStory />
    </>
  );
}

// Reduced-motion fallback
function StaticVisual() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 p-5"
      style={{ background: '#080f1c', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}
    >
      <div className="mb-3 pb-3 border-b border-white/8">
        <p className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-500/70 font-bold mb-0.5">Reportly</p>
        <p className="text-[13px] font-bold text-white">Structural Assessment Report</p>
        <p className="text-[9px] text-white/35 mt-0.5">Bridge Inspection 2024 · Vancouver, BC</p>
      </div>
      <ReportRow num="01" title="Executive Summary"    codeRef="NBCC 2020" checked />
      <ReportRow num="02" title="Inspection Findings"  codeRef="CSA S6-19" checked />
      <ReportRow num="03" title="Code References"      codeRef="BCBC 2024" checked />
      <ReportRow num="04" title="Recommendations"      checked />
      <div
        className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
        style={{ border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(52,211,153,0.06)' }}
      >
        <Download className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-[11px] font-bold text-white">Structural_Bridge_Report_Final.docx</p>
          <p className="text-[8.5px] text-emerald-400 mt-0.5">QA-ready · Code-compliant · 3 min</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile story - stacked cards (problem → ship)
// ─────────────────────────────────────────────────────────────────────────────

export function ReportlyMobileStory() {
  return (
    <section className="bg-[#060b14] py-16 md:hidden border-t border-white/6">
      <div className="px-6">
        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Before &amp; After</p>
        <h2
          className="font-black text-white leading-[1.06] tracking-[-0.04em] mb-10"
          style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)' }}
        >
          Manual chaos in.<br />
          <span className="text-emerald-400">Clean report out.</span>
        </h2>
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const Icon = STEP_ICONS[step.id];
            return (
              <motion.div
                key={step.id}
                className="p-5 rounded-2xl border border-white/8 bg-white/[0.025]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={step.id === 'problem' ? { borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.03)' } : {}}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${step.accent}12`, border: `1px solid ${step.accent}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: `${step.accent}bb` }} />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: `${step.accent}bb` }}>
                    {step.eyebrow}
                  </p>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2 leading-tight">{step.heading}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed">{step.body}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8">
          <a
            href="/reportly"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black font-bold text-[14px]"
          >
            Try Reportly <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Named export alias for any existing imports
export { WorkflowSection as ReportlyScrollStory };
