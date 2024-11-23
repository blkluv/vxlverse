import { useState, useEffect } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Model3D } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Model } from '../Model';
import { Portal } from '../Portal';
import * as THREE from 'three';

const MODEL_API = 'https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/data.json';

export function ModelSelector() {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  
  const { currentSceneId, setShowModelSelector } = useEditorStore();

  useEffect(() => {
    fetch(MODEL_API)
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load models:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(models.map(m => m.category)))].sort();
  
  const filteredModels = models.filter(model => {
    const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToScene = () => {
    if (!selectedModel || !currentSceneId) return;

    const newObject = {
      id: new THREE.Object3D().uuid,
      name: selectedModel.name,
      modelUrl: selectedModel.glb,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1)
    };

    useEditorStore.getState().addObject(currentSceneId, newObject);
    setShowModelSelector(false);
  };

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        onClick={() => setShowModelSelector(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-xl w-[85vw] h-[85vh] flex overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Left Panel */}
          <div className="w-96 p-6 border-r border-gray-700 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Select Model</h2>
              <button
                onClick={() => setShowModelSelector(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {loading ? (
                  <div className="text-center py-4 text-gray-400">Loading...</div>
                ) : filteredModels.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">No models found</div>
                ) : (
                  filteredModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`p-3 rounded-lg transition-all ${
                        selectedModel?.id === model.id
                          ? 'bg-blue-500 ring-2 ring-blue-400'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="text-left">
                          <h3 className="font-medium">{model.name}</h3>
                          <p className="text-sm text-gray-400">{model.creator}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {model.tags.split(',').slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 text-xs bg-gray-600 rounded-full"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-black relative">
            {selectedModel ? (
              <>
                <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Stage environment="city" intensity={0.6}>
                    <Model url={selectedModel.glb} />
                  </Stage>
                  <OrbitControls autoRotate />
                </Canvas>

                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={handleAddToScene}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Scene
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a model to preview
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}