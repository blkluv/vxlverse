import { useState } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { Box, Minimize, Maximize, Info, HelpCircle } from "lucide-react";
import { Input } from "../../UI/input";
import { Checkbox } from "../../UI";
import { cn } from "../../../lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-50 w-48 p-2 text-xs bg-slate-900 border border-slate-700 rounded-md shadow-lg text-slate-300 -translate-x-1/2 left-1/2 bottom-full mb-2">
          {content}
          <div className="absolute w-2 h-2 bg-slate-900 border-b border-r border-slate-700 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      )}
    </div>
  );
};

export function PhysicsPanel() {
  const [expanded, setExpanded] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

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

  // Initialize physics if not present
  const physics = selectedObject.physics || {
    enabled: false,
    type: "fixed" as const,
    mass: 1,
    colliders: "cuboid" as const,
    restitution: 0.3,
    friction: 0.5,
  };

  const handlePhysicsChange = (key: string, value: any) => {
    if (!currentScene.id) return;

    const updatedPhysics = {
      ...physics,
      [key]: value,
    };

    updateObject(currentScene.id, selectedObject.id, {
      physics: updatedPhysics,
    });
  };

  const handleTogglePhysics = () => {
    handlePhysicsChange("enabled", !physics.enabled);
  };

  const colliderTypes = [
    { value: "cuboid", label: "Box", icon: "📦" },
    { value: "ball", label: "Sphere", icon: "🔴" },
    { value: "trimesh", label: "Trimesh", icon: "🔷" },
    { value: "hull", label: "Hull", icon: "🛡️" },
  ];

  // Helper to render a select input
  const SelectInput = ({
    label,
    value,
    onChange,
    options,
    description,
    tooltip,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string; icon?: string }[];
    description?: string;
    tooltip?: string;
  }) => (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[11px] font-medium text-blue-300/90">
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
          </Tooltip>
        )}
      </div>

      <div className="grid grid-cols-5 gap-1 mb-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center justify-center p-1 rounded transition-all",
              "text-[10px] border",
              value === option.value
                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                : "bg-slate-800/30 border-slate-700/30 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700/50"
            )}
            title={option.label}
          >
            <span className="text-sm mb-0.5">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {description && (
        <p className="text-[10px] text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );

  // Helper to render a number input
  const NumberInputField = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 0.1,
    tooltip,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    tooltip?: string;
  }) => (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[11px] font-medium text-blue-300/90">
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
          </Tooltip>
        )}
      </div>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full h-7 px-2 text-[11px] bg-slate-900/80 border border-slate-700/50 text-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50"
      />
    </div>
  );

  // Get description and tooltip for collider type
  const getColliderInfo = (type: string) => {
    switch (type) {
      case "cuboid":
        return {
          description: "Simple box collider",
          tooltip:
            "Box-shaped collision volume that follows the object's dimensions",
        };
      case "ball":
        return {
          description: "Perfect sphere collider",
          tooltip:
            "Spherical collision volume, good for round objects and performance",
        };
      case "capsule":
        return {
          description: "Pill-shaped collider",
          tooltip: "Cylinder with rounded ends, good for character controllers",
        };
      case "trimesh":
        return {
          description: "Complex mesh collider (expensive)",
          tooltip: "Follows the exact shape of your model but uses more CPU",
        };
      case "hull":
        return {
          description: "Simplified convex hull",
          tooltip: "Creates a simplified convex shape around your model",
        };
      default:
        return { description: "", tooltip: "" };
    }
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 overflow-hidden rounded-sm">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Box className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Physics
        </h3>
        <div className="flex items-center gap-2">
          <Tooltip content="Physics allows objects to interact with each other in a realistic way. Enable this to add collision detection to your object.">
            <Info
              className="w-3.5 h-3.5 text-slate-400 hover:text-blue-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowHelp(!showHelp);
              }}
            />
          </Tooltip>
          {expanded ? (
            <Minimize className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="overflow-hidden">
          {showHelp && (
            <div className="p-3 pt-2 border-t border-slate-700/30 bg-blue-900/10">
              <p className="text-[11px] text-blue-200/80 leading-relaxed">
                Physics allows objects to interact with each other in a
                realistic way. Currently, only static colliders are supported,
                which means objects won't move but can be collided with.
              </p>
            </div>
          )}

          <div className="p-3 pt-2 border-t border-slate-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="physics-enabled"
                  className="w-4 h-4 text-blue-500/50 bg-slate-700/80 border border-slate-600/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/50 rounded-none"
                  checked={physics.enabled}
                  onChange={handleTogglePhysics}
                />
                <span className="text-[11px] font-medium text-blue-300/90">
                  Enable Physics
                </span>
              </div>
            </div>

            {physics.enabled && (
              <div className="space-y-3">
                <SelectInput
                  label="Collider Shape"
                  value={physics.colliders || "cuboid"}
                  onChange={(value) => handlePhysicsChange("colliders", value)}
                  options={colliderTypes}
                  description={
                    getColliderInfo(physics.colliders || "cuboid").description
                  }
                  tooltip={
                    getColliderInfo(physics.colliders || "cuboid").tooltip
                  }
                />

                <div className="mt-2 pt-2 border-t border-slate-700/20">
                  <p className="text-[10px] text-slate-400 mb-2 flex items-center">
                    <Info className="w-3 h-3 text-blue-400 mr-1" />
                    Selected:{" "}
                    {
                      colliderTypes.find(
                        (c) => c.value === (physics.colliders || "cuboid")
                      )?.label
                    }{" "}
                    Collider
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
