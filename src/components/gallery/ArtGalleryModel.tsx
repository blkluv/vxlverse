import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { ThreeEvent } from "@react-three/fiber";

function Paint() {
  const { selectedPaintingId, paintings } = usePaintingsStore();
  const selectedPainting = paintings.find((p) => p.id === selectedPaintingId);
  const texture = useTexture(selectedPainting?.imageUrl || "");
  return (
    <group>
      <mesh>
        <boxGeometry args={[10, 10, 0.1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export function ArtGalleryModel() {
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const galleryRef = useRef<THREE.Group>(null);
  const paintingRef = useRef<THREE.Group>(null);

  const { selectedPaintingId } = usePaintingsStore();

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.position.set(0, 0, 0);
      galleryRef.current.scale.set(1, 1, 1);

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [clonedScene]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (paintingRef.current && event.face) {
      const normal = event.face.normal.clone();
      const position = event.point.clone();

      // Offset painting slightly from surface to prevent z-fighting
      position.add(normal.multiplyScalar(0.01));

      paintingRef.current.position.copy(position);

      if (Math.abs(normal.y) > 0.9) {
        // On the floor or ceiling: keep painting upright facing default direction
        paintingRef.current.rotation.set(0, 0, 0);
      } else {
        // On walls: align flat to wall, vertically upright
        const lookAtPos = position.clone().sub(normal);
        lookAtPos.y = position.y;
        paintingRef.current.lookAt(lookAtPos);
        paintingRef.current.rotation.x = 0;
        paintingRef.current.rotation.z = 0;
      }
    }
  };

  const selectedPainting = usePaintingsStore
    .getState()
    .paintings.find((p) => p.id === selectedPaintingId);

  return (
    <>
      {selectedPainting && (
        <group ref={paintingRef}>
          <Paint />
        </group>
      )}

      <group ref={galleryRef} onPointerMove={handlePointerMove} dispose={null}>
        <primitive object={clonedScene} />

        {/* Invisible walls for painting placement */}
        <group>
          <mesh position={[0, 2, -5]}>
            <boxGeometry args={[10, 4, 0.1]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>

          <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[10, 4, 0.1]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>

          <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[10, 4, 0.1]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>

          <mesh position={[0, 2, 5]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[10, 4, 0.1]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/models/artgallery.glb", true);
