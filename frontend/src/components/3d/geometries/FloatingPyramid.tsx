/**
 * FloatingPyramid - 3D Tetrahedron (Pyramid) with Glassmorphism
 *
 * Perfect for process steps, directional flow, or hierarchical content
 * Features:
 * - Idle: Rotation around multiple axes
 * - Floating motion (sine wave oscillation)
 * - Cyan glassmorphism material
 * - Sharp, directional aesthetic
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { GlassMaterial } from '../core/Materials';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FloatingPyramidProps {
  size?: number;
  variant?: 'glass' | 'glassGlow';
  enableRotation?: boolean;
  enableFloating?: boolean;
  position?: [number, number, number];
  rotationAxis?: 'x' | 'y' | 'z' | 'all';
}

export function FloatingPyramid({
  size = 1.5,
  variant = 'glass',
  enableRotation = true,
  enableFloating = true,
  position = [0, 0, 0],
  rotationAxis = 'all',
}: FloatingPyramidProps) {
  const meshRef = useRef<Mesh>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { rotationSpeed, floatAmplitude, floatSpeed } = VIBE_3D_THEME.animations.idle;

    // Idle rotation (more dramatic than cube)
    if (enableRotation) {
      if (rotationAxis === 'all' || rotationAxis === 'y') {
        meshRef.current.rotation.y += rotationSpeed * 1.5;
      }
      if (rotationAxis === 'all' || rotationAxis === 'x') {
        meshRef.current.rotation.x += rotationSpeed * 0.8;
      }
      if (rotationAxis === 'all' || rotationAxis === 'z') {
        meshRef.current.rotation.z += rotationSpeed * 0.5;
      }
    }

    // Floating motion (sine wave)
    if (enableFloating) {
      const floatOffset = Math.sin(time * floatSpeed + timeOffset.current) * floatAmplitude;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <tetrahedronGeometry args={[size]} />
      <GlassMaterial variant={variant} />
    </mesh>
  );
}
