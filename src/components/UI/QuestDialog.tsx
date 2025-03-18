import { useState } from "react";
import { useGameStore, Quest } from "../../stores/gameStore";
import { MessageSquare, XCircle } from "lucide-react";

interface QuestDialogProps {
  quest: Quest;
  onClose: () => void;
}

export function QuestDialog({ quest, onClose }: QuestDialogProps) {
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const playerStats = useGameStore((state) => state.playerStats);
  const updatePlayerStats = useGameStore((state) => state.updatePlayerStats);

  const handleComplete = () => {
    if (quest.rewards) {
      updatePlayerStats({
        xp: playerStats.xp + (quest.rewards.xp || 0),
        money: playerStats.money + (quest.rewards.money || 0),
        energy: Math.min(100, playerStats.energy + (quest.rewards.energy || 0)),
      });
    }
    onClose();
  };

  const canComplete =
    (!quest.requirements.level || playerStats.level >= quest.requirements.level) &&
    (!quest.requirements.energy || playerStats.energy >= quest.requirements.energy) &&
    (!quest.requirements.money || playerStats.money >= quest.requirements.money);

  return (
    <div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="bg-gray-800  max-w-2xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XCircle className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{quest.title}</h2>
          <p className="text-gray-400">{quest.description}</p>
        </div>

        <div className="bg-gray-700  p-4 mb-6">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-blue-400 mt-1" />
            <div>
              <p className="text-sm text-blue-400 mb-1">
                {quest.dialogues[currentDialogue].speaker}
              </p>
              <p className="text-white">{quest.dialogues[currentDialogue].text}</p>
            </div>
          </div>

          {quest.dialogues[currentDialogue].choices && (
            <div className="mt-4 space-y-2">
              {quest.dialogues[currentDialogue].choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (choice.nextDialogue !== undefined) {
                      setCurrentDialogue(choice.nextDialogue);
                    }
                    if (choice.action) {
                      choice.action();
                    }
                  }}
                  className="w-full text-left px-4 py-2  bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Requirements</h3>
            <ul className="space-y-1">
              {quest.requirements.level && (
                <li className="text-sm">Level {quest.requirements.level}</li>
              )}
              {quest.requirements.energy && (
                <li className="text-sm">Energy {quest.requirements.energy}</li>
              )}
              {quest.requirements.money && (
                <li className="text-sm">Money {quest.requirements.money}</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Rewards</h3>
            <ul className="space-y-1">
              {quest.rewards.xp && <li className="text-sm">XP +{quest.rewards.xp}</li>}
              {quest.rewards.money && <li className="text-sm">Money +{quest.rewards.money}</li>}
              {quest.rewards.energy && <li className="text-sm">Energy +{quest.rewards.energy}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`px-4 py-2  ${
              canComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Complete Quest
          </button>
        </div>
      </div>
    </div>
  );
}
