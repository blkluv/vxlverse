import { Suspense, useState } from "react";
import { X, Search, FileSymlink } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { ModalPortal } from "../UI/ModalPortal";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Environment } from "@react-three/drei";
import { useTemplates } from "../../hooks/useTemplates";
import { EditorGameObject } from "./EditorGameObject";
import { Object3D } from "three";

interface NewSceneModalProps {
  onClose: () => void;
}

export function NewSceneModal({ onClose }: NewSceneModalProps) {
  const { createNewScene, addObject } = useEditorStore();

  const [sceneName, setSceneName] = useState(
    `mpoapostolis-template-${Math.floor(Math.random() * 1000)}`
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { templates, isLoading, error } = useTemplates();

  const handleCreateScene = () => {
    if (!sceneName.trim()) return;

    // Create a new scene
    const templateObjects = selectTemplate?.template?.map((obj) => {
      const uuid = new Object3D().uuid;
      // Ensure the object has a valid ID
      return {
        ...obj,
        id: uuid,
      };
    });
    createNewScene(sceneName, templateObjects);

    onClose();
  };

  const selectTemplate = templates?.find((template) => template.id === selectedTemplate);

  return (
    <ModalPortal>
      <div className="bg-slate-800 border  h-full border-slate-700  shadow-xl w-[80vw] max-w-[95vw] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-200">Create New Scene</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 h-full overflow-hidden">
          {/* Left panel: Template selection */}
          <div className="w-full border-r border-slate-700 p-4 flex flex-col">
            {/* Scene name input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">Scene Name</label>
              <input
                type="text"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700  px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter scene name"
                autoFocus
              />
            </div>

            {/* Search templates */}
            <div className="mb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700  pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search templates..."
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 mb-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2 py-1 text-[10px] ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("most-used")}
                className={`px-2 py-1 text-[10px] ${
                  activeFilter === "most-used"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Most Used
              </button>
              <button
                onClick={() => setActiveFilter("recent")}
                className={`px-2 py-1 text-[10px] ${
                  activeFilter === "recent"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveFilter("environment")}
                className={`px-2 py-1 text-[10px] ${
                  activeFilter === "environment"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Environments
              </button>
              <button
                onClick={() => setActiveFilter("dungeon")}
                className={`px-2 py-1 text-[10px] ${
                  activeFilter === "dungeon"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Dungeons
              </button>
            </div>

            {/* Template list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="text-center py-4 text-slate-400 text-sm">Loading templates...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-400 text-sm">Error loading templates</div>
              ) : templates?.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-sm">No templates found</div>
              ) : (
                <div className="space-y-2">
                  {templates?.map((template: any) => (
                    <div
                      key={template.id}
                      className={`p-2.5 border  cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? "bg-blue-900/30 border-blue-500"
                          : "bg-slate-900/30 border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center gap-2">
                        <FileSymlink size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {template.name}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">
                          {template.category || "Default"} •{" "}
                          {new Date(template.created).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium bg-slate-700 text-slate-300  hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScene}
                disabled={!sceneName.trim()}
                className={`px-3 py-1.5 text-xs font-medium  ${
                  !sceneName.trim()
                    ? "bg-blue-900/30 text-blue-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Create Scene
              </button>
            </div>
          </div>

          {/* Right panel: 3D Preview */}
          <div className="flex-1 w-full  flex flex-col">
            <div className="flex-1 overflow-hidden">
              <Canvas
                style={{ width: "100%", height: "100%" }}
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true }}
              >
                <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                <OrbitControls enableDamping />

                {/* Environment */}
                <Environment preset="city" background={false} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                {/* Grid */}
                <Grid
                  infiniteGrid
                  cellSize={1}
                  cellThickness={0.5}
                  cellColor="#334155"
                  sectionSize={5}
                  sectionThickness={1}
                  sectionColor="#1e293b"
                  fadeDistance={30}
                  fadeStrength={1.5}
                  position={[0, -0.01, 0]}
                />

                <Suspense fallback={null}>
                  {selectTemplate?.template?.map((obj, index) => (
                    <EditorGameObject isSelected={false} key={index} {...obj} />
                  ))}
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
