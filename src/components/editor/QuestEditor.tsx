import { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { Plus, Trash2, Edit3, MessageSquare } from "lucide-react";

export function QuestEditor() {
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const scenes = useGameStore((state) => state.scenes);
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  const [editingQuest, setEditingQuest] = useState(null);

  const handleAddQuest = () => {
    const newQuest = {
      id: `quest-${Date.now()}`,
      title: "New Quest",
      description: "Quest description",
      requirements: {
        level: 1,
        energy: 10,
      },
      rewards: {
        xp: 100,
        money: 50,
        energy: 20,
      },
      dialogues: [
        {
          text: "Welcome to this quest!",
          speaker: "Guide",
          choices: [
            {
              text: "Begin quest",
              nextDialogue: 1,
            },
          ],
        },
      ],
      completed: false,
    };
    // Add quest to current scene
  };

  if (!currentScene) {
    return <div className="text-center py-8 text-gray-400">Select a scene to manage quests</div>;
  }

  return (
    <div className="space-y-2">
      {currentScene.quests.map((quest) => (
        <div key={quest.id} className="p-3  bg-gray-700 hover:bg-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{quest.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingQuest(quest)} className="p-1 hover:text-blue-400">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-1 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-400">
            <div>Level {quest.requirements.level} required</div>
            <div>
              Rewards: {quest.rewards.xp} XP, {quest.rewards.money} coins
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddQuest}
        className="w-full py-2 flex items-center justify-center gap-2  bg-gray-700 hover:bg-gray-600"
      >
        <Plus className="w-4 h-4" />
        Add Quest
      </button>
    </div>
  );
}
