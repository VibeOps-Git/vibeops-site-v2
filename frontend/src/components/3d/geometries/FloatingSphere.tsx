/**
 * FloatingSphere - Pulsing 3D Sphere with Glassmorphism
 *
 * Perfect for metrics, statistics, or data points
 * Features:
 * - Idle: Rotation + pulsing scale animation
 * - Floating motion (sine wave oscillation)
 * - Cyan glassmorphism material
 * - Optional wireframe overlay
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { GlassMaterial } from '../core/Materials';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FloatingSphereProps {
  size?: number;
  variant?: 'glass' | 'glassGlow';
  enableRotation?: boolean;
  enableFloating?: boolean;
  enablePulsing?: boolean;
  position?: [number, number, number];
}

export function FloatingSphere({
  size = 1.2,
  variant = 'glass',
  enableRotation = true,
  enableFloating = true,
  enablePulsing = true,
  position = [0, 0, 0],
}: FloatingSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { rotationSpeed, floatAmplitude, floatSpeed } = VIBE_3D_THEME.animations.idle;

    // Idle rotation on Y axis
    if (enableRotation) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.5;
    }

    // Floating motion (sine wave)
    if (enableFloating) {
      const floatOffset = Math.sin(time * floatSpeed + timeOffset.current) * floatAmplitude;
      meshRef.current.position.y = position[1] + floatOffset;
    }

    // Pulsing scale animation
    if (enablePulsing) {
      const pulseScale = 1 + Math.sin(time * 2 + timeOffset.current) * 0.05;
      meshRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <GlassMaterial variant={variant} />
    </mesh>
  );
}
