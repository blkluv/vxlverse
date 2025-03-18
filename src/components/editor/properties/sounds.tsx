import { useState } from "react";
import { Volume2, Minimize, Maximize, Play, Pause, VolumeX } from "lucide-react";
import { Input } from "../../UI/input";
import { Slider } from "../../UI/slider";

export function SoundPanel() {
  const [expanded, setExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 overflow-hidden">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
          Sound
        </h3>
        {expanded ? (
          <Minimize className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="p-3 pt-1 border-t border-slate-700/30 space-y-3">
          {/* Sound URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">
                Interaction Sound URL
              </span>
              <div className="flex space-x-1">
                <button
                  className="w-5 h-5 flex items-center justify-center  bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors"
                  title={isPlaying ? "Stop" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <Play className="w-3 h-3 text-cyan-400" />
                  )}
                </button>
                {isPlaying && (
                  <button
                    className="w-5 h-5 flex items-center justify-center  bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30 hover:from-slate-500/30 hover:to-slate-600/30 transition-colors"
                    title="Mute/Unmute"
                  >
                    {audioElement?.muted ? (
                      <VolumeX className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <Input
              placeholder="Enter sound URL (MP3, WAV, etc.)"
              className="h-7 text-[11px] bg-slate-900/60"
            />
          </div>

          {/* Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">Volume</span>
              <span className="text-[10px] text-slate-400">{Math.round(100)}%</span>
            </div>
            <Slider value={[0.5]} min={0} max={1} step={0.01} className="mt-1" />
          </div>

          {/* Helper Text */}
          <div className="text-[9px] text-slate-400 italic">
            This sound will play when the player interacts with this object.
          </div>
        </div>
      )}
    </div>
  );
}
