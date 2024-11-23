import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Quest } from "../../types";
import {
  MessageSquare,
  User,
  ChevronRight,
  Trophy,
  Coins,
  Heart,
  XCircle,
  Gift,
  Package,
} from "lucide-react";
import { useState } from "react";
import { GAME_ITEMS } from "../../types";
import { useSound } from "../../hooks/useSound";

interface DialogueModalProps {
  quest: Quest;
  dialogueId: number;
}

export function DialogueModal({ quest, dialogueId }: DialogueModalProps) {
  const dialogue = quest.dialogues[dialogueId];
  const playerStats = useGameStore((state) => state.playerStats);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const hasItem = useGameStore((state) => state.hasItem);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const [showRewards, setShowRewards] = useState(false);
  const { playSound } = useSound();

  const handleChoice = (choiceIndex: number) => {
    playSound("select");
    const choice = dialogue.choices?.[choiceIndex];
    if (!choice) return;

    // Check if this is the last dialogue
    const isLastDialogue =
      choice.nextDialogue === undefined || choice.nextDialogue === null;

    if (isLastDialogue) {
      const canComplete = checkQuestCompletion(quest);
      if (canComplete) {
        playSound("questComplete");

        setShowRewards(true);
      } else {
        // Show "requirements not met" message and close dialogue
        setActiveQuest(null);
        setActiveDialogue(null);
      }
    } else {
      setActiveDialogue(choice.nextDialogue!);
    }
  };

  const handleClaimRewards = () => {
    completeQuest(quest.id);
    setShowRewards(false);
  };

  const checkQuestCompletion = (quest: Quest) => {
    const { conditions } = quest.completion;

    // Check item requirements
    if (
      conditions.items &&
      !conditions.items.every((item) => hasItem(item.id, item.amount))
    ) {
      return false;
    }

    // Check level requirement
    if (
      quest.requirements.level &&
      playerStats.level < quest.requirements.level
    ) {
      return false;
    }

    // Check energy requirement
    if (
      quest.requirements.energy &&
      playerStats.energy < quest.requirements.energy
    ) {
      return false;
    }

    // Check money requirement
    if (
      quest.requirements.money &&
      playerStats.money < quest.requirements.money
    ) {
      return false;
    }

    return true;
  };

  const isLastDialogue = dialogue.choices?.every(
    (choice) =>
      choice.nextDialogue === undefined || choice.nextDialogue === null
  );

  const getMissingRequirements = () => {
    const missing = [];

    if (
      quest.requirements.level &&
      playerStats.level < quest.requirements.level
    ) {
      missing.push(`Level ${quest.requirements.level}`);
    }
    if (
      quest.requirements.energy &&
      playerStats.energy < quest.requirements.energy
    ) {
      missing.push(`${quest.requirements.energy} Energy`);
    }
    if (
      quest.requirements.money &&
      playerStats.money < quest.requirements.money
    ) {
      missing.push(`${quest.requirements.money} Coins`);
    }
    if (quest.completion.conditions.items) {
      quest.completion.conditions.items.forEach((item) => {
        if (!hasItem(item.id, item.amount)) {
          missing.push(`${item.amount}x ${item.id}`);
        }
      });
    }

    return missing;
  };

  const getItemDetails = (itemId: string) =>
    GAME_ITEMS.find((item) => item.id === itemId);

  return (
    <>
      <div className="fixed inset-0 flex items-end justify-center p-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full max-w-4xl pointer-events-auto"
        >
          {/* Speaker Portrait & Name */}
          <div className="flex items-end gap-4 mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg border-4 border-gray-900"
            >
              {dialogue.speaker === "Player" ? (
                <User className="w-10 h-10 text-white" />
              ) : (
                <MessageSquare className="w-10 h-10 text-white" />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-t-xl"
            >
              <h3 className="text-lg font-bold text-blue-400">
                {dialogue.speaker}
              </h3>
            </motion.div>
          </div>

          {/* Dialogue Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl"
          >
            {/* Dialogue Text */}
            <div className="mb-6">
              <p className="text-lg text-gray-100 leading-relaxed">
                {dialogue.text}
              </p>
            </div>

            {/* Quest Info for Last Dialogue */}
            {isLastDialogue && !checkQuestCompletion(quest) && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2">
                      Missing Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {getMissingRequirements().map((req, index) => (
                        <li key={index} className="text-sm text-red-300">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Choices */}
            {dialogue.choices && (
              <div className="space-y-2">
                {dialogue.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.1 },
                    }}
                    whileHover={{ x: 10 }}
                    onClick={() => handleChoice(index)}
                    className="w-full p-4 rounded-xl text-left transition-all flex items-center justify-between group
                      bg-gray-800/50 hover:bg-blue-900/50 text-gray-100"
                  >
                    <span>{choice.text}</span>
                    <ChevronRight className="w-5 h-5 text-blue-400 transform transition-transform group-hover:translate-x-1" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Rewards Modal */}
      <AnimatePresence>
        {showRewards && (
          <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowRewards(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg relative border border-gray-800 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-700 mx-auto flex items-center justify-center mb-4">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-300">
                  Quest Rewards!
                </h2>
                <p className="text-gray-400 mt-2">
                  Claim your rewards for completing "{quest.title}"
                </p>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* XP */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-yellow-400/70">
                        Experience
                      </div>
                      <div className="text-xl font-bold text-yellow-300">
                        +{quest.rewards.xp} XP
                      </div>
                    </div>
                  </div>
                </div>

                {/* Money */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm text-amber-400/70">Money</div>
                      <div className="text-xl font-bold text-amber-300">
                        +{quest.rewards.money}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Energy */}
                {quest.rewards.energy > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm text-red-400/70">Energy</div>
                        <div className="text-xl font-bold text-red-300">
                          +{quest.rewards.energy}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              {quest.rewards.items && quest.rewards.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {quest.rewards.items.map((item, index) => {
                      const details = getItemDetails(item.id);
                      return (
                        <div
                          key={index}
                          className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 flex items-center gap-3"
                        >
                          <div className="text-2xl">{details?.emoji}</div>
                          <div>
                            <div className="font-medium text-gray-200">
                              {details?.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              ×{item.amount}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Claim Button */}
              <button
                onClick={handleClaimRewards}
                className="w-full py-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl font-medium text-white
                         hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Claim Rewards
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
