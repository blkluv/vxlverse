import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Map } from "./Map";
import { useSound } from "../../hooks/useSound";
import { useEffect } from "react";

const baseXP = 100; // Base XP for the first level
const increment = 50; // Increment factor

// Function to calculate XP required for a given level
function getXPForLevel(level: number) {
  return baseXP + increment * Math.pow(level, 2);
}

// Function to calculate the current level based on total XP
function calculateLevel(totalXP: number) {
  let level = 1;
  let xpForNextLevel = getXPForLevel(level);

  while (totalXP >= xpForNextLevel) {
    level++;
    xpForNextLevel = getXPForLevel(level);
  }

  return level - 1; // Adjust to the correct level
}

export function GameHUD() {
  const { level, xp, money, health, maxHealth } = useGameStore(
    (state) => state.playerStats
  );
  const { hours, minutes, day } = useGameStore((state) => state.gameTime);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const questLog = useGameStore((state) => state.questLog);
  const inventory = useGameStore((state) => state.inventory);
  const setInventoryOpen = useGameStore((state) => state.setInventoryOpen);
  const setQuestLogOpen = useGameStore((state) => state.setQuestLogOpen);
  const mapOpen = useGameStore((state) => state.mapOpen);
  const setMapOpen = useGameStore((state) => state.setMapOpen);
  const { playSound } = useSound();

  const handleInventoryClick = () => {
    playSound("select");
    setInventoryOpen(true);
  };

  const handleQuestLogClick = () => {
    playSound("select");
    setQuestLogOpen(true);
  };

  const handleMapClick = () => {
    playSound("select");
    setMapOpen(true);
  };

  useEffect(() => {
    if (level > 1) playSound("levelUp");
  }, [level]);

  // Calculate XP progress
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpProgress =
    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <>
      {/* Top Left - Level & Health */}
      <div className="fixed top-4 left-4 space-y-2">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br text-xs from-yellow-400 to-yellow-600 flex items-center justify-center  font-bold">
              {level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-yellow-500/70">
                  {Math.max(xp - currentLevelXP, 0)}/
                  {nextLevelXP - currentLevelXP} XP
                </span>
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${xpProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-red-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔋</div>
            <div className="flex-1">
              <div className="text-xs text-green-400 font-medium mb-1">
                Energy {health}/{maxHealth}
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${(health / maxHealth) * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(health / maxHealth) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Right - Money & Time */}
      <div className="fixed top-4 right-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/20 flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="text-yellow-100 font-medium">{money}</span>
          </div>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/20 flex items-center gap-2">
            <span className="text-xl">🕐</span>
            <div className="text-sm">
              <span className="text-blue-100">Day {day}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-blue-200">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}
              </span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-blue-300 capitalize">{timeOfDay}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right - Quick Actions */}
      <div className="fixed bottom-6 right-6">
        <div className="flex items-center gap-4">
          {/* Inventory */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInventoryClick}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-2xl">🎒</span>
            {inventory.length > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900">
                {inventory.length}
              </div>
            )}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                Inventory (I)
              </div>
            </div>
          </motion.button>

          {/* Quest Log */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.1 }}
            onClick={handleQuestLogClick}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-2xl">📜</span>
            {questLog.active.length > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900">
                {questLog.active.length}
              </div>
            )}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                Quest Log (L)
              </div>
            </div>
          </motion.button>

          {/* Map */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMapClick}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-2xl">🗺️</span>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                World Map (M)
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Map Modal */}
      {mapOpen && <Map onClose={() => setMapOpen(false)} />}
    </>
  );
}
