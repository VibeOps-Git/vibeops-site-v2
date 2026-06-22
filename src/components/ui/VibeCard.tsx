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
  const baseStyles = 'relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm transition-all duration-300';

  const variants = {
    default: '',
    glow: '',
    glass: 'bg-secondary',
    gradient: '',
  };

  // Subtle, restrained hover state
  const hoverStyles = hover
    ? 'hover:border-primary/40 hover:shadow-md'
    : '';

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)}>
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
    <Tag className={cn('text-lg font-semibold text-foreground', className)}>
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
    <p className={cn('text-sm text-muted-foreground mt-1', className)}>
      {children}
    </p>
  );
}
