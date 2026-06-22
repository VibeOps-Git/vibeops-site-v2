import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

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
  highlight?: boolean;
  href?: string;
  cta?: string;
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
  highlight = false,
  href,
  cta = 'Learn more',
}: LiquidGlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bg = highlight
    ? isHovered
      ? 'hsl(var(--primary) / 0.1)'
      : 'hsl(var(--primary) / 0.06)'
    : 'hsl(var(--card))';

  const borderColor = highlight
    ? isHovered
      ? 'hsl(var(--primary) / 0.3)'
      : 'hsl(var(--primary) / 0.16)'
    : 'hsl(var(--border))';

  const shadow = isHovered ? '0 4px 16px hsl(var(--foreground) / 0.08)' : 'none';

  return (
    <>
      {/* Card */}
      <motion.div
        className="relative h-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onZoom}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, scale: isHovered && !isZoomed ? 1.012 : 1 }}
        transition={{ delay: index * 0.08, scale: { duration: 0.22 } }}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0 rounded-2xl border transition-all duration-300 cursor-pointer"
          style={{ background: bg, borderColor, boxShadow: shadow }}
        />

        {/* Content */}
        <div
          className={`relative h-full cursor-pointer flex gap-6 ${
            highlight ? 'p-7 flex-col md:flex-row md:gap-10' : 'p-7 flex-col'
          }`}
        >
          {/* Main column */}
          <div className={`flex flex-col gap-4 ${highlight ? 'flex-1' : ''}`}>
            {highlight && (
              <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-[9px] font-semibold text-primary uppercase tracking-[0.22em]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Flagship Product
              </span>
            )}

            <div className="flex items-start gap-3">
              {Icon && (
                <div className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-foreground leading-snug mb-1">{title}</h3>
                <p
                  className={`text-[11px] font-medium tracking-wide ${
                    highlight ? 'text-primary/70' : 'text-muted-foreground'
                  }`}
                >
                  {subtitle}
                </p>
              </div>
            </div>

            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {highlight
                ? description
                : description.length > 120
                ? description.slice(0, 120) + '...'
                : description}
            </p>

            <div
              className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200 mt-auto ${
                highlight
                  ? isHovered
                    ? 'text-primary'
                    : 'text-primary'
                  : isHovered
                  ? 'text-foreground/80'
                  : 'text-muted-foreground'
              }`}
            >
              {cta} <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Feature list - shown inline for featured card on desktop */}
          {highlight && features.length > 0 && (
            <div className="md:w-56 flex-shrink-0 flex flex-col justify-center">
              <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-3">
                What's included
              </p>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Zoom modal */}
      <AnimatePresence>
        {isZoomed && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-2xl w-full max-h-[84vh] overflow-y-auto pointer-events-auto"
                initial={{ scale: 0.92, y: 28 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 28 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              >
                <div
                  className="absolute inset-0 rounded-2xl border"
                  style={{
                    background: 'hsl(var(--card))',
                    borderColor: highlight ? 'hsl(var(--primary) / 0.22)' : 'hsl(var(--border))',
                    boxShadow: '0 24px 60px hsl(var(--foreground) / 0.12)',
                  }}
                />
                <div className="relative p-8 md:p-10">
                  <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {highlight && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-[9px] font-semibold text-primary uppercase tracking-[0.22em] mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      Flagship Product
                    </span>
                  )}

                  {Icon && (
                    <div className={`mb-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
                      <Icon className="w-9 h-9" />
                    </div>
                  )}

                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{title}</h2>
                  <p
                    className={`text-sm mb-5 ${
                      highlight ? 'text-primary/70' : 'text-muted-foreground'
                    }`}
                  >
                    {subtitle}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-7">{description}</p>

                  {features.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
                        What's included
                      </p>
                      <ul className="space-y-2.5">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                            <Check
                              className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                                highlight ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {href && (
                    <div className="mt-8 pt-5 border-t border-border">
                      <a
                        href={href}
                        className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                          highlight
                            ? 'text-primary hover:text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cta} <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
