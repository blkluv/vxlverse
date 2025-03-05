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
  
  // Convert Tailwind color classes to actual color values
  const getColorValue = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      "from-red-700": "#b91c1c",
      "to-red-500": "#ef4444",
      "from-blue-700": "#1d4ed8",
      "to-blue-500": "#3b82f6",
      "from-purple-700": "#7e22ce",
      "to-indigo-500": "#6366f1"
    };
    return colorMap[colorClass] || colorClass;
  };
  
  const fromColorValue = getColorValue(fromColor);
  const toColorValue = getColorValue(toColor);
  
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
        borderColor: "#92400e #78350f #78350f #92400e",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
        imageRendering: "pixelated",
        marginBottom: "4px"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(to right, ${fromColorValue} 0%, ${toColorValue} 100%)`,
          transition: "width 0.3s ease-out",
          borderRight: pct < 100 ? "2px solid #000" : "none",
          animation: lowPulse ? "pulse 2s infinite" : "none"
        }}
      />
      {/* Pixelated overlay pattern for texture */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          opacity: 0.5
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
              borderImage: "linear-gradient(to bottom right, #b45309, #78350f) 1",
              boxShadow:
                "0 0 0 2px #78350f, 0 0 10px 2px rgba(217, 119, 6, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.7)",
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
                  letterSpacing: "1px",
                  textTransform: "uppercase"
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
                <span style={{ color: "#fcd34d", fontWeight: "bold" }}>
                  {level}
                </span>
              </p>
              <div
                style={{
                  backgroundColor: "#292524",
                  padding: "12px",
                  marginBottom: "16px",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  borderColor: "#92400e #78350f #78350f #92400e",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "14px",
                    color: "#fef3c7",
                    fontFamily: "monospace",
                    textShadow: "1px 1px 0 #000",
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
                    color: "#fef3c7",
                    textShadow: "1px 1px 0 #000",
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
                  borderColor: "#92400e #78350f #78350f #92400e",
                  color: "#fef3c7",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  fontFamily: "monospace",
                  textShadow: "1px 1px 0 #000",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "14px"
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
      <div 
        style={{
          pointerEvents: "auto",
          backgroundColor: "#1c1917",
          borderBottom: "2px solid #78350f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          imageRendering: "pixelated"
        }}
      >
        {/* Left: Time & Day */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#fef3c7",
            textShadow: "1px 1px 0 #000"
          }}
        >
          <span style={{ fontSize: "16px" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div 
            style={{
              width: isMobile ? "28px" : "32px",
              height: isMobile ? "28px" : "32px",
              background: "linear-gradient(to bottom right, #fbbf24, #b45309)",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#92400e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fef3c7",
              fontSize: isMobile ? "12px" : "14px",
              fontFamily: "monospace",
              fontWeight: "bold",
              textShadow: "1px 1px 0 #000",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.3)"
            }}
          >
            {level}
          </div>
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#78350f",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#92400e",
              padding: "4px 8px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#fef3c7",
              textShadow: "1px 1px 0 #000"
            }}
          >
            <span style={{ marginRight: "4px" }}>💰</span>
            <span style={{ fontWeight: "bold" }}>{money}</span>
          </div>
        </div>
      </div>

      {/* RESOURCE BARS (Health, Energy, XP) */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "1fr",
          maxWidth: "384px",
          gap: "4px",
          marginTop: "8px",
          padding: "0 8px"
        }}
      >
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
      <div 
        style={{
          pointerEvents: "auto",
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Inventory */}
          <button
            onClick={onOpenInventory}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              backgroundColor: "#1c1917",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#78350f",
              color: "#fef3c7",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
              imageRendering: "pixelated"
            }}
          >
            🎒
            {inventoryCount > 0 && (
              <span 
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#b91c1c",
                  color: "white",
                  fontSize: "10px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #f87171",
                  boxShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontWeight: "bold"
                }}
              >
                {inventoryCount}
              </span>
            )}
          </button>

          {/* Quest Log */}
          <button
            onClick={onOpenQuestLog}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              backgroundColor: "#1c1917",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#78350f",
              color: "#fef3c7",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
              imageRendering: "pixelated"
            }}
          >
            📜
            {activeQuest && (
              <span 
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#d97706",
                  color: "white",
                  fontSize: "10px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #fbbf24",
                  boxShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  animation: "pulse 2s infinite"
                }}
              >
                !
              </span>
            )}
          </button>

          {/* Map */}
          <button
            onClick={onOpenMap}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#1c1917",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#78350f",
              color: "#fef3c7",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
              imageRendering: "pixelated"
            }}
          >
            🗺️
          </button>
        </div>
      </div>
    </div>
  );
}
