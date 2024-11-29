import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useGameStore } from "../stores/gameStore";
import * as THREE from "three";
import { PivotControls } from "@react-three/drei";
import { useSound } from "../hooks/useSound";

import { SkeletonUtils } from "three-stdlib";

// same url multiple GLTF instances
function useGltfMemo(url: string) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

interface GameObjectProps {
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  isSelected: boolean;
  quests?: any[];
  thumbnail?: string;
  onClick?: () => void;
  onTransform?: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3
  ) => void;
}

export function GameObject({
  modelUrl,
  position,
  rotation,
  scale,
  isSelected,
  quests,
  thumbnail,
  onClick,
  onTransform,
}: GameObjectProps) {
  const { scene } = useGltfMemo(modelUrl);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const questLog = useGameStore((state) => state.questLog);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const { playSound } = useSound();
  const isGameMode = window.location.pathname === "/game" || "/";
  const isEditor = window.location.pathname === "/editor";
  const groupRef = useRef<THREE.Group>(null);

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    onClick?.();

    // Prevent multiple clicks while dialog is active
    const activeQuest = useGameStore.getState().activeQuest;
    const activeDialogue = useGameStore.getState().activeDialogue;
    if (activeQuest !== null && activeDialogue !== null) {
      return;
    }

    if (isGameMode) {
      // Check if NPC has quests
      if (quests?.length > 0) {
        // Find the first incomplete quest
        const nextQuest = quests?.find(
          (quest) =>
            !questLog?.active?.find((q) => q.id === quest.id)?.completed &&
            !questLog?.completed?.find((q) => q.id === quest.id)
        );

        if (nextQuest) {
          // Has an incomplete quest - start quest dialogue
          playSound("npcGreeting");
          playSound("questAccept");
          setActiveQuest({ ...nextQuest, thumbnail });
          setActiveDialogue(0);
        } else {
          // All quests completed - just show greeting
          playSound("npcGreeting");
          setActiveQuest({
            id: "greeting",
            title: "Friendly Greeting",
            description: "A friendly chat",
            rewards: {
              xp: 0,
              money: 0,
              energy: 0,
            },
            completion: {
              type: "talk",
              conditions: {
                items: [],
              },
            },
            dialogues: [
              {
                id: 0,
                speaker: "NPC",
                text: "Hello! Thanks for all your help. Have a great day!",
                choices: [
                  {
                    text: "Goodbye!",
                    nextDialogue: null,
                    action: () => {
                      setActiveQuest(null);
                      setActiveDialogue(null);
                    },
                  },
                ],
              },
            ],
          });
          setActiveDialogue(0);
        }
      }
    } else if (!isGameMode && onClick) {
      onClick();
    }
  };

  return (
    <group ref={groupRef}>
      {isSelected ? (
        <PivotControls
          scale={50}
          lineWidth={1.5}
          fixed
          activeAxes={[true, true, true]}
          depthTest={false}
          axisColors={["#ff2060", "#20df80", "#2080ff"]}
          anchor={[0, 0, 0]}
          matrix={new THREE.Matrix4().compose(
            position,
            new THREE.Quaternion().setFromEuler(rotation),
            scale
          )}
          onDrag={(matrix) => {
            if (!onTransform) return;

            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();

            matrix.decompose(position, quaternion, scale);
            const rotation = new THREE.Euler().setFromQuaternion(quaternion);

            onTransform(position, rotation, scale);
          }}
        >
          <primitive
            object={scene}
            onClick={handleClick}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          />
        </PivotControls>
      ) : (
        <group position={position} rotation={rotation} scale={scale}>
          <primitive
            object={scene}
            onClick={handleClick}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          />
        </group>
      )}
    </group>
  );
}
