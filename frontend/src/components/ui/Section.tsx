// src/components/ui/Section.tsx
// Reusable section wrapper with consistent spacing, dividers, and optional header

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AnimatedContent from '../AnimatedContent';

// Subtle gradient divider component
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn('w-full h-px', className)}>
      <div className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  divider?: boolean; // Show divider at top of section
}

export function Section({ children, className, id, divider = false }: SectionProps) {
  return (
    <>
      {divider && <SectionDivider className="mx-auto max-w-5xl px-4" />}
      <section id={id} className={cn('py-20 px-4', className)}>
        <div className="container mx-auto">
          {children}
        </div>
      </section>
    </>
  );
}

// Section with a centered header
interface SectionWithHeaderProps {
  children: ReactNode;
  tag?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  divider?: boolean;
}

export function SectionWithHeader({
  children,
  tag,
  title,
  description,
  className,
  id,
  maxWidth = 'full',
  divider = false,
}: SectionWithHeaderProps) {
  const maxWidthStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    full: '',
  };

  return (
    <>
      {divider && <SectionDivider className="mx-auto max-w-5xl px-4" />}
      <section id={id} className={cn('py-20 px-4', className)}>
        <div className={cn('container mx-auto', maxWidthStyles[maxWidth])}>
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <div className="text-center mb-12">
              {tag && (
                <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
                  {tag}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                {title}
              </h2>
              {description && (
                <p className="text-gray-400 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          </AnimatedContent>
          {children}
        </div>
      </section>
    </>
  );
}
