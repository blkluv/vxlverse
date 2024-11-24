import { useGameStore } from "../../stores/gameStore";
import {
  Book,
  X,
  Trophy,
  Coins,
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "../Portal";
import { GAME_ITEMS } from "../../types";

export function QuestLog() {
  const isOpen = useGameStore((state) => state.questLogOpen);
  const setIsOpen = useGameStore((state) => state.setQuestLogOpen);
  const questLog = useGameStore((state) => state.questLog);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const playerStats = useGameStore((state) => state.playerStats);

  const getItemDetails = (itemId: string) =>
    GAME_ITEMS.find((item) => item.id === itemId);

  if (!isOpen) return null;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95 rounded-xl w-[900px] h-[600px] shadow-xl border border-amber-500/20 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Quest Log</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    {questLog.active.length} Active
                  </span>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                    {questLog.completed.length} Completed
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Quest List */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {/* Active Quests */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Active Quests
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {questLog.active.map((quest) => (
                    <motion.button
                      key={quest.id}
                      layoutId={quest.id}
                      onClick={() => {
                        setActiveQuest(quest);
                        setActiveDialogue(0);
                        setIsOpen(false);
                      }}
                      className="w-full p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900
                               rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-amber-300">
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-2 text-amber-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            +{quest.rewards.xp} XP
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {quest.description}
                      </p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">
                          Requirements
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {quest.requirements.level > 0 && (
                            <span
                              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1
                              ${
                                playerStats.level >= quest.requirements.level
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                                  : "bg-red-500/20 text-red-300 border border-red-500/20"
                              }`}
                            >
                              <Trophy className="w-3 h-3" />
                              Level {quest.requirements.level}
                            </span>
                          )}
                          {quest.requirements.items.map((item, index) => {
                            const itemDetails = getItemDetails(item.id);
                            return (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 border border-gray-700/50 flex items-center gap-1"
                              >
                                <span>{itemDetails?.emoji}</span>
                                {item.amount}x {itemDetails?.name || item.id}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Rewards Preview */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300">
                            +{quest.rewards.xp} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300">
                            +{quest.rewards.money}
                          </span>
                        </div>
                        {quest.rewards.energy > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-red-300">
                              +{quest.rewards.energy}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Completed Quests */}
              {questLog.completed.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed Quests
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {questLog.completed.map((quest) => (
                      <motion.div
                        key={quest.id}
                        layoutId={quest.id}
                        className="p-4 bg-gradient-to-br from-emerald-500/5 to-emerald-700/5 rounded-xl border border-emerald-500/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-emerald-300">
                            {quest.title}
                          </h4>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {quest.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-sm text-emerald-400/70">
                          <Trophy className="w-4 h-4" />
                          <span>+{quest.rewards.xp} XP earned</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}
