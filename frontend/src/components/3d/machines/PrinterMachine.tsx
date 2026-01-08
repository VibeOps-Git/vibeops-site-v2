/**
 * PrinterMachine - Report Automation Machine
 *
 * Visual metaphor for report generation:
 * - Rotating drum (like printing press)
 * - Papers flying out periodically
 * - Glowing status screen
 * - Pulsing cyan status light
 */

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh, Group } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';
import { DarkMetalMaterial } from '../core/Materials';

interface PrinterMachineProps {
  position?: [number, number, number];
  isActive?: boolean;
  isFocused?: boolean;
}

interface Paper {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  age: number;
}

export function PrinterMachine({
  position = [0, 0, 0],
  isActive = true,
  isFocused = false,
}: PrinterMachineProps) {
  const groupRef = useRef<Group>(null);
  const drumRef = useRef<Mesh>(null);
  const statusLightRef = useRef<Mesh>(null);

  const [papers, setPapers] = useState<Paper[]>([]);
  const paperIdCounter = useRef(0);
  const timeSinceLastPaper = useRef(0);

  // Animation loop
  useFrame((state, delta) => {
    // Rotate drum
    if (drumRef.current && isActive) {
      drumRef.current.rotation.z += delta * 0.5; // 0.5 rad/s
    }

    // Pulse status light
    if (statusLightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      statusLightRef.current.scale.setScalar(0.8 + pulse * 0.2);
    }

    // Spawn new papers periodically
    if (isActive && !isFocused) {
      timeSinceLastPaper.current += delta;
      if (timeSinceLastPaper.current > 2) {
        // Spawn paper every 2 seconds
        const newPaper: Paper = {
          id: paperIdCounter.current++,
          position: [1.2, 0.3, 0],
          velocity: [1.5, 0.5, 0],
          age: 0,
        };
        setPapers(prev => [...prev, newPaper]);
        timeSinceLastPaper.current = 0;
      }
    }

    // Update paper positions
    setPapers(prev =>
      prev
        .map(paper => ({
          ...paper,
          position: [
            paper.position[0] + paper.velocity[0] * delta,
            paper.position[1] + paper.velocity[1] * delta - 9.8 * delta * paper.age, // Gravity
            paper.position[2] + paper.velocity[2] * delta,
          ] as [number, number, number],
          velocity: [
            paper.velocity[0],
            paper.velocity[1] - 9.8 * delta, // Gravity affects velocity
            paper.velocity[2],
          ] as [number, number, number],
          age: paper.age + delta,
        }))
        .filter(paper => paper.position[1] > -5) // Remove papers that fell too far
        .slice(-5) // Keep max 5 papers
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Machine body (base) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <DarkMetalMaterial />
      </mesh>

      {/* Rotating drum */}
      <mesh ref={drumRef} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 16]} />
        <meshStandardMaterial
          color="#666"
          metalness={0.8}
          roughness={0.2}
        />
        {/* Cyan bands on drum */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.2, 16]} />
          <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.2, 16]} />
          <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} transparent opacity={0.6} />
        </mesh>
      </mesh>

      {/* Output tray */}
      <mesh position={[1, -0.1, 0]} rotation={[0, 0, Math.PI / 12]} castShadow>
        <boxGeometry args={[0.8, 0.1, 1.2]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Status screen */}
      <mesh position={[0, 1.3, 0.76]} rotation={[-Math.PI / 6, 0, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial
          color={VIBE_3D_THEME.colors.primary}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Status screen text */}
      <Html position={[0, 1.3, 0.8]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="text-[#00ffcc] text-[8px] font-mono uppercase tracking-wider bg-[#0a0a0f]/80 px-2 py-1 rounded border border-[#00ffcc]/30">
          {isActive ? 'OUTPUT' : 'STANDBY'}
        </div>
      </Html>

      {/* Status light on top */}
      <mesh ref={statusLightRef} position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} />
      </mesh>

      {/* Glow around status light */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={VIBE_3D_THEME.colors.primary}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Flying papers */}
      {papers.map(paper => (
        <mesh key={paper.id} position={paper.position} rotation={[paper.age * 2, paper.age * 3, 0]}>
          <boxGeometry args={[0.3, 0.4, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Label above machine */}
      <Html position={[0, 2.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.15em] font-semibold">
            Report Automation
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

      {/* Output port (where conveyor belt connects) */}
      <group position={[1.2, 0.5, 0]}>
        {/* Port housing */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
          <meshStandardMaterial
            color="#333"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Port opening glow */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
          <meshBasicMaterial
            color={VIBE_3D_THEME.colors.primary}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Port indicator light */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={VIBE_3D_THEME.colors.primary} />
        </mesh>
      </group>
    </group>
  );
}
