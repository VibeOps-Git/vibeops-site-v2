/**
 * ControlPanelMachine - Engineering Dashboards Machine
 *
 * Visual metaphor for monitoring and dashboards:
 * - Angled console with control buttons
 * - Multiple floating holographic screens
 * - Animated graphs and charts
 * - Cable connections to floor
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh, Group } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';
import { DarkMetalMaterial } from '../core/Materials';

interface ControlPanelMachineProps {
  position?: [number, number, number];
  isActive?: boolean;
  isFocused?: boolean;
}

export function ControlPanelMachine({
  position = [0, 0, 0],
  isActive = true,
  isFocused = false,
}: ControlPanelMachineProps) {
  const groupRef = useRef<Group>(null);
  const screensRef = useRef<Group>(null);

  useFrame((state, delta) => {
    // Gently float screens
    if (screensRef.current && isActive) {
      screensRef.current.position.y =
        1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const screens = [
    { id: 1, position: [-0.6, 0, 0], rotation: [0, Math.PI / 12, 0] },
    { id: 2, position: [0, 0, 0.1], rotation: [0, 0, 0] },
    { id: 3, position: [0.6, 0, 0], rotation: [0, -Math.PI / 12, 0] },
  ];

  const buttons = [
    [0, 0],
    [0.15, 0],
    [0.3, 0],
    [0, -0.12],
    [0.15, -0.12],
    [0.3, -0.12],
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Console base (angled) */}
      <mesh position={[0, 0.2, 0.3]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.4, 1]} />
        <DarkMetalMaterial />
      </mesh>

      {/* Console top (control surface) */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 3, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.6, 0.1]} />
        <meshStandardMaterial
          color="#0f0f0f"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Control buttons */}
      {buttons.map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0] - 0.15, 0.55, pos[1] + 0.05]}
          rotation={[-Math.PI / 3, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
          <meshBasicMaterial
            color={VIBE_3D_THEME.colors.primary}
            transparent
            opacity={isActive ? 0.7 : 0.3}
          />
        </mesh>
      ))}

      {/* Holographic screens */}
      <group ref={screensRef} position={[0, 1.2, -0.2]}>
        {screens.map(screen => (
          <group
            key={screen.id}
            position={screen.position as [number, number, number]}
            rotation={screen.rotation as [number, number, number]}
          >
            {/* Screen frame */}
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.6, 0.02]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Screen surface */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.45, 0.55]} />
              <meshBasicMaterial
                color={VIBE_3D_THEME.colors.primary}
                transparent
                opacity={0.15}
              />
            </mesh>

            {/* Screen content (charts) */}
            <Html
              position={[0, 0, 0.03]}
              center
              distanceFactor={2.5}
              style={{ pointerEvents: 'none' }}
            >
              <div className="w-[80px] h-[90px] bg-gradient-to-b from-[#00ffcc]/10 to-transparent border border-[#00ffcc]/20 rounded p-1">
                {/* Animated bars */}
                <div className="flex items-end justify-around h-full gap-0.5">
                  {[40, 70, 55, 80, 60].map((height, i) => (
                    <div
                      key={i}
                      className="w-2 bg-[#00ffcc]/60 rounded-t transition-all duration-1000"
                      style={{
                        height: `${isActive ? height : 20}%`,
                        animation: isActive ? `pulse ${2 + i * 0.3}s ease-in-out infinite` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </Html>

            {/* Screen glow */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.55, 0.65]} />
              <meshBasicMaterial
                color={VIBE_3D_THEME.colors.primary}
                transparent
                opacity={0.05}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cable connections to floor */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial
            color="#333"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Cable glow */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={`glow-${i}`} position={[x, -0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshBasicMaterial
            color={VIBE_3D_THEME.colors.primary}
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}

      {/* Label above machine */}
      <Html position={[0, 2.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.15em] font-semibold">
            Engineering Dashboards
          </div>
          <div className="text-[#00ffcc]/50 text-[7px] uppercase tracking-wider">
            {isActive ? '● ACTIVE' : '○ STANDBY'}
          </div>
        </div>
      </Html>

      {/* Connection to floor */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
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

      {/* Output port (right side) */}
      <group position={[1.0, 0.5, 0]}>
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
