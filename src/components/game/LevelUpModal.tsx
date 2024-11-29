import { motion } from "framer-motion";
import { Portal } from "../Portal";
import { Trophy, Star, Heart, Sword, Shield } from "lucide-react";
import { useSound } from "../../hooks/useSound";
import { useGameStore } from "../../stores/gameStore";
import { useEffect } from "react";

export function LevelUpModal({}) {
  const { playSound } = useSound();
  const level = useGameStore((state) => state.playerStats.level);
  const setShowLevelUp = useGameStore((state) => state.setShowLevelUp);
  const oldLevel = level - 1;
  const newLevel = level;
  const healthIncrease = 10;
  const playerStats = useGameStore((state) => state.playerStats);
  useEffect(() => {
    playSound("levelUp");
    setTimeout(() => {
      setShowLevelUp(false);
    }, 3000);
  }, []);
  return (
    <Portal>
      <div className="fixed  flex justify-center inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed top-4 bg-black/95 backdrop-blur-md rounded-2xl border border-yellow-500/20 p-4 shadow-xl pointer-events-auto"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-lg font-bold text-yellow-300"
                >
                  Level Up!
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-sm text-yellow-500/70"
                >
                  You've reached level {newLevel}
                </motion.div>
              </div>
            </div>

            <div className="h-12 w-px bg-gray-800" />

            <div className="flex items-center gap-4">
              {/* Level Increase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 border border-yellow-500/30"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-yellow-200">
                    Level
                  </span>
                  <span className="text-xs text-yellow-400">
                    {oldLevel} →{" "}
                    <span className="text-green-400">{newLevel}</span>
                  </span>
                </div>
              </motion.div>

              {/* Damage Increase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-2 border border-red-500/30"
              >
                <Sword className="w-5 h-5 text-red-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-red-200">
                    Damage
                  </span>
                  <span className="text-xs text-red-400">
                    +5 (New Total: {playerStats.damage})
                  </span>
                </div>
              </motion.div>

              {/* Defense Increase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="flex items-center gap-2 bg-emerald-500/20 rounded-lg px-3 py-2 border border-emerald-500/30"
              >
                <Shield className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-emerald-200">
                    Defense
                  </span>
                  <span className="text-xs text-emerald-400">+1</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
