// src/lib/design-tokens.ts
// Apple-caliber Precision Luxury design tokens for VibeOps v2
// Single source for palette and motion physics per PR01 spec.
// Re-exports motion constants from ./motion (the authoritative source).

export {
  MOTION,
  APPLE_EASE,
  APPLE_REVEAL_SPRING,
  APPLE_HOVER_SPRING,
  APPLE_CARD_SPRING,
  CROSSFADE_MS,
  SCRAMBLE_DURATION,
  getTransition,
  REDUCED_MOTION_VARIANTS,
  GSAP_EASE,
  GSAP_SPRING,
} from './motion';

export const PRECISION_TOKENS = {
  emerald: {
    deep: '#0f7c5a',      // --emerald-deep (primary accent, headings, CTAs)
    accent: '#34d399',    // --emerald-accent (highlights, success, hover)
  },
  gold: '#b89f6e',          // --gold (rare executive signatures, final CTAs rings)
  slate: {
    deepest: '#02050a',
    dark: '#050912',
    card: '#0a0f1a',
  },
} as const;
