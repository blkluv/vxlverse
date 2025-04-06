import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { ArtGalleryModel } from "./ArtGalleryModel";
import { Painting } from "./Painting";
import { useRef, useState } from "react";
import * as THREE from "three";
import { PhysicsArea } from "./PhysicsArea";
import { useThree } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";

interface EditorSceneProps {
  showGrid?: boolean;
  gridSnap?: boolean;
  transformMode?: "translate" | "rotate" | "scale";
}

export function ArtEditor({
  showGrid = true,
  gridSnap = false,
  transformMode = "translate",
}: EditorSceneProps = {}) {
  const { camera } = useThree();

  // State for tracking transform operations
  const [, setIsDragging] = useState(false);
  const { scenes, currentSceneId, updateObject, setSelectedObject, selectedObjectId, brushActive } =
    useEditorStore();

  // References
  const selectedPaintingRef = useRef<THREE.Group | null>(null);
  const galleryModelRef = useRef<THREE.Group | null>(null);
  if (!scenes || !currentSceneId) return null;

  const objects = scenes.find((scene) => scene.id === currentSceneId)?.objects;
  // Get the selected painting

  return (
    <>
      {/* Sky */}
      <Environment preset="park" background />

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Grid */}
      {showGrid && (
        <Grid
          position={[0, 0.5, 0]}
          args={[100, 100]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={gridSnap ? "#4080ff" : "#6f6f6f"}
          sectionSize={3}
          sectionThickness={1}
          sectionColor={gridSnap ? "#4080ff" : "#9d4b4b"}
          fadeDistance={100}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}

      <PhysicsArea />
      {/* Gallery Model */}
      <ArtGalleryModel />

      {/* Render all paintings from the store */}
      {objects?.map((painting) => (
        <Painting
          key={painting.id}
          imageUrl={painting.imageUrl ?? ""}
          position={painting.position}
          rotation={painting.rotation}
          scale={painting.scale}
          width={1}
          height={1}
          isSelected={painting.id === selectedObjectId}
          onClick={() => setSelectedObject(painting.id)}
          ref={
            painting.id === selectedObjectId
              ? (selectedPaintingRef as React.RefObject<THREE.Group>)
              : undefined
          }
        />
      ))}

      {/* Transform Controls */}
      {!brushActive && selectedObjectId && selectedPaintingRef.current && (
        <TransformControls
          object={selectedPaintingRef.current}
          mode={transformMode}
          size={0.7}
          showX
          showY
          showZ
          camera={camera}
          onMouseDown={() => {
            setIsDragging(true);
          }}
          onMouseUp={() => {
            if (selectedPaintingRef.current && selectedObjectId) {
              const position = selectedPaintingRef.current.position.toArray() as [
                number,
                number,
                number,
              ];
              const rotation = [
                selectedPaintingRef.current.rotation.x,
                selectedPaintingRef.current.rotation.y,
                selectedPaintingRef.current.rotation.z,
              ] as [number, number, number];
              const scale = selectedPaintingRef.current.scale.toArray() as [number, number, number];
              updateObject(currentSceneId, selectedObjectId, {
                position: new THREE.Vector3(...position),
                rotation: new THREE.Euler(...rotation),
                scale: new THREE.Vector3(...scale),
              });
              setIsDragging(false);
            }
          }}
          onObjectChange={() => {
            if (!selectedPaintingRef.current || !gridSnap) return;

            // Apply grid snapping if enabled
            if (gridSnap) {
              // Snap position to grid (0.5 unit grid)
              selectedPaintingRef.current.position.x =
                Math.round(selectedPaintingRef.current.position.x * 2) / 2;
              selectedPaintingRef.current.position.y =
                Math.round(selectedPaintingRef.current.position.y * 2) / 2;
              selectedPaintingRef.current.position.z =
                Math.round(selectedPaintingRef.current.position.z * 2) / 2;

              // Snap rotation to 45-degree increments
              selectedPaintingRef.current.rotation.x =
                Math.round(selectedPaintingRef.current.rotation.x / (Math.PI / 4)) * (Math.PI / 4);
              selectedPaintingRef.current.rotation.y =
                Math.round(selectedPaintingRef.current.rotation.y / (Math.PI / 4)) * (Math.PI / 4);
              selectedPaintingRef.current.rotation.z =
                Math.round(selectedPaintingRef.current.rotation.z / (Math.PI / 4)) * (Math.PI / 4);

              // Snap scale to 0.25 increments
              selectedPaintingRef.current.scale.x =
                Math.round(selectedPaintingRef.current.scale.x * 4) / 4;
              selectedPaintingRef.current.scale.y =
                Math.round(selectedPaintingRef.current.scale.y * 4) / 4;
              selectedPaintingRef.current.scale.z =
                Math.round(selectedPaintingRef.current.scale.z * 4) / 4;
            }
          }}
        />
      )}

      <GizmoHelper
        alignment="top-right" // widget alignment within scene
        margin={[100, 100]}
      >
        <GizmoViewport axisColors={["#f48", "#7c3", "#00b0ff"]} labelColor="black" />
      </GizmoHelper>
    </>
  );
}
