import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useGameStore } from "../../stores/gameStore";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { GameObject } from "../../types";
import { useSound } from "../../hooks/useSound";
import { cn } from "../UI";
import {
  ColliderOptions,
  RigidBody,
  RigidBodyAutoCollider,
} from "@react-three/rapier";

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

  const bbox = new THREE.Box3().setFromObject(gltf.scene);
  const height = bbox.getSize(new THREE.Vector3()).y;
  const width = bbox.getSize(new THREE.Vector3()).x;

  return {
    ...gltf,
    animations: [...gltf.animations],
    scene: scene,
    height,
    width,
  };
}

function PhysicsWrapper({
  children,
  physics,
}: {
  children: React.ReactNode;
  physics?: GameObject["physics"];
}) {
  if (physics?.enabled) {
    return (
      <RigidBody
        type="fixed"
        colliders={physics.colliders as RigidBodyAutoCollider}
      >
        {children}
      </RigidBody>
    );
  }
  return <>{children}</>;
}

export function GameObject(props: GameObject) {
  const gltf = useGltfMemo(props.modelUrl);
  const { actions } = useAnimations(gltf.animations, gltf.scene);
  const ref = useRef<THREE.Group>(null);
  const [showInteractionMenu] = useState(false);
  const { playSound } = useSound();

  // Game store data and actions
  const setActiveNpc = useGameStore((state) => state.setActiveNpc);

  // Assume NPC has quests if it's an NPC type and there are available quests
  const hasQuests = props.type === "npc";

  // Mock player level - replace with actual player level from your game store
  useEffect(() => {
    if (props.animations?.idle) {
      actions[props.animations.idle]?.play();
    }
  }, [props.animations, actions]);

  const { position, rotation, scale } = useMemo(() => {
    return {
      position: new THREE.Vector3(
        props.position.x,
        props.position.y,
        props.position.z
      ),
      rotation: new THREE.Euler().copy(props.rotation),
      scale: new THREE.Vector3(props.scale.x, props.scale.y, props.scale.z),
    };
  }, [props.position, props.rotation, props.scale]);
  return (
    <Suspense>
      <PhysicsWrapper physics={props.physics}>
        <primitive
          onClick={(e: THREE.Event) => {
            // @ts-ignore
            e.stopPropagation();

            if (props.type === "npc") {
              // Instead of immediately setting active NPC, show the interaction menu
              setActiveNpc(props.id);
              playSound("select");
            }
          }}
          ref={ref}
          scale={scale}
          position={position}
          rotation={rotation}
          object={gltf.scene}
        />
      </PhysicsWrapper>

      {/* Quest indicator */}
      {hasQuests && gltf.height && (
        <group scale={scale} rotation={rotation} position={position}>
          <Html
            distanceFactor={15}
            center
            position={[0, gltf.height * (showInteractionMenu ? 0.5 : 1.3), 0]}
            zIndexRange={[0, 0]}
            occlude
            prepend
          >
            <div className="flex flex-col items-center gap-2">
              {/* Pixel-art sprite style quest indicator */}
              <div
                className={cn("flex gap-4 w-full justify-center", {
                  hidden: showInteractionMenu,
                })}
              >
                {/* Pixelated quest icon */}
                <div
                  className="relative group flex justify-center items-center w-10 h-10 bg-yellow-500 border-[3px] border-b-[4px] border-r-[4px] border-yellow-700 hover:border-yellow-600 shadow-md hover:shadow-yellow-400/50 transition-all duration-200 cursor-pointer"
                  style={{
                    imageRendering: "pixelated",
                    transform: "scale(1)",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.2)",
                  }}
                >
                  <span
                    className="text-black font-bold text-xl"
                    style={{ fontFamily: "monospace" }}
                  >
                    !
                  </span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      )}
    </Suspense>
  );
}
