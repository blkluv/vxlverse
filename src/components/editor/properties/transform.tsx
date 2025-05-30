import { useState, useRef, useEffect } from "react";
import { Move, Minimize, Maximize, RotateCcw, Link, Unlink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../UI/input";
import { useEditorStore } from "../../../stores/editorStore";
import { Euler, MathUtils, Vector3 } from "three";

export function TransformPanel() {
  const [expanded, setExpanded] = useState(true);
  const [scaleLinked, setScaleLinked] = useState(true);

  // Get state from the store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const updateObject = useEditorStore((state) => state.updateObject);

  // Get the current scene and selected object
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find((obj) => obj.id === selectedObjectId);

  if (!currentScene || !selectedObject) return null;

  // Access the transform properties directly - they should be THREE objects
  // that already have x, y, z properties

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    // Create a new Vector3 with the current values
    const position = new Vector3(
      selectedObject.position.x,
      selectedObject.position.y,
      selectedObject.position.z
    );
    // Update the specified axis
    position[axis] = value;
    updateObject(currentScene.id, selectedObject.id, { position });
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    // Create a new Vector3 with the current values
    const rotation = new Euler(
      selectedObject.rotation.x,
      selectedObject.rotation.y,
      selectedObject.rotation.z,
      "XYZ"
    );
    // Update the specified axis
    rotation[axis] = MathUtils.degToRad(value);

    // Update the object with the new rotation
    updateObject(currentScene.id, selectedObject.id, { rotation });
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    if (scaleLinked) {
      // If linked, update all axes to the new value.
      const scale = new Vector3(value, value, value);
      updateObject(currentScene.id, selectedObject.id, { scale });
    } else {
      // Otherwise update only the specified axis.
      const scale = new Vector3(
        selectedObject.scale.x,
        selectedObject.scale.y,
        selectedObject.scale.z
      );
      scale[axis] = value;
      updateObject(currentScene.id, selectedObject.id, { scale });
    }
  };

  const toggleScaleLink = () => {
    setScaleLinked((prev) => {
      const newLinked = !prev;
      // When linking, unify all scale axes to the current X value (or default to 1)
      if (newLinked) {
        const xVal = selectedObject.scale?.x || 1;
        updateObject(currentScene.id, selectedObject.id, {
          scale: { x: xVal, y: xVal, z: xVal },
        });
      }
      return newLinked;
    });
  };

  // Modified TransformInput preserves focus by managing its own state.
  const TransformInput = ({
    axis,
    value,
    onChange,
    color,
    step = 0.1,
    disabled = false,
  }: {
    axis: "x" | "y" | "z";
    value: number;
    onChange: (value: number) => void;
    color: "red" | "green" | "blue";
    step?: number;
    disabled?: boolean;
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
    const [localValue, setLocalValue] = useState(value);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);
    // Only update local state when input isn't focused.
    useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setLocalValue(value);
        setInputValue(value?.toString());
      }
    }, [value]);

    const handleBlur = () => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        setLocalValue(parsed);
        onChange(parsed);
      } else {
        setInputValue(localValue.toString());
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    return (
      <div className="flex items-center">
        <div
          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${colors.bg} ${colors.border} border mr-1.5`}
        >
          <span className={`text-[10px] font-bold ${colors.text}`}>{axis.toUpperCase()}</span>
        </div>
        <div className="flex-grow relative">
          <Input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            step={step}
            disabled={disabled}
            className={`w-full h-7 px-2 text-[11px] bg-slate-900/80 border border-slate-700/50 ${
              colors.text
            } placeholder-slate-500 focus:outline-none focus:ring-1 ${colors.focusRing.replace(
              "focus-within:",
              "focus:"
            )} focus:border-none ${colors.focusBorder.replace(
              "focus-within:",
              "focus:"
            )} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  const TransformSection = ({
    title,
    onReset,
    extraControls,
    children,
  }: {
    title: string;
    onReset: () => void;
    extraControls?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-[11px] font-medium text-blue-300/90">{title}</span>
          {extraControls && <div className="ml-2">{extraControls}</div>}
        </div>
        <button
          onClick={onReset}
          className="flex items-center px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-blue-400 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
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
    <div className="bg-slate-800/30 border border-slate-700/30 overflow-hidden">
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
        <AnimatePresence>
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="p-3 pt-2 border-t border-slate-700/30">
              {/* Position */}
              <TransformSection
                title="Position"
                onReset={() =>
                  updateObject(currentScene.id, selectedObject.id, {
                    position: { x: 0, y: 0, z: 0 },
                  })
                }
              >
                <TransformInput
                  axis="x"
                  value={selectedObject.position.x}
                  onChange={(value) => handlePositionChange("x", value)}
                  color="red"
                />
                <TransformInput
                  axis="y"
                  value={selectedObject.position.y}
                  onChange={(value) => handlePositionChange("y", value)}
                  color="green"
                />
                <TransformInput
                  axis="z"
                  value={selectedObject.position.z}
                  onChange={(value) => handlePositionChange("z", value)}
                  color="blue"
                />
              </TransformSection>

              {/* Rotation */}
              <TransformSection
                title="Rotation"
                onReset={() => {
                  // Create a proper Euler object with zeros and XYZ order
                  const rotation = new Euler(0, 0, 0, "XYZ");
                  updateObject(currentScene.id, selectedObject.id, { rotation });
                }}
              >
                <TransformInput
                  axis="x"
                  value={MathUtils.radToDeg(selectedObject.rotation._x)}
                  onChange={(value) => handleRotationChange("x", value)}
                  color="red"
                  step={1}
                />
                <TransformInput
                  axis="y"
                  value={MathUtils.radToDeg(selectedObject.rotation._y)}
                  onChange={(value) => handleRotationChange("y", value)}
                  color="green"
                  step={1}
                />
                <TransformInput
                  axis="z"
                  value={MathUtils.radToDeg(selectedObject.rotation._z)}
                  onChange={(value) => handleRotationChange("z", value)}
                  color="blue"
                  step={1}
                />
              </TransformSection>

              {/* Scale */}
              <TransformSection
                title="Scale"
                onReset={() =>
                  updateObject(currentScene.id, selectedObject.id, {
                    scale: { x: 1, y: 1, z: 1 },
                  })
                }
                extraControls={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleScaleLink();
                    }}
                    className="p-1  hover:bg-slate-700/50 transition-colors"
                    title={scaleLinked ? "Unlink scale values" : "Link scale values"}
                  >
                    {scaleLinked ? (
                      <Link className="w-3 h-3 text-blue-400" />
                    ) : (
                      <Unlink className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                }
              >
                <TransformInput
                  axis="x"
                  value={selectedObject.scale.x}
                  onChange={(value) => handleScaleChange("x", value)}
                  color="red"
                  step={0.1}
                />
                <TransformInput
                  axis="y"
                  value={selectedObject.scale.y}
                  onChange={(value) => handleScaleChange("y", value)}
                  color="green"
                  step={0.1}
                  disabled={scaleLinked}
                />
                <TransformInput
                  axis="z"
                  value={selectedObject.scale.z}
                  onChange={(value) => handleScaleChange("z", value)}
                  color="blue"
                  step={0.1}
                  disabled={scaleLinked}
                />
              </TransformSection>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
