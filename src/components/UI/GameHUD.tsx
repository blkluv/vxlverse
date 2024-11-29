import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Clock, Coins, Heart, RotateCcw, Trophy } from "lucide-react";

export function GameHUD() {
  const { level, xp, money, energy } = useGameStore(
    (state) => state.playerStats
  );
  const { hours, minutes, day } = useGameStore((state) => state.gameTime);
  const timeOfDay = useGameStore((state) => state.timeOfDay);

  const isDev = window.location.hostname === "localhost";

  // Ensure energy is capped at 100
  const cappedEnergy = Math.min(100, energy);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 p-4 pointer-events-none z-50"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Level {level}</span>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${xp % 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-white">{money}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${cappedEnergy}%` }}
                />
              </div>
              <span className="text-white text-sm">
                {Math.floor(cappedEnergy)}%
              </span>
            </div>

            {isDev && (
              <button
                onClick={() => {
                  localStorage.removeItem("game-storage");
                  window.location.reload();
                }}
                className="flex items-center gap-2 bg-red-900/80 hover:bg-red-800/80 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors pointer-events-auto cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-red-400" />
                <span className="text-white">Reset Game</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-white">
              Day {day} - {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")} ({timeOfDay})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
