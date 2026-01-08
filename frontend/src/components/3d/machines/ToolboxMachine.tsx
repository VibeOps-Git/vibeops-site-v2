/**
 * ToolboxMachine - Internal Tools Machine
 *
 * Visual metaphor for internal tooling:
 * - Open toolbox container
 * - Floating tools (wrench, gears, blueprint)
 * - Rotating tool carousel
 * - Orbiting particle system
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';
import { DarkMetalMaterial } from '../core/Materials';

interface ToolboxMachineProps {
  position?: [number, number, number];
  isActive?: boolean;
  isFocused?: boolean;
}

export function ToolboxMachine({
  position = [0, 0, 0],
  isActive = true,
  isFocused = false,
}: ToolboxMachineProps) {
  const groupRef = useRef<Group>(null);
  const carouselRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);

  useFrame((state, delta) => {
    // Rotate tool carousel
    if (carouselRef.current && isActive && !isFocused) {
      carouselRef.current.rotation.y += delta * 0.3;
    }

    // Orbit particles
    if (particlesRef.current && isActive) {
      particlesRef.current.rotation.y += delta * 0.5;
    }
  });

  // Particle positions (orbiting around toolbox)
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 1.2;
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(i * 0.5) * 0.3,
      z: Math.sin(angle) * radius,
    };
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Toolbox base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.4, 0.6, 1]} />
        <DarkMetalMaterial />
      </mesh>

      {/* Toolbox lid (open) */}
      <mesh position={[0, 0.7, -0.5]} rotation={[-Math.PI / 3, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.1, 1]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Tool carousel */}
      <group ref={carouselRef} position={[0, 1, 0]}>
        {/* Wrench */}
        <group position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          {/* Handle */}
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <torusGeometry args={[0.08, 0.03, 8, 12]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Gear 1 */}
        <group position={[-0.5, 0, 0]} rotation={[0, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 8]} />
            <meshStandardMaterial
              color={VIBE_3D_THEME.colors.primary}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Gear teeth (simplified) */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}
                rotation={[0, angle, 0]}
                castShadow
              >
                <boxGeometry args={[0.06, 0.05, 0.03]} />
                <meshStandardMaterial
                  color={VIBE_3D_THEME.colors.primary}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            );
          })}
        </group>

        {/* Gear 2 */}
        <group position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 6]} />
            <meshStandardMaterial
              color={VIBE_3D_THEME.colors.primary}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        {/* Blueprint (semi-transparent plane) */}
        <group position={[0, -0.3, 0.5]} rotation={[Math.PI / 6, 0, 0]}>
          <mesh castShadow>
            <planeGeometry args={[0.6, 0.4]} />
            <meshStandardMaterial
              color={VIBE_3D_THEME.colors.primary}
              transparent
              opacity={0.2}
              side={2} // DoubleSide
            />
          </mesh>
          {/* Blueprint lines */}
          <Html position={[0, 0, 0.01]} center distanceFactor={4} style={{ pointerEvents: 'none' }}>
            <div className="w-[60px] h-[40px] border border-[#00ffcc]/40 bg-[#00ffcc]/5 p-1">
              <div className="grid grid-cols-3 gap-0.5 h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-[#00ffcc]/20" />
                ))}
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* Orbiting particles */}
      <group ref={particlesRef} position={[0, 0.8, 0]}>
        {particles.map(p => (
          <mesh key={p.id} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={VIBE_3D_THEME.colors.primary}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Central energy core */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={VIBE_3D_THEME.colors.primary}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Label above machine */}
      <Html position={[0, 2.3, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.15em] font-semibold">
            Internal Tools
          </div>
          <div className="text-[#00ffcc]/50 text-[7px] uppercase tracking-wider">
            {isActive ? '● ACTIVE' : '○ STANDBY'}
          </div>
        </div>
      </Html>

      {/* Connection to floor */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshBasicMaterial
          color={VIBE_3D_THEME.colors.primary}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Input port (left side) */}
      <group position={[-1.0, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
          <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} />
        </mesh>
      </group>
    </group>
  );
}
