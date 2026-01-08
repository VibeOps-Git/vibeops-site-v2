/**
 * ConveyorBelt - Connecting belt between machines
 *
 * Creates visible connection between two points showing workflow
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface ConveyorBeltProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive?: boolean;
}

export function ConveyorBelt({
  start,
  end,
  isActive = true,
}: ConveyorBeltProps) {
  const beltRef = useRef<Mesh>(null);
  const offset = useRef(0);

  useFrame((state, delta) => {
    if (isActive) {
      offset.current += delta * 0.3;
      if (offset.current > 1) offset.current = 0;
    }
  });

  // Calculate belt geometry
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[1] - start[1], 2) +
    Math.pow(end[2] - start[2], 2)
  );

  // Calculate rotation to face from start to end
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <group>
      {/* Main belt surface */}
      <mesh
        ref={beltRef}
        position={midpoint}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[length, 0.1, 0.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Belt sides (railings) */}
      <mesh position={[midpoint[0], midpoint[1] + 0.1, midpoint[2]]} rotation={[0, angle, 0]}>
        <boxGeometry args={[length, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#333"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Glowing data stream on belt */}
      {isActive && (
        <mesh position={[midpoint[0], midpoint[1] + 0.06, midpoint[2]]} rotation={[0, angle, 0]}>
          <boxGeometry args={[length * 0.8, 0.02, 0.1]} />
          <meshBasicMaterial
            color={VIBE_3D_THEME.colors.primary}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Moving data packets */}
      {isActive && [0, 0.33, 0.66].map((pos, i) => {
        const t = (pos + offset.current) % 1;
        const packetPos: [number, number, number] = [
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t + 0.15,
          start[2] + (end[2] - start[2]) * t,
        ];

        return (
          <mesh key={i} position={packetPos}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial
              color={VIBE_3D_THEME.colors.primary}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}
