import { useState } from "react";
import { Grid, Minimize, Maximize, Magnet } from "lucide-react";
import toast from "react-hot-toast";
import { useEditorStore } from "../../../stores/editorStore";
import { ToggleSwitch } from "../../UI/ToggleSwitch";
import { Slider } from "../../UI/slider";

export function GridSnappingPanel() {
  const [expanded, setExpanded] = useState(true);

  // Get grid state and actions directly from the store
  const showGrid = useEditorStore((state) => state.showGrid);
  const gridSnap = useEditorStore((state) => state.gridSnap);
  const gridSize = useEditorStore((state) => state.gridSize);
  const snapPrecision = useEditorStore((state) => state.snapPrecision);
  const setShowGrid = useEditorStore((state) => state.setShowGrid);
  const setGridSnap = useEditorStore((state) => state.setGridSnap);
  const setGridSize = useEditorStore((state) => state.setGridSize);
  const setSnapPrecision = useEditorStore((state) => state.setSnapPrecision);

  // Handle grid visibility toggle
  const handleGridVisibilityToggle = (checked: boolean) => {
    setShowGrid(checked);
    toast.success(`Grid ${checked ? "visible" : "hidden"}`);
  };

  // Handle grid snap toggle
  const handleGridSnapToggle = (checked: boolean) => {
    setGridSnap(checked);
    toast.success(`Grid snapping ${checked ? "enabled" : "disabled"}`);
  };

  // Handle grid size change
  const handleGridSizeChange = (values: number[]) => {
    setGridSize(values[0]);
  };

  // Handle snap precision change
  const handleSnapPrecisionChange = (values: number[]) => {
    setSnapPrecision(values[0]);
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 overflow-hidden">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Grid className="w-3.5 h-3.5 text-green-400 mr-1.5" />
          Grid & Snapping
        </h3>
        {expanded ? (
          <Minimize className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-3 pt-1 border-t border-slate-700/30 space-y-3"
        >
          {/* Grid Visibility Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-5 h-5 flex items-center justify-center  ${
                  showGrid
                    ? "bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30"
                    : "bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30"
                } mr-1.5`}
              >
                <Grid className={`w-3 h-3 ${showGrid ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <span className="text-[10px] font-medium text-slate-300/90">Show Grid</span>
            </div>
            <ToggleSwitch
              isOn={showGrid}
              onToggle={() => handleGridVisibilityToggle(!showGrid)}
              color="blue"
            />
          </div>

          {/* Grid Snap Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-5 h-5 flex items-center justify-center  ${
                  gridSnap
                    ? "bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30"
                    : "bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30"
                } mr-1.5`}
              >
                <Magnet className={`w-3 h-3 ${gridSnap ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <span className="text-[10px] font-medium text-slate-300/90">Grid Snapping</span>
            </div>
            <ToggleSwitch
              isOn={gridSnap}
              onToggle={() => handleGridSnapToggle(!gridSnap)}
              color="blue"
            />
          </div>

          {/* Grid Size Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">Grid Size</span>
              <span className="text-[10px] text-slate-400">{gridSize}</span>
            </div>
            <Slider
              value={[gridSize]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={handleGridSizeChange}
              className="mt-1"
            />
          </div>

          {/* Snap Precision Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-300/90">Snap Precision</span>
              <span className="text-[10px] text-slate-400">{snapPrecision}</span>
            </div>
            <Slider
              value={[snapPrecision]}
              min={0.1}
              max={1}
              step={0.1}
              onValueChange={handleSnapPrecisionChange}
              className="mt-1"
            />
          </div>

          {/* Helper Text */}
          <div className="text-[9px] text-slate-400 italic">
            Grid snapping helps align objects to the grid for precise positioning.
          </div>
        </div>
      )}
    </div>
  );
}
