import { useRef, useState } from "react";
import { Box, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";

interface EditorBoxColliderProps {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  isSelected: boolean;
  onClick?: (e: THREE.Event) => void;
  transformMode?: "translate" | "rotate" | "scale";
  onTransform?: (position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3) => void;
}

/**
 * EditorBoxCollider represents a box collider object within the editor.
 * It supports selection, transformation, and grid snapping.
 */
export function EditorBoxCollider({
  id,
  position,
  rotation,
  scale,
  isSelected,
  transformMode,
  onClick,
  onTransform,
}: EditorBoxColliderProps) {
  // Refs for object manipulation
  const objectRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Local state for transformation tracking
  const [, setIsDragging] = useState(false);

  // Editor store state
  const gridSnap = useEditorStore((state) => state.gridSnap);
  const setIsTransforming = useEditorStore((state) => state.setIsTransforming);
  const brushActive = useEditorStore((state) => state.brushActive);

  // Drag start and end handlers
  const handleDragStart = () => {
    setIsDragging(true);
    setIsTransforming(true);
  };

  const handleDragEnd = () => {
    if (!objectRef.current || !onTransform) return;
    const newPosition = objectRef.current.position.clone();
    const newRotation = objectRef.current.rotation.clone();
    const newScale = objectRef.current.scale.clone();
    onTransform(newPosition, newRotation, newScale);
    setIsDragging(false);
    setIsTransforming(false);
  };

  /**
   * Snap the object's transformation to a grid.
   * Provides visual feedback during transformation.
   */
  const handleObjectChange = () => {
    if (!objectRef.current || !gridSnap) return;

    // Apply grid snapping if enabled
    if (gridSnap) {
      // Snap position to grid (0.5 unit grid to match EditorScene)
      objectRef.current.position.x = Math.round(objectRef.current.position.x * 2) / 2;
      objectRef.current.position.y = Math.round(objectRef.current.position.y * 2) / 2;
      objectRef.current.position.z = Math.round(objectRef.current.position.z * 2) / 2;

      // Snap rotation to 45-degree increments
      objectRef.current.rotation.x =
        Math.round(objectRef.current.rotation.x / (Math.PI / 4)) * (Math.PI / 4);
      objectRef.current.rotation.y =
        Math.round(objectRef.current.rotation.y / (Math.PI / 4)) * (Math.PI / 4);
      objectRef.current.rotation.z =
        Math.round(objectRef.current.rotation.z / (Math.PI / 4)) * (Math.PI / 4);

      // Snap scale to 0.25 increments
      objectRef.current.scale.x = Math.round(objectRef.current.scale.x * 4) / 4;
      objectRef.current.scale.y = Math.round(objectRef.current.scale.y * 4) / 4;
      objectRef.current.scale.z = Math.round(objectRef.current.scale.z * 4) / 4;
    }
  };

  return (
    <group key={id}>
      <group
        ref={objectRef}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
        onDoubleClick={(e) => {
          if (!brushActive) e.stopPropagation();
          document.body.style.cursor = "pointer";
          if (onClick && !brushActive) onClick(e);
        }}
        onPointerOver={() => {
          document.body.style.cursor = brushActive ? "crosshair" : "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial wireframe color="#00ff00" />
        </Box>
      </group>

      {isSelected && objectRef.current && (
        <TransformControls
          object={objectRef.current}
          onObjectChange={handleObjectChange}
          mode={transformMode}
          size={0.7}
          showX
          showY
          showZ
          camera={camera}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
        />
      )}
    </group>
  );
}
