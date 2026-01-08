/**
 * Standard 3D Lighting Rig
 *
 * Three-point lighting setup optimized for cyan glassmorphism:
 * - Ambient: Soft base illumination
 * - Key: Main cyan light from top-right
 * - Rim: Backlight from top-left for depth
 */

import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface Lights3DProps {
  variant?: 'default' | 'dramatic' | 'subtle';
}

export function Lights3D({ variant = 'default' }: Lights3DProps) {
  const { ambient, key, rim } = VIBE_3D_THEME.lighting;

  // Adjust intensity based on variant
  const intensityMultiplier = {
    default: 1.0,
    dramatic: 1.5,
    subtle: 0.6,
  }[variant];

  return (
    <>
      {/* Ambient base light */}
      <ambientLight
        color={ambient.color}
        intensity={ambient.intensity * intensityMultiplier}
      />

      {/* Key light - main source (top-right, cyan) */}
      <pointLight
        position={key.position}
        color={key.color}
        intensity={key.intensity * intensityMultiplier}
        distance={50}
        decay={2}
      />

      {/* Rim light - backlight for depth (top-left, light cyan) */}
      <pointLight
        position={rim.position}
        color={rim.color}
        intensity={rim.intensity * intensityMultiplier}
        distance={30}
        decay={2}
      />
    </>
  );
}
