import { Suspense, useEffect, useRef, useState } from "react";
import { Environment, Sky } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { GameObject } from "../GameObjectWrapper";
import { Scene as SceneType } from "../../types";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Player } from "./Player";
import { useSound } from "../../hooks/useSound";
import { useEnemyStore } from "../../stores/enemyStore";
import { Enemy } from "./Enemy";
import { EnemyRewardModal } from "./EnemyReward";
import { useGame } from "ecctrl";

interface SceneProps {
  sceneData?: SceneType;
  isPreview?: boolean;
}

function Floor() {
  const setMoveToPoint = useGame((state) => state.setMoveToPoint);
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);
  const [targetPoint, setTargetPoint] = useState<THREE.Vector3 | null>(null);
  const indicatorRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef<THREE.Mesh>(null);

  // Animation for target point
  useEffect(() => {
    if (targetRef.current) {
      const animate = () => {
        if (targetRef.current) {
          targetRef.current.rotation.z += 0.02;
        }
      };

      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [targetPoint]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            const point = e.point.clone().add(new THREE.Vector3(0, 0.01, 0));
            setMoveToPoint(point);
            setTargetPoint(point);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            setHoverPoint(e.point.add(new THREE.Vector3(0, 0.01, 0)));
          }}
          onPointerLeave={() => setHoverPoint(null)}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </RigidBody>

      {/* Hover Point Indicator */}
      {hoverPoint && (
        <mesh
          ref={indicatorRef}
          position={hoverPoint}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
          <mesh position={[0, 0.01, 0]}>
            <circleGeometry args={[0.1, 32]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        </mesh>
      )}

      {/* Target Point Indicator */}
      {targetPoint && (
        <group position={targetPoint}>
          {/* Outer rotating ring */}
          <mesh ref={targetRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} />
          </mesh>

          {/* Inner static elements */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.3, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.6} />
            <mesh position={[0, 0.01, 0]}>
              <circleGeometry args={[0.15, 32]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
          </mesh>

          {/* Pulsing effect */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[
              1 + Math.sin(Date.now() * 0.005) * 0.2,
              1 + Math.sin(Date.now() * 0.005) * 0.2,
              1,
            ]}
          >
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function GameScene({ sceneData, isPreview }: SceneProps) {
  const { scene } = useThree();

  const { playSound } = useSound();

  useEffect(() => {
    playSound("background");
  }, [sceneData?.fog, scene]);

  if (!sceneData) return null;
  const enemies = useEnemyStore((state) => state.enemies);

  const startSpawning = useEnemyStore((state) => state.startSpawning);
  const stopSpawning = useEnemyStore((state) => state.stopSpawning);

  useEffect(() => {
    startSpawning();
    return () => stopSpawning();
  }, [startSpawning, stopSpawning]);

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

      <Physics>
        {/* Ground */}
        <Floor />

        {!isPreview && <Player />}
        {/* Spawn Enemies */}
        <Suspense fallback={null}>
          {enemies.map((enemy) => (
            <Enemy key={enemy.id} enemy={enemy} />
          ))}
        </Suspense>
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
