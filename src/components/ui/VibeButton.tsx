// src/components/ui/VibeButton.tsx
// Signature button component — Apple-caliber Precision Luxury (enhanced per design doc PR01)
// Uses centralized motion tokens, buttery APPLE_HOVER_SPRING, whileTap micro-press, emerald focus ring.

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { APPLE_HOVER_SPRING, getTransition } from '@/lib/motion';

interface VibeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function VibeButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: VibeButtonProps) {
  const reduced = useReducedMotion() ?? false;
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--emerald-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912] min-h-[44px]';

  const variants = {
    primary: 'bg-[var(--emerald-accent)] text-black hover:bg-[var(--emerald-accent)]/90 shadow-lg shadow-[var(--emerald-accent)]/25',
    glass: 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-xl',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border border-[var(--emerald-accent)]/35 text-white hover:bg-[var(--emerald-accent)]/10 hover:border-[var(--emerald-accent)]/60',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm', // 44px+ tap target per §3
    lg: 'px-8 py-3 text-base',
  };

  const hoverScale = reduced ? {} : { scale: 1.02, y: -1 };
  const tapScale = reduced ? {} : { scale: 0.975 };
  const springTransition = getTransition(reduced, APPLE_HOVER_SPRING);

  return (
    <motion.button
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size], className)}
      whileHover={hoverScale}
      whileTap={tapScale}
      transition={springTransition}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Link-style button wrapper (also Apple-motion enhanced)
interface VibeLinkButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
}

export function VibeLinkButton({
  children,
  href,
  className,
  variant = 'primary',
  size = 'md',
  external = false,
}: VibeLinkButtonProps) {
  const reduced = useReducedMotion() ?? false;
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--emerald-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912] min-h-[44px]';

  const variants = {
    primary: 'bg-[var(--emerald-accent)] text-black hover:bg-[var(--emerald-accent)]/90 shadow-lg shadow-[var(--emerald-accent)]/25',
    glass: 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-xl',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border border-[var(--emerald-accent)]/35 text-white hover:bg-[var(--emerald-accent)]/10 hover:border-[var(--emerald-accent)]/60',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm', // 44px+ tap target per §3
    lg: 'px-8 py-3 text-base',
  };

  const hoverScale = reduced ? {} : { scale: 1.02, y: -1 };
  const tapScale = reduced ? {} : { scale: 0.975 };
  const springTransition = getTransition(reduced, APPLE_HOVER_SPRING);

  return (
    <motion.a
      href={href}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size], className)}
      whileHover={hoverScale}
      whileTap={tapScale}
      transition={springTransition}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </motion.a>
  );
}
