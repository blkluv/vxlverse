import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function ArtGalleryModel() {
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const galleryRef = useRef<THREE.Group>(null);

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

  return (
    <>
      <group ref={galleryRef} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </>
  );
}

useGLTF.preload("/models/artgallery.glb", true);
