import { useRef, useState, useEffect, useMemo } from "react";
import {
  useGLTF,
  useAnimations,
  Ring,
  Html,
  Sphere,
  Cylinder,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Enemy as EnemyType } from "../../types";
import { useGameStore } from "../../stores/gameStore";
import { useEnemyStore } from "../../stores/enemyStore";
import * as THREE from "three";
import { useSound } from "../../hooks/useSound";

// Helper function to get health bar color based on percentage
export function getHealthBarColor(current: number, max: number): string {
  const percentage = current / max;
  if (percentage > 0.6) return "#4CAF10"; // Green
  if (percentage > 0.3) return "#FFC107"; // Yellow/Orange
  return "#F44336"; // Red
}

// Pulsing ring component with proper animation
function PulsingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  return (
    <Ring
      args={[1.8, 2.3, 64]}
      position={[0, 0.07, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={ringRef}
    >
      <meshBasicMaterial color={"#ff9900"} transparent toneMapped={false} />
    </Ring>
  );
}

export function Enemy({ enemy }: { enemy: EnemyType }) {
  // Basic setup
  const { scene, animations } = useGLTF(enemy.model);
  const enemyRef = useRef<any>();
  const { currentEnemy, setCurrentEnemy } = useGameStore();
  const { dyingEnemies } = useEnemyStore();
  const { playSound } = useSound();

  // States
  const active = currentEnemy === enemy.id;
  const isDying = dyingEnemies.includes(enemy.id);
  const [showDamage, setShowDamage] = useState(false);
  const [lastHealth, setLastHealth] = useState(enemy.health);
  const [damageAmount, setDamageAmount] = useState(0);

  // Animation setup
  const { actions } = useAnimations(animations, enemyRef);

  // Handle health changes and damage display
  useEffect(() => {
    if (enemy.health < lastHealth) {
      // Show damage
      setDamageAmount(lastHealth - enemy.health);
      setShowDamage(true);

      // Flash red
      if (enemyRef.current) {
        enemyRef.current.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.emissive = new THREE.Color(0xff0000);
            child.material.emissiveIntensity = 1;

            setTimeout(() => {
              if (child.isMesh) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            }, 200);
          }
        });
      }

      // Hide damage number after delay
      setTimeout(() => setShowDamage(false), 1000);
    }
    setLastHealth(enemy.health);
  }, [enemy.health, lastHealth]);

  // Handle animations
  useEffect(() => {
    if (!actions) return;

    // Find animations
    const idleAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("idle") ||
        name.toLowerCase().includes("breathing")
    );

    const deathAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("death") ||
        name.toLowerCase().includes("dying")
    );

    const hitAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("hit") ||
        name.toLowerCase().includes("impact")
    );

    // Stop all animations
    Object.values(actions).forEach((action) => action?.stop());

    // Play appropriate animation
    if (isDying && deathAnim) {
      actions[deathAnim]?.reset().play();
      playSound("hurt");
    } else if (showDamage && hitAnim) {
      actions[hitAnim]?.reset().play().setLoop(THREE.LoopOnce, 1);
    } else if (idleAnim) {
      actions[idleAnim]?.reset().play();
    }
  }, [actions, isDying, showDamage, playSound]);

  const bbox = useMemo(() => new THREE.Box3().setFromObject(scene), [scene]);
  const height = bbox.getSize(new THREE.Vector3()).y;
  return (
    <group>
      {active && (
        <Html
          zIndexRange={[0, 0]}
          occlude
          prepend
          position={[enemy.position.x, height * 1.5, enemy.position.z]}
          center
          sprite
        >
          <div className="pointer-events-none">
            {/* Name with level badge */}
            <div className="flex items-center justify-center mb-1.5 gap-1.5">
              <span
                className="font-bold text-xs tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                style={{
                  textShadow: "0 0 4px black",
                }}
              >
                {enemy.name}
              </span>
            </div>

            {/* Enhanced health bar - styled like Hero component */}
            <div className="w-[80px]">
              {/* Health bar container */}
              <div className="w-full h-2 bg-[#2A2A2A] border border-[#4A4A4A] shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black overflow-hidden">
                {/* Health bar fill */}
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                    backgroundColor: getHealthBarColor(
                      enemy.health,
                      enemy.maxHealth
                    ),
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Html>
      )}
      <group
        position={[enemy.position.x, enemy.position.y, enemy.position.z]}
        userData={{ type: "enemy" }}
      >
        <group
          onClick={(e) => {
            e.stopPropagation();
            setCurrentEnemy(enemy.id);
            playSound("dialogueChoice");
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          {/* Selection indicator */}
          {active && (
            <group>
              {/* Glowing ring on the ground */}
              <Ring
                args={[2.5, 3, 64]}
                position={[0, 0.05, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <meshBasicMaterial
                  color={"#ffcc00"}
                  transparent
                  opacity={0.7}
                  toneMapped={false}
                />
              </Ring>

              {/* Pulsing inner ring */}
              <PulsingRing />

              {/* Subtle vertical light beam */}
              <Cylinder args={[2, 2, height * 2]}>
                <meshBasicMaterial
                  depthWrite={false}
                  color={"#ffcc00"}
                  transparent
                  opacity={0.05}
                  toneMapped={false}
                />
              </Cylinder>
            </group>
          )}
          {/* Enemy model */}
          <primitive
            ref={enemyRef}
            object={scene}
            scale={enemy.scale}
            // position={[0, enemy.scale / 2, 0]}
            castShadow
            receiveShadow
          />
          {/* Health bar - only show when active */}
          {/* Damage number */}
          {showDamage && (
            <Html
              position={[
                (Math.random() - 0.5) * 1.5,
                enemy.scale * 2 + Math.random() * 1,
                0,
              ]}
              center
              sprite
            >
              <div
                style={{
                  color: "#ff3333",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textShadow: "0 0 3px black",
                  animation: "float 1s forwards",
                  whiteSpace: "nowrap",
                }}
              >
                -{damageAmount}
                <style>{`
                @keyframes float {
                  0% { opacity: 0; transform: translateY(0) scale(0.5); }
                  20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
                  100% { opacity: 0; transform: translateY(-30px) scale(1); }
                }
              `}</style>
              </div>
            </Html>
          )}
          BS
        </group>
      </group>
    </group>
  );
}
