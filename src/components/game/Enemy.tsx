import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { Enemy as EnemyType } from "../../types";
import { useEnemyStore } from "../../stores/enemyStore";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { Vector3 } from "three";
import { AnimatePresence } from "framer-motion";

interface DamageNumber {
  id: string;
  value: number;
  position: { x: number; y: number; z: number };
}

export function Enemy({ enemy }: { enemy: EnemyType }) {
  const { scene, animations } = useGLTF(enemy.model);
  const ref = useRef<any>();
  const damageEnemy = useEnemyStore((state) => state.damageEnemy);
  const dyingEnemies = useEnemyStore((state) => state.dyingEnemies);
  const playerDamage = useGameStore((state) => state.playerStats.damage);
  const { playSound } = useSound();
  const isDying = dyingEnemies.includes(enemy.id);
  const [isNearby, setIsNearby] = useState(false);
  const { camera } = useThree();
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [canAttack, setCanAttack] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [damagePos, setDamagePos] = useState({ x: 0, y: 0 });
  const [showLowEnergyMsg, setShowLowEnergyMsg] = useState(false);

  // Animation setup
  const { actions } = useAnimations(animations, ref);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  // Start idle animation on spawn
  useEffect(() => {
    if (actions) {
      const availableAnimations = Object.keys(actions);

      const idleAnim = availableAnimations.find(
        (name) =>
          name.toLowerCase().includes("idle") ||
          name.toLowerCase().includes("breathing") ||
          name.toLowerCase().includes("armature|mixamo")
      );

      if (idleAnim) {
        actions[idleAnim].reset().play();
        setCurrentAnimation(idleAnim);
      }
    }
  }, [actions]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (!isNearby) return;

    // Get player stats
    const playerStats = useGameStore.getState().playerStats;
    const currentEnergy = Number(playerStats.energy);

    if (isNaN(currentEnergy) || currentEnergy <= 0) {
      // Show low energy message
      setShowLowEnergyMsg(true);
      playSound("notAllowed");
      setTimeout(() => setShowLowEnergyMsg(false), 2000);
      return;
    }

    // Calculate damage based on player's damage stat and enemy level
    const playerLevel = playerStats.level;
    const levelDiff = playerLevel - enemy.level;
    const levelMultiplier = 1 + levelDiff * 0.1; // 10% more/less damage per level difference

    const baseDamage = playerDamage * levelMultiplier;
    const minDamage = Math.floor(baseDamage * 0.8); // 80% of base damage
    const maxDamage = Math.floor(baseDamage * 1.2); // 120% of base damage
    const damage =
      Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;

    // Create single damage number
    const newDamageNumber: DamageNumber = {
      id: Math.random().toString(),
      value: damage,
      position: {
        x: Math.random() * 2 - 1,
        y: Math.random() * 4,
        z: Math.random() * 2 - 1,
      },
    };

    setDamageNumbers((prev) => [...prev, newDamageNumber]);
    setTimeout(() => {
      setDamageNumbers((prev) =>
        prev.filter((d) => d.id !== newDamageNumber.id)
      );
    }, 1000);

    damageEnemy(enemy.id, damage);
    playSound("hit");

    // Check if enemy will die from this hit
    if (enemy.health - damage <= 0) {
      // Consume energy when killing enemy
      const newEnergy = Math.max(0, currentEnergy - 1);
      useGameStore.getState().updatePlayerStats({
        energy: newEnergy,
      });
    }

    // Play hit animation if available
    if (actions) {
      const availableAnimations = Object.keys(actions);
      const hitAnim = availableAnimations.find(
        (name) =>
          name.toLowerCase().includes("hit") ||
          name.toLowerCase().includes("damage") ||
          name.toLowerCase().includes("impact")
      );

      if (hitAnim && currentAnimation !== hitAnim) {
        if (currentAnimation) {
          actions[currentAnimation].fadeOut(0.2);
        }

        actions[hitAnim].reset().fadeIn(0.2).play().setLoop(1, 1);

        setTimeout(() => {
          const idleAnim = availableAnimations.find(
            (name) =>
              name.toLowerCase().includes("idle") ||
              name.toLowerCase().includes("breathing")
          );
          if (idleAnim) {
            actions[hitAnim].fadeOut(0.2);
            actions[idleAnim].reset().fadeIn(0.2).play();
            setCurrentAnimation(idleAnim);
          }
        }, 1000);
      }
    }
  };

  useFrame(() => {
    if (ref.current && camera) {
      // Calculate distance to player
      const enemyPos = new Vector3(
        enemy.position.x,
        enemy.position.y,
        enemy.position.z
      );
      const distance = camera.position.distanceTo(enemyPos);

      // Update UI visibility and attack ability based on distance
      setIsNearby(distance < 15);

      // Make enemy look at player
      const lookAtPos = new Vector3(
        camera.position.x,
        enemy.position.y, // Keep same Y to avoid tilting
        camera.position.z
      );

      const direction = lookAtPos.sub(enemyPos).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      if (ref.current) {
        ref.current.rotation.y = angle;
      }
    }

    if (isDying && ref.current) {
      if (actions) {
        const availableAnimations = Object.keys(actions);
        const deathAnim = availableAnimations.find(
          (name) =>
            name.toLowerCase().includes("death") ||
            name.toLowerCase().includes("die") ||
            name.toLowerCase().includes("fall")
        );

        if (deathAnim && currentAnimation !== "death") {
          if (currentAnimation) {
            actions[currentAnimation].fadeOut(0.2);
          }

          actions[deathAnim].reset().fadeIn(0.2).play().setLoop(1, 1);

          setCurrentAnimation("death");
        }
      }

      ref.current.scale.y *= 0.95;
      ref.current.scale.x *= 0.95;
      ref.current.scale.z *= 0.95;
      ref.current.position.y -= 0.1;
    }
  });

  return (
    <group position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (!isDying) {
            handleClick(e);
          }
        }}
        onPointerOver={() =>
          !isDying && (document.body.style.cursor = "pointer")
        }
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <primitive
          ref={ref}
          object={scene}
          scale={enemy.scale}
          position={[0, 1, 0]}
        />
      </group>

      {!isDying && isNearby && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black/80 px-3  w-32 py-1.5 rounded-lg">
            <div className=" items-center gap-1 mb-1">
              <span className="text-yellow-400 block w-fit text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20">
                Lv.{enemy.level}
              </span>
              <span className="text-white/90 text-xs">{enemy.name}</span>
            </div>

            <div className="relative w-full h-1.5 bg-gray-800/80 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-200"
                style={{
                  width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                }}
              />
            </div>
          </div>
        </Html>
      )}

      {/* Low energy message */}
      {showLowEnergyMsg && (
        <Html position={[0, 2, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              color: "#ff4444",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Not enough energy mate!
          </div>
        </Html>
      )}

      <AnimatePresence>
        {damageNumbers.map((damage) => (
          <Html
            key={damage.id}
            position={[damage.position.x, damage.position.y, damage.position.z]}
            center
          >
            <div
              className="damage-text text-2xl font-bold"
              style={{ whiteSpace: "nowrap" }}
            >
              -{damage.value}
            </div>
          </Html>
        ))}
      </AnimatePresence>
    </group>
  );
}
