import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, RotateCcw, Maximize, Link, Unlink } from 'lucide-react';
import * as THREE from 'three';

interface TransformControlsProps {
  object: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  };
  onChange: (updates: Partial<typeof object>) => void;
}

export function TransformControls({ object, onChange }: TransformControlsProps) {
  const [activeTab, setActiveTab] = useState<'position' | 'rotation' | 'scale'>('position');
  const [uniformScale, setUniformScale] = useState(true);

  const getValues = (type: typeof activeTab) => {
    switch (type) {
      case 'position':
        return [object.position.x, object.position.y, object.position.z];
      case 'rotation':
        return [object.rotation.x, object.rotation.y, object.rotation.z];
      case 'scale':
        return [object.scale.x, object.scale.y, object.scale.z];
    }
  };

  const handleChange = (type: typeof activeTab, axis: 'x' | 'y' | 'z', value: number) => {
    const newValue = new (type === 'rotation' ? THREE.Euler : THREE.Vector3)();
    const currentValues = getValues(type);

    if (type === 'scale' && uniformScale) {
      newValue.set(value, value, value);
    } else {
      const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
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
    >
      <div className="flex rounded-lg overflow-hidden bg-gray-700">
        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 p-2.5 text-sm font-medium transition-colors ${
            activeTab === 'position' ? 'bg-blue-500 text-white' : 'hover:bg-gray-600 text-gray-300'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            <span>Position</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('rotation')}
          className={`flex-1 p-2.5 text-sm font-medium transition-colors ${
            activeTab === 'rotation' ? 'bg-blue-500 text-white' : 'hover:bg-gray-600 text-gray-300'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="w-4 h-4" />
            <span>Rotation</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`flex-1 p-2.5 text-sm font-medium transition-colors ${
            activeTab === 'scale' ? 'bg-blue-500 text-white' : 'hover:bg-gray-600 text-gray-300'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>Scale</span>
          </div>
        </button>
      </div>

      {activeTab === 'scale' && (
        <button
          onClick={() => setUniformScale(!uniformScale)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {uniformScale ? (
            <>
              <Link className="w-4 h-4" />
              <span>Uniform Scale</span>
            </>
          ) : (
            <>
              <Unlink className="w-4 h-4" />
              <span>Independent Scale</span>
            </>
          )}
        </button>
      )}

      <div className="space-y-3">
        {(activeTab === 'scale' && uniformScale ? ['uniform'] : ['x', 'y', 'z']).map((axis, index) => {
          const value = axis === 'uniform' ? values[0] : values[index];
          
          return (
            <div key={`${activeTab}-${axis}`} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span className="uppercase">{axis}</span>
                <span className="text-xs">{value.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={activeTab === 'scale' ? 0.1 : -10}
                  max={activeTab === 'scale' ? 10 : 10}
                  step={0.1}
                  value={value}
                  onChange={(e) => handleChange(
                    activeTab,
                    axis === 'uniform' ? 'x' : axis as 'x' | 'y' | 'z',
                    parseFloat(e.target.value)
                  )}
                  className="flex-1 h-2 rounded-full accent-blue-500 bg-gray-700"
                />
                <input
                  type="number"
                  value={value.toFixed(2)}
                  onChange={(e) => handleChange(
                    activeTab,
                    axis === 'uniform' ? 'x' : axis as 'x' | 'y' | 'z',
                    parseFloat(e.target.value)
                  )}
                  className="w-16 px-2 py-1 bg-gray-700 rounded text-right text-sm"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}