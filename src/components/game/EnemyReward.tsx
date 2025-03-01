import { motion } from "framer-motion";
import { Portal } from "../Portal";
import { Trophy, Star } from "lucide-react";
import { GAME_ITEMS } from "../../types";
import { useEffect } from "react";
import { useSound } from "../../hooks/useSound";

interface EnemyRewardModalProps {
  rewards: { itemId: string; amount: number; xp: number };
  onClose: () => void;
}

export function EnemyRewardModal({ rewards, onClose }: EnemyRewardModalProps) {
  const item = GAME_ITEMS.find((i) => i.id === rewards.itemId);
  if (!item) return null;

  const { playSound } = useSound();
  useEffect(() => {
    playSound("loot");
    setTimeout(() => {
      onClose();
    }, 2000);
  }, [item]);
  return (
    <Portal>
      <div className="fixed flex justify-center h-fit inset-0 pointer-events-none px-4">
        <div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mt-4 top-8 w-full max-w-lg bg-black/95 backdrop-blur-md  border border-amber-500/20 p-3 md:p-4 shadow-xl pointer-events-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="w-10 h-10 md:w-12 md:h-12  bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-base md:text-lg font-bold text-amber-300"
                >
                  Enemy Defeated!
                </h2>
                <div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-xs md:text-sm text-amber-500/70"
                >
                  Rewards Collected
                </div>
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-gray-800" />
            <div className="md:hidden h-px w-full bg-gray-800" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              {/* XP Reward */}
              <div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 bg-yellow-500/20  px-3 py-2 border border-yellow-500/30 w-full md:w-auto"
              >
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-yellow-200">
                    Experience
                  </span>
                  <span className="text-xs text-yellow-400">
                    +{rewards.xp} XP
                  </span>
                </div>
              </div>

              {/* Item Reward */}
              <div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center gap-2 bg-gray-800/50  px-3 py-2 border border-gray-700/50 w-full md:w-auto"
              >
                <span className="text-xl md:text-2xl">{item?.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-gray-200">
                    {item?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ×{rewards.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
