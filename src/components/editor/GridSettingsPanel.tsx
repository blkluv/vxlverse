import { Grid3X3, Magnet } from "lucide-react";
import { motion } from "framer-motion";
import { Scene } from "../../types";

interface GridSettingsPanelProps {
  scene: Scene;
  showGrid: boolean;
  gridSnap: boolean;
  onToggleGrid: () => void;
  onToggleGridSnap: () => void;
  onUpdateScene: (sceneId: string, updates: Partial<Scene>) => void;
}

export function GridSettingsPanel({
  scene,
  showGrid,
  gridSnap,
  onToggleGrid,
  onToggleGridSnap,
  onUpdateScene,
}: GridSettingsPanelProps) {
  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {/* Grid Visibility */}
      <div className="flex items-center justify-between bg-slate-800/50 p-2 ">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-3.5 h-3.5 text-blue-400" />
          <label className="text-xs font-medium text-slate-300">
            Show Grid
          </label>
        </div>
        <button
          onClick={onToggleGrid}
          className={`w-10 h-5 flex items-center -full p-1 cursor-pointer transition-colors duration-300 ${
            showGrid ? "bg-blue-500" : "bg-slate-700"
          }`}
        >
          <div
            className={`bg-white w-3 h-3 -full shadow-md transform transition-transform duration-300 ${
              showGrid ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>

      {/* Grid Snap */}
      <div className="flex items-center justify-between bg-slate-800/50 p-2 ">
        <div className="flex items-center gap-2">
          <Magnet className="w-3.5 h-3.5 text-blue-400" />
          <label className="text-xs font-medium text-slate-300">
            Snap to Grid
          </label>
        </div>
        <button
          onClick={onToggleGridSnap}
          className={`w-10 h-5 flex items-center -full p-1 cursor-pointer transition-colors duration-300 ${
            gridSnap ? "bg-blue-500" : "bg-slate-700"
          }`}
        >
          <div
            className={`bg-white w-3 h-3 -full shadow-md transform transition-transform duration-300 ${
              gridSnap ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>

      {/* Grid Size */}
      <div className="bg-slate-800/50 p-2 space-y-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-3.5 h-3.5 text-blue-400" />
            <label className="text-xs font-medium text-slate-300">
              Grid Size
            </label>
          </div>
          <span className="text-xs text-slate-400">{scene.gridSize}</span>
        </div>
        <div className="pt-1">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={scene.gridSize}
            onChange={(e) =>
              onUpdateScene(scene.id, {
                gridSize: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-700  appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.1</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Snap Precision */}
      <div className="bg-slate-800/50 p-2 space-y-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Magnet className="w-3.5 h-3.5 text-blue-400" />
            <label className="text-xs font-medium text-slate-300">
              Snap Precision
            </label>
          </div>
          <span className="text-xs text-slate-400">{scene.snapPrecision}</span>
        </div>
        <div className="pt-1">
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={scene.snapPrecision}
            onChange={(e) =>
              onUpdateScene(scene.id, {
                snapPrecision: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-700  appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.05</span>
            <span>1</span>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-1">
            Lower values = more precise snapping
          </p>
        </div>
      </div>
    </div>
  );
}
