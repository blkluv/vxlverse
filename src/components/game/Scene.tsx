import { useEffect } from "react";
import { Environment, Sky } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { GameObject } from "../GameObject";
import { Scene as SceneType } from "../../types";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Player } from "./Player";
import { useSound } from "../../hooks/useSound";

interface SceneProps {
  sceneData?: SceneType;
  isPreview?: boolean;
}

export function Scene({ sceneData, isPreview }: SceneProps) {
  const { scene } = useThree();

  const { playSound } = useSound();

  useEffect(() => {
    // playSound("background");
    if (sceneData?.fog) {
      scene.fog = new THREE.Fog(
        sceneData.fog.color,
        sceneData.fog.near || 1,
        sceneData.fog.far || 100
      );
    } else {
      scene.fog = null;
    }
  }, [sceneData?.fog, scene]);

  if (!sceneData) return null;

  return (
    <>
      {sceneData.environment && (
        <Environment
          preset={sceneData.environment as any}
          background={sceneData.background === "environment"}
        />
      )}

      <ambientLight intensity={sceneData.ambientLight || 0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Physics debug={false}>
        {/* Ground */}
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </RigidBody>

        {!isPreview && <Player />}

        {/* Scene Objects */}
        {sceneData.objects.map((object) => (
          <GameObject
            key={object.id}
            modelUrl={object.modelUrl}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            isSelected={false}
            quests={object.quests}
            thumbnail={object.modelUrl
              .replace("scene_", "thumbnail_")
              .replace(".glb", ".webp")}
          />
        ))}
      </Physics>
    </>
  );
}
