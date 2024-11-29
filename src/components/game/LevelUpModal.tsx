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
      <div className="fixed flex justify-center inset-0 pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed top-4 w-full max-w-lg bg-black/95 backdrop-blur-md rounded-2xl border border-yellow-500/20 p-3 md:p-4 shadow-xl pointer-events-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-base md:text-lg font-bold text-yellow-300"
                >
                  Level Up!
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-xs md:text-sm text-yellow-500/70"
                >
                  You've reached level {newLevel}
                </motion.div>
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-gray-800" />
            <div className="md:hidden h-px w-full bg-gray-800" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              {/* Level Increase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 border border-yellow-500/30 w-full md:w-auto"
              >
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-yellow-200">
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
                className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-2 border border-red-500/30 w-full md:w-auto"
              >
                <Sword className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-red-200">
                    Damage
                  </span>
                  <span className="text-xs text-red-400">
                    +5 (New Total: {playerStats.damage})
                  </span>
                </div>
              </motion.div>

              {/* Health Increase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="flex items-center gap-2 bg-green-500/20 rounded-lg px-3 py-2 border border-green-500/30 w-full md:w-auto"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-medium text-green-200">
                    Health
                  </span>
                  <span className="text-xs text-green-400">
                    +{healthIncrease} (New Total: {playerStats.health})
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
