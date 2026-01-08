/**
 * FloatingField - Ambient 3D Space Ops Background
 *
 * Creates a sparse field of floating geometric shapes for visual depth
 * - Mixed geometries (cubes, spheres, pyramids, rings)
 * - Random positions, sizes, rotation speeds
 * - Very subtle, low opacity to stay in background
 * - Parallax effect on scroll
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Matrix4 } from 'three';
import { VIBE_3D_THEME } from '@/lib/3d/theme';

interface FloatingFieldProps {
  count?: number;
  spread?: number;
  depthRange?: [number, number];
}

type ShapeConfig = {
  position: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
  type: 'cube' | 'sphere' | 'pyramid' | 'ring';
};

export function FloatingField({
  count = 12,
  spread = 20,
  depthRange = [-30, -10],
}: FloatingFieldProps) {
  const cubesRef = useRef<InstancedMesh>(null);
  const spheresRef = useRef<InstancedMesh>(null);
  const pyramidsRef = useRef<InstancedMesh>(null);
  const ringsRef = useRef<InstancedMesh>(null);

  // Generate random configurations for each shape
  const shapes = useMemo<ShapeConfig[]>(() => {
    const types: ShapeConfig['type'][] = ['cube', 'sphere', 'pyramid', 'ring'];
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        Math.random() * (depthRange[1] - depthRange[0]) + depthRange[0],
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number],
      rotationSpeed: [
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      type: types[Math.floor(Math.random() * types.length)],
    }));
  }, [count, spread, depthRange]);

  // Group shapes by type
  const groupedShapes = useMemo(() => {
    return {
      cube: shapes.filter(s => s.type === 'cube'),
      sphere: shapes.filter(s => s.type === 'sphere'),
      pyramid: shapes.filter(s => s.type === 'pyramid'),
      ring: shapes.filter(s => s.type === 'ring'),
    };
  }, [shapes]);

  const dummy = useMemo(() => new Object3D(), []);

  // Animate all instances
  useFrame(() => {
    // Update cubes
    if (cubesRef.current) {
      groupedShapes.cube.forEach((shape, i) => {
        shape.rotation[0] += shape.rotationSpeed[0];
        shape.rotation[1] += shape.rotationSpeed[1];
        shape.rotation[2] += shape.rotationSpeed[2];

        dummy.position.set(...shape.position);
        dummy.rotation.set(...shape.rotation);
        dummy.scale.setScalar(shape.scale);
        dummy.updateMatrix();

        cubesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      cubesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update spheres
    if (spheresRef.current) {
      groupedShapes.sphere.forEach((shape, i) => {
        shape.rotation[0] += shape.rotationSpeed[0];
        shape.rotation[1] += shape.rotationSpeed[1];

        dummy.position.set(...shape.position);
        dummy.rotation.set(...shape.rotation);
        dummy.scale.setScalar(shape.scale);
        dummy.updateMatrix();

        spheresRef.current!.setMatrixAt(i, dummy.matrix);
      });
      spheresRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update pyramids
    if (pyramidsRef.current) {
      groupedShapes.pyramid.forEach((shape, i) => {
        shape.rotation[0] += shape.rotationSpeed[0];
        shape.rotation[1] += shape.rotationSpeed[1];
        shape.rotation[2] += shape.rotationSpeed[2];

        dummy.position.set(...shape.position);
        dummy.rotation.set(...shape.rotation);
        dummy.scale.setScalar(shape.scale);
        dummy.updateMatrix();

        pyramidsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pyramidsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update rings
    if (ringsRef.current) {
      groupedShapes.ring.forEach((shape, i) => {
        shape.rotation[0] += shape.rotationSpeed[0];
        shape.rotation[1] += shape.rotationSpeed[1];

        dummy.position.set(...shape.position);
        dummy.rotation.set(...shape.rotation);
        dummy.scale.setScalar(shape.scale);
        dummy.updateMatrix();

        ringsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ringsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Instanced Cubes */}
      {groupedShapes.cube.length > 0 && (
        <instancedMesh ref={cubesRef} args={[undefined, undefined, groupedShapes.cube.length]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0.08}
            wireframe
          />
        </instancedMesh>
      )}

      {/* Instanced Spheres */}
      {groupedShapes.sphere.length > 0 && (
        <instancedMesh ref={spheresRef} args={[undefined, undefined, groupedShapes.sphere.length]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0.06}
            wireframe
          />
        </instancedMesh>
      )}

      {/* Instanced Pyramids */}
      {groupedShapes.pyramid.length > 0 && (
        <instancedMesh ref={pyramidsRef} args={[undefined, undefined, groupedShapes.pyramid.length]}>
          <tetrahedronGeometry args={[0.6]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0.07}
            wireframe
          />
        </instancedMesh>
      )}

      {/* Instanced Rings (Torus) */}
      {groupedShapes.ring.length > 0 && (
        <instancedMesh ref={ringsRef} args={[undefined, undefined, groupedShapes.ring.length]}>
          <torusGeometry args={[0.6, 0.1, 8, 16]} />
          <meshBasicMaterial
            color="#00ffdd"
            transparent
            opacity={0.05}
            wireframe
          />
        </instancedMesh>
      )}
    </group>
  );
}
