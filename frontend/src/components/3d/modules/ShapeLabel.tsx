/**
 * ShapeLabel - HTML Label that follows 3D shapes
 *
 * Creates a floating label that appears next to 3D shapes
 * - Positioned using CSS 3D transforms
 * - Shows title and subtitle
 * - Fades out when shape is focused
 */

import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Html } from '@react-three/drei';

interface ShapeLabelProps {
  position: [number, number, number];
  title: string;
  subtitle: string;
  visible: boolean;
  geometry: 'cube' | 'sphere' | 'pyramid' | 'icosahedron';
}

export function ShapeLabel({
  position,
  title,
  subtitle,
  visible,
  geometry,
}: ShapeLabelProps) {
  if (!visible) return null;

  // Get icon based on geometry
  const getIcon = () => {
    switch (geometry) {
      case 'cube':
        return '◼';
      case 'sphere':
        return '●';
      case 'pyramid':
        return '▲';
      case 'icosahedron':
        return '◆';
      default:
        return '●';
    }
  };

  return (
    <Html
      position={[position[0], position[1] + 2, position[2]]}
      center
      distanceFactor={5}
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex flex-col items-center gap-1 animate-in fade-in duration-500">
        {/* Icon */}
        <div className="text-[#00ffcc] text-2xl opacity-60">
          {getIcon()}
        </div>

        {/* Label card */}
        <div className="bg-[#0a0a0f]/90 backdrop-blur-sm border border-[#00ffcc]/30 rounded-lg px-3 py-2 min-w-[140px]">
          <p className="text-[10px] uppercase tracking-wider text-[#00ffcc]/70 text-center">
            {subtitle}
          </p>
          <p className="text-xs font-semibold text-white text-center mt-0.5">
            {title}
          </p>
        </div>

        {/* Connecting line */}
        <div className="w-px h-8 bg-gradient-to-b from-[#00ffcc]/30 to-transparent" />
      </div>
    </Html>
  );
}
