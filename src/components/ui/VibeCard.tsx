// src/components/ui/VibeCard.tsx
// Signature card component with the "Ops vibing" aesthetic

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VibeCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'glass' | 'gradient';
  hover?: boolean;
}

export function VibeCard({
  children,
  className,
  variant = 'default',
  hover = true
}: VibeCardProps) {
  const baseStyles = 'relative rounded-2xl overflow-hidden transition-all duration-300';

  const variants = {
    default: 'bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm',
    glow: 'bg-[rgba(10,10,20,0.7)] border border-[#00ffcc]/20 backdrop-blur-md',
    glass: 'bg-white/5 border border-white/10 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-[#00ffcc]/10 via-[rgba(10,10,20,0.8)] to-transparent border border-[#00ffcc]/20',
  };

  // Subtle hover glow effect instead of aggressive transform
  const hoverStyles = hover
    ? 'hover:border-[#00ffcc]/30 hover:shadow-[0_0_30px_rgba(0,255,204,0.08)] hover:bg-[rgba(10,10,20,0.7)]'
    : '';

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)}>
      {/* Top edge glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/30 to-transparent opacity-60" />
      {children}
    </div>
  );
}

// Header section for VibeCard
interface VibeCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function VibeCardHeader({ children, className }: VibeCardHeaderProps) {
  return (
    <div className={cn('p-6 pb-2', className)}>
      {children}
    </div>
  );
}

// Content section for VibeCard
interface VibeCardContentProps {
  children: ReactNode;
  className?: string;
}

export function VibeCardContent({ children, className }: VibeCardContentProps) {
  return (
    <div className={cn('p-6 pt-2', className)}>
      {children}
    </div>
  );
}

// Title for VibeCard
interface VibeCardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function VibeCardTitle({ children, className, as: Tag = 'h3' }: VibeCardTitleProps) {
  return (
    <Tag className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </Tag>
  );
}

// Description for VibeCard
interface VibeCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function VibeCardDescription({ children, className }: VibeCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-400 mt-1', className)}>
      {children}
    </p>
  );
}
