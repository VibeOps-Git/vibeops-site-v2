/**
 * Camera Utilities
 *
 * Helper functions for calculating camera positions and grid layouts in 3D space
 */

/**
 * Calculate position for arranging 3D objects on 2D factory background
 * Simple grid layout for machines
 */
export function calculateGridPosition(
  index: number,
  totalItems: number
): [number, number, number] {
  // Simple 2x2 grid
  const cols = 2;
  const row = Math.floor(index / cols);
  const col = index % cols;

  const spacing = 4;
  const x = (col - 0.5) * spacing;
  const z = (row - 0.5) * spacing * 0.5; // Less depth
  const y = 0;

  return [x, y, z];
}

/**
 * Calculate camera position for focusing on a specific object
 * Returns position that frames the object nicely
 */
export function calculateFocusPosition(
  objectPosition: [number, number, number],
  distance: number = 3
): [number, number, number] {
  return [
    objectPosition[0],
    objectPosition[1],
    objectPosition[2] + distance
  ];
}

/**
 * Calculate camera look-at target
 */
export function calculateLookAt(
  objectPosition: [number, number, number]
): [number, number, number] {
  return objectPosition;
}
