import { MeshWobbleMaterial, Sphere, Trail /*, MeshWobbleMaterial */ } from "@react-three/drei";
import { useGameStore } from "../../stores/gameStore";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useSound } from "../../hooks/useSound";
import { useEnemyStore } from "../../stores/enemyStore";
import { useJoystickControls } from "ecctrl";
import { Vector3 } from "three";

// Define a type for a single fireball
interface FireballData {
  id: string;
  initial: Vector3;
  target: Vector3;
  active: boolean;
}

// Single Fireball component that handles one fireball
function SingleFireball({ data, onHit }: { data: FireballData; onHit: () => void }) {
  const fireBallRef = useRef<RapierRigidBody>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const speed = 50; // Speed of the fireball
  const { playSound } = useSound();
  const gameStore = useGameStore();
  const enemyStore = useEnemyStore();
  const joystick = useJoystickControls();

  // Move the fireball toward the target and animate the sphere
  useFrame(({ clock }) => {
    if (!data.active || !fireBallRef.current) return;

    // Get current position
    const position = fireBallRef.current.translation();

    // Calculate direction vector from current position to target
    const direction = new THREE.Vector3(
      data.target.x - position.x,
      data.target.y - position.y,
      data.target.z - position.z
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

  return (
    <Trail
      width={5}
      color={"#ff2d00"}
      length={2}
      decay={2}
      attenuation={(width) => width * 3}
      local={false} /* This ensures the trail follows world space movement */
    >
      <RigidBody
        ref={fireBallRef}
        type="dynamic"
        colliders="ball"
        gravityScale={-20}
        position={[data.initial.x, data.initial.y, data.initial.z]}
        onCollisionEnter={(e) => {
          joystick.releaseAllButtons();
          playSound("hurt");
          if (gameStore.currentEnemy) {
            enemyStore.damageEnemy(gameStore.currentEnemy, gameStore.playerStats?.damage ?? 1);
          }
          onHit(); // Call the onHit callback to remove this fireball
        }}
      >
        <Sphere ref={sphereRef} args={[0.3, 32, 32]}>
          <MeshWobbleMaterial
            speed={100}
            factor={100}
            color="#ff5500"
            emissive="#ff2200"
            emissiveIntensity={2}
          />
        </Sphere>
      </RigidBody>
    </Trail>
  );
}

// Main Fireball manager component
export function Fireball() {
  const gameStore = useGameStore();
  const { attack } = gameStore;
  const [fireballs, setFireballs] = useState<FireballData[]>([]);

  // When a new attack is initiated, add it to our fireballs array
  useEffect(() => {
    if (attack) {
      setFireballs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9), // Generate a unique ID
          initial: attack.initial,
          target: attack.target,
          active: true,
        },
      ]);

      // Clear the attack in the store so we can accept new attacks
      // but keep our existing fireballs active
      gameStore.setAttack(null);
    }
  }, [attack, gameStore]);
  // Remove a fireball when it hits something
  const handleFireballHit = (id: string) => {
    setFireballs((prev) =>
      prev.map((fireball) => (fireball.id === id ? { ...fireball, active: false } : fireball))
    );

    // Clean up inactive fireballs after a delay
    setTimeout(() => {
      setFireballs((prev) => prev.filter((fireball) => fireball.active));
    }, 100);
  };

  // Render all active fireballs
  return (
    <>
      {fireballs.map((fireball) =>
        fireball.active ? (
          <SingleFireball
            key={fireball.id}
            data={fireball}
            onHit={() => handleFireballHit(fireball.id)}
          />
        ) : null
      )}
    </>
  );
}
