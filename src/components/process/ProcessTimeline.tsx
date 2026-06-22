/**
 * ProcessTimeline - Animated Process Steps with Connecting Lines
 *
 * Features:
 * - Animated connecting lines between steps
 * - Icons for each phase
 * - Hover states with glow and lift effects
 * - Scroll-triggered animations
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Rocket } from 'lucide-react';
import { VibeCard } from '@/components/ui/VibeCard';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

const stepIcons = {
  '01': Search,    // Discovery - magnifying glass
  '02': Zap,       // Prototype - lightning/building
  '03': Rocket,    // Rollout - rocket launch
};

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* Connecting line background */}
      <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-border" />

      {/* Animated progress line */}
      <motion.div
        className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Steps grid */}
      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.step as keyof typeof stepIcons];
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative"
            >
              {/* Animated connecting dot on line */}
              <motion.div
                className="hidden md:block absolute top-[84px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.2 + 0.3,
                  ease: 'backOut',
                }}
              />


              {/* Card */}
              <motion.div
                animate={{
                  y: isHovered ? -8 : 0,
                  scale: isHovered ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <VibeCard
                  className={`p-6 text-center h-full transition-colors duration-300 ${
                    isHovered ? 'border-primary/40' : ''
                  }`}
                >
                  {/* Icon with animation */}
                  <motion.div
                    className="relative mx-auto mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + 0.2,
                      ease: 'backOut',
                    }}
                  >
                    {/* Icon background */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-secondary border flex items-center justify-center transition-colors duration-300 ${
                        isHovered ? 'border-primary/40' : 'border-border'
                      }`}
                    >
                      {Icon && (
                        <motion.div
                          animate={{
                            scale: isHovered ? [1, 1.1, 1] : 1,
                            rotate: isHovered ? [0, 5, -5, 0] : 0,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: 'easeInOut',
                          }}
                        >
                          <Icon className="w-7 h-7 text-primary" />
                        </motion.div>
                      )}
                    </div>

                    {/* Step number badge */}
                    <motion.div
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary border flex items-center justify-center transition-colors duration-300 ${
                        isHovered ? 'border-primary/50' : 'border-border'
                      }`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.2 + 0.4,
                        ease: 'backOut',
                      }}
                    >
                      <span className="text-primary font-bold text-xs">
                        {step.step}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                      isHovered ? 'text-primary' : 'text-foreground'
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.2 + 0.3,
                    }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-sm text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.2 + 0.4,
                    }}
                  >
                    {step.description}
                  </motion.p>

                  {/* Hover indicator */}
                  {isHovered && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-primary text-xs"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="inline-block w-1 h-1 bg-primary rounded-full" />
                      Phase {step.step}
                      <span className="inline-block w-1 h-1 bg-primary rounded-full" />
                    </motion.div>
                  )}
                </VibeCard>
              </motion.div>

              {/* Arrow connector for mobile */}
              {index < steps.length - 1 && (
                <motion.div
                  className="md:hidden flex justify-center my-4"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.5,
                  }}
                >
                  <svg
                    className="w-6 h-6 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
