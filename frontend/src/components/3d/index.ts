/**
 * 3D Component Exports
 *
 * Barrel file for easy imports throughout the application
 */

// Core infrastructure
export { Scene3D } from './core/Scene3D';
export { Lights3D } from './core/Lights3D';
export { GlassMaterial, NeonWireframeMaterial, DarkMetalMaterial } from './core/Materials';

// Geometries
export { FloatingCube } from './geometries/FloatingCube';
export { FloatingSphere } from './geometries/FloatingSphere';
export { FloatingPyramid } from './geometries/FloatingPyramid';
export { FloatingIcosahedron } from './geometries/FloatingIcosahedron';

// Sections
export { GallerySection3D } from './sections/GallerySection3D';
export { ContentOverlay } from './sections/ContentOverlay';
export { FactoryFloor } from './sections/FactoryFloor';

// Machines
export { PrinterMachine } from './machines/PrinterMachine';
export { ConveyorMachine } from './machines/ConveyorMachine';
export { ControlPanelMachine } from './machines/ControlPanelMachine';
export { ToolboxMachine } from './machines/ToolboxMachine';

// Backgrounds
export { FloatingField } from './backgrounds/FloatingField';

// Modules
export { ZoomableMachine, type MachineType } from './modules/ZoomableMachine';
export { ZoomableCard } from './modules/ZoomableCard'; // Keep for backwards compatibility
export { ShapeLabel } from './modules/ShapeLabel';
export { ConveyorBelt } from './modules/ConveyorBelt';

// Camera
export { ZoomCamera } from './camera/ZoomCamera';
