import { useEditorStore } from "../stores/editorStore";
import { useGameStore } from "../stores/gameStore";
import { GameHUD } from "../components/game/GameHUD";
import { QuestLog } from "../components/game/QuestLog";
import { Inventory } from "../components/game/Inventory";
import { DialogueModal } from "../components/game/DialogueModal";
import { Canvas } from "@react-three/fiber";
import { Sky, StatsGl } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useEnemyStore } from "../stores/enemyStore";
import { LevelUp, LevelUpModal } from "../components/game/LevelUp";
import { useParams } from "react-router-dom";
import { GameScene } from "../components/game/Scene";
import { Joystick } from "../components/game/Joystick";
import { useGame } from "../hooks/useGame";
import { Quests } from "../components/game/Quests";
import { FloatingReward, Rewards } from "../components/game/Rewards";

export function Game() {
  const { id } = useParams<{ id: string }>();
  const { isLoading } = useGame(id!);
  useGame(id!);

  // Game state management
  const gameState = useGameStore((state) => ({
    currentSceneId: state.currentSceneId,
    setCurrentSceneId: state.setCurrentSceneId,
    showLevelUp: state.showLevelUp,
    inventoryOpen: state.inventoryOpen,
    questLogOpen: state.questLogOpen,
    timeOfDay: state.timeOfDay,
  }));
  // Editor state for scene data
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene =
    scenes.find((scene) => scene.id === gameState.currentSceneId) ?? scenes[0];

  // Enemy rewards state
  const { rewards, clearRewards } = useEnemyStore((state) => ({
    rewards: state.rewards,
    clearRewards: state.clearRewards,
  }));

  // Local UI state
  const [showSceneName, setShowSceneName] = useState(false);

  // Set the current scene ID when the route parameter changes
  useEffect(() => {
    if (id) {
      gameState.setCurrentSceneId(id);
    }
  }, [id, gameState.setCurrentSceneId]);

  useEffect(() => {
    setShowSceneName(true);
    const timeout = setTimeout(() => {
      setShowSceneName(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [gameState.currentSceneId]);

  const getSunPosition = () => {
    switch (gameState.timeOfDay) {
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
      {/* Game UI */}
      <img
        src="/keyControls.png"
        className="z-50 pointer-events-none md:block hidden absolute bottom-0 opacity-40 m-4 w-80 left-0"
        alt=""
      />
      {/* Modals */}
      <LevelUp />
      {/* <Quests /> */}
      <Rewards />
      <div key={gameState.currentSceneId} className="w-full h-full">
        {/* 3D Scene */}
        <img
          className="absolute top-0 m-4 w-20 left-0 z-30"
          src="/icons/large-logo.png"
          alt="VXLverse"
        />
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <GameScene sceneData={currentScene} />
          <Sky sunPosition={getSunPosition() as [number, number, number]} />
        </Canvas>
      </div>
      {!gameState.inventoryOpen &&
        !gameState.questLogOpen &&
        !gameState.showLevelUp && <Joystick />}
      {gameState.inventoryOpen && <Inventory />}
      {gameState.questLogOpen && <QuestLog />}
      <GameHUD />
      {/* <video
        onEnded={(e) => {
          e.currentTarget.remove();
        }}
        className="fixed z-50 top-0 left-0 w-full h-full object-cover"
        src="/video/intro.webm"
        autoPlay
        muted
      /> */}
      <DialogueModal />
    </div>
  );
}
