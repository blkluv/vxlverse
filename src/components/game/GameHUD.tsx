import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { cn } from "../../lib/utils";

interface GameHUDProps {
  onOpenInventory?: () => void;
  onOpenQuestLog?: () => void;
  onOpenMap?: () => void;
  onOpenCharacterSheet?: () => void;
}

// Minimal progress bar with translucent styling
interface ProgressBarProps {
  label: string;
  icon: React.ReactNode;
  current: number;
  max: number;
  lowPulse?: boolean;
  fromColor?: string;
  toColor?: string;
}

// A pixel-art style progress bar with RPG aesthetics.
function ProgressBar({
  label,
  icon,
  current,
  max,
  lowPulse,
  fromColor = "from-red-700",
  toColor = "to-red-500",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div 
      style={{
        position: "relative",
        width: "100%",
        height: "20px",
        overflow: "hidden",
        backgroundColor: "#1c1917",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "#78350f",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
        imageRendering: "pixelated",
      }}
    >
      <div
        className={cn(
          lowPulse && "animate-pulse"
        )}
        style={{ 
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(to right, ${fromColor.replace("from-", "")} 0%, ${toColor.replace("to-", "")} 100%)`,
          transition: "width 0.3s ease-out",
          borderRight: pct < 100 ? "2px solid #000" : "none",
        }}
      />
      <div 
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          color: "#fef3c7",
          fontSize: "12px",
          fontFamily: "monospace",
          fontWeight: "bold",
          textShadow: "1px 1px 0 #000",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span>
          {Math.floor(current)}/{max}
        </span>
      </div>
    </div>
  );
}

export function GameHUD({
  onOpenInventory,
  onOpenQuestLog,
  onOpenMap,
  onOpenCharacterSheet,
}: GameHUDProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Responsive
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Game store data
  const { health, maxHealth, energy, maxEnergy, xp, xpNeeded, level, money } =
    useGameStore((s) => s.playerStats);
  const activeQuest = useGameStore((s) => s.activeQuest);
  const inventory = useGameStore((s) => s.inventory);
  const gameTime = useGameStore((s) => s.gameTime);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const showLevelUp = useGameStore((s) => s.showLevelUp);
  const setShowLevelUp = useGameStore((s) => s.setShowLevelUp);

  const inventoryCount = inventory.length;

  // Basic time formatting
  const formattedTime = `${String(gameTime.hours).padStart(2, "0")}:${String(
    gameTime.minutes
  ).padStart(2, "0")}`;

  // Low thresholds
  const healthLow = health <= maxHealth * 0.2;
  const energyLow = energy <= maxEnergy * 0.2;
  const xpPct = (xp / xpNeeded) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col text-white">
      {/* LEVEL-UP POPUP */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#1c1917",
              borderStyle: "solid",
              borderWidth: "4px",
              borderColor: "#b45309",
              boxShadow: "0 0 0 2px #78350f, 0 0 10px 2px rgba(217, 119, 6, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.7)",
              padding: "20px",
              maxWidth: "300px",
              width: "90%",
              pointerEvents: "auto",
              imageRendering: "pixelated",
            }}
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ textAlign: "center" }}>
              <div 
                style={{ 
                  fontSize: "48px", 
                  marginBottom: "12px",
                  textShadow: "2px 2px 0 #000",
                }}
              >
                🏆
              </div>
              <h2 
                style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold", 
                  marginBottom: "12px",
                  color: "#fef3c7",
                  fontFamily: "monospace",
                  textShadow: "2px 2px 0 #000",
                }}
              >
                Level Up!
              </h2>
              <p 
                style={{ 
                  fontSize: "16px", 
                  marginBottom: "16px",
                  color: "#e5e7eb",
                  fontFamily: "monospace",
                }}
              >
                You are now level{" "}
                <span style={{ color: "#fcd34d", fontWeight: "bold" }}>{level}</span>
              </p>
              <div 
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.1)", 
                  padding: "12px", 
                  marginBottom: "16px",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#78350f",
                }}
              >
                <p 
                  style={{ 
                    fontWeight: "500", 
                    marginBottom: "8px", 
                    fontSize: "14px",
                    color: "#fef3c7",
                    fontFamily: "monospace",
                  }}
                >
                  Stats increased:
                </p>
                <div 
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "8px", 
                    fontSize: "14px",
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "4px" }}>❤️</span> +20
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "4px" }}>⚡</span> +10
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "4px" }}>⚔️</span> +5
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "4px" }}>🛡️</span> +3
                  </div>
                </div>
              </div>
              <button
                style={{
                  backgroundColor: "#b45309",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#92400e",
                  color: "#fef3c7",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  fontFamily: "monospace",
                  textShadow: "1px 1px 0 #000",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                }}
                onClick={() => setShowLevelUp(false)}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR */}
      <div className="pointer-events-auto bg-black/50 border-b border-gray-700 shadow-sm flex items-center justify-between px-4 py-2">
        {/* Left: Time & Day */}
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <span className="text-base">
            {timeOfDay === "morning" && "🌅"}
            {timeOfDay === "noon" && "☀️"}
            {timeOfDay === "evening" && "🌆"}
            {timeOfDay === "night" && "🌙"}
          </span>
          <span>
            {formattedTime} | Day {gameTime.day}
          </span>
        </div>
        {/* Right: Level & Money */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-yellow-300 flex items-center justify-center text-black text-sm sm:text-base font-extrabold shadow-sm">
            {level}
          </div>
          <div className="flex items-center bg-white/10 rounded-full px-2 py-1 text-sm">
            <span className="mr-1 text-yellow-300">💰</span>
            <span className="font-bold">{money}</span>
          </div>
        </div>
      </div>

      {/* RESOURCE BARS (Health, Energy, XP) */}
      <div className="grid md:grid-cols-1 max-w-96  gap-1 grid-cols-3 mt-2 px-2">
        <ProgressBar
          label="HP"
          icon="❤️"
          current={health}
          max={maxHealth}
          lowPulse={healthLow}
          fromColor="from-red-700"
          toColor="to-red-500"
        />
        <ProgressBar
          label="EN"
          icon="⚡"
          current={energy}
          max={maxEnergy}
          lowPulse={energyLow}
          fromColor="from-blue-700"
          toColor="to-blue-500"
        />
        <ProgressBar
          label="XP"
          icon="✨"
          current={xp}
          max={xpNeeded}
          lowPulse={xpPct >= 90}
          fromColor="from-purple-700"
          toColor="to-indigo-500"
        />
      </div>

      {/* Spacer to allow the center area for the 3D model */}
      <div className="flex-1" />

      {/* BOTTOM BAR */}
      <div className="pointer-events-auto    flex justify-end py-2">
        <div className="flex items-center space-x-3">
          {/* Inventory */}
          <button
            onClick={onOpenInventory}
            className="relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl flex items-center justify-center transition transform hover:scale-105 shadow-sm"
          >
            🎒
            {inventoryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.65rem] rounded-full w-5 h-5 flex items-center justify-center border border-red-400 shadow-sm">
                {inventoryCount}
              </span>
            )}
          </button>

          {/* Quest Log */}
          <button
            onClick={onOpenQuestLog}
            className="relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl flex items-center justify-center transition transform hover:scale-105 shadow-sm"
          >
            📜
            {activeQuest && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[0.65rem] rounded-full w-5 h-5 flex items-center justify-center border border-yellow-400 shadow-sm animate-pulse">
                !
              </span>
            )}
          </button>

          {/* Map */}
          <button
            onClick={onOpenMap}
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xl flex items-center justify-center transition transform hover:scale-105 shadow-sm"
          >
            🗺️
          </button>
        </div>
      </div>
    </div>
  );
}
