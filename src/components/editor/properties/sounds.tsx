import { useState } from "react";
import {
  Volume2,
  Minimize,
  Maximize,
  Play,
  Pause,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../../UI/input";
import { Slider } from "../../UI/slider";
import toast from "react-hot-toast";
import { useEditorStore } from "../../../stores/editorStore";

export function SoundPanel() {
  const [expanded, setExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  // Get state from the store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const updateObject = useEditorStore((state) => state.updateObject);

  // Get the current scene and selected object
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find(
    (obj) => obj.id === selectedObjectId
  );

  // If no scene or no selected object, don't render
  if (!currentScene || !selectedObject) return null;

  // Get sound URL and volume from the object or use defaults
  const soundUrl = selectedObject.interactionSound || "";
  const soundVolume = 1;

  // Handle sound URL change
  const handleSoundUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentScene.id) {
      updateObject(currentScene.id, selectedObject.id, {
        interactionSound: e.target.value,
      });
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number) => {
    if (currentScene.id) {
      // Update current audio element volume if it exists
      if (audioElement) {
        audioElement.volume = value;
      }
    }
  };

  // Play/pause sound
  const toggleSound = () => {
    if (!soundUrl) {
      toast.error("No sound URL provided");
      return;
    }

    if (isPlaying && audioElement) {
      // Stop playback
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
      setAudioElement(null);
    } else {
      // Start playback
      const audio = new Audio(soundUrl);
      audio.volume = soundVolume;

      audio.onended = () => {
        setIsPlaying(false);
        setAudioElement(null);
      };

      audio.onerror = () => {
        toast.error("Failed to play sound. Check the URL.");
        setIsPlaying(false);
        setAudioElement(null);
      };

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioElement(audio);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play sound. Check the URL.");
        });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !audioElement.muted;
      // Force a re-render
      setAudioElement({ ...audioElement } as HTMLAudioElement);
    }
  };

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-3 pt-1 border-t border-slate-700/30 space-y-3"
        >
          {/* Sound URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">
                Interaction Sound URL
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={toggleSound}
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
                    onClick={toggleMute}
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
              value={soundUrl}
              onChange={handleSoundUrlChange}
              placeholder="Enter sound URL (MP3, WAV, etc.)"
              className="h-7 text-[11px] bg-slate-900/60"
            />
          </div>

          {/* Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">
                Volume
              </span>
              <span className="text-[10px] text-slate-400">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[soundVolume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(values) => handleVolumeChange(values[0])}
              className="mt-1"
            />
          </div>

          {/* Helper Text */}
          <div className="text-[9px] text-slate-400 italic">
            This sound will play when the player interacts with this object.
          </div>
        </motion.div>
      )}
    </div>
  );
}
