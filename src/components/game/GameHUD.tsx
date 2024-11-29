import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Map } from "./Map";
import { useSound } from "../../hooks/useSound";
import { useEffect, useState } from "react";
import { LevelUpModal } from "./LevelUpModal";

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
  const { level, xp, xpNeeded, money, energy } = useGameStore(
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

  // Calculate XP progress percentage
  const xpProgress = (xp / xpNeeded) * 100;

  return (
    <>
      {/* Top Left - Level & Health */}
      <div className="fixed top-2 left-2 md:top-4 md:left-4 space-y-1.5 md:space-y-2">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br text-[10px] md:text-xs from-yellow-400 to-yellow-600 flex items-center justify-center font-bold">
              {level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] md:text-xs mb-1">
                <span className="text-yellow-500/70">
                  {xp}/{xpNeeded} XP
                </span>
              </div>
              <div className="h-1.5 md:h-2 bg-black/50 rounded-full overflow-hidden">
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

        {/* Energy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-green-500/20"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-xl md:text-2xl">🔋</div>
            <div className="flex-1">
              <div className="text-[10px] md:text-xs text-green-400 font-medium mb-1">
                Energy {energy}/{100}
              </div>
              <div className="h-1.5 md:h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${(energy / 100) * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(energy / 100) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Right - Money & Time */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-1.5 md:gap-2 flex-col md:flex-row"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-yellow-500/20 flex items-center gap-1.5 md:gap-2">
            <span className="text-lg md:text-xl">💰</span>
            <span className="text-yellow-100 font-medium text-sm md:text-base">{money}</span>
          </div>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-blue-500/20 flex items-center gap-1.5 md:gap-2">
            <span className="text-lg md:text-xl">🕐</span>
            <div className="text-xs md:text-sm">
              <span className="text-blue-100">Day {day}</span>
              <span className="text-gray-500 mx-1 md:mx-2">•</span>
              <span className="text-blue-200">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}
              </span>
              <span className="hidden md:inline text-gray-500 mx-2">•</span>
              <span className="hidden md:inline text-blue-300 capitalize">{timeOfDay}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right - Quick Actions */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Inventory */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInventoryClick}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-xl md:text-2xl">🎒</span>
            {inventory.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 flex items-center justify-center text-[10px] md:text-xs font-bold text-white border-2 border-gray-900">
                {inventory.length}
              </div>
            )}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg whitespace-nowrap">
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
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-xl md:text-2xl">📜</span>
            {questLog.active.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 flex items-center justify-center text-[10px] md:text-xs font-bold text-white border-2 border-gray-900">
                {questLog.active.length}
              </div>
            )}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg whitespace-nowrap">
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
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg relative group"
          >
            <span className="text-xl md:text-2xl">🗺️</span>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg whitespace-nowrap">
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
