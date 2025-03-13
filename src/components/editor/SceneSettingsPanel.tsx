import { useState } from "react";
import { Scene } from "../../types";
import {
  Edit3,
  Settings,
  Skull,
  Minimize,
  Maximize,
  Check,
} from "lucide-react";
import { Input } from "../UI/input";
import { ObjectHierarchyPanel } from "./ObjectHierarchyPanel";
import { SoundPanel } from "./properties/sounds";

interface SceneSettingsPanelProps {
  scene: Scene;
  onChange: (updates: Partial<Scene>) => void;
}

export function SceneSettingsPanel({
  scene,
  onChange,
}: SceneSettingsPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Update scene with farm zone settings
  const updateFarmZoneSettings = (updates: any) => {
    onChange({
      farmZone: {
        ...(scene.farmZone || {}),
        ...updates,
      },
    });
    showSaveAnimation();
  };

  // Handle scene name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: e.target.value });
    showSaveAnimation();
  };

  // Show save animation
  const showSaveAnimation = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-b from-slate-800/40 to-slate-800/30 border border-slate-700/40 overflow-hidden shadow-md">
        <div className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-700/30 transition-colors">
          <h3 className="text-xs font-medium text-slate-200 flex items-center">
            <Settings className="w-3.5 h-3.5 text-green-400 mr-1.5" />
            Scene Settings
            {showSaveIndicator && (
              <div className="ml-2 flex items-center text-[10px] text-green-400">
                <Check className="w-3 h-3 mr-0.5" />
                <span>Saved</span>
              </div>
            )}
          </h3>
          <div className="flex items-center">
            <div className="text-[10px] text-slate-400 mr-2 px-1.5 py-0.5 bg-slate-700/30">
              ID: {scene.id.substring(0, 6)}
            </div>
            {expanded ? (
              <Minimize className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Maximize className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="p-3 pt-2 border-t border-slate-700/30">
            {/* Scene Name */}
            <div className="flex h-6 items-center space-x-2 mb-3">
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30">
                <Edit3 className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-grow">
                <Input
                  value={scene.name || ""}
                  onChange={handleNameChange}
                  className="w-full h-6 px-2 text-xs bg-slate-900/60 border border-slate-700/50 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 text-slate-200 placeholder-slate-500"
                  placeholder="Enter scene name"
                />
              </div>
            </div>

            {/* Farm Zone Toggle */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
                <Skull className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Farm Zone
                  </label>
                  <div className="relative inline-block w-7 mr-0.5 align-middle select-none">
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
                      className={`relative inline-flex h-3.5 w-7 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                        ${
                          scene.farmZone?.enabled
                            ? "bg-gradient-to-r from-red-500 to-red-600 shadow-inner shadow-red-700/30"
                            : "bg-gradient-to-r from-slate-700 to-slate-800"
                        }
                        after:content-[''] after:absolute after:h-2.5 after:w-2.5 after:rounded-full 
                        after:bg-white after:shadow-sm after:transition-all after:duration-200 after:left-0.5 after:top-0.5
                        peer-checked:after:translate-x-3.5 peer-focus:outline-none
                        hover:${
                          scene.farmZone?.enabled
                            ? "from-red-600 to-red-700"
                            : "from-slate-600 to-slate-700"
                        }
                      `}
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SoundPanel />
    </div>
  );
}
