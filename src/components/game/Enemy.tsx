import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Enemy as EnemyType } from "../../types";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEnemyStore } from "../../stores/enemyStore";
import { useSound } from "../../hooks/useSound";
import { SkeletonUtils } from "three-stdlib";

// same url multiple GLTF instances
function useGltfMemo(url: string) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

interface EnemyProps {
  enemy: EnemyType;
}

export function Enemy({ enemy }: EnemyProps) {
  const { scene } = useGltfMemo(enemy.model);
  const ref = useRef<any>();
  const damageEnemy = useEnemyStore((state) => state.damageEnemy);
  const dyingEnemies = useEnemyStore((state) => state.dyingEnemies);
  const { playSound } = useSound();
  const isDying = dyingEnemies.includes(enemy.id);

  const handleClick = () => {
    if (isDying) return; // Prevent clicking while dying
    damageEnemy(enemy.id, 10);
    playSound("hit");
  };

  // Death animation
  useFrame((state, delta) => {
    if (isDying && ref.current) {
      ref.current.scale.y *= 0.95;
      ref.current.scale.x *= 0.95;
      ref.current.scale.z *= 0.95;
      ref.current.position.y -= 0.1;
    }
  });

  return (
    <group
      position={[
        enemy.position.x,
        enemy.position.y + enemy.type === "skeleton" ? 2 : 0,
        enemy.position.z,
      ]}
    >
      <primitive
        ref={ref}
        object={scene}
        scale={enemy.scale}
        onClick={handleClick}
        onPointerOver={() =>
          !isDying && (document.body.style.cursor = "pointer")
        }
        onPointerOut={() => (document.body.style.cursor = "default")}
      />

      {/* Enemy UI */}
      {!isDying && (
        <Html position={[0, 3, 0]} center zIndexRange={[0, 0]}>
          <div className="flex z-20 flex-col items-center gap-1">
            {/* Name Tag */}
            <div className="px-3 py-1 bg-black/70 rounded-lg backdrop-blur-sm text-sm font-medium text-white">
              {enemy.name}
              <span className="ml-2 text-xs text-yellow-400">
                Lv. {Math.floor(enemy.xp / 10)}
              </span>
            </div>

            {/* Health Bar */}
            <div className="px-2 py-1.5 bg-black/50 rounded-lg backdrop-blur-sm min-w-[120px]">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-red-400">HP</span>
                <span className="text-gray-300">
                  {enemy.health}/{enemy.maxHealth}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
