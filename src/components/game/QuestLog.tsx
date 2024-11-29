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
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95 rounded-xl w-full md:w-[900px] h-[85vh] md:h-[600px] shadow-xl border border-amber-500/20 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Book className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Quest Log</h2>
                <div className="flex items-center gap-2 md:gap-3 mt-1">
                  <span className="text-xs md:text-sm px-1.5 md:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    {questLog.active.length} Active
                  </span>
                  <span className="text-xs md:text-sm px-1.5 md:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                    {questLog.completed.length} Completed
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
          </div>

          {/* Quest List */}
          <div className="flex-1 p-3 md:p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6 md:space-y-8">
              {/* Active Quests */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-xs md:text-sm font-medium text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Active Quests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {questLog.active.map((quest) => (
                    <motion.button
                      key={quest.id}
                      layoutId={quest.id}
                      onClick={() => {
                        setActiveQuest(quest);
                        setActiveDialogue(0);
                        setIsOpen(false);
                      }}
                      className="w-full p-3 md:p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900
                               rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <h4 className="font-medium text-amber-300 text-sm md:text-base">
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 text-amber-400">
                          <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm">
                            +{quest.rewards.xp} XP
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-3">
                        {quest.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {quest.rewards.items?.map((itemId) => {
                          const item = getItemDetails(itemId);
                          if (!item) return null;
                          return (
                            <div
                              key={itemId}
                              className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs md:text-sm"
                            >
                              <Package className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              {item.name}
                            </div>
                          );
                        })}
                        {quest.rewards.money && (
                          <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs md:text-sm">
                            <Coins className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            {quest.rewards.money} coins
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Completed Quests */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-xs md:text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Completed Quests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {questLog.completed.map((quest) => (
                    <div
                      key={quest.id}
                      className="w-full p-3 md:p-4 bg-gradient-to-br from-gray-800/20 to-gray-900/20
                               rounded-xl border border-emerald-500/20"
                    >
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <h4 className="font-medium text-emerald-300 text-sm md:text-base">
                          {quest.title}
                        </h4>
                        <Trophy className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                        {quest.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}
