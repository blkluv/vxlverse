import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Maximize,
  Link,
  Unlink,
} from "lucide-react";
import * as THREE from "three";

interface TransformControlsProps {
  object: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };
  onChange: (updates: Partial<typeof object>) => void;
}

export function TransformControls({
  object,
  onChange,
}: TransformControlsProps) {
  const [activeTab, setActiveTab] = useState<"position" | "rotation" | "scale">(
    "position"
  );
  const [uniformScale, setUniformScale] = useState(true);

  const getValues = (type: typeof activeTab) => {
    switch (type) {
      case "position":
        return [object.position.x, object.position.y, object.position.z];
      case "rotation":
        return [object.rotation.x, object.rotation.y, object.rotation.z];
      case "scale":
        return [object.scale.x, object.scale.y, object.scale.z];
    }
  };

  const handleChange = (
    type: typeof activeTab,
    axis: "x" | "y" | "z",
    value: number
  ) => {
    const newValue = new (type === "rotation" ? THREE.Euler : THREE.Vector3)();
    const currentValues = getValues(type);

    if (type === "scale" && uniformScale) {
      newValue.set(value, value, value);
    } else {
      const index = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      currentValues[index] = value;
      newValue.set(...currentValues);
    }

    onChange({ [type]: newValue });
  };

  const values = getValues(activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-gray-800 rounded-lg p-4"
    ></motion.div>
  );
}
