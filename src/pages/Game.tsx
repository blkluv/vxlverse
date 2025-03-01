import { useEditorStore } from "../stores/editorStore";
import { useGameStore } from "../stores/gameStore";
import { GameHUD } from "../components/game/GameHUD";
import { QuestLog } from "../components/game/QuestLog";
import { Inventory } from "../components/game/Inventory";
import { DialogueModal } from "../components/game/DialogueModal";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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

  // Test function to add a standalone dialogue
  const addTestDialogue = useGameStore((state) => state.addDialogue);
  const setActiveDialogueId = useGameStore((state) => state.setActiveDialogue);
  const startAIDialogue = useGameStore((state) => state.startAIDialogue);

  // Add test dialogue and NPCs when the game loads
  useEffect(() => {
    // Create a test dialogue
    const testDialogue = {
      id: 9999,
      speaker: "Guide",
      text: "Welcome to VXLverse! This is a standalone dialogue that doesn't require an active quest.",
      choices: [
        {
          text: "Tell me more about this world",
          nextDialogue: 10000,
        },
        {
          text: "I'd like to talk to an NPC",
          nextDialogue: 10001,
        },
        {
          text: "I'm ready to explore",
          nextDialogue: null,
        },
      ],
    };

    const followUpDialogue = {
      id: 10000,
      speaker: "Guide",
      text: "VXLverse is a 3D world where you can complete quests, fight enemies, and explore different scenes. The world is yours to discover!",
      choices: [
        {
          text: "Thanks for the information",
          nextDialogue: null,
        },
      ],
    };
    
    // NPC selection dialogue
    const npcSelectionDialogue = {
      id: 10001,
      speaker: "Guide",
      text: "There are several interesting characters you can speak with. Who would you like to meet?",
      choices: [
        {
          text: "Elara, the Crystal Guardian Scholar",
          nextDialogue: null,
          action: {
            type: "custom",
            params: {
              callback: () => {
                startAIDialogue("Elara", "I am Elara, a scholar of the Crystal Guardians. I study the ancient texts that speak of the Crystal of Balance and its fragments. What knowledge do you seek, traveler?");
              }
            }
          }
        },
        {
          text: "Thorne, the Iron Crown Captain",
          nextDialogue: null,
          action: {
            type: "custom",
            params: {
              callback: () => {
                startAIDialogue("Captain Thorne", "*eyes you suspiciously* I am Captain Thorne of the Iron Crown. We maintain order in these chaotic times. State your business quickly, stranger.");
              }
            }
          }
        },
        {
          text: "Willow, the Whispering Circle Druid",
          nextDialogue: null,
          action: {
            type: "custom",
            params: {
              callback: () => {
                startAIDialogue("Willow", "*smiles gently* The forest welcomes you, traveler. I am Willow of the Whispering Circle. The ancient trees have whispered of your coming.");
              }
            }
          }
        },
        {
          text: "Old Grimble, the Village Merchant",
          nextDialogue: null,
          action: {
            type: "custom",
            params: {
              callback: () => {
                startAIDialogue("Old Grimble", "Ah, a new face! Welcome to my humble shop. Got all sorts of odds and ends for sale. What can Old Grimble get for ya today?");
              }
            }
          }
        },
      ],
    };

    // Add dialogues to the game store
    addTestDialogue(testDialogue);
    addTestDialogue(followUpDialogue);
    addTestDialogue(npcSelectionDialogue);

    // Activate the dialogue after a short delay
    const timer = setTimeout(() => {
      setActiveDialogueId(9999);
    }, 1000);

    return () => clearTimeout(timer);
  }, [addTestDialogue, setActiveDialogueId, startAIDialogue]);

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
            <Sky sunPosition={getSunPosition() as [number, number, number]} />
          </Suspense>
        </Canvas>

        {/* Scene Name Indicator */}
        <AnimatePresence>
          {showSceneName && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
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
      <DialogueModal />
      {/* Reward Modal */}
      {rewards && !showLevelUp && (
        <EnemyRewardModal rewards={rewards} onClose={clearRewards} />
      )}

      {showLevelUp && <LevelUpModal />}
    </div>
  );
}
