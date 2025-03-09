import { useGameStore } from "../../stores/gameStore";

interface GameHUDProps {
  onOpenInventory?: () => void;
  onOpenQuestLog?: () => void;
  onOpenMap?: () => void;
  onOpenCharacterSheet?: () => void;
}

interface ProgressBarProps {
  label: string;
  icon: React.ReactNode;
  current: number;
  max: number;
  lowPulse?: boolean;
  fromColor?: string;
  toColor?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
};

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

  // Map Tailwind gradient classes to hex colors
  const colorMap: Record<string, string> = {
    "from-red-700": "#b91c1c",
    "to-red-500": "#ef4444",
    "from-blue-700": "#1d4ed8",
    "to-blue-500": "#3b82f6",
    "from-purple-700": "#7e22ce",
    "to-indigo-500": "#6366f1",
  };

  const fromColorValue = colorMap[fromColor] || fromColor;
  const toColorValue = colorMap[toColor] || toColor;

  return (
    <div className="relative w-full h-6 overflow-hidden mb-2 group">
      {/* Bar background with pixel art border */}
      <div className="absolute inset-0 bg-stone-950 border-2 border-amber-950 rounded-sm">
        {/* Highlight effect on top edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-amber-700/30"></div>
      </div>

      {/* Progress fill */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
          lowPulse ? "animate-pulse" : ""
        }`}
        style={{
          width: `${pct}%`,
          background: `linear-gradient(to right, ${fromColorValue} 0%, ${toColorValue} 100%)`,
          borderRight: pct < 100 ? "2px solid rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Inner highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20"></div>
      </div>

      {/* Pixelated overlay pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      ></div>

      {/* Text content */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold font-mono text-amber-100 [text-shadow:1px_1px_0_#000]">
        <div className="flex items-center gap-1.5 z-10">
          <span className="text-base">{icon}</span>
          <span>{label}</span>
        </div>
        <span className="z-10 tracking-wide">
          {formatNumber(Math.floor(current))}/{formatNumber(max)}
        </span>
      </div>
    </div>
  );
}

interface HUDButtonProps {
  icon: React.ReactNode;
  count?: number;
  onClick?: () => void;
  pulse?: boolean;
  tooltip?: string;
}

const HUDButton = ({
  icon,
  count,
  onClick,
  pulse = false,
  tooltip,
}: HUDButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative w-10 h-10 bg-stone-900 border-2 border-t-amber-700 border-l-amber-700 border-b-amber-900 border-r-amber-900 text-amber-100 text-lg flex items-center justify-center cursor-pointer shadow-md rendering-pixelated transition-all duration-100 hover:brightness-125 hover:scale-105 active:translate-y-0.5 active:shadow-sm"
      title={tooltip}
    >
      <div className="text-xl group-hover:animate-bounce-once">{icon}</div>

      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-red-600 to-red-800 text-white text-[10px] w-5 h-5 flex items-center justify-center border border-red-400 shadow-sm font-mono font-bold rounded-full">
          {count}
        </span>
      )}

      {pulse && (
        <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-500 to-amber-700 text-white text-[10px] w-5 h-5 flex items-center justify-center border border-amber-300 shadow-sm font-mono font-bold animate-pulse rounded-full">
          !
        </span>
      )}

      {/* Pixel art highlight effect */}
      <div className="absolute inset-0 border border-amber-300/20 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </button>
  );
};

export function GameHUD({
  onOpenInventory,
  onOpenQuestLog,
  onOpenMap,
}: GameHUDProps) {
  const { inventory, playerStats, gameTime, timeOfDay, activeQuest } =
    useGameStore();
  const { health, maxHealth, energy, maxEnergy, xp, xpNeeded, level, money } =
    playerStats;

  const inventoryCount = inventory.length;
  const formattedTime = `${String(gameTime.hours).padStart(2, "0")}:${String(
    gameTime.minutes
  ).padStart(2, "0")}`;

  const healthLow = health <= maxHealth * 0.2;
  const xpPct = (xp / xpNeeded) * 100;

  return (
    <div className="fixed inset-0 flex flex-col pointer-events-none text-white">
      {/* Top Bar */}
      <div className="pointer-events-auto bg-stone-950 border-b-2 border-amber-800 flex items-center justify-between px-3 py-2 shadow-md rendering-pixelated">
        {/* Top bar highlight effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-amber-500/20"></div>
        {/* Time & Day */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-100 [text-shadow:1px_1px_0_#000] bg-amber-950/50 px-2 py-1 rounded-sm border border-amber-900/50">
          <span className="text-lg">
            {timeOfDay === "morning" && "🌅"}
            {timeOfDay === "noon" && "☀️"}
            {timeOfDay === "evening" && "🌆"}
            {timeOfDay === "night" && "🌙"}
          </span>
          <span>
            {formattedTime} | Day {gameTime.day}
          </span>
        </div>

        {/* HUD Buttons */}
        <div className="flex items-center gap-2">
          <HUDButton
            icon="🎒"
            count={inventoryCount}
            onClick={onOpenInventory}
            tooltip="Inventory"
          />
          <HUDButton
            icon="📜"
            onClick={onOpenQuestLog}
            pulse={!!activeQuest}
            tooltip="Quest Log"
          />
          <HUDButton icon="🗺️" onClick={onOpenMap} tooltip="Map" />
          <HUDButton icon="💰" onClick={() => {}} tooltip="Shop" />
        </div>
      </div>
    </div>
  );
}
