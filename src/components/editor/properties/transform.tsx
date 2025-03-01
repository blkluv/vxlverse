import { useState } from "react";
import { Move, Minimize, Maximize, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../UI/input";
import { useEditorStore } from "../../../stores/editorStore";

export function TransformPanel() {
  const [expanded, setExpanded] = useState(true);

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

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (currentScene.id) {
      const position = { ...(selectedObject.position || { x: 0, y: 0, z: 0 }) };
      position[axis] = value;
      updateObject(currentScene.id, selectedObject.id, { position });
    }
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    if (currentScene.id) {
      const rotation = { ...(selectedObject.rotation || { x: 0, y: 0, z: 0 }) };
      rotation[axis] = value;
      updateObject(currentScene.id, selectedObject.id, { rotation });
    }
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    if (currentScene.id) {
      const scale = { ...(selectedObject.scale || { x: 1, y: 1, z: 1 }) };
      scale[axis] = value;
      updateObject(currentScene.id, selectedObject.id, { scale });
    }
  };

  // Reusable transform input component
  const TransformInput = ({
    axis,
    value,
    onChange,
    color,
    step = 0.1,
  }: {
    axis: "x" | "y" | "z";
    value: number;
    onChange: (value: number) => void;
    color: "red" | "green" | "blue";
    step?: number;
  }) => {
    const colorMap = {
      red: {
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-400",
        focusBorder: "focus-within:border-red-500/50",
        focusRing: "focus-within:ring-red-500/30",
      },
      green: {
        bg: "bg-green-500/20",
        border: "border-green-500/30",
        text: "text-green-400",
        focusBorder: "focus-within:border-green-500/50",
        focusRing: "focus-within:ring-green-500/30",
      },
      blue: {
        bg: "bg-blue-500/20",
        border: "border-blue-500/30",
        text: "text-blue-400",
        focusBorder: "focus-within:border-blue-500/50",
        focusRing: "focus-within:ring-blue-500/30",
      },
    };

    const colors = colorMap[color];

    return (
      <div className="flex items-center">
        <div
          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center  ${colors.bg} ${colors.border} border mr-1.5`}
        >
          <span className={`text-[10px] font-bold ${colors.text}`}>
            {axis.toUpperCase()}
          </span>
        </div>
        <div className="flex-grow relative">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            step={step}
            className={`w-full h-7 px-2 text-[11px] bg-slate-900/80 border border-slate-700/50 ${
              colors.text
            } placeholder-slate-500 focus:outline-none focus:ring-1 ${colors.focusRing.replace(
              "focus-within:",
              "focus:"
            )} focus:border-none ${colors.focusBorder.replace(
              "focus-within:",
              "focus:"
            )}`}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  // Reusable section component
  const TransformSection = ({
    title,
    onReset,
    children,
  }: {
    title: string;
    onReset: () => void;
    children: React.ReactNode;
  }) => (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-[11px] font-medium text-blue-300/90">
            {title}
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-blue-400 bg-slate-800/40 hover:bg-slate-800/60  transition-colors"
          title={`Reset ${title}`}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </div>
  );

  return (
    <div className="bg-slate-800/30 border border-slate-700/30  overflow-hidden">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Move className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Transform
        </h3>
        {expanded ? (
          <Minimize className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="overflow-hidden">
          <div className="p-3 pt-2 border-t border-slate-700/30">
            {/* Position */}
            <TransformSection
              title="Position"
              onReset={() => {
                if (currentScene.id) {
                  updateObject(currentScene.id, selectedObject.id, {
                    position: { x: 0, y: 0, z: 0 },
                  });
                }
              }}
            >
              <TransformInput
                axis="x"
                value={selectedObject.position?.x || 0}
                onChange={(value) => handlePositionChange("x", value)}
                color="red"
              />
              <TransformInput
                axis="y"
                value={selectedObject.position?.y || 0}
                onChange={(value) => handlePositionChange("y", value)}
                color="green"
              />
              <TransformInput
                axis="z"
                value={selectedObject.position?.z || 0}
                onChange={(value) => handlePositionChange("z", value)}
                color="blue"
              />
            </TransformSection>

            {/* Rotation */}
            <TransformSection
              title="Rotation"
              onReset={() => {
                if (currentScene.id) {
                  updateObject(currentScene.id, selectedObject.id, {
                    rotation: { x: 0, y: 0, z: 0 },
                  });
                }
              }}
            >
              <TransformInput
                axis="x"
                value={selectedObject.rotation?.x || 0}
                onChange={(value) => handleRotationChange("x", value)}
                color="red"
              />
              <TransformInput
                axis="y"
                value={selectedObject.rotation?.y || 0}
                onChange={(value) => handleRotationChange("y", value)}
                color="green"
              />
              <TransformInput
                axis="z"
                value={selectedObject.rotation?.z || 0}
                onChange={(value) => handleRotationChange("z", value)}
                color="blue"
              />
            </TransformSection>

            {/* Scale */}
            <TransformSection
              title="Scale"
              onReset={() => {
                if (currentScene.id) {
                  updateObject(currentScene.id, selectedObject.id, {
                    scale: { x: 1, y: 1, z: 1 },
                  });
                }
              }}
            >
              <TransformInput
                axis="x"
                value={selectedObject.scale?.x || 1}
                onChange={(value) => handleScaleChange("x", value)}
                color="red"
                step={0.1}
              />
              <TransformInput
                axis="y"
                value={selectedObject.scale?.y || 1}
                onChange={(value) => handleScaleChange("y", value)}
                color="green"
                step={0.1}
              />
              <TransformInput
                axis="z"
                value={selectedObject.scale?.z || 1}
                onChange={(value) => handleScaleChange("z", value)}
                color="blue"
                step={0.1}
              />
            </TransformSection>
          </div>
        </div>
      )}
    </div>
  );
}
