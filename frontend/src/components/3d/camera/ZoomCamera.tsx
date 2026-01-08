/**
 * ZoomCamera - Animated Camera with Zoom Transitions
 *
 * Smoothly transitions between overview and focused positions
 * Uses lerp for smooth interpolation
 */

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import type { PerspectiveCamera as PerspectiveCameraType } from 'three';

interface ZoomCameraProps {
  focusPosition?: [number, number, number];
  lookAt?: [number, number, number];
  isZoomed?: boolean;
  defaultPosition?: [number, number, number];
  zoomDuration?: number;
}

export function ZoomCamera({
  focusPosition = [0, 0, 5],
  lookAt = [0, 0, 0],
  isZoomed = false,
  defaultPosition = [0, 0, 10],
  zoomDuration = 0.8,
}: ZoomCameraProps) {
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const targetPosition = useRef(new Vector3(...defaultPosition));
  const targetLookAt = useRef(new Vector3(...lookAt));
  const { camera } = useThree();

  // Update target positions when zoom state changes
  useEffect(() => {
    if (isZoomed) {
      targetPosition.current.set(...focusPosition);
      targetLookAt.current.set(...lookAt);
    } else {
      targetPosition.current.set(...defaultPosition);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [isZoomed, focusPosition, lookAt, defaultPosition]);

  // Smooth camera animation
  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // Lerp factor based on duration (smoother = lower factor)
    const lerpFactor = Math.min(delta * (1 / zoomDuration) * 2, 1);

    // Smoothly interpolate position
    camera.position.lerp(targetPosition.current, lerpFactor);

    // Smoothly interpolate look-at
    const currentLookAt = new Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(targetLookAt.current, lerpFactor);

    camera.lookAt(currentLookAt);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={defaultPosition}
      fov={75}
    />
  );
}
