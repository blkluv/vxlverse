import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import {
  useGLTF,
  TransformControls,
  useAnimations,
  Gltf,
} from "@react-three/drei";
import { useGameStore } from "../stores/gameStore";
import * as THREE from "three";
import { useSound } from "../hooks/useSound";
import { useThree } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { useEditorStore } from "../stores/editorStore";
import { toast } from "./UI/Toast";
import type { GameObject } from "../types";

// same url multiple GLTF instances
function useGltfMemo(url: string) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(gltf.scene);

    // Make all meshes in the scene interactive
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.selectable = true;
        // Ensure the mesh has proper raycast behavior
        child.raycast = (raycaster, intersects) => {
          THREE.Mesh.prototype.raycast.call(child, raycaster, intersects);
        };
      }
    });

    return clonedScene;
  }, [gltf.scene]);

  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

export function GameObject(props: GameObject) {
  const gltf = useGltfMemo(props.modelUrl);
  const { actions } = useAnimations(gltf.animations, gltf.scene);
  const ref = useRef<THREE.Mesh>(null);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const startAIDialogue = useGameStore((state) => state.startAIDialogue);

  useEffect(() => {
    if (props.animations?.idle) {
      actions[props.animations.idle]?.play();
    }
  }, [props.animations, actions]);

  return (
    <primitive
      onClick={(e: THREE.Event) => {
        // @ts-ignore
        e.stopPropagation();
        
        // Handle object interaction based on type
        if (props.type === "npc") {
          // Start AI dialogue for NPCs
          startAIDialogue(props.name || "NPC");
        } else if (props.quests && props.quests.length > 0 && props.quests[0].dialogues.length > 0) {
          // Use first dialogue from quest if available
          setActiveDialogue(props.quests[0].dialogues[0].id.toString());
        } else {
          // Default interaction
          console.log("Interacted with:", props.name);
        }
      }}
      ref={ref}
      scale={props.scale}
      position={props.position}
      rotation={props.rotation}
      object={gltf.scene}
    />
  );
}
