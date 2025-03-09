import { useRef, useState, useEffect } from "react";
import {
  useGLTF,
  useAnimations,
  Ring,
  Text,
  Billboard,
  Html,
  // Removed unused import
} from "@react-three/drei";
import { Enemy as EnemyType } from "../../types";
import { useGameStore } from "../../stores/gameStore";
import { useEnemyStore } from "../../stores/enemyStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSound } from "../../hooks/useSound";

// Helper function to get health bar color based on percentage
function getHealthBarColor(current: number, max: number): string {
  const percentage = current / max;
  if (percentage > 0.6) return "#4CAF50"; // Green
  if (percentage > 0.3) return "#FFC107"; // Yellow/Orange
  return "#F44336"; // Red
}

export function Enemy({ enemy }: { enemy: EnemyType }) {
  // Memoize GLTF loading to prevent unnecessary re-renders
  const { scene, animations } = useGLTF(enemy.model);
  const enemyRef = useRef<any>();
  const materialRef = useRef<THREE.Material>();
  const { currentEnemy, setCurrentEnemy } = useGameStore();
  const { dyingEnemies } = useEnemyStore();
  const { playSound } = useSound();

  const active = currentEnemy === enemy.id;
  const isDying = dyingEnemies.includes(enemy.id);

  // Using only the setter function for animation state management
  const [, setCurrentAnimation] = useState<string | null>(null);
  const [showDamage, setShowDamage] = useState(false);
  const [lastHealth, setLastHealth] = useState(enemy.health);
  const [damageAmount, setDamageAmount] = useState(0);
  const [damagePosition, setDamagePosition] = useState({ x: 0, y: 0 });

  // Animation setup
  const { actions } = useAnimations(animations, enemyRef);

  useEffect(() => {}, []);

  // Check for health changes to show damage numbers
  useEffect(() => {
    if (enemy.health < lastHealth) {
      const damage = lastHealth - enemy.health;
      setDamageAmount(damage);
      setShowDamage(true);

      // Random position for damage number
      setDamagePosition({
        x: (Math.random() - 0.5) * 1.5,
        y: enemy.scale * 2 + Math.random() * 1,
      });

      // Flash the enemy red when taking damage
      if (enemyRef.current) {
        enemyRef.current.traverse((child: any) => {
          if (child.isMesh && child.material) {
            // Store original material if not already stored
            if (!materialRef.current) {
              materialRef.current = child.material.clone();
            }

            // Apply red tint
            child.material.emissive = new THREE.Color(0xff0000);
            child.material.emissiveIntensity = 1;

            // Reset after a short delay
            setTimeout(() => {
              if (child.isMesh && materialRef.current) {
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
              }
            }, 200);
          }
        });
      }

      // Hide damage number after a delay
      setTimeout(() => setShowDamage(false), 1000);
    }
    setLastHealth(enemy.health);
  }, [enemy.health, lastHealth]);

  // Handle animations based on state
  useEffect(() => {
    if (!actions) return;

    // Find appropriate animations
    const idleAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("idle") ||
        name.toLowerCase().includes("breathing") ||
        name.toLowerCase().includes("armature|mixamo")
    );

    const deathAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("death") ||
        name.toLowerCase().includes("dying") ||
        name.toLowerCase().includes("fall")
    );

    const hitAnim = Object.keys(actions).find(
      (name) =>
        name.toLowerCase().includes("hit") ||
        name.toLowerCase().includes("impact") ||
        name.toLowerCase().includes("damage")
    );

    // Reset all animations
    Object.values(actions).forEach((action) => action?.stop());

    // Play appropriate animation based on state
    if (isDying && deathAnim) {
      actions[deathAnim]?.reset().play();
      setCurrentAnimation(deathAnim);
      playSound("hurt");
    } else if (showDamage && hitAnim) {
      actions[hitAnim]?.reset().play().setLoop(THREE.LoopOnce, 1);
      setCurrentAnimation(hitAnim);
    } else if (idleAnim) {
      actions[idleAnim]?.reset().play();
      setCurrentAnimation(idleAnim);
    }
  }, [actions, isDying, showDamage, playSound]);

  // Handle dying animation and scaling down
  // useFrame((_, delta) => {
  //   if (isDying && enemyRef.current) {
  //     // Fade out by scaling down
  //     enemyRef.current.scale.multiplyScalar(0.99);

  //     // Sink into the ground
  //     if (enemyRef.current.position.y > -1) {
  //       enemyRef.current.position.y -= delta * 0.5;
  //     }
  //   }
  // });

  return (
    <group
      userData={{
        type: "enemy",
      }}
      position={[enemy.position.x, enemy.position.y, enemy.position.z]}
    >
      <group
        onClick={(e) => {
          e.stopPropagation();
          setCurrentEnemy(enemy.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        {/* Premium effect - glowing ring under the enemy */}
        {active && (
          <group position={[0, 0.05, 0]}>
            <Ring args={[1.5, 2, 64]} rotation={[-Math.PI / 2, 0, 0]}>
              <meshBasicMaterial
                color={enemy.level > 5 ? "#ff9900" : "#3388ff"}
                transparent
                opacity={0.7}
                toneMapped={false}
              />
            </Ring>

            {/* HTML overlay for enemy info */}
            <Html
              position={[0, enemy.scale * 2.5, 0]}
              center
              distanceFactor={8}
              transform
              sprite
            >
              <div
                style={{
                  width: "200px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "5px",
                  padding: "8px",
                  color: "white",
                  fontFamily: "Arial, sans-serif",
                  textAlign: "center",
                  border:
                    "2px solid " + (enemy.level > 5 ? "#ff9900" : "#3388ff"),
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                  pointerEvents: "none",
                  animation: isDying ? "fadeOut 1s forwards" : "none",
                }}
              >
                {/* Enemy name and level */}
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    textShadow: "1px 1px 2px black",
                  }}
                >
                  {enemy.name}{" "}
                  <span
                    style={{
                      color: enemy.level > 5 ? "#ff9900" : "#3388ff",
                    }}
                  >
                    Lv.{enemy.level}
                  </span>
                </div>

                {/* Health bar with animated background */}
                <div
                  style={{
                    width: "100%",
                    height: "15px",
                    backgroundColor: "#333",
                    backgroundImage:
                      "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
                    backgroundSize: "20px 20px",
                    borderRadius: "3px",
                    overflow: "hidden",
                    position: "relative",
                    marginBottom: "3px",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                      height: "100%",
                      backgroundColor: getHealthBarColor(
                        enemy.health,
                        enemy.maxHealth
                      ),
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0))",
                      transition: "width 0.3s ease-in-out",
                      boxShadow:
                        "0 0 5px " +
                        getHealthBarColor(enemy.health, enemy.maxHealth),
                    }}
                  />
                </div>

                {/* Health text */}
                <div
                  style={{
                    fontSize: "12px",
                    textShadow: "1px 1px 1px black",
                  }}
                >
                  {enemy.health}/{enemy.maxHealth} HP
                </div>

                {/* Status indicator */}
                {isDying && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#F44336",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "3px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                      animation: "fadeIn 0.3s forwards",
                    }}
                  >
                    DEFEATED
                  </div>
                )}

                <style>
                  {`
                    @keyframes fadeOut {
                      from { opacity: 1; }
                      to { opacity: 0; }
                    }
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                      to { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }
                  `}
                </style>
              </div>
            </Html>
          </group>
        )}

        {/* Damage number popup */}
        {showDamage && (
          <Html
            position={[damagePosition.x, damagePosition.y, 0]}
            center
            sprite
          >
            <div
              style={{
                color: "#ff3333",
                fontWeight: "bold",
                fontSize: "18px",
                textShadow:
                  "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black",
                animation: "damageFloat 1s forwards",
                whiteSpace: "nowrap",
              }}
            >
              -{damageAmount}
              <style>
                {`
                  @keyframes damageFloat {
                    0% { opacity: 0; transform: translateY(0) scale(0.5); }
                    20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
                    100% { opacity: 0; transform: translateY(-30px) scale(1); }
                  }
                `}
              </style>
            </div>
          </Html>
        )}

        <primitive
          ref={enemyRef}
          object={scene}
          scale={enemy.scale}
          position={[0, 1, 0]}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}
