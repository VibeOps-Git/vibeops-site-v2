// VibeOpsShowcase.tsx
// 3-scene animated showcase: Reportly → Code Intelligence → Custom Solutions
// Slower pacing so users can actually read what's happening.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FileText, MapPin, Wrench, Check, Download, AlertCircle, BarChart3 } from 'lucide-react';

const E = [0.22, 1, 0.36, 1] as const;
const SCENE_MS = 7500; // 7.5 seconds per scene - slow enough to read

type Scene = 'reportly' | 'codes' | 'custom';
const SCENES: Scene[] = ['reportly', 'codes', 'custom'];

// ─── Scene 1: Reportly - Report Editor ───────────────────────────────────────
// Looks like someone is editing a structural assessment report in Reportly.
// Sections build in, code citations attach, progress fills, export appears.

const REPORT_SECTIONS = [
  { num: '01', title: 'Executive Summary',    code: 'NBCC 2020', accent: '#34d399' },
  { num: '02', title: 'Site & Project Info',  code: 'BCBC 2024', accent: '#34d399' },
  { num: '03', title: 'Inspection Findings',  code: 'CSA S6-19', accent: '#34d399' },
  { num: '04', title: 'Structural Analysis',  code: 'CSA S6-19', accent: '#34d399' },
  { num: '05', title: 'Code References',      code: 'NBCC 2020', accent: '#34d399' },
  { num: '06', title: 'Recommendations',      code: null,         accent: '#34d399' },
];

function ReportlyScene() {
  const [visible, setVisible] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Show one section every 900ms
    const id = setInterval(() => {
      setVisible(v => {
        if (v >= REPORT_SECTIONS.length) { clearInterval(id); setExporting(true); return v; }
        return v + 1;
      });
    }, 950);
    return () => clearInterval(id);
  }, []);

  const done = visible >= REPORT_SECTIONS.length;

  return (
    <div className="h-full flex flex-col px-3 py-2 gap-1.5 overflow-hidden">
      {/* Report header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: E }}
        className="flex items-start justify-between gap-2 flex-shrink-0"
      >
        <div className="min-w-0">
          <p className="text-[6px] uppercase tracking-[0.22em] font-black text-emerald-400/65 mb-0.5">Reportly</p>
          <p className="text-[10.5px] font-bold text-white leading-tight truncate">Structural Assessment Report</p>
          <p className="text-[7.5px] text-white/35 mt-0.5">Bridge Inspection 2024 · Vancouver, BC · <span className="text-emerald-400/70">Draft</span></p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="w-14 h-1 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(52,211,153,0.12)' }}>
            <motion.div
              className="h-full rounded-full bg-emerald-400"
              animate={{ width: `${Math.round((visible / REPORT_SECTIONS.length) * 100)}%` }}
              transition={{ duration: 0.5, ease: E }}
            />
          </div>
          <p className="text-[6px] text-white/30 font-mono">{visible}/{REPORT_SECTIONS.length} sections</p>
        </div>
      </motion.div>

      {/* Section rows */}
      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {REPORT_SECTIONS.slice(0, visible).map((r, i) => (
          <motion.div
            key={r.num}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: E }}
            className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-white/6 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[6px] font-black text-white/18 flex-shrink-0">{r.num}</span>
              <p className="text-[8.5px] font-semibold text-white/72 truncate">{r.title}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {r.code && (
                <span className="text-[6px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ color: r.accent, border: `1px solid ${r.accent}30`, background: `${r.accent}0e` }}>
                  {r.code}
                </span>
              )}
              {/* Last section animates in as generating, then done */}
              {i < visible - 1 || done ? (
                <div className="w-3.5 h-3.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 flex items-center justify-center">
                  <Check className="w-2 h-2 text-emerald-400" />
                </div>
              ) : (
                <div className="flex gap-0.5">
                  {[0,1,2].map(k => (
                    <motion.div key={k} className="w-0.5 h-0.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [0.3,1,0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.22 }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Placeholder rows for sections not yet generated */}
        {REPORT_SECTIONS.slice(visible).map((r) => (
          <div key={r.num} className="h-7 rounded-lg border border-white/4 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.01)' }} />
        ))}
      </div>

      {/* Export row - appears when all done */}
      <AnimatePresence>
        {exporting && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: E }}
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl flex-shrink-0"
            style={{ border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(52,211,153,0.08)' }}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[8.5px] font-bold text-white truncate">Structural_Bridge_Report_2024.docx</p>
              <p className="text-[6.5px] text-emerald-400/60">Ready for QA review · 6 sections · 3 code standards cited</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scene 2: Code Intelligence - Address Code Lookup ────────────────────────
// Shows the code intelligence workflow: enter an address, get the full code stack.
// Typing → jurisdiction detection → codes loading → standards shown.

const MC_ADDRESS = '800 Robson St, Vancouver, BC';
const MC_CODES = [
  { name: 'National Building Code of Canada', year: '2020', level: 'federal',    color: '#34d399', status: 'In Force' },
  { name: 'National Fire Code of Canada',     year: '2020', level: 'federal',    color: '#34d399', status: 'In Force' },
  { name: 'BC Building Code',                  year: '2024', level: 'provincial', color: '#34d399', status: 'In Force' },
  { name: 'BC Fire Code',                      year: '2024', level: 'provincial', color: '#34d399', status: 'In Force' },
  { name: 'Vancouver Building By-law',          year: '2023', level: 'municipal',  color: '#34d399', status: 'In Force' },
];
const MC_STANDARDS = ['CSA A23.3-19', 'CSA S16-19', 'CSA O86-19', 'ASTM E119'];

type MCPhase = 'typing' | 'analyzing' | 'results';

function CodeIntelligenceScene() {
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<MCPhase>('typing');
  const [visibleCodes, setVisibleCodes] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(MC_ADDRESS.slice(0, i));
      if (i >= MC_ADDRESS.length) {
        clearInterval(id);
        setTimeout(() => setPhase('analyzing'), 300);
      }
    }, 42);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const t = setTimeout(() => setPhase('results'), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'results') return;
    let n = 0;
    const id = setInterval(() => {
      n++;
      setVisibleCodes(n);
      if (n >= MC_CODES.length) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="h-full flex flex-col px-3 py-2 gap-2 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: E }}
        className="flex-shrink-0"
      >
        <p className="text-[6px] uppercase tracking-[0.22em] font-black text-[#34d399]/65 mb-0.5">Code Intelligence</p>
        <p className="text-[10px] font-bold text-white leading-tight">Building Code Intelligence</p>
      </motion.div>

      {/* Address search bar */}
      <div className="flex gap-1.5 flex-shrink-0 min-w-0">
        <div className="flex-1 min-w-0 rounded-xl border border-white/12 px-2 py-1.5 flex items-center gap-1 min-h-[28px]"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#34d399' }} />
          <span className="text-[8px] font-mono text-white/70 truncate flex-1 min-w-0">
            {typed}
            {phase === 'typing' && <span className="inline-block w-0.5 h-2 bg-white/60 ml-0.5 align-middle animate-pulse" />}
          </span>
        </div>
        <motion.div
          className="px-2 py-1 rounded-lg text-[8px] font-bold text-white flex items-center flex-shrink-0 whitespace-nowrap"
          animate={{ background: phase === 'typing' ? '#0a2318' : '#34d399' }}
          transition={{ duration: 0.3 }}
        >
          Go
        </motion.div>
      </div>

      {/* Analyzing state */}
      <AnimatePresence>
        {phase === 'analyzing' && (
          <motion.div key="analyzing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="flex gap-0.5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  animate={{ opacity: [0.3,1,0.3] }}
                  transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.18 }} />
              ))}
            </div>
            <span className="text-[8.5px] text-amber-400 font-semibold">Detecting jurisdictions…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {phase === 'results' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col gap-1.5 overflow-hidden"
        >
          {/* Jurisdiction badges */}
          <div className="flex gap-1 flex-wrap flex-shrink-0">
            {[
              { label: 'Federal: Canada', color: '#34d399' },
              { label: 'Provincial: BC',  color: '#34d399' },
              { label: 'Municipal: Vancouver', color: '#34d399' },
            ].map((j, i) => (
              <motion.span key={j.label}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.08 }}
                className="text-[7px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${j.color}10`, color: j.color, border: `1px solid ${j.color}28` }}>
                ● {j.label}
              </motion.span>
            ))}
          </div>

          {/* Code results table */}
          <div className="rounded-xl overflow-hidden border border-white/8 flex-1"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/6"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[7px] font-bold text-white/35 uppercase tracking-wider">Applicable Building Codes</p>
              <p className="text-[7px] font-bold" style={{ color: '#34d399' }}>{visibleCodes} matched</p>
            </div>
            {MC_CODES.slice(0, visibleCodes).map((c, i) => (
              <motion.div key={c.name}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: i * 0.04 }}
                className="flex items-center justify-between px-2.5 py-2 border-b border-white/4 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-[8.5px] font-semibold text-white/78 truncate">{c.name}</p>
                  <p className="text-[6.5px] text-white/28 mt-0.5">{c.year} edition</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <span className="text-[6.5px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                    style={{ background: `${c.color}10`, color: c.color, border: `1px solid ${c.color}25` }}>
                    {c.level}
                  </span>
                  <span className="text-[6px] font-semibold" style={{ color: '#34d399' }}>{c.status}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Referenced standards */}
          {visibleCodes >= MC_CODES.length && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="flex-shrink-0"
            >
              <p className="text-[6.5px] uppercase tracking-[0.2em] text-white/25 font-bold mb-1">Referenced Standards</p>
              <div className="flex gap-1 flex-wrap">
                {MC_STANDARDS.map(s => (
                  <span key={s} className="text-[7px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(52,211,153,0.08)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Scene 3: Custom Solutions - Bespoke Engineering Software ─────────────────
// Shows a firm-specific custom deployment: a project tracking dashboard
// built on VibeOps IP for a specific AE firm.

const CUSTOM_REPORTS = [
  { name: 'Fraser Valley Bridge Inspection',    type: 'Structural', status: 'complete',   code: 'NBCC 2020', pct: 100 },
  { name: 'UBC Bldg C - Seismic Assessment',   type: 'Seismic',    status: 'review',     code: 'NBC S832',  pct: 88  },
  { name: 'Burnaby SkyTrain Station Survey',    type: 'Condition',  status: 'generating', code: 'BCBC 2024', pct: 61  },
  { name: 'Surrey Overpass Load Analysis',      type: 'Structural', status: 'queued',     code: null,        pct: 0   },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  complete:   { label: 'Complete',   color: '#34d399' },
  review:     { label: 'In Review',  color: '#60a5fa' },
  generating: { label: 'Generating', color: '#fbbf24' },
  queued:     { label: 'Queued',     color: 'rgba(255,255,255,0.28)' },
};

function CustomScene() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setShown(s => Math.min(s + 1, CUSTOM_REPORTS.length)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col px-3 py-2 gap-2 overflow-hidden">
      {/* Firm header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: E }}
        className="flex items-start justify-between flex-shrink-0"
      >
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-[6px] uppercase tracking-[0.22em] font-black text-blue-400/70">Custom Solutions · AE Firm Rollout</p>
          </div>
          <p className="text-[10.5px] font-bold text-white leading-tight">Report Automation Suite</p>
          <p className="text-[7.5px] text-white/35 mt-0.5">Private deployment · Powered by VibeOps</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[7px] font-black text-white">{CUSTOM_REPORTS.filter((_,i) => i < shown && CUSTOM_REPORTS[i].status === 'complete').length}</p>
          <p className="text-[6px] text-white/30 uppercase tracking-wide">Complete</p>
        </div>
      </motion.div>

      {/* Metric chips */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-3 gap-1.5 flex-shrink-0"
      >
        {[
          { val: '847',  unit: 'hrs', label: 'Saved',       color: '#34d399' },
          { val: '23',   unit: '',    label: 'Reports',      color: '#60a5fa' },
          { val: '98%',  unit: '',    label: 'QA Pass',      color: '#34d399' },
        ].map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.08 }}
            className="rounded-lg px-2 py-1.5 text-center"
            style={{ background: `${m.color}08`, border: `1px solid ${m.color}18` }}>
            <p className="text-[11px] font-black leading-none" style={{ color: m.color }}>
              {m.val}<span className="text-[7px]">{m.unit}</span>
            </p>
            <p className="text-[6px] text-white/30 mt-0.5 uppercase tracking-wide">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Report queue */}
      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        <p className="text-[6.5px] font-black uppercase tracking-[0.18em] text-white/28 flex-shrink-0">Active Projects</p>
        {CUSTOM_REPORTS.slice(0, shown).map((r, i) => {
          const st = STATUS_LABEL[r.status];
          return (
            <motion.div key={r.name}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: i * 0.05 }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-white/5 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-semibold text-white/70 truncate">{r.name}</p>
                <p className="text-[6px] text-white/28">{r.type} Report{r.code ? ` · ${r.code}` : ''}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-8 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: st.color }} />
                </div>
                <span className="text-[6.5px] font-semibold" style={{ color: st.color }}>{st.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chrome top bar ───────────────────────────────────────────────────────────

const CHROME_CONFIG: Record<Scene, { title: string; status: string; color: string }> = {
  reportly: { title: 'Reportly - Structural Assessment 2024',         status: 'Generating', color: '#34d399' },
  codes:    { title: 'Reportly - Building Code Intelligence (Vancouver)', status: 'Analyzing',  color: '#34d399' },
  custom:   { title: 'AE Firm - Custom Report Suite',                  status: 'Live',        color: '#60a5fa' },
};

function ChromeBar({ scene }: { scene: Scene }) {
  const cfg = CHROME_CONFIG[scene];
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8 flex-shrink-0" style={{ background: '#050a12' }}>
      <div className="flex gap-1 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 mx-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={scene}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded px-2 py-0.5 text-center text-[7.5px] text-white/22 border border-white/6 truncate"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {cfg.title}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={scene + '-s'}
          initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
          <span className="text-[7px] font-bold uppercase tracking-wide" style={{ color: cfg.color }}>{cfg.status}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


// ─── Main export ─────────────────────────────────────────────────────────────

export function VibeOpsShowcaseScreen() {
  const rm = useReducedMotion();
  const [sceneIdx, setSceneIdx] = useState(0);

  useEffect(() => {
    if (rm) return;
    const id = setInterval(() => setSceneIdx(i => (i + 1) % SCENES.length), SCENE_MS);
    return () => clearInterval(id);
  }, [rm]);

  const scene = rm ? 'reportly' : SCENES[sceneIdx];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#070d1a' }}>
      <ChromeBar scene={scene} />

      <div className="flex-1 overflow-hidden relative min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={scene} className="absolute inset-0"
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.4, ease: E }}>
            {scene === 'reportly' && <ReportlyScene />}
            {scene === 'codes'    && <CodeIntelligenceScene />}
            {scene === 'custom'   && <CustomScene />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
