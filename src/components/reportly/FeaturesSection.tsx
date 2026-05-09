import { useState } from 'react';
import { Check, Cog, Brain, FileText, Calculator, Wand2, HardHat } from "lucide-react";
import { motion, useReducedMotion } from 'framer-motion';
import { ScrambleText } from "../ScrambleText";
import { APPLE_HOVER_SPRING, APPLE_CARD_SPRING, APPLE_REVEAL_SPRING, getTransition, SCRAMBLE_DURATION } from '@/lib/motion';

const features = [
  {
    icon: Cog,
    title: "Eng-Specific Automation",
    description: "Built for civil engineering workflows, not generic documents.",
    proof: "Preserves your exact styles, tables, and conditional logic from day one.",
  },
  {
    icon: Brain,
    title: "AI Engineering Reports",
    description: "Intelligent document parsing that understands engineering context.",
    proof: "Recognizes inspection data, photos, and calculations without manual mapping.",
  },
  {
    icon: FileText,
    title: "Uses Your Templates",
    description: "Upload your existing Word and Excel templates. We work with them.",
    proof: "Purpose-built for civil engineering workflows that already use your templates.",
  },
  {
    icon: Calculator,
    title: "Cost Sheet Automation",
    description: "Automatically populate calculations and cost estimates.",
    proof: "All formulas, units, and roll-ups execute exactly as your firm has validated.",
  },
  {
    icon: Wand2,
    title: "No-Code Setup",
    description: "No technical skills required. Just upload templates and go.",
    proof: "Project managers configure in under 10 minutes. No IT tickets required.",
  },
  {
    icon: HardHat,
    title: "Structural & Civil Focus",
    description: "Purpose-built for structural and civil engineering firms.",
    proof: "QA gates, SharePoint folders, and compliance checklists remain untouched.",
  },
];

// Refined premium glass card (equivalent to LiquidGlassCard for grid use, no modal zoom)
// FeatureCard: ~58 lines intentional for optical micro-details (specular, icon grid, tracking, proof expand).
// Decomposed from FeaturesSection per Issue 14 feedback; magic values documented as Apple-tuned optical sizes.
function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const reduced = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(false);

  const revealTransition = getTransition(reduced, APPLE_REVEAL_SPRING);
  const hoverAnim = reduced ? {} : { scale: 1.02, y: -1 };
  const hoverTransition = getTransition(reduced, APPLE_HOVER_SPRING);
  const expandTransition = getTransition(reduced, APPLE_CARD_SPRING);

  // Keyboard accessibility (Issue 5): button semantics, ARIA, Enter/Space handler, focus ring
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <motion.button
      type="button"
      onClick={toggleExpanded}
      onKeyDown={handleKeyDown}
      aria-expanded={expanded}
      aria-controls={`proof-${feature.title.replace(/\s+/g, '-')}`}
      tabIndex={0}
      className="group relative h-full w-full text-left rounded-3xl border border-white/12 bg-white/[0.035] backdrop-blur-3xl p-8 shadow-[0_20px_60px_-15px_rgb(0,0,0,0.55)] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--emerald-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912]"
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0, transition: revealTransition }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={hoverAnim}
      transition={hoverTransition}
    >
      {/* Subtle inner specular highlight — now spring-parity timing (Issue 14) via group-hover + fast ease matching APPLE_EASE (160ms ≈ 0.16s crossfade slice) */}
      <div 
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-150" 
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1.0, 0.32, 1)' }}
      />

      {/* Icon — emerald, 12/16 grid spacing (documented optical) */}
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--emerald-deep)]/15 border border-[var(--emerald-accent)]/20 mb-6">
        <feature.icon className="w-6 h-6 text-[var(--emerald-accent)]" />
      </div>

      {/* Typography using fluid scale + tracking vars (1.05rem/0.95rem are optical tweaks within --fs-body range) */}
      <h3 className="text-[1.05rem] font-semibold text-white mb-3 tracking-[-0.014em]">
        {feature.title}
      </h3>
      <p className="text-[0.95rem] leading-[1.62] text-white/70 mb-4 tracking-[-0.004em]">
        {feature.description}
      </p>

      {/* Refined check badge (emerald) */}
      <div className="absolute top-8 right-8">
        <div className="w-7 h-7 rounded-full bg-[var(--emerald-accent)]/10 border border-[var(--emerald-accent)]/30 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-[var(--emerald-accent)]" />
        </div>
      </div>

      {/* Expandable proof panel (Issue 4 fixed): always-mounted content, maxHeight + opacity for stable spring animation */}
      <motion.div
        id={`proof-${feature.title.replace(/\s+/g, '-')}`}
        initial={false}
        animate={{ maxHeight: expanded ? 160 : 0, opacity: expanded ? 1 : 0 }}
        transition={expandTransition}
        className="overflow-hidden"
        aria-hidden={!expanded}
      >
        <div className="pt-4 mt-4 border-t border-white/10 text-[0.9rem] text-white/65 leading-[1.62] tracking-[-0.002em]">
          {feature.proof}
        </div>
      </motion.div>

      {/* Subtle expand hint (micro) */}
      <div className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-[var(--emerald-accent)]/60 transition-colors">
        {expanded ? 'COLLAPSE' : 'DETAILS'}
      </div>
    </motion.button>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050912] via-[#050912] to-[#02050a]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header — luxury B2B quiet confidence, typography vars */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[var(--emerald-accent)] border border-[var(--emerald-accent)]/30 bg-[var(--emerald-accent)]/5 mb-5">
            Why Reportly
          </span>
          <h2 
            className="font-semibold text-white mb-4"
            style={{ fontSize: 'var(--fs-h2)', letterSpacing: 'var(--tracking-h2)', lineHeight: 'var(--leading-h2)' }}
          >
            <ScrambleText text="Purpose-built for civil engineering" duration={SCRAMBLE_DURATION} />{" "}
            <span className="text-[var(--emerald-accent)]"><ScrambleText text="workflows" duration={SCRAMBLE_DURATION} /></span>
          </h2>
          <p className="text-white/70 max-w-[38ch] mx-auto text-[var(--fs-body)] tracking-[var(--tracking-body)] leading-[var(--leading-body)]">
            Purpose-built for civil engineering workflows that already use your templates.
          </p>
        </div>

        {/* Premium 3-col grid (chapterized feel via expandable cards) — 8/12/16 spacing respected via p-8 + gap-6 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Comparison hint — refined, emerald accent */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3.5 p-5 rounded-3xl bg-white/[0.025] border border-white/8">
            <span className="text-sm text-white/45 tracking-[0.02em]">Compared to:</span>
            {["Domo", "Jaspersoft", "Autodesk CC", "Power BI"].map((name) => (
              <span
                key={name}
                className="text-sm text-white/55 px-3 py-0.5 rounded-full bg-white/5 border border-white/5"
              >
                {name}
              </span>
            ))}
            <span className="text-sm text-[var(--emerald-accent)] font-medium tracking-tight ml-1">
              Only Reportly respects your templates end-to-end ✓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

