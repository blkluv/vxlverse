import { useState } from "react";
import {
  Move,
  RotateCcw,
  Maximize,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";
import * as THREE from "three";

interface TransformPanelProps {
  object: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };
  onChange: (updates: Partial<typeof object>) => void;
}

export function TransformPanel({ object, onChange }: TransformPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["position"])
  );
  const [lockScale, setLockScale] = useState<boolean>(true);

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

  const formatValue = (value: number) => {
    return Number(value.toFixed(2));
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newPosition = object.position.clone();
    newPosition[axis] = numValue;
    onChange({ position: newPosition });
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = (parseFloat(value) * Math.PI) / 180;
    if (isNaN(numValue)) return;

    const newRotation = object.rotation.clone();
    newRotation[axis] = numValue;
    onChange({ rotation: newRotation });
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newScale = object.scale.clone();

    if (lockScale) {
      // If scale is locked, update all axes with the same value
      newScale.set(
        Math.max(0.01, numValue),
        Math.max(0.01, numValue),
        Math.max(0.01, numValue)
      );
    } else {
      // Otherwise just update the specified axis
      newScale[axis] = Math.max(0.01, numValue);
    }

    onChange({ scale: newScale });
  };

  const applyPresetScale = (scaleValue: number) => {
    const newScale = new THREE.Vector3(scaleValue, scaleValue, scaleValue);
    onChange({ scale: newScale });
  };

  const resetTransforms = (type: "position" | "rotation" | "scale") => {
    switch (type) {
      case "position":
        onChange({ position: new THREE.Vector3(0, 0, 0) });
        break;
      case "rotation":
        onChange({ rotation: new THREE.Euler(0, 0, 0) });
        break;
      case "scale":
        onChange({ scale: new THREE.Vector3(1, 1, 1) });
        break;
    }
  };

  return (
    <div className="space-y-2">
      {/* Position Section */}
      <div className="bg-slate-800/50  border border-slate-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection("position")}
          className="w-full p-2 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5  bg-cyan-500/10">
              <Move className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-cyan-100">Position</span>
          </div>
          {expandedSections.has("position") ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {expandedSections.has("position") && (
          <div className="p-2 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-2">
              {["x", "y", "z"].map((axis) => (
                <div key={`pos-${axis}`} className="relative group">
                  <div className="absolute inset-0 bg-cyan-500/5  -m-0.5 group-hover:bg-cyan-500/10 transition-colors" />
                  <div className="relative">
                    <label className="text-[10px] font-medium text-cyan-300/70 uppercase tracking-wider block mb-1 ml-0.5">
                      {axis}
                    </label>
                    <input
                      type="number"
                      value={formatValue(
                        object.position[axis as "x" | "y" | "z"]
                      )}
                      onChange={(e) =>
                        handlePositionChange(
                          axis as "x" | "y" | "z",
                          e.target.value
                        )
                      }
                      className="w-full px-1.5 py-1 text-xs bg-slate-800/50 border border-slate-600/50  
                               focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-right
                               transition-all"
                      step={0.1}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => resetTransforms("position")}
              className="w-full mt-2 p-1 flex items-center justify-center gap-1.5 text-[10px] text-cyan-300 hover:bg-cyan-500/10  transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Rotation Section */}
      <div className="bg-slate-800/50  border border-slate-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection("rotation")}
          className="w-full p-2 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5  bg-blue-500/10">
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-100">Rotation</span>
          </div>
          {expandedSections.has("rotation") ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {expandedSections.has("rotation") && (
          <div className="p-2 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-2">
              {["x", "y", "z"].map((axis) => (
                <div key={`rot-${axis}`} className="relative group">
                  <div className="absolute inset-0 bg-blue-500/5  -m-0.5 group-hover:bg-blue-500/10 transition-colors" />
                  <div className="relative">
                    <label className="text-[10px] font-medium text-blue-300/70 uppercase tracking-wider block mb-1 ml-0.5">
                      {axis}
                    </label>
                    <input
                      type="number"
                      value={formatValue(
                        (object.rotation[axis as "x" | "y" | "z"] * 180) /
                          Math.PI
                      )}
                      onChange={(e) =>
                        handleRotationChange(
                          axis as "x" | "y" | "z",
                          e.target.value
                        )
                      }
                      className="w-full px-1.5 py-1 text-xs bg-slate-800/50 border border-slate-600/50  
                               focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-right
                               transition-all"
                      step={1}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => resetTransforms("rotation")}
              className="w-full mt-2 p-1 flex items-center justify-center gap-1.5 text-[10px] text-blue-300 hover:bg-blue-500/10  transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Scale Section */}
      <div className="bg-slate-800/50  border border-slate-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection("scale")}
          className="w-full p-2 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5  bg-purple-500/10">
              <Maximize className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-purple-100">Scale</span>
          </div>
          {expandedSections.has("scale") ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {expandedSections.has("scale") && (
          <div className="p-2 border-t border-slate-700/50">
            {/* Lock/Unlock Toggle */}
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setLockScale(!lockScale)}
                className="flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 transition-colors"
                title={
                  lockScale
                    ? "Unlock axes (scale independently)"
                    : "Lock axes (uniform scaling)"
                }
              >
                {lockScale ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>Unlocked</span>
                  </>
                )}
              </button>
            </div>

            {/* Scale Inputs */}
            <div className="grid grid-cols-3 gap-2">
              {["x", "y", "z"].map((axis) => (
                <div key={`scale-${axis}`} className="relative group">
                  <div className="absolute inset-0 bg-purple-500/5  -m-0.5 group-hover:bg-purple-500/10 transition-colors" />
                  <div className="relative">
                    <label className="text-[10px] font-medium text-purple-300/70 uppercase tracking-wider block mb-1 ml-0.5">
                      {axis}
                    </label>
                    <input
                      type="number"
                      value={formatValue(object.scale[axis as "x" | "y" | "z"])}
                      onChange={(e) =>
                        handleScaleChange(
                          axis as "x" | "y" | "z",
                          e.target.value
                        )
                      }
                      className="w-full px-1.5 py-1 text-xs bg-slate-800/50 border border-slate-600/50  
                               focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 text-right
                               transition-all"
                      step={0.1}
                      min={0.01}
                      disabled={lockScale && axis !== "x"}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Slider for uniform scaling */}
            <div className="mt-3 px-1">
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={object.scale.x}
                onChange={(e) => handleScaleChange("x", e.target.value)}
                className="w-full h-1.5 bg-purple-500/20  appearance-none cursor-pointer"
              />
            </div>

            {/* Preset Scale Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => applyPresetScale(0.5)}
                className="p-1 text-[10px] text-purple-300 bg-purple-500/10 hover:bg-purple-500/20  transition-colors"
              >
                0.5×
              </button>
              <button
                onClick={() => applyPresetScale(1)}
                className="p-1 text-[10px] text-purple-300 bg-purple-500/10 hover:bg-purple-500/20  transition-colors"
              >
                1×
              </button>
              <button
                onClick={() => applyPresetScale(2)}
                className="p-1 text-[10px] text-purple-300 bg-purple-500/10 hover:bg-purple-500/20  transition-colors"
              >
                2×
              </button>
            </div>

            <button
              onClick={() => resetTransforms("scale")}
              className="w-full mt-2 p-1 flex items-center justify-center gap-1.5 text-[10px] text-purple-300 hover:bg-purple-500/10  transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
