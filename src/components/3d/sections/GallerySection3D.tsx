/**
 * GallerySection3D - Liquid Glass Card Gallery
 *
 * Simple grid layout with glassmorphism cards that zoom on click
 */

import { useState, useEffect } from 'react';
import { LiquidGlassCard } from '../modules/LiquidGlassCard';

interface GalleryItem {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

interface GallerySection3DProps {
  items: GalleryItem[];
  onItemFocus?: (index: number | null) => void;
}

export function GallerySection3D({
  items,
  onItemFocus,
}: GallerySection3DProps) {
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  const handleZoom = (index: number) => {
    setZoomedIndex(index);
    onItemFocus?.(index);
  };

  const handleClose = () => {
    setZoomedIndex(null);
    onItemFocus?.(null);
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedIndex !== null) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedIndex]);

  return (
    <div className="relative w-full py-12">
      {/* Grid of liquid glass cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <LiquidGlassCard
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            features={item.features}
            icon={item.icon}
            index={index}
            isZoomed={zoomedIndex === index}
            onZoom={() => handleZoom(index)}
            onClose={handleClose}
          />
        ))}
      </div>
    </div>
  );
}
