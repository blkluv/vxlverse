import { useState, useRef, useEffect } from "react";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { Link, Unlink } from "lucide-react";

interface TransformInputProps {
  axis: "x" | "y" | "z";
  value: number;
  onChange: (value: number) => void;
  color: "red" | "green" | "blue";
  step?: number;
}

export function PaintingTransformControls() {
  const [scaleLinked, setScaleLinked] = useState(true);

  // Get state from the store
  const { paintings, selectedPaintingId, updatePainting } = usePaintingsStore();

  // Get the selected painting
  const selectedPainting = paintings.find((painting) => painting.id === selectedPaintingId);

  if (!selectedPainting) return null;

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    const newPosition = [...selectedPainting.position] as [number, number, number];
    newPosition["xyz".indexOf(axis)] = value;
    updatePainting(selectedPainting.id, { position: newPosition });
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    const newRotation = [...selectedPainting.rotation] as [number, number, number];
    newRotation["xyz".indexOf(axis)] = value;
    updatePainting(selectedPainting.id, { rotation: newRotation });
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    const newScale = [...selectedPainting.scale] as [number, number, number];

    if (scaleLinked) {
      // Update all axes with the same value
      newScale[0] = value;
      newScale[1] = value;
      newScale[2] = value;
    } else {
      // Update only the specified axis
      newScale["xyz".indexOf(axis)] = value;
    }

    updatePainting(selectedPainting.id, { scale: newScale });
  };

  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    updatePainting(selectedPainting.id, { [dimension]: value });
  };

  const resetPosition = () => {
    updatePainting(selectedPainting.id, { position: [0, 1.5, 0] });
  };

  const resetRotation = () => {
    updatePainting(selectedPainting.id, { rotation: [0, 0, 0] });
  };

  const resetScale = () => {
    updatePainting(selectedPainting.id, { scale: [1, 1, 1] });
  };

  return (
    <div className="space-y-4">
      {/* Position Controls */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-blue-300">Position</h4>
          <button onClick={resetPosition} className="text-xs text-gray-400 hover:text-white">
            Reset
          </button>
        </div>
        <TransformInput
          axis="x"
          value={selectedPainting.position[0]}
          onChange={(value) => handlePositionChange("x", value)}
          color="red"
          step={0.1}
        />
        <TransformInput
          axis="y"
          value={selectedPainting.position[1]}
          onChange={(value) => handlePositionChange("y", value)}
          color="green"
          step={0.1}
        />
        <TransformInput
          axis="z"
          value={selectedPainting.position[2]}
          onChange={(value) => handlePositionChange("z", value)}
          color="blue"
          step={0.1}
        />
      </div>

      {/* Rotation Controls */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-blue-300">Rotation</h4>
          <button onClick={resetRotation} className="text-xs text-gray-400 hover:text-white">
            Reset
          </button>
        </div>
        <TransformInput
          axis="x"
          value={selectedPainting.rotation[0]}
          onChange={(value) => handleRotationChange("x", value)}
          color="red"
          step={0.1}
        />
        <TransformInput
          axis="y"
          value={selectedPainting.rotation[1]}
          onChange={(value) => handleRotationChange("y", value)}
          color="green"
          step={0.1}
        />
        <TransformInput
          axis="z"
          value={selectedPainting.rotation[2]}
          onChange={(value) => handleRotationChange("z", value)}
          color="blue"
          step={0.1}
        />
      </div>

      {/* Scale Controls */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-blue-300">Scale</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScaleLinked(!scaleLinked)}
              className="text-xs text-gray-400 hover:text-white"
              title={scaleLinked ? "Unlink scales" : "Link scales"}
            >
              {scaleLinked ? <Link size={14} /> : <Unlink size={14} />}
            </button>
            <button onClick={resetScale} className="text-xs text-gray-400 hover:text-white">
              Reset
            </button>
          </div>
        </div>
        <TransformInput
          axis="x"
          value={selectedPainting.scale[0]}
          onChange={(value) => handleScaleChange("x", value)}
          color="red"
          step={0.1}
        />
        <TransformInput
          axis="y"
          value={selectedPainting.scale[1]}
          onChange={(value) => handleScaleChange("y", value)}
          color="green"
          step={0.1}
        />
        <TransformInput
          axis="z"
          value={selectedPainting.scale[2]}
          onChange={(value) => handleScaleChange("z", value)}
          color="blue"
          step={0.1}
        />
      </div>

      {/* Size Controls */}
      <div>
        <h4 className="text-sm font-medium text-blue-300 mb-2">Dimensions</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Width</label>
            <TransformInput
              axis="x"
              value={selectedPainting.width}
              onChange={(value) => handleSizeChange("width", value)}
              color="red"
              step={0.1}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Height</label>
            <TransformInput
              axis="y"
              value={selectedPainting.height}
              onChange={(value) => handleSizeChange("height", value)}
              color="green"
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransformInput({ axis, value, onChange, color, step = 1 }: TransformInputProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setLocalValue(newValue);
    }
  };

  const handleBlur = () => {
    if (!isNaN(localValue)) {
      onChange(localValue);
    }
  };

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

  // Handle long press for increment/decrement buttons
  const intervalRef = useRef<number | null>(null);

  const startIncrement = () => {
    increment();
    intervalRef.current = setInterval(increment, 100);
  };

  const startDecrement = () => {
    decrement();
    intervalRef.current = setInterval(decrement, 100);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
          onMouseDown={startDecrement}
          onMouseUp={stopInterval}
          onMouseLeave={stopInterval}
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
          onMouseDown={startIncrement}
          onMouseUp={stopInterval}
          onMouseLeave={stopInterval}
        >
          +
        </button>
      </div>
    </div>
  );
}
