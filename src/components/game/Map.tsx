import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { useGameStore } from '../../stores/gameStore';
import { X, Compass } from 'lucide-react';
import { Portal } from '../Portal';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Scene } from '../Scene';

interface MapProps {
  onClose: () => void;
}

export function Map({ onClose }: MapProps) {
  const scenes = useEditorStore((state) => state.scenes);
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const setCurrentSceneId = useGameStore((state) => state.setCurrentSceneId);

  const handleTeleport = (sceneId: string) => {
    setCurrentSceneId(sceneId);
    onClose();
  };

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95 rounded-xl w-[1000px] shadow-xl border border-gray-800/50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Compass className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">World Map</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Map Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {scenes.map((scene) => (
                <motion.button
                  key={scene.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTeleport(scene.id)}
                  className={`group relative h-[300px] rounded-xl border transition-all ${
                    currentSceneId === scene.id
                      ? 'bg-emerald-500/20 border-emerald-500/30 ring-1 ring-emerald-500/30'
                      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'
                  }`}
                >
                  {/* Scene Preview */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Canvas
                      camera={{ position: [10, 10, 10], fov: 50 }}
                      gl={{ preserveDrawingBuffer: true }}
                    >
                      <Scene sceneData={scene} isPreview />
                      <OrbitControls 
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={1}
                      />
                      <Environment preset={scene.environment || 'sunset'} />
                    </Canvas>
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-2">{scene.name}</h3>
                    {currentSceneId === scene.id ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Current Location
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Click to travel</div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 border-2 rounded-xl transition-colors ${
                    currentSceneId === scene.id
                      ? 'border-emerald-400/50'
                      : 'border-transparent group-hover:border-white/20'
                  }`} />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}