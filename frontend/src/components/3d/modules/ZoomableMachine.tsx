/**
 * ZoomableMachine - Interactive Factory Machine Wrapper
 *
 * Wraps factory machine components with interaction logic:
 * - Idle: Machine runs normally
 * - Hover: Machine powers up (brighter, faster animations)
 * - Click: Trigger zoom event to parent
 * - Focused: Machine highlighted, camera zoomed in
 */

import { useState } from 'react';
import { PrinterMachine } from '../machines/PrinterMachine';
import { ConveyorMachine } from '../machines/ConveyorMachine';
import { ControlPanelMachine } from '../machines/ControlPanelMachine';
import { ToolboxMachine } from '../machines/ToolboxMachine';

export type MachineType = 'printer' | 'conveyor' | 'controlPanel' | 'toolbox';

interface ZoomableMachineProps {
  position: [number, number, number];
  machineType: MachineType;
  onClick?: () => void;
  isFocused?: boolean;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

function getMachineComponent(type: MachineType) {
  switch (type) {
    case 'printer':
      return PrinterMachine;
    case 'conveyor':
      return ConveyorMachine;
    case 'controlPanel':
      return ControlPanelMachine;
    case 'toolbox':
      return ToolboxMachine;
    default:
      return PrinterMachine;
  }
}

export function ZoomableMachine({
  position,
  machineType,
  onClick,
  isFocused = false,
  isHovered = false,
  onHoverChange,
}: ZoomableMachineProps) {
  const [localHover, setLocalHover] = useState(false);

  const isInteractive = isHovered || localHover;

  const handlePointerOver = () => {
    setLocalHover(true);
    onHoverChange?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setLocalHover(false);
    onHoverChange?.(false);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
  };

  const MachineComponent = getMachineComponent(machineType);

  return (
    <group
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <MachineComponent
        position={position}
        isActive={!isFocused}
        isFocused={isFocused}
      />

      {/* Hover glow effect */}
      {isInteractive && !isFocused && (
        <mesh position={[position[0], position[1] + 0.5, position[2]]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0.05}
          />
        </mesh>
      )}
    </group>
  );
}
