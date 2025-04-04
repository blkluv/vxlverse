import { useState, useRef, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { Euler, MathUtils, Vector3 } from "three";
import { Link, Unlink } from "lucide-react";

export function TransformControls() {
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
        const newScale = new Vector3(xVal, xVal, xVal);
        updateObject(currentScene.id, selectedObject.id, { scale: newScale });
      }
      return newLinked;
    });
  };

  // TransformInput component for handling inputs
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
      red: "text-red-400 bg-red-500/20 border-red-500/30",
      green: "text-green-400 bg-green-500/20 border-green-500/30",
      blue: "text-blue-400 bg-blue-500/20 border-blue-500/30",
    };

    const [localValue, setLocalValue] = useState(value);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    // Update local state when prop value changes and input isn't focused
    useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setLocalValue(value);
        setInputValue(value.toFixed(2));
      }
    }, [value]);

    const handleBlur = () => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        setLocalValue(parsed);
        onChange(parsed);
      } else {
        setInputValue(localValue.toFixed(2));
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    // Increment/decrement buttons
    const increment = () => {
      const newValue = localValue + step;
      setLocalValue(newValue);
      setInputValue(newValue.toFixed(2));
      onChange(newValue);
    };

    const decrement = () => {
      const newValue = localValue - step;
      setLocalValue(newValue);
      setInputValue(newValue.toFixed(2));
      onChange(newValue);
    };

    return (
      <div className="flex items-center mb-2">
        <div
          className={`w-6 h-6 flex items-center justify-center ${colorMap[color]} border mr-2 rounded`}
        >
          <span className="text-xs font-bold">{axis.toUpperCase()}</span>
        </div>
        <div className="flex-grow flex items-center">
          <button
            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-l flex items-center justify-center"
            onClick={decrement}
          >
            -
          </button>
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            step={step}
            className={`w-full h-6 px-2 text-xs bg-slate-800 border-y border-slate-600 ${colorMap[color].split(" ")[0]} focus:outline-none`}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button
            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-r flex items-center justify-center"
            onClick={increment}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Position controls */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-blue-300">Position</h4>
          <button
            onClick={() => {
              const resetPosition = new Vector3(0, 0, 0);
              updateObject(currentScene.id, selectedObject.id, { position: resetPosition });
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            Reset
          </button>
        </div>
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
      </div>

      {/* Rotation controls */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-blue-300">Rotation</h4>
          <button
            onClick={() => {
              const resetRotation = new Euler(0, 0, 0, "XYZ");
              updateObject(currentScene.id, selectedObject.id, { rotation: resetRotation });
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            Reset
          </button>
        </div>
        <TransformInput
          axis="x"
          value={MathUtils.radToDeg(selectedObject.rotation.x)}
          onChange={(value) => handleRotationChange("x", value)}
          color="red"
          step={5}
        />
        <TransformInput
          axis="y"
          value={MathUtils.radToDeg(selectedObject.rotation.y)}
          onChange={(value) => handleRotationChange("y", value)}
          color="green"
          step={5}
        />
        <TransformInput
          axis="z"
          value={MathUtils.radToDeg(selectedObject.rotation.z)}
          onChange={(value) => handleRotationChange("z", value)}
          color="blue"
          step={5}
        />
      </div>

      {/* Scale controls */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-blue-300">Scale</h4>
          <div className="flex items-center">
            <button
              onClick={toggleScaleLink}
              className="mr-2 text-gray-400 hover:text-white"
              title={scaleLinked ? "Unlink scales" : "Link scales"}
            >
              {scaleLinked ? <Link size={16} /> : <Unlink size={16} />}
            </button>
            <button
              onClick={() => {
                const resetScale = new Vector3(1, 1, 1);
                updateObject(currentScene.id, selectedObject.id, { scale: resetScale });
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
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
        />
        <TransformInput
          axis="z"
          value={selectedObject.scale.z}
          onChange={(value) => handleScaleChange("z", value)}
          color="blue"
          step={0.1}
        />
      </div>
    </div>
  );
}
