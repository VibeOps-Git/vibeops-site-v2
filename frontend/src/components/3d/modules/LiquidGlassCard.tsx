/**
 * LiquidGlassCard - Glassmorphism Card with Click-to-Zoom
 *
 * Features:
 * - Liquid glass/glassmorphism effect
 * - Click to zoom and expand
 * - Summary view by default
 * - Full content on zoom
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface LiquidGlassCardProps {
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  icon?: React.ComponentType<{ className?: string }>;
  index: number;
  isZoomed: boolean;
  onZoom: () => void;
  onClose: () => void;
}

export function LiquidGlassCard({
  title,
  subtitle,
  description,
  features = [],
  icon: Icon,
  index,
  isZoomed,
  onZoom,
  onClose,
}: LiquidGlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Card in grid */}
      <motion.div
        className="relative h-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onZoom}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isHovered && !isZoomed ? 1.02 : 1,
        }}
        transition={{
          delay: index * 0.1,
          scale: { duration: 0.2 }
        }}
      >
        {/* Liquid glass background */}
        <div
          className="absolute inset-0 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer"
          style={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(0, 255, 204, 0.15) 0%, rgba(0, 255, 204, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(0, 255, 204, 0.1) 0%, rgba(0, 255, 204, 0.02) 100%)',
            borderColor: isHovered ? 'rgba(0, 255, 204, 0.4)' : 'rgba(0, 255, 204, 0.2)',
            boxShadow: isHovered
              ? '0 8px 32px 0 rgba(0, 255, 204, 0.2)'
              : '0 4px 16px 0 rgba(0, 255, 204, 0.1)',
          }}
        />

        {/* Animated gradient orb */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
          style={{
            background: `radial-gradient(circle at ${isHovered ? '50%' : '100%'} ${isHovered ? '50%' : '0%'}, ${VIBE_3D_THEME.colors.primary} 0%, transparent 70%)`,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Icon */}
          {Icon && (
            <div className="mb-4 text-[#00ffcc]">
              <Icon className="w-8 h-8" />
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 text-white">
            {title}
          </h3>

          {/* Subtitle */}
          <p className="text-[#00ffcc]/70 text-sm mb-4">
            {subtitle}
          </p>

          {/* Short description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
            {description.slice(0, 120)}...
          </p>

          {/* Click to expand hint */}
          <div className="flex items-center gap-2 text-[#00ffcc]/50 text-xs">
            <span className="inline-block w-1.5 h-1.5 bg-[#00ffcc] rounded-full animate-pulse" />
            Click to explore
          </div>
        </div>
      </motion.div>

      {/* Zoomed overlay */}
      <AnimatePresence>
        {isZoomed && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Zoomed card */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Liquid glass background */}
                <div
                  className="absolute inset-0 rounded-3xl backdrop-blur-2xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.15) 0%, rgba(0, 255, 204, 0.05) 100%)',
                    borderColor: 'rgba(0, 255, 204, 0.4)',
                    boxShadow: '0 24px 64px 0 rgba(0, 255, 204, 0.3)',
                  }}
                />

                {/* Animated gradient orb */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${VIBE_3D_THEME.colors.primary} 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="relative p-12">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Icon */}
                  {Icon && (
                    <motion.div
                      className="mb-6 text-[#00ffcc]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Icon className="w-12 h-12" />
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h2
                    className="text-4xl font-bold mb-3 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    className="text-[#00ffcc]/70 text-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>

                  {/* Full description */}
                  <motion.p
                    className="text-gray-300 text-base leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {description}
                  </motion.p>

                  {/* Features */}
                  {features.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-3 text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.05 }}
                          >
                            <span className="inline-block w-1.5 h-1.5 bg-[#00ffcc] rounded-full mt-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Press ESC hint */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-[#00ffcc]/20 flex items-center gap-2 text-[#00ffcc]/50 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <kbd className="px-2 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded text-xs">
                      ESC
                    </kbd>
                    <span>Press to close</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
