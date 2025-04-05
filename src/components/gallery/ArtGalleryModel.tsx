import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { ThreeEvent } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";

function Paint({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  return (
    <group>
      <mesh>
        <boxGeometry args={[10, 10, 0.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export function ArtGalleryModel() {
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const galleryRef = useRef<THREE.Group>(null);
  const paintingRef = useRef<THREE.Group>(null);

  const { selectedPaintingId, paintings } = usePaintingsStore();
  const { gridSnap } = useEditorStore();

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

      position.add(normal.multiplyScalar(0.1));

      if (gridSnap) {
        position.set(Math.round(position.x), Math.round(position.y), Math.round(position.z));
      }

      paintingRef.current.position.copy(position);

      if (Math.abs(normal.y) > 0.9) {
        paintingRef.current.rotation.set(0, 0, 0);
      } else {
        const lookAtPos = position.clone().sub(normal);
        lookAtPos.y = position.y;
        paintingRef.current.lookAt(lookAtPos);
        paintingRef.current.rotation.x = 0;
        paintingRef.current.rotation.z = 0;
      }
    }
  };

  const selectedPainting = paintings.find((p) => p.id === selectedPaintingId);

  return (
    <>
      {selectedPainting && (
        <group ref={paintingRef}>
          <Paint imageUrl={selectedPainting.imageUrl} />
        </group>
      )}

      <group ref={galleryRef} onPointerMove={handlePointerMove} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </>
  );
}

useGLTF.preload("/models/artgallery.glb", true);
