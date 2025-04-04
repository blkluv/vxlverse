import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function ArtGalleryModel(props: any) {
  // Load the art gallery model
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const groupRef = useRef<THREE.Group>(null);

  // Create a clone of the scene to avoid modifying the cached original
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Apply any transformations or adjustments to the model
  useEffect(() => {
    if (groupRef.current) {
      // Center the model if needed
      groupRef.current.position.set(0, 0, 0);

      // Apply any scale adjustments if needed
      groupRef.current.scale.set(1, 1, 1);

      // Make sure all meshes cast and receive shadows
      clonedScene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Ensure materials are properly set up
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [clonedScene]);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/artgallery.glb", true);
