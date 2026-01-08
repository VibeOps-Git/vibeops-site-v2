/**
 * FactoryFloor - Industrial Grid Floor Base
 *
 * Creates a factory floor with:
 * - Dark industrial surface
 * - Cyan glowing grid lines
 * - Subtle metallic reflection
 * - Positioned below machines (y = -2)
 */

import { useMemo } from 'react';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FactoryFloorProps {
  size?: number;
  gridSpacing?: number;
  position?: [number, number, number];
}

export function FactoryFloor({
  size = 100, // Much larger default
  gridSpacing = 3,
  position = [0, 0, 0], // Floor at ground level (y=0)
}: FactoryFloorProps) {
  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines: Array<{
      start: [number, number, number];
      end: [number, number, number];
    }> = [];

    const halfSize = size / 2;
    const numLines = Math.floor(size / gridSpacing);

    // Vertical lines (along Z-axis)
    for (let i = -numLines / 2; i <= numLines / 2; i++) {
      const x = i * gridSpacing;
      lines.push({
        start: [x, 0, -halfSize],
        end: [x, 0, halfSize],
      });
    }

    // Horizontal lines (along X-axis)
    for (let i = -numLines / 2; i <= numLines / 2; i++) {
      const z = i * gridSpacing;
      lines.push({
        start: [-halfSize, 0, z],
        end: [halfSize, 0, z],
      });
    }

    return lines;
  }, [size, gridSpacing]);

  return (
    <group position={position}>
      {/* Main floor surface - Industrial concrete/epoxy floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#2a2d35"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Factory floor tiles pattern - lighter sections */}
      {Array.from({ length: 10 }, (_, i) =>
        Array.from({ length: 10 }, (_, j) => (
          <mesh
            key={`tile-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              (i - 4.5) * (size / 10),
              0.005,
              (j - 4.5) * (size / 10),
            ]}
          >
            <planeGeometry args={[size / 10 - 0.2, size / 10 - 0.2]} />
            <meshStandardMaterial
              color={(i + j) % 2 === 0 ? "#353942" : "#3a3e48"}
              roughness={0.8}
              metalness={0.05}
            />
          </mesh>
        ))
      ).flat()}

      {/* Grid lines - industrial yellow safety lines */}
      {gridLines.map((line, index) => {
        const midpoint = [
          (line.start[0] + line.end[0]) / 2,
          (line.start[1] + line.end[1]) / 2 + 0.02, // Slightly above floor to prevent z-fighting
          (line.start[2] + line.end[2]) / 2,
        ] as [number, number, number];

        const length = Math.sqrt(
          Math.pow(line.end[0] - line.start[0], 2) +
          Math.pow(line.end[1] - line.start[1], 2) +
          Math.pow(line.end[2] - line.start[2], 2)
        );

        // Determine if it's a vertical (along Z) or horizontal (along X) line
        const isVertical = Math.abs(line.start[0] - line.end[0]) < 0.01;
        const rotation: [number, number, number] = isVertical
          ? [0, 0, 0]
          : [0, Math.PI / 2, 0];

        return (
          <mesh key={index} position={midpoint} rotation={rotation}>
            <boxGeometry args={[length, 0.01, 0.08]} />
            <meshStandardMaterial
              color="#f5d547"
              roughness={0.6}
              emissive="#f5d547"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}

      {/* Factory floor pathway markings (yellow walkways) */}
      {/* Central cross pathways */}
      {/* North-South pathway */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, size * 0.9]} />
        <meshStandardMaterial
          color="#f5d547"
          roughness={0.7}
          emissive="#f5d547"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* East-West pathway */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size * 0.9, 2.5]} />
        <meshStandardMaterial
          color="#f5d547"
          roughness={0.7}
          emissive="#f5d547"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Corner safety zones (yellow and black diagonal stripes) */}
      {[
        [-20, -20],
        [20, -20],
        [-20, 20],
        [20, 20],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.03, z]}>
          {/* Diagonal warning stripes */}
          {[0, 0.8, 1.6, 2.4, 3.2].map((offset, j) => (
            <mesh key={j} position={[offset - 1.6, 0, offset - 1.6]} rotation={[-Math.PI / 2, Math.PI / 4, 0]}>
              <planeGeometry args={[3, 0.3]} />
              <meshStandardMaterial
                color={j % 2 === 0 ? "#f5d547" : "#1a1a1a"}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
