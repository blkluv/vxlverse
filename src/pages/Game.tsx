import { useEditorStore } from "../stores/editorStore";
import { useGameStore } from "../stores/gameStore";
import { GameHUD } from "../components/game/GameHUD";
import { QuestLog } from "../components/game/QuestLog";
import { Inventory } from "../components/game/Inventory";
import { DialogueModal } from "../components/game/DialogueModal";
import { Canvas } from "@react-three/fiber";
import { SceneWrapper } from "../components/SceneWrapper";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnemyStore } from "../stores/enemyStore";
import { EnemyRewardModal } from "../components/game/EnemyReward";
import { LevelUpModal } from "../components/game/LevelUpModal";
import { useParams } from "react-router-dom";
import { GameScene } from "../components/game/Scene";

export function Game() {
  const { id } = useParams();
  const setCurrentSceneId = useGameStore((state) => state.setCurrentSceneId);
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const [showSceneName, setShowSceneName] = useState(false);
  const activeQuest = useGameStore((state) => state.activeQuest);
  const showLevelUp = useGameStore((state) => state.showLevelUp);
  const activeDialogue = useGameStore((state) => state.activeDialogue);
  const inventoryOpen = useGameStore((state) => state.inventoryOpen);
  const questLogOpen = useGameStore((state) => state.questLogOpen);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const rewards = useEnemyStore((state) => state.rewards);
  const clearRewards = useEnemyStore((state) => state.clearRewards);

  useEffect(() => {
    if (id) {
      setCurrentSceneId(id);
    }
  }, [id, setCurrentSceneId]);

  useEffect(() => {
    setShowSceneName(true);
    const timeout = setTimeout(() => {
      setShowSceneName(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [currentSceneId]);

  const getSunPosition = () => {
    switch (timeOfDay) {
      case "morning":
        return [-1, 0.5, 2];
      case "noon":
        return [0, 1, 0];
      case "evening":
        return [1, 0.5, -2];
      case "night":
        return [0, -1, 0];
      default:
        return [0, 1, 0];
    }
  };

  return (
    <div className="w-full h-screen relative select-none">
      <div
        key={currentSceneId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        {/* 3D Scene */}
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <GameScene sceneData={currentScene} />
            <Sky sunPosition={getSunPosition()} />
          </Suspense>
        </Canvas>

        {/* Scene Name Indicator */}
        <AnimatePresence>
          {showSceneName && (
            <div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="bg-black/80 backdrop-blur-sm px-6 py-2 ">
                <h2 className="text-xl font-bold text-white">
                  {currentScene?.name}
                </h2>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Game UI */}
      <GameHUD />

      {/* Modals */}
      {inventoryOpen && <Inventory />}
      {questLogOpen && <QuestLog />}
      {activeQuest && activeDialogue !== null && (
        <DialogueModal quest={activeQuest} dialogueId={activeDialogue} />
      )}
      {/* Reward Modal */}
      {rewards && !showLevelUp && (
        <EnemyRewardModal rewards={rewards} onClose={clearRewards} />
      )}

      {showLevelUp && <LevelUpModal />}
    </div>
  );
}
