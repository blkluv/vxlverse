import { Coins } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { Link } from "react-router-dom";

export function GameHUD() {
  const { playSound } = useSound();
  const { gameTime, timeOfDay, playerStats, setQuestLogOpen, setMapOpen, setInventoryOpen } =
    useGameStore();

  const formatTime = () => {
    const hours = String(gameTime.hours).padStart(2, "0");
    const minutes = String(gameTime.minutes).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed top-2 right-2 z-[9999] flex flex-col gap-1.5">
      {/* Top row with time and money */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] tracking-wider">
        <div className="bg-[#2A2A2A] px-2.5 py-1 border-2 border-[#4A4A4A] sm flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black">
          <span className="text-[#7FE4FF] border-r-2 pr-2 border-[#4A4A4A] uppercase font-bold tracking-wide">
            {timeOfDay}
          </span>
          <span className="text-[#7FE4FF] font-bold tracking-wide">{formatTime()}</span>
        </div>
        <div className="bg-[#2A2A2A] px-2.5 py-1 border-2 border-[#4A4A4A] sm flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black">
          <Coins size={15} className="text-[#FFD700]" />
          <span className="text-[#FFD700] tabular-nums font-bold tracking-wide">
            {playerStats.money ?? 200020}
          </span>
        </div>
      </div>

      {/* Bottom row with buttons */}
      <div className="flex text-xs justify-end gap-1.5">
        <Link to="/">
          <button
            onClick={() => {
              playSound("select");
              setMapOpen(true);
            }}
            className="relative z-[9999] bg-[#2A2A2A] p-1.5 border-2 border-[#4A4A4A] sm shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black hover:bg-[#3A3A3A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            <span className="text-[#7FE4FF] font-bold">🏠</span>
          </button>
        </Link>
        <button
          onClick={() => {
            playSound("select");
            setQuestLogOpen(true);
          }}
          className="relative z-[9999] bg-[#2A2A2A] p-1.5 border-2 border-[#4A4A4A] sm shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black hover:bg-[#3A3A3A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <span className="text-[#7FE4FF] font-bold">📋</span>
        </button>

        <button
          onClick={() => {
            playSound("select");
            setInventoryOpen(true);
          }}
          className="relative z-[9999] bg-[#2A2A2A] p-1.5 border-2 border-[#4A4A4A] sm shadow-[2px_2px_0px_0px_#000000] outline outline-1 outline-black hover:bg-[#3A3A3A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <span className="text-[#7FE4FF] font-bold">📦</span>
        </button>
      </div>
    </div>
  );
}
