/**
 * 3D Design System Theme
 *
 * Centralized 3D design tokens that match VibeOps brand:
 * - Cyan accent (#00ffcc)
 * - Dark background (#0a0a0f)
 * - Glassmorphism and metallic materials
 */

import type { Color } from 'three';

export const VIBE_3D_THEME = {
  colors: {
    primary: '#00ffcc',      // Cyan accent
    background: '#0a0a0f',   // Very dark blue-gray
    glow: '#00ffdd',         // Slightly lighter cyan for highlights
    white: '#ffffff',
    transparent: 'rgba(0, 0, 0, 0)',
  },

  // Material properties for different surface types
  materials: {
    glass: {
      color: '#00ffcc',
      transparent: true,
      opacity: 0.15,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.9,     // Glass-like light transmission
      ior: 1.45,            // Index of refraction (glass)
      thickness: 0.5,
      envMapIntensity: 1.5,
    },
    glassGlow: {
      color: '#00ffcc',
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.7,
      ior: 1.45,
      thickness: 0.5,
      emissive: '#00ffcc',
      emissiveIntensity: 0.3,
      envMapIntensity: 1.5,
    },
    darkMetal: {
      color: '#0a0a0f',
      roughness: 0.4,
      metalness: 1.0,
      emissive: '#00ffcc',
      emissiveIntensity: 0.2,
    },
    neonWireframe: {
      color: '#00ffcc',
      transparent: true,
      opacity: 0.6,
      wireframe: true,
      emissive: '#00ffcc',
      emissiveIntensity: 0.8,
    },
  },

  // Lighting configuration
  lighting: {
    ambient: {
      color: '#0a0a0f',
      intensity: 0.4,
    },
    key: {
      color: '#00ffcc',
      intensity: 1.5,
      position: [10, 10, 5] as [number, number, number],
    },
    rim: {
      color: '#00ffdd',
      intensity: 0.8,
      position: [-5, 5, -5] as [number, number, number],
    },
  },

  // Animation timing
  animations: {
    idle: {
      rotationSpeed: 0.002,  // 0.2 RPM
      floatAmplitude: 0.3,
      floatSpeed: 0.001,
    },
    hover: {
      scale: 1.05,
      duration: 150,
      glowIntensityIncrease: 0.6,
    },
    zoom: {
      scale: 1.15,
      duration: 800,
      easing: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
    flip: {
      duration: 400,
      easing: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },

  // Performance settings
  performance: {
    desktop: {
      backgroundObjects: 15,
      particleCount: 200,
      enableBloom: true,
      shadowQuality: 'medium',
    },
    mobile: {
      backgroundObjects: 5,
      particleCount: 50,
      enableBloom: false,
      shadowQuality: 'low',
    },
  },
} as const;

// Type exports for TypeScript
export type MaterialType = keyof typeof VIBE_3D_THEME.materials;
export type LightType = keyof typeof VIBE_3D_THEME.lighting;
