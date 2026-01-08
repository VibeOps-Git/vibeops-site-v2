/**
 * Scene3D - Canvas Wrapper Component
 *
 * Provides a configured Three.js canvas with:
 * - Responsive sizing
 * - Default camera settings
 * - Performance optimizations
 * - Dark transparent background matching VibeOps theme
 */

import { Canvas, type CanvasProps } from '@react-three/fiber';
import { type ReactNode } from 'react';

interface Scene3DProps extends Partial<CanvasProps> {
  children: ReactNode;
  className?: string;
}

export function Scene3D({
  children,
  className = '',
  camera,
  gl,
  dpr,
  ...props
}: Scene3DProps) {
  return (
    <Canvas
      className={className}
      camera={{
        position: [0, 0, 5],
        fov: 75,
        ...camera,
      }}
      gl={{
        alpha: true,
        antialias: true,
        ...gl,
      }}
      dpr={dpr || [1, 2]} // Adaptive pixel ratio (1x for low-end, 2x for high-end)
      {...props}
    >
      {children}
    </Canvas>
  );
}
