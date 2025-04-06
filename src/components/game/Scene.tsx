import { Suspense, useEffect } from "react";
import { Box, Environment, Stars } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { GameObject } from "./GameObject";
import { Scene as SceneType } from "../../types";
import { useThree } from "@react-three/fiber";
import { Player } from "./Player";
import { useSound } from "../../hooks/useSound";
import { useEnemyStore } from "../../stores/enemyStore";
import { Enemy } from "./Enemy";
import { Fireball } from "./FireBall";
import { useParams } from "react-router-dom";

interface SceneProps {
  sceneData?: SceneType;
  isPreview?: boolean;
}

export function GameScene({ sceneData }: SceneProps) {
  const { scene } = useThree();
  const { playSound, stopSound } = useSound();
  const enemies = useEnemyStore((state) => state.enemies);
  const startSpawning = useEnemyStore((state) => state.startSpawning);
  const stopSpawning = useEnemyStore((state) => state.stopSpawning);
  const { debug: isPreview } = useParams<{ debug: string }>();
  useEffect(() => {
    stopSound("background");
    playSound("background");
  }, [scene, playSound, stopSound]);

  useEffect(() => {
    if (!sceneData?.farmZone?.enabled) return;
    startSpawning();
    return () => stopSpawning();
  }, [startSpawning, stopSpawning, sceneData?.farmZone?.enabled]);

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
      <Stars />
      <Physics>
        <Fireball />
        <Player />
        {/* Spawn Enemies */}
        <Suspense fallback={null}>
          {enemies.map((enemy, idx) => (
            <Enemy key={enemy.id + idx} enemy={enemy} />
          ))}
        </Suspense>
        {/* Scene Objects */}
        {sceneData.objects
          .filter((object) => object.type !== "boxCollider")
          .map((object) => (
            <GameObject key={object.id} {...object} />
          ))}

        {sceneData.objects
          .filter((object) => object.type === "boxCollider")
          .map((object) => {
            const { position, rotation, scale } = object;
            const { x, y, z } = position;
            const { _x: rx, _y: ry, _z: rz } = rotation;
            const { x: sx, y: sy, z: sz } = scale;
            return (
              <RigidBody
                key={object.id}
                args={[1, 1, 1]}
                position={[x, y, z]}
                rotation={[rx, ry, rz]}
                scale={[sx, sy, sz]}
                type="fixed"
                colliders="cuboid"
              >
                <Box>
                  <meshBasicMaterial wireframe color={"#4080ff"} />
                </Box>
              </RigidBody>
            );
          })}
      </Physics>
    </>
  );
}
