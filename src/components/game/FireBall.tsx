import {
  MeshWobbleMaterial,
  Sphere,
  Trail /*, MeshWobbleMaterial */,
} from "@react-three/drei";
import { useGameStore } from "../../stores/gameStore";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useSound } from "../../hooks/useSound";
import { useEnemyStore } from "../../stores/enemyStore";
import { useJoystickControls } from "ecctrl";

export function Fireball() {
  const gameStore = useGameStore();
  const { attack } = gameStore;
  const { playSound } = useSound();
  const enemyStore = useEnemyStore();
  const joystick = useJoystickControls();

  const fireBallRef = useRef<RapierRigidBody>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const speed = 50; // Speed of the fireball

  // Move the fireball toward the target and animate the sphere
  useFrame(({ clock }) => {
    if (!attack || !fireBallRef.current) return;

    // Get current position
    const position = fireBallRef.current.translation();

    // Calculate direction vector from current position to target
    const direction = new THREE.Vector3(
      attack.target.x - position.x,
      attack.target.y - position.y,
      attack.target.z - position.z
    ).normalize();

    // Apply velocity in the direction of the target
    fireBallRef.current.setLinvel(
      {
        x: direction.x * speed,
        y: direction.y * speed,
        z: direction.z * speed,
      },
      true
    );

    // Animate the sphere: pulsate and rotate
    if (sphereRef.current) {
      const pulsate = 1 + Math.sin(clock.elapsedTime * 5) * 0.1;
      sphereRef.current.scale.set(pulsate, pulsate, pulsate);
      sphereRef.current.rotation.y += 0.05;
    }
  });

  // Don't render anything if there's no attack
  if (!attack) return null;

  return (
    <RigidBody
      ref={fireBallRef}
      type="dynamic"
      colliders="ball"
      gravityScale={-20}
      position={[attack.initial.x, attack.initial.y, attack.initial.z]}
      onCollisionEnter={(e) => {
        joystick.releaseAllButtons();
        gameStore.setAttack(null);
        playSound("hurt");
        if (gameStore.currentEnemy)
          enemyStore.damageEnemy(
            gameStore.currentEnemy,
            gameStore.playerStats?.damage ?? 1
          );
      }}
    >
      <Trail
        width={5}
        color={"#ff2d00"}
        length={2}
        decay={2}
        attenuation={(width) => width * 3}
      >
        <Sphere ref={sphereRef} args={[0.3, 32, 32]}>
          {/* Standard material with emissive glow */}
          {/* <meshStandardMaterial
            color="#ff5500"
            emissive="#ff2200"
            emissiveIntensity={2}
            toneMapped={false}
          /> */}
          <MeshWobbleMaterial
            speed={10}
            factor={20.3}
            color="#ff5500"
            emissive="#ff2200"
            emissiveIntensity={2}
            toneMapped={true}
          />
        </Sphere>
      </Trail>
    </RigidBody>
  );
}
