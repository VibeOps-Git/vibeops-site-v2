/**
 * Shared Material Components
 *
 * Reusable Three.js materials that match the VibeOps brand aesthetic.
 * All materials use the centralized theme tokens.
 */

import { VIBE_3D_THEME, type MaterialType } from '@/lib/3d/theme';

interface MaterialProps {
  variant?: MaterialType;
}

/**
 * Glass Material with Transmission
 * Creates a frosted glass effect with cyan tint
 */
export function GlassMaterial({ variant = 'glass' }: MaterialProps) {
  const props = VIBE_3D_THEME.materials[variant];

  return (
    <meshPhysicalMaterial
      attach="material"
      color={props.color}
      transparent={props.transparent}
      opacity={props.opacity}
      roughness={props.roughness}
      metalness={props.metalness}
      transmission={props.transmission}
      ior={props.ior}
      thickness={props.thickness}
      envMapIntensity={props.envMapIntensity}
      emissive={props.emissive}
      emissiveIntensity={props.emissiveIntensity}
    />
  );
}

/**
 * Neon Wireframe Material
 * Creates a glowing cyan wireframe effect
 */
export function NeonWireframeMaterial() {
  const props = VIBE_3D_THEME.materials.neonWireframe;

  return (
    <meshBasicMaterial
      attach="material"
      color={props.color}
      wireframe={props.wireframe}
      transparent={props.transparent}
      opacity={props.opacity}
    />
  );
}

/**
 * Dark Metal Material
 * Creates a dark metallic surface with cyan highlights
 */
export function DarkMetalMaterial() {
  const props = VIBE_3D_THEME.materials.darkMetal;

  return (
    <meshStandardMaterial
      attach="material"
      color={props.color}
      roughness={props.roughness}
      metalness={props.metalness}
      emissive={props.emissive}
      emissiveIntensity={props.emissiveIntensity}
    />
  );
}
