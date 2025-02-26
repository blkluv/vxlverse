import { useState, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { Model3D } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Package,
  User,
  Tag,
  Calendar,
  FileCode,
  ChevronRight,
  Brush,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Model } from "../Model";
import { Portal } from "../Portal";
import * as THREE from "three";

const MODEL_API =
  "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/data.json";

export function ModelSelector() {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  const { currentSceneId, setShowModelSelector, setBrushTemplate } =
    useEditorStore();

  useEffect(() => {
    fetch(MODEL_API)
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(models.map((m) => m.category))),
  ].sort();

  const filteredModels = models.filter((model) => {
    const matchesCategory =
      selectedCategory === "All" || model.category === selectedCategory;
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      scale: new THREE.Vector3(1, 1, 1),
    };

    useEditorStore.getState().addObject(currentSceneId, newObject);
    setShowModelSelector(false);
  };

  const handleUseAsBrush = () => {
    if (!selectedModel) return;

    const brushObject = {
      id: new THREE.Object3D().uuid,
      name: selectedModel.name,
      modelUrl: selectedModel.glb,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
    };

    setBrushTemplate(brushObject);
    setShowModelSelector(false);
  };

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        onClick={() => setShowModelSelector(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900  w-[85vw] h-[85vh] flex overflow-hidden border border-slate-800/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel */}
          <div className="w-96 flex flex-col border-r border-slate-800/50">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2  bg-blue-500/10">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">
                      Add Object
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Select a 3D model to add to your scene
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModelSelector(false)}
                  className="p-2 hover:bg-slate-800/50  transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50"
                />
              </div>

              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5  text-sm font-medium transition-all flex-shrink-0 ${
                      selectedCategory === category
                        ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Model List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-3">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent  mx-auto mb-4" />
                    <p className="text-slate-400">Loading models...</p>
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No models found</p>
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <motion.button
                      key={model.id}
                      layout
                      onClick={() => setSelectedModel(model)}
                      className={`w-full p-4  transition-all ${
                        selectedModel?.id === model.id
                          ? "bg-blue-500/20 ring-1 ring-blue-500/30"
                          : "bg-slate-800/50 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20  overflow-hidden bg-slate-800 flex-shrink-0">
                          <img
                            src={model.thumbnail}
                            alt={model.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-medium text-slate-100 truncate">
                            {model.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                            <User className="w-4 h-4" />
                            <span className="truncate">{model.creator}</span>
                          </div>
                          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                            {model.tags.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-slate-700/50 text-slate-300  whitespace-nowrap flex-shrink-0"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 transition-colors flex-shrink-0 ${
                            selectedModel?.id === model.id
                              ? "text-blue-400"
                              : "text-slate-500"
                          }`}
                        />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-slate-950 relative">
            {selectedModel ? (
              <>
                <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Stage environment="city" intensity={0.6}>
                    <Model url={selectedModel.glb} />
                  </Stage>
                  <OrbitControls autoRotate />
                </Canvas>

                {/* Model Details */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-slate-950/0 p-6">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Created
                        </div>
                        <div className="text-sm text-slate-200">
                          {new Date(selectedModel.created).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <FileCode className="w-4 h-4" />
                          License
                        </div>
                        <div className="text-sm text-slate-200">
                          {selectedModel.licence}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Category
                        </div>
                        <div className="text-sm text-slate-200">
                          {selectedModel.category}
                        </div>
                      </div>
                    </div>

                    {/* Preview Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        onClick={handleAddToScene}
                        disabled={!selectedModel}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white  transition-all duration-300 disabled:opacity-50 disabled:hover:from-blue-500 disabled:hover:to-violet-500"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Scene
                      </button>

                      <button
                        onClick={handleUseAsBrush}
                        disabled={!selectedModel}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white  transition-all duration-300 disabled:opacity-50 border border-slate-700/50"
                      >
                        <Brush className="w-4 h-4" />
                        Use as Brush
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                <Package className="w-16 h-16 mb-4 text-slate-500" />
                <p className="text-lg font-medium mb-2">No Model Selected</p>
                <p className="text-sm text-center max-w-md">
                  Select a model from the list to preview it here. You can
                  rotate and zoom the preview using your mouse.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}
