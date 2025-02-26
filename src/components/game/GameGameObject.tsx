import { useMemo, useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStore } from "../../stores/gameStore";
import * as THREE from "three";
import { useSound } from "../../hooks/useSound";
import { SkeletonUtils } from "three-stdlib";
import { Quest } from "../../types";

interface GltfMemoOptions {
  /** Option to center the geometry of non-rigged meshes */
  center?: boolean;
}

/**
 * Loads a GLTF model and returns a cloned, memoized version.
 * Optionally centers non-rigged meshes and makes them interactive.
 *
 * @param url - The URL to the GLTF asset.
 * @param options - Additional options (e.g., { center: true } to center geometry).
 */
export function useGltfMemo(url: string, options: GltfMemoOptions = {}) {
  const { center = false } = options;
  const gltf = useGLTF(url);

  const scene = useMemo(() => {
    // Clone the scene to avoid mutating the original GLTF
    const clonedScene = SkeletonUtils.clone(gltf.scene);

    // Traverse and modify all mesh children
    // clonedScene.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     // Mark mesh as selectable
    //     child.userData.selectable = true;

    //     // Optionally center the mesh geometry if desired and if it exists.
    //     if (center && child.geometry) {
    //       child.geometry.center();
    //     }

    //     // Overwrite the raycast method to ensure correct interaction behavior
    //     child.raycast = (raycaster, intersects) => {
    //       THREE.Mesh.prototype.raycast.call(child, raycaster, intersects);
    //     };
    //   }
    // });

    return clonedScene;
  }, [gltf.scene, center]);

  return { ...gltf, animations: [...gltf.animations], scene };
}

interface GameGameObjectProps {
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  quests?: Quest[];
  activeAnimation?: string;
  interactionSound?: string;
  onClick?: (e: THREE.Event) => void;
}

export function GameGameObject({
  modelUrl,
  position,
  rotation,
  scale,
  quests,
  activeAnimation,
  interactionSound,
  onClick,
}: GameGameObjectProps) {
  const { scene, animations } = useGltfMemo(modelUrl, {
    center: true,
  });
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const { playSound } = useSound();
  const groupRef = useRef<THREE.Group>(null);
  const objectRef = useRef<THREE.Group>(null);

  // Animation setup
  const { actions, mixer } = useAnimations(animations, objectRef);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  // Update the object's position when the position prop changes
  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.position.copy(position);
      objectRef.current.rotation.copy(rotation);
      objectRef.current.scale.copy(scale);
    }
  }, [position, rotation, scale]);

  // Handle animations when activeAnimation changes
  useEffect(() => {
    // Safety check for actions
    if (!actions || Object.keys(actions).length === 0) return;

    if (activeAnimation) {
      // Check if the animation exists in the actions object
      if (actions[activeAnimation]) {
        try {
          // Stop any current animation if it exists
          if (currentAnimation && actions[currentAnimation]) {
            actions[currentAnimation].fadeOut(0.5);
          }

          // Play the new animation with fade in
          actions[activeAnimation].reset().fadeIn(0.5).play();
          setCurrentAnimation(activeAnimation);
        } catch (error) {
          console.error("Error playing animation:", error);
          setCurrentAnimation(null);
        }
      }
    }
  }, [actions, activeAnimation]);

  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      if (mixer) {
        try {
          mixer.stopAllAction();
        } catch (error) {
          console.error("Error cleaning up animations:", error);
        }
      }
    };
  }, [mixer]);

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();

    // Play interaction sound if available
    if (interactionSound) {
      playSound(interactionSound);
    }

    // Handle quest interaction
    if (quests && quests.length > 0) {
      const quest = quests[0];
      if (quest.dialogues && quest.dialogues.length > 0) {
        setActiveDialogue(quest.dialogues[0].id);
      }
      setActiveQuest(quest);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <group ref={groupRef}>
      <group
        ref={objectRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerDown={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <primitive
          object={scene}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
        />
      </group>
    </group>
  );
}
