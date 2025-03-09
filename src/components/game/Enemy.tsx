import { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF, useAnimations, Ring, Html } from "@react-three/drei";
import { Enemy as EnemyType } from "../../types";
import { useGameStore } from "../../stores/gameStore";
import { useEnemyStore } from "../../stores/enemyStore";
import * as THREE from "three";
import { useSound } from "../../hooks/useSound";

// Helper function to get health bar color based on percentage
export function getHealthBarColor(current: number, max: number): string {
  const percentage = current / max;
  if (percentage > 0.6) return "#4CAF50"; // Green
  if (percentage > 0.3) return "#FFC107"; // Yellow/Orange
  return "#F44336"; // Red
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

  // Get enemy color based on level
  const getEnemyColor = () => {
    if (enemy.level > 10) return "#ff5500";
    if (enemy.level > 5) return "#ff9900";
    return "#3388ff";
  };

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

            {/* Enhanced health bar */}
            <div className="relative w-[100px]">
              {/* Health bar container */}
              <div className="w-full h-2 p-px bg-black rounded-sm overflow-hidden">
                {/* Health bar fill */}
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                    background: `linear-gradient(to bottom, ${getHealthBarColor(
                      enemy.health,
                      enemy.maxHealth
                    )}, ${getHealthBarColor(enemy.health, enemy.maxHealth)}90)`,
                    boxShadow: `0 0 4px ${getHealthBarColor(
                      enemy.health,
                      enemy.maxHealth
                    )}`,
                  }}
                ></div>

                {/* Tick marks */}
                <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-full w-px bg-black/20"></div>
                  ))}
                </div>
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
            playSound("attack");
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          {/* Selection ring */}
          {active && (
            <Ring
              args={[enemy.scale * 0.8, enemy.scale * 1.2, 32]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.05, 0]}
            >
              <meshBasicMaterial
                color={getEnemyColor()}
                transparent
                opacity={0.7}
                toneMapped={false}
              />
            </Ring>
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
        </group>
      </group>
    </group>
  );
}
