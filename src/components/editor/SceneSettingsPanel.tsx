import { useState } from "react";
import { Scene } from "../../types";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Skull,
  Package,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../UI/input";
import { Textarea } from "../UI/textarea";
import { ItemSelector } from "./ItemSelector";

interface SceneSettingsPanelProps {
  scene: Scene;
  onChange: (updates: Partial<Scene>) => void;
  // Grid and snapping props
  showGrid?: boolean;
  onToggleGrid?: () => void;
  gridSnap?: boolean;
  onToggleGridSnap?: () => void;
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
  snapPrecision?: number;
  onSnapPrecisionChange?: (precision: number) => void;
}

export function SceneSettingsPanel({
  scene,
  onChange,
}: SceneSettingsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["info", "environment", "farmZone"])
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

  // Update scene with farm zone settings
  const updateFarmZoneSettings = (updates: any) => {
    onChange({
      farmZone: {
        ...(scene.farmZone || {}),
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-3 py-3 px-1">
      {/* Section Header Component */}
      {["info", "farmZone"].map((section) => {
        // Define section config
        const sectionConfig = {
          info: {
            title: "Scene Information",
            icon: <Info className="w-4 h-4 text-purple-400" />,
            color: "purple",
          },
          farmZone: {
            title: "Farm Zone Settings",
            icon: <Skull className="w-4 h-4 text-red-400" />,
            color: "red",
          },
        };

        const { title, icon, color } =
          sectionConfig[section as keyof typeof sectionConfig] ?? {};
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
            {isExpanded && (
              <div className="overflow-hidden">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 space-y-4 border-t border-slate-700/20"
                >
                  {/* Environment Section */}

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
                          onChange={(e) => onChange({ name: e.target.value })}
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
                        <Textarea
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

                  {/* Farm Zone Section */}
                  {section === "farmZone" && (
                    <>
                      <div className="space-y-4">
                        {/* Enable Farm Zone Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skull className="w-3.5 h-3.5 text-red-400" />
                            <label className="text-xs font-medium text-slate-300">
                              Enable Farm Zone
                            </label>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input
                              type="checkbox"
                              id="toggle-farm-zone"
                              checked={scene.farmZone?.enabled || false}
                              onChange={(e) =>
                                updateFarmZoneSettings({
                                  enabled: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <label
                              htmlFor="toggle-farm-zone"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ease-in-out
                                ${
                                  scene.farmZone?.enabled
                                    ? "bg-red-500 shadow-inner shadow-red-700/30"
                                    : "bg-slate-700"
                                }
                                after:content-[''] after:absolute after:h-5 after:w-5 after:rounded-full 
                                after:bg-white after:shadow-sm after:transition-all after:duration-300 after:left-0.5 after:top-0.5
                                peer-checked:after:translate-x-5 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-400/20
                                hover:${
                                  scene.farmZone?.enabled
                                    ? "bg-red-600"
                                    : "bg-slate-600"
                                }
                              `}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
