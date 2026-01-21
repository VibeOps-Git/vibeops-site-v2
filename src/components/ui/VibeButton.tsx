// src/components/ui/VibeButton.tsx
// Signature button component with the "Ops vibing" aesthetic

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface VibeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200';

  const variants = {
    primary: 'bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90 shadow-lg shadow-[#00ffcc]/25 hover:shadow-[#00ffcc]/40 hover:-translate-y-0.5',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border border-[#00ffcc]/30 text-white hover:bg-[#00ffcc]/10 hover:border-[#00ffcc]/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

// Link-style button wrapper
interface VibeLinkButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200';

  const variants = {
    primary: 'bg-[#00ffcc] text-black hover:bg-[#00ffcc]/90 shadow-lg shadow-[#00ffcc]/25 hover:shadow-[#00ffcc]/40 hover:-translate-y-0.5',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border border-[#00ffcc]/30 text-white hover:bg-[#00ffcc]/10 hover:border-[#00ffcc]/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <a
      href={href}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
