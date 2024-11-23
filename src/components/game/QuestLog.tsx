import { useGameStore } from '../../stores/gameStore';
import { Book, X, Trophy, Coins, Heart, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../Portal';

export function QuestLog() {
  const isOpen = useGameStore((state) => state.questLogOpen);
  const setIsOpen = useGameStore((state) => state.setQuestLogOpen);
  const questLog = useGameStore((state) => state.questLog);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);

  if (!isOpen) return null;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95 rounded-xl w-[800px] h-[600px] shadow-xl border border-gray-800/50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Quest Log</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {questLog.active.length} Active
                </span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300">
                  {questLog.completed.length} Completed
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Quest List */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Active Quests */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Active Quests
                </h3>
                {questLog.active.map((quest) => (
                  <motion.button
                    key={quest.id}
                    layoutId={quest.id}
                    onClick={() => {
                      setActiveQuest(quest);
                      setActiveDialogue(0);
                      setIsOpen(false);
                    }}
                    className="w-full p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{quest.title}</h4>
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{quest.description}</p>
                    
                    {/* Requirements */}
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-500 mb-2">Requirements</h5>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                          Level {quest.requirements.level}
                        </span>
                        {quest.requirements.items.map((item, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                            {item.amount}x {item.id}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-100">+{quest.rewards.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-100">+{quest.rewards.money}</span>
                      </div>
                      {quest.rewards.energy > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-red-100">+{quest.rewards.energy}</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Completed Quests */}
              {questLog.completed.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed Quests
                  </h3>
                  {questLog.completed.map((quest) => (
                    <motion.div
                      key={quest.id}
                      layoutId={quest.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-300">{quest.title}</h4>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-sm text-gray-500">{quest.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}