import { useState, useEffect } from 'react';
import { LiquidGlassCard } from '../modules/LiquidGlassCard';

interface GalleryItem {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  href?: string;
  cta?: string;
}

interface GallerySection3DProps {
  items: GalleryItem[];
  onItemFocus?: (index: number | null) => void;
}

export function GallerySection3D({ items, onItemFocus }: GallerySection3DProps) {
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  const handleZoom = (index: number) => {
    setZoomedIndex(index);
    onItemFocus?.(index);
  };

  const handleClose = () => {
    setZoomedIndex(null);
    onItemFocus?.(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedIndex !== null) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedIndex]);

  // Split featured card (first item with highlight) from the rest
  const featuredIndex = items.findIndex((item) => item.highlight);
  const featured = featuredIndex >= 0 ? items[featuredIndex] : null;
  const supporting = items.filter((_, i) => i !== featuredIndex);
  // Supporting items start at index 1 when there's a featured card
  const supportingOffset = featured ? 1 : 0;

  return (
    <div className="relative w-full py-10 flex flex-col gap-5">
      {/* Featured card — full width */}
      {featured && (
        <LiquidGlassCard
          key={featuredIndex}
          title={featured.title}
          subtitle={featured.subtitle}
          description={featured.description}
          features={featured.features}
          icon={featured.icon}
          index={featuredIndex}
          isZoomed={zoomedIndex === featuredIndex}
          onZoom={() => handleZoom(featuredIndex)}
          onClose={handleClose}
          highlight={featured.highlight}
          href={featured.href}
          cta={featured.cta}
        />
      )}

      {/* Supporting cards — 3-column grid */}
      {supporting.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-5 ${
            supporting.length === 3
              ? 'md:grid-cols-3'
              : supporting.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2'
          }`}
        >
          {supporting.map((item, i) => {
            const idx = supportingOffset + i;
            return (
              <LiquidGlassCard
                key={idx}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                features={item.features}
                icon={item.icon}
                index={idx}
                isZoomed={zoomedIndex === idx}
                onZoom={() => handleZoom(idx)}
                onClose={handleClose}
                highlight={item.highlight}
                href={item.href}
                cta={item.cta}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
