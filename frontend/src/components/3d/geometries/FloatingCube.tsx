/**
 * FloatingCube - Animated 3D Cube with Glassmorphism
 *
 * Features:
 * - Idle rotation animation (0.2 RPM)
 * - Floating motion (sine wave oscillation)
 * - Cyan glassmorphism material
 * - Optional wireframe overlay
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { GlassMaterial } from '../core/Materials';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FloatingCubeProps {
  size?: number;
  variant?: 'glass' | 'glassGlow';
  enableRotation?: boolean;
  enableFloating?: boolean;
  position?: [number, number, number];
}

export function FloatingCube({
  size = 2,
  variant = 'glass',
  enableRotation = true,
  enableFloating = true,
  position = [0, 0, 0],
}: FloatingCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2); // Random phase for floating

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { rotationSpeed, floatAmplitude, floatSpeed } = VIBE_3D_THEME.animations.idle;

    // Idle rotation on Y axis
    if (enableRotation) {
      meshRef.current.rotation.y += rotationSpeed;
    }

    // Floating motion (sine wave)
    if (enableFloating) {
      const floatOffset = Math.sin(time * floatSpeed + timeOffset.current) * floatAmplitude;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <GlassMaterial variant={variant} />
    </mesh>
  );
}
