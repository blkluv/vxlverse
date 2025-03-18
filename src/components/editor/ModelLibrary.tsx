import { useState, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { Model3D } from "../../types";
import { Package, Search, Plus, Tag } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Model } from "../Model";
import * as THREE from "three";

const MODEL_API =
  "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/data.json";

export function ModelLibrary() {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  const { currentSceneId, setBrushTemplate } = useEditorStore();

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

  const categories = ["All", ...Array.from(new Set(models.map((m) => m.category)))].sort();

  const filteredModels = models.filter((model) => {
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory;
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
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 sm">
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-lg font-medium text-slate-100">Model Library</h2>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-700/50 sm"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs font-medium transition-all flex-shrink-0 sm ${
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent full mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading models...</p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No models found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`flex flex-col p-2 transition-all sm ${
                  selectedModel?.id === model.id
                    ? "bg-blue-500/20 ring-1 ring-blue-500/30"
                    : "bg-slate-800/50 hover:bg-slate-800/80"
                }`}
              >
                <div className="w-full aspect-square bg-slate-800 mb-2 overflow-hidden">
                  <img
                    src={model.thumbnail}
                    alt={model.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-medium text-slate-100 truncate">{model.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <p className="text-[10px] text-slate-400 truncate">{model.tags}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Model Preview */}
      {selectedModel && (
        <div className="border-t border-slate-800/50">
          <div className="h-40 bg-slate-800/30">
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
              <Stage environment="city" intensity={0.5}>
                <Model url={selectedModel.glb} />
              </Stage>
              <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
          <div className="p-3 flex gap-2">
            <button
              onClick={handleAddToScene}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Scene
            </button>
            <button
              onClick={handleUseAsBrush}
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium sm flex items-center justify-center gap-1.5"
            >
              Use as Brush
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
