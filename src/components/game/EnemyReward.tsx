import { motion } from "framer-motion";
import { Portal } from "../Portal";
import { Trophy, Star } from "lucide-react";
import { GAME_ITEMS } from "../../types";
import { useEffect } from "react";

interface EnemyRewardModalProps {
  rewards: { itemId: string; amount: number; xp: number };
  onClose: () => void;
}

export function EnemyRewardModal({ rewards, onClose }: EnemyRewardModalProps) {
  const item = GAME_ITEMS.find((i) => i.id === rewards.itemId);
  if (!item) return null;

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 2000);
  }, [item]);
  return (
    <Portal>
      <div className="fixed  flex justify-center h-fit inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className=" mt-4 top-8 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-md rounded-2xl border border-amber-500/20 p-4 shadow-xl pointer-events-auto"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-lg font-bold text-amber-300"
                >
                  Enemy Defeated!
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-sm text-amber-500/70"
                >
                  Rewards Collected
                </motion.div>
              </div>
            </div>

            <div className="h-12 w-px bg-gray-800" />

            <div className="flex items-center gap-4">
              {/* XP Reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 border border-yellow-500/30"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-yellow-200">
                    Experience
                  </span>
                  <span className="text-xs text-yellow-400">
                    +{rewards.xp} XP
                  </span>
                </div>
              </motion.div>

              {/* Item Reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50"
              >
                <span className="text-2xl">{item?.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">
                    {item?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ×{rewards.amount}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
