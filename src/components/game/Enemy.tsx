import { useRef, useState, useEffect } from "react";
import {
  useGLTF,
  useAnimations,
  Ring,
  Text,
  Billboard,
} from "@react-three/drei";
import { Enemy as EnemyType } from "../../types";
import { useGameStore } from "../../stores/gameStore";

export function Enemy({ enemy }: { enemy: EnemyType }) {
  // Memoize GLTF loading to prevent unnecessary re-renders
  const { scene, animations } = useGLTF(enemy.model);
  const enemyRef = useRef<any>();
  const { currentEnemy, setCurrentEnemy } = useGameStore();

  const active = currentEnemy === enemy.id;

  const [, setCurrentAnimation] = useState<string | null>(null);

  // Animation setup
  const { actions } = useAnimations(animations, enemyRef);

  useEffect(() => {
    if (actions) {
      const idleAnim = Object.keys(actions).find(
        (name) =>
          name.toLowerCase().includes("idle") ||
          name.toLowerCase().includes("breathing") ||
          name.toLowerCase().includes("armature|mixamo")
      );
      if (idleAnim) {
        actions?.[idleAnim]?.reset().play();
        setCurrentAnimation(idleAnim);
      }
    }
  }, [actions]);

  return (
    <group position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
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
          </group>
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
