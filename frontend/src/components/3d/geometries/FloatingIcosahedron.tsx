/**
 * FloatingIcosahedron - Multi-faceted 3D Shape with Glassmorphism
 *
 * Perfect for testimonials, quotes, or multi-perspective content
 * Features:
 * - Idle: Slow elegant rotation
 * - Floating motion (sine wave oscillation)
 * - Cyan glassmorphism material
 * - 20-sided geometry for visual complexity
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { GlassMaterial } from '../core/Materials';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FloatingIcosahedronProps {
  size?: number;
  variant?: 'glass' | 'glassGlow';
  enableRotation?: boolean;
  enableFloating?: boolean;
  position?: [number, number, number];
  detail?: number; // Subdivision detail (0-5)
}

export function FloatingIcosahedron({
  size = 1.3,
  variant = 'glass',
  enableRotation = true,
  enableFloating = true,
  position = [0, 0, 0],
  detail = 0,
}: FloatingIcosahedronProps) {
  const meshRef = useRef<Mesh>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { rotationSpeed, floatAmplitude, floatSpeed } = VIBE_3D_THEME.animations.idle;

    // Slow elegant rotation
    if (enableRotation) {
      meshRef.current.rotation.y += rotationSpeed * 0.8;
      meshRef.current.rotation.x += rotationSpeed * 0.3;
    }

    // Floating motion (sine wave) - slower than others
    if (enableFloating) {
      const floatOffset = Math.sin(time * floatSpeed * 0.8 + timeOffset.current) * floatAmplitude;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, detail]} />
      <GlassMaterial variant={variant} />
    </mesh>
  );
}
