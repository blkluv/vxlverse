import { useState } from "react";
import { Scene } from "../../types";
import {
  Sun,
  Music,
  Cloud,
  ChevronDown,
  ChevronRight,
  Info,
  Palette,
  Volume2,
  Repeat,
  Image,
  Layers,
  Stars,
  Wind,
  Eye,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../UI/input";

const ENVIRONMENT_PRESETS = [
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
] as const;

const BACKGROUND_OPTIONS = [
  { value: "environment", label: "Environment" },
  { value: "sky", label: "Sky" },
  { value: "none", label: "None" },
] as const;

interface SceneSettingsPanelProps {
  scene: Scene;
  onChange: (updates: Partial<Scene>) => void;
}

export function SceneSettingsPanel({
  scene,
  onChange,
}: SceneSettingsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["environment"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3 py-3 px-1">
      {/* Section Header Component */}
      {["environment", "fog", "clouds", "stars", "audio", "info"].map(
        (section) => {
          // Define section config
          const sectionConfig = {
            environment: {
              title: "Environment",
              icon: <Sun className="w-4 h-4 text-amber-400" />,
              color: "amber",
            },
            fog: {
              title: "Fog",
              icon: <Cloud className="w-4 h-4 text-blue-400" />,
              color: "blue",
            },
            clouds: {
              title: "Clouds",
              icon: <Wind className="w-4 h-4 text-blue-400" />,
              color: "blue",
            },
            stars: {
              title: "Stars",
              icon: <Stars className="w-4 h-4 text-purple-400" />,
              color: "purple",
            },
            audio: {
              title: "Background Music",
              icon: <Music className="w-4 h-4 text-green-400" />,
              color: "green",
            },
            info: {
              title: "Scene Information",
              icon: <Info className="w-4 h-4 text-purple-400" />,
              color: "purple",
            },
          };

          const { title, icon, color } =
            sectionConfig[section as keyof typeof sectionConfig];
          const isExpanded = expandedSections.has(section);

          return (
            <div key={section} className=" overflow-hidden bg-slate-800/30">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full py-3 px-4 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  {icon}
                  {title}
                </div>
                <div
                  className={`w-5 h-5  flex items-center justify-center ${
                    isExpanded ? `bg-${color}-500/20` : "bg-slate-700/30"
                  }`}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 border-t border-slate-700/20">
                      {/* Environment Section */}
                      {section === "environment" && (
                        <>
                          {/* Environment Preset */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Image className="w-3.5 h-3.5 text-amber-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Environment Preset
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {ENVIRONMENT_PRESETS.map((preset) => (
                                <button
                                  key={preset}
                                  onClick={() =>
                                    onChange({ environment: preset })
                                  }
                                  className={`px-3 py-2  text-xs capitalize transition-colors ${
                                    scene.environment === preset
                                      ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30"
                                      : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 hover:text-slate-200"
                                  }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Type */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-amber-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Background
                              </label>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {BACKGROUND_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    onChange({ background: option.value })
                                  }
                                  className={`px-3 py-2  text-xs transition-colors ${
                                    scene.background === option.value
                                      ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30"
                                      : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 hover:text-slate-200"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Ambient Light */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Sun className="w-3.5 h-3.5 text-amber-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Ambient Light
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-amber-500/20 text-amber-200 px-2 py-0.5 ">
                                {scene.ambientLight || 0.5}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={scene.ambientLight || 0.5}
                              onChange={(e) =>
                                onChange({
                                  ambientLight: parseFloat(e.target.value),
                                })
                              }
                              className="w-full accent-amber-500"
                            />
                          </div>
                        </>
                      )}

                      {/* Fog Section */}
                      {section === "fog" && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Palette className="w-3.5 h-3.5 text-blue-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Fog Color
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={scene.fog?.color || "#000000"}
                                onChange={(e) =>
                                  onChange({
                                    fog: {
                                      ...scene.fog,
                                      color: e.target.value,
                                    },
                                  })
                                }
                                className="w-8 h-8  border border-slate-700 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={scene.fog?.color || "#000000"}
                                onChange={(e) =>
                                  onChange({
                                    fog: {
                                      ...scene.fog,
                                      color: e.target.value,
                                    },
                                  })
                                }
                                className="flex-1 bg-slate-800 text-xs text-slate-200 px-3 py-2  border border-slate-700 focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-slate-300">
                                  Near
                                </label>
                                <span className="text-xs font-medium bg-blue-500/20 text-blue-200 px-2 py-0.5 ">
                                  {scene.fog?.near || 1}
                                </span>
                              </div>
                              <Input
                                type="range"
                                min="0"
                                max="50"
                                value={scene.fog?.near || 1}
                                onChange={(e) =>
                                  onChange({
                                    fog: {
                                      ...scene.fog,
                                      near: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-slate-300">
                                  Far
                                </label>
                                <span className="text-xs font-medium bg-blue-500/20 text-blue-200 px-2 py-0.5 ">
                                  {scene.fog?.far || 100}
                                </span>
                              </div>
                              <Input
                                type="range"
                                min="50"
                                max="1000"
                                value={scene.fog?.far || 100}
                                onChange={(e) =>
                                  onChange({
                                    fog: {
                                      ...scene.fog,
                                      far: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Clouds Section */}
                      {section === "clouds" && (
                        <>
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 ">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Show Clouds
                              </label>
                            </div>
                            <ToggleSwitch
                              isOn={scene.clouds?.enabled ?? false}
                              onToggle={() =>
                                onChange({
                                  clouds: {
                                    ...scene.clouds,
                                    enabled: !(scene.clouds?.enabled ?? false),
                                    speed: scene.clouds?.speed || 1,
                                    opacity: scene.clouds?.opacity || 0.5,
                                    count: scene.clouds?.count || 20,
                                  },
                                })
                              }
                              color="blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Wind className="w-3.5 h-3.5 text-blue-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Cloud Speed
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-blue-500/20 text-blue-200 px-2 py-0.5 ">
                                {scene.clouds?.speed || 1}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="0"
                              max="5"
                              step="0.1"
                              value={scene.clouds?.speed || 1}
                              onChange={(e) =>
                                onChange({
                                  clouds: {
                                    ...scene.clouds,
                                    speed: parseFloat(e.target.value),
                                    enabled: scene.clouds?.enabled ?? false,
                                    opacity: scene.clouds?.opacity || 0.5,
                                    count: scene.clouds?.count || 20,
                                  },
                                })
                              }
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-blue-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Cloud Count
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-blue-500/20 text-blue-200 px-2 py-0.5 ">
                                {scene.clouds?.count || 20}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              value={scene.clouds?.count || 20}
                              onChange={(e) =>
                                onChange({
                                  clouds: {
                                    ...scene.clouds,
                                    count: parseInt(e.target.value),
                                    enabled: scene.clouds?.enabled ?? false,
                                    speed: scene.clouds?.speed || 1,
                                    opacity: scene.clouds?.opacity || 0.5,
                                  },
                                })
                              }
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Palette className="w-3.5 h-3.5 text-blue-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Cloud Opacity
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-blue-500/20 text-blue-200 px-2 py-0.5 ">
                                {scene.clouds?.opacity || 0.5}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={scene.clouds?.opacity || 0.5}
                              onChange={(e) =>
                                onChange({
                                  clouds: {
                                    ...scene.clouds,
                                    opacity: parseFloat(e.target.value),
                                    enabled: scene.clouds?.enabled ?? false,
                                    speed: scene.clouds?.speed || 1,
                                    count: scene.clouds?.count || 20,
                                  },
                                })
                              }
                              className="w-full accent-blue-500"
                            />
                          </div>
                        </>
                      )}

                      {/* Stars Section */}
                      {section === "stars" && (
                        <>
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 ">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5 text-purple-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Show Stars
                              </label>
                            </div>
                            <ToggleSwitch
                              isOn={scene.stars?.enabled ?? false}
                              onToggle={() =>
                                onChange({
                                  stars: {
                                    ...scene.stars,
                                    enabled: !(scene.stars?.enabled ?? false),
                                    count: scene.stars?.count || 5000,
                                    depth: scene.stars?.depth || 50,
                                    fade: scene.stars?.fade ?? true,
                                  },
                                })
                              }
                              color="purple"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Star Count
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-purple-500/20 text-purple-200 px-2 py-0.5 ">
                                {scene.stars?.count || 5000}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="1000"
                              max="10000"
                              step="100"
                              value={scene.stars?.count || 5000}
                              onChange={(e) =>
                                onChange({
                                  stars: {
                                    ...scene.stars,
                                    count: parseInt(e.target.value),
                                    enabled: scene.stars?.enabled ?? false,
                                    depth: scene.stars?.depth || 50,
                                    fade: scene.stars?.fade ?? true,
                                  },
                                })
                              }
                              className="w-full accent-purple-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-purple-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Star Depth
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-purple-500/20 text-purple-200 px-2 py-0.5 ">
                                {scene.stars?.depth || 50}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="10"
                              max="100"
                              step="1"
                              value={scene.stars?.depth || 50}
                              onChange={(e) =>
                                onChange({
                                  stars: {
                                    ...scene.stars,
                                    depth: parseInt(e.target.value),
                                    enabled: scene.stars?.enabled ?? false,
                                    count: scene.stars?.count || 5000,
                                    fade: scene.stars?.fade ?? true,
                                  },
                                })
                              }
                              className="w-full accent-purple-500"
                            />
                          </div>
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 ">
                            <div className="flex items-center gap-2">
                              <Palette className="w-3.5 h-3.5 text-purple-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Star Fade Effect
                              </label>
                            </div>
                            <ToggleSwitch
                              isOn={scene.stars?.fade ?? true}
                              onToggle={() =>
                                onChange({
                                  stars: {
                                    ...scene.stars,
                                    fade: !(scene.stars?.fade ?? true),
                                    enabled: scene.stars?.enabled ?? false,
                                    count: scene.stars?.count || 5000,
                                    depth: scene.stars?.depth || 50,
                                  },
                                })
                              }
                              color="purple"
                            />
                          </div>
                        </>
                      )}

                      {/* Audio Section */}
                      {section === "audio" && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Music className="w-3.5 h-3.5 text-green-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Audio URL
                              </label>
                            </div>
                            <Input
                              type="text"
                              placeholder="https://example.com/music.mp3"
                              value={scene.music?.url || ""}
                              onChange={(e) =>
                                onChange({
                                  music: {
                                    ...scene.music,
                                    url: e.target.value,
                                    volume: scene.music?.volume || 0.5,
                                    loop: scene.music?.loop ?? true,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700  text-xs focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-3.5 h-3.5 text-green-400" />
                                <label className="text-xs font-medium text-slate-300">
                                  Volume
                                </label>
                              </div>
                              <span className="text-xs font-medium bg-green-500/20 text-green-200 px-2 py-0.5 ">
                                {scene.music?.volume || 0.5}
                              </span>
                            </div>
                            <Input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={scene.music?.volume || 0.5}
                              onChange={(e) =>
                                onChange({
                                  music: {
                                    ...scene.music,
                                    volume: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className="w-full accent-green-500"
                            />
                          </div>
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 ">
                            <div className="flex items-center gap-2">
                              <Repeat className="w-3.5 h-3.5 text-green-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Loop Audio
                              </label>
                            </div>
                            <ToggleSwitch
                              isOn={scene.music?.loop ?? true}
                              onToggle={() =>
                                onChange({
                                  music: {
                                    ...scene.music,
                                    loop: !(scene.music?.loop ?? true),
                                  },
                                })
                              }
                              color="green"
                            />
                          </div>
                        </>
                      )}

                      {/* Scene Info Section */}
                      {section === "info" && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Info className="w-3.5 h-3.5 text-purple-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Scene Name
                              </label>
                            </div>
                            <Input
                              type="text"
                              value={scene.name}
                              onChange={(e) =>
                                onChange({ name: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700  text-xs focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Info className="w-3.5 h-3.5 text-purple-400" />
                              <label className="text-xs font-medium text-slate-300">
                                Description
                              </label>
                            </div>
                            <textarea
                              rows={3}
                              value={scene.description || ""}
                              onChange={(e) =>
                                onChange({ description: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700  text-xs resize-none focus:border-purple-500 focus:outline-none"
                              placeholder="Add a description for this scene..."
                            />
                          </div>
                          <div className="bg-slate-800/50 p-3  space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs text-slate-400">
                                  Scene ID
                                </span>
                              </div>
                              <span className="text-xs font-mono bg-slate-700/50 text-slate-300 px-2 py-0.5 ">
                                {scene.id.substring(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs text-slate-400">
                                  Objects
                                </span>
                              </div>
                              <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 ">
                                {scene.objects?.length || 0}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }
      )}
    </div>
  );
}
