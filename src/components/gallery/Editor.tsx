import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  Environment,
  TransformControls,
  Box,
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
  const { paintings, selectedPaintingId, selectPainting, updatePainting, placeWithBrush } =
    usePaintingsStore();

  // Get Three.js camera and raycaster

  // References
  const selectedPaintingRef = useRef<THREE.Group | null>(null);
  const galleryModelRef = useRef<THREE.Group | null>(null);
  const boxRef = useRef<THREE.Mesh | null>(null);
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

      <TransformControls
        onMouseUp={(event) => {
          console.log((event as any)?.target?.object);
          const object = (event as any)?.target?.object;
          const { position, rotation, scale } = object;
          console.log(`
            position= {${position.toArray()}}
            rotation= {${rotation.toArray()}}
            scale= {${scale.toArray()}}
          `);
          if (boxRef.current) {
            const position = boxRef.current.position.toArray() as [number, number, number];
            const rotation = [
              boxRef.current.rotation.x,
              boxRef.current.rotation.y,
              boxRef.current.rotation.z,
            ] as [number, number, number];
            const scale = boxRef.current.scale.toArray() as [number, number, number];

            boxRef.current.position.set(...position);
            boxRef.current.rotation.set(...rotation);
            boxRef.current.scale.set(...scale);
          }
        }}
        mode={transformMode}
      >
        <Box ref={boxRef} args={[1, 1, 1]}>
          <meshBasicMaterial color={"#00000000"} />
        </Box>
      </TransformControls>

      <Box
        position={[28.074240273245735, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial color={"#00000000"} />
      </Box>

      <Box
        position={[-28.099190510049553, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial color={"#00000000"} />
      </Box>

      <Box
        position={[-30.673658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial color={"#00000000"} />
      </Box>

      <Box
        position={[30.573658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[-0.39954031579897986, 12.809816915989206, 108.43256308749729]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[0.39954031579897986, 10.119850165385632, -119.93882746000172]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[20.660679450910656, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[-21.753696967218218, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[-18.186416420525397, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[18.022778670184913, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      <Box
        position={[-0.3178609843752156, 8.673026543030618, -74.29217556618775]}
        rotation={[0, 0, 0]}
        scale={[23.667055730843213, 13.126795246184962, 0.8699142340470483]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} color={"#00000000"} />
      </Box>

      {/* Gallery Model */}
      <group ref={galleryModelRef}>
        <ArtGalleryModel />
      </group>

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
        <GizmoViewport axisColors={["#f48", "#00000000", "#00b0ff"]} labelColor="black" />
      </GizmoHelper>
    </>
  );
}
