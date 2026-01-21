/**
 * ContentOverlay - Detailed Content Display
 *
 * Shows detailed information when a card is focused
 * - Staggered fade-in animations
 * - Semi-transparent background
 * - Accessible with keyboard
 */

import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContentOverlayProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  onClose: () => void;
}

export function ContentOverlay({
  title,
  subtitle,
  description,
  features,
  onClose,
}: ContentOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        relative bg-[#0a0a0f]/95 backdrop-blur-md rounded-3xl border-2 border-[#00ffcc]/30 p-8
        transition-all duration-300
        shadow-[0_0_40px_rgba(0,255,204,0.15)]
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
      }}
    >
      {/* Diagonal corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 border-l-2 border-t-2 border-[#00ffcc]/20"
           style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />

      {/* Top corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#00ffcc]/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#00ffcc]/40" />

      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-[#00ffcc]/5 animate-pulse"
           style={{ animationDuration: '3s' }} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 transition-colors z-10 border border-[#00ffcc]/20"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-[#00ffcc]" />
      </button>

      {/* Content */}
      <div className="space-y-4">
        {/* Subtitle */}
        <p
          className={`
            text-xs uppercase tracking-[0.2em] text-[#00ffcc]/70
            transition-all duration-300 delay-100
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {subtitle}
        </p>

        {/* Title */}
        <h3
          className={`
            text-3xl font-bold text-white
            transition-all duration-300 delay-150
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`
            text-gray-400 leading-relaxed
            transition-all duration-300 delay-200
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {description}
        </p>

        {/* Features */}
        <div className="pt-4 space-y-3">
          {features.map((feature, index) => (
            <div
              key={feature}
              className={`
                flex items-center gap-3 text-gray-300
                transition-all duration-300
                ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
              `}
              style={{ transitionDelay: `${250 + index * 80}ms` }}
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00ffcc]/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-[#00ffcc]" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p
          className={`
            pt-4 text-xs text-gray-500 text-center
            transition-all duration-300 delay-500
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  );
}
