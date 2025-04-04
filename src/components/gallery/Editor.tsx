import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { ArtGalleryModel } from "./ArtGalleryModel";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { Painting } from "./Painting";
import { useRef } from "react";
import * as THREE from "three";

interface EditorSceneProps {
  showGrid?: boolean;
  gridSnap?: boolean;
  transformMode?: "translate" | "rotate" | "scale";
}

export function ArtEditor({
  showGrid = true,
  gridSnap = false,
  transformMode,
}: EditorSceneProps = {}) {
  // Get paintings from store
  const { paintings, selectedPaintingId, selectPainting, updatePainting } = usePaintingsStore();

  // Reference to the selected painting object
  const selectedPaintingRef = useRef<THREE.Group | null>(null);

  // Get the selected painting
  const selectedPainting = paintings.find((p) => p.id === selectedPaintingId);
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

      <ArtGalleryModel position={[0, 0, 0]} />

      {/* Render all paintings from the store */}
      {paintings.map((painting) => (
        <Painting
          key={painting.id}
          imageUrl={painting.imageUrl}
          position={painting.position}
          rotation={painting.rotation}
          scale={painting.scale}
          width={painting.width}
          height={painting.height}
          isSelected={painting.id === selectedPaintingId}
          onClick={() => selectPainting(painting.id)}
          ref={
            painting.id === selectedPaintingId
              ? (selectedPaintingRef as React.RefObject<THREE.Group>)
              : undefined
          }
        />
      ))}

      {/* Transform Controls */}
      {selectedPaintingId && selectedPainting && selectedPaintingRef.current && (
        <TransformControls
          object={selectedPaintingRef.current}
          mode={transformMode}
          onMouseUp={() => {
            if (selectedPaintingRef.current && selectedPaintingId) {
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

              updatePainting(selectedPaintingId, { position, rotation, scale });
            }
          }}
        />
      )}

      <GizmoHelper
        alignment="top-right" // widget alignment within scene
        margin={[100, 100]}
      >
        <GizmoViewport axisColors={["#f48", "#00e676", "#00b0ff"]} labelColor="black" />
      </GizmoHelper>
    </>
  );
}
