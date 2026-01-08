/**
 * ConveyorMachine - Workflow Automation Machine
 *
 * Visual metaphor for workflow automation:
 * - Animated conveyor belt with moving boxes
 * - Robotic arm that picks/sorts boxes
 * - Control panel with status indicators
 * - Movement shows continuous workflow
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh, Group } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';
import { DarkMetalMaterial } from '../core/Materials';

interface ConveyorMachineProps {
  position?: [number, number, number];
  isActive?: boolean;
  isFocused?: boolean;
}

export function ConveyorMachine({
  position = [0, 0, 0],
  isActive = true,
  isFocused = false,
}: ConveyorMachineProps) {
  const groupRef = useRef<Group>(null);
  const beltOffset = useRef(0);
  const armRef = useRef<Group>(null);

  // Boxes on conveyor
  const boxes = [
    { id: 1, offset: 0 },
    { id: 2, offset: -1.5 },
    { id: 3, offset: -3 },
  ];

  useFrame((state, delta) => {
    // Move conveyor belt
    if (isActive && !isFocused) {
      beltOffset.current += delta * 0.5;
      if (beltOffset.current > 1.5) beltOffset.current = 0;
    }

    // Animate robotic arm
    if (armRef.current && isActive) {
      armRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base platform */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.3, 1.2]} />
        <DarkMetalMaterial />
      </mesh>

      {/* Conveyor belt surface */}
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <boxGeometry args={[2.8, 0.05, 1]} />
        <meshStandardMaterial
          color="#222"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      {/* Belt rollers */}
      <mesh position={[-1.3, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.3, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Moving boxes on conveyor */}
      {boxes.map(box => {
        const xPos = ((box.offset + beltOffset.current) % 3) - 1.2;
        const visible = xPos > -1.5 && xPos < 1.5;

        return visible ? (
          <mesh key={box.id} position={[xPos, 0.4, 0]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              color="#555"
              roughness={0.6}
              metalness={0.4}
            />
            {/* Cyan band on box */}
            <mesh position={[0, 0, 0.16]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial
                color={VIBE_3D_THEME.colors.primary}
                transparent
                opacity={0.6}
              />
            </mesh>
          </mesh>
        ) : null;
      })}

      {/* Robotic arm */}
      <group ref={armRef} position={[0.5, 0.6, 0]}>
        {/* Arm base */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Arm segment 1 */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Arm segment 2 */}
        <mesh position={[0, 0.8, 0.2]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Claw */}
        <group position={[0, 1, 0.4]}>
          <mesh position={[-0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.03, 0.15, 0.03]} />
            <meshStandardMaterial color={VIBE_3D_THEME.colors.primary} />
          </mesh>
          <mesh position={[0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.03, 0.15, 0.03]} />
            <meshStandardMaterial color={VIBE_3D_THEME.colors.primary} />
          </mesh>
        </group>
      </group>

      {/* Control panel */}
      <mesh position={[1.2, 0.6, 0]} rotation={[0, -Math.PI / 6, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Status indicators on panel */}
      {[0, 1, 2].map(i => (
        <mesh
          key={i}
          position={[1.15, 0.7 - i * 0.15, 0.06]}
          rotation={[0, -Math.PI / 6, 0]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color={VIBE_3D_THEME.colors.primary}
            transparent
            opacity={isActive ? 0.8 : 0.3}
          />
        </mesh>
      ))}

      {/* Label above machine */}
      <Html position={[0, 2.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.15em] font-semibold">
            Workflow Automation
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
      <group position={[-1.5, 0.5, 0]}>
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

      {/* Output port (right side) */}
      <group position={[1.5, 0.5, 0]}>
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
