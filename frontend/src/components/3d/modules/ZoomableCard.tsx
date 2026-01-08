/**
 * ZoomableCard - Interactive 3D Shape Module
 *
 * Features:
 * - Idle: Rotation + floating animation
 * - Hover: Scale up, pause rotation, increase glow
 * - Click: Trigger zoom event to parent
 * - Focused: Stop animations, brighten
 * - Supports multiple geometry types (cube, sphere, pyramid, icosahedron)
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { GlassMaterial } from '../core/Materials';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

type GeometryType = 'cube' | 'sphere' | 'pyramid' | 'icosahedron';

interface ZoomableCardProps {
  position: [number, number, number];
  size?: number;
  geometry?: GeometryType;
  onClick?: () => void;
  isFocused?: boolean;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

function getGeometry(type: GeometryType, size: number) {
  switch (type) {
    case 'sphere':
      return <sphereGeometry args={[size * 0.6, 32, 32]} />;
    case 'pyramid':
      return <tetrahedronGeometry args={[size * 0.75]} />;
    case 'icosahedron':
      return <icosahedronGeometry args={[size * 0.65, 0]} />;
    case 'cube':
    default:
      return <boxGeometry args={[size, size, size]} />;
  }
}

export function ZoomableCard({
  position,
  size = 2,
  geometry = 'cube',
  onClick,
  isFocused = false,
  isHovered = false,
  onHoverChange,
}: ZoomableCardProps) {
  const meshRef = useRef<Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const timeOffset = useRef(Math.random() * Math.PI * 2);
  const rotationRef = useRef(0);

  const isInteractive = isHovered || localHover;

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { rotationSpeed, floatAmplitude, floatSpeed } = VIBE_3D_THEME.animations.idle;
    const { scale: hoverScale } = VIBE_3D_THEME.animations.hover;

    // Rotation (pause when hovered or focused)
    if (!isInteractive && !isFocused) {
      rotationRef.current += rotationSpeed;
      meshRef.current.rotation.y = rotationRef.current;
    }

    // Floating motion (stop when focused)
    if (!isFocused) {
      const floatOffset = Math.sin(time * floatSpeed + timeOffset.current) * floatAmplitude;
      meshRef.current.position.y = position[1] + floatOffset;
    } else {
      meshRef.current.position.y = position[1];
    }

    // Scale on hover
    const targetScale = isInteractive ? hoverScale : 1.0;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale } as any,
      0.1
    );
  });

  const handlePointerOver = () => {
    setLocalHover(true);
    onHoverChange?.(true);
  };

  const handlePointerOut = () => {
    setLocalHover(false);
    onHoverChange?.(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group>
      {/* Main geometry */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {getGeometry(geometry, size)}
        <GlassMaterial variant={isFocused || isInteractive ? 'glassGlow' : 'glass'} />
      </mesh>

      {/* Wireframe overlay (shows on hover) */}
      {isInteractive && (
        <mesh position={position} scale={1.02}>
          {getGeometry(geometry, size)}
          <meshBasicMaterial
            color="#00ffcc"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}
