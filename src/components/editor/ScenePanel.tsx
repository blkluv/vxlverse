import { useState } from "react";
import { useEditorStore } from "../../stores/editorStore";
import {
  Plus,
  Trash2,
  Box,
  Search,
  Eye,
  EyeOff,
  Package,
  User,
  FileCode,
  Copy,
  ScrollText,
  Skull,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { Model3D } from "../../types";
import useSWR from "swr";
import { pb } from "../../lib/pocketbase";
import { Input } from "../UI/input";
import { Tooltip } from "../UI/Tooltip";
import * as THREE from "three";

// Function to get the appropriate icon based on object type
const getObjectTypeIcon = (type: string | undefined, isSelected: boolean) => {
  const baseClass = "w-3 h-3";
  const defaultColor = "text-slate-400";

  switch (type) {
    case "npc":
      return (
        <User
          className={`${baseClass} ${
            isSelected ? "text-teal-400" : defaultColor
          }`}
        />
      );
    case "enemy":
      return (
        <Skull
          className={`${baseClass} ${
            isSelected ? "text-rose-400" : defaultColor
          }`}
        />
      );
    case "item":
      return (
        <Package
          className={`${baseClass} ${
            isSelected ? "text-yellow-400" : defaultColor
          }`}
        />
      );
    case "portal":
      return (
        <ArrowUpRight
          className={`${baseClass} ${
            isSelected ? "text-indigo-400" : defaultColor
          }`}
        />
      );
    case "trigger":
      return (
        <Target
          className={`${baseClass} ${
            isSelected ? "text-sky-400" : defaultColor
          }`}
        />
      );
    default: // prop
      return (
        <Box
          className={`${baseClass} ${
            isSelected ? "text-blue-400" : defaultColor
          }`}
        />
      );
  }
};

const useModels = (searchTerm: string) => {
  const { data, error } = useSWR("models" + searchTerm, async (url) => {
    const res = await pb.collection("3d_models").getList<Model3D>(1, 50, {
      sort: "created",
      filter: `name ~ "${searchTerm}" || tags ~ "${searchTerm}"`,
    });
    return res.items?.map((obj) => ({
      ...obj,
      thumbnail: pb.files.getURL(obj, obj.thumbnail),
      glb: pb.files.getURL(obj, obj.glb),
    }));
  });

  return {
    models: data || [],
    isLoading: !data && !error,
    error,
  };
};

export function ScenePanel() {
  const {
    scenes,
    currentSceneId,
    selectedObjectId,
    removeObject,
    duplicateObject,
    setSelectedObject,
    setFocusOnObject,
  } = useEditorStore();

  // State to track search input and expanded scenes
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenObjects, setHiddenObjects] = useState<string[]>([]);
  const [objectsExpanded, setObjectsExpanded] = useState(true);
  const [modelsExpanded, setModelsExpanded] = useState(true);

  // State for models
  const { models, isLoading } = useModels(searchQuery);

  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  // Handle adding model to scene
  const handleAddModelToScene = (model: Model3D) => {
    if (!currentSceneId) return;

    const newObject = {
      id: new THREE.Object3D().uuid,
      name: model.name,
      modelUrl: model.glb,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
    };

    useEditorStore.getState().addObject(currentSceneId, newObject);
  };

  // Duplicate object

  return (
    <div className="flex flex-col h-full border-r border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* HEADER: Title, Actions, & Search */}
      <div className="flex border-b h-9 border-white/10 px-4 items-center gap-2">
        <div className="w-7 h-7  flex items-center justify-center ">
          <span className="text-lg font-bold text-indigo-400">VXL</span>
        </div>
        <h1 className="text-sm font-bold text-white">verse</h1>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* OBJECTS SECTION */}
        <section className="flex-1  flex flex-col overflow-hidden border-b border-slate-800/70">
          <div
            className="px-3 py-2 bg-slate-800/30 border-b border-slate-800/50 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition-colors"
            onClick={() => setObjectsExpanded(!objectsExpanded)}
          >
            <h3 className="text-xs font-medium text-slate-200 flex items-center">
              <Box className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              {currentScene?.objects.length
                ? `Hierarchy  (${currentScene.objects.length})`
                : "Hierarchy"}
            </h3>
          </div>

          <div className="p-3 space-y-1.5 overflow-y-auto custom-scrollbar flex-grow">
            {currentScene?.objects.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-800/20 border border-slate-700/20 ">
                <Box className="w-12 h-12 text-slate-500 mb-3 opacity-50" />
                <p className="text-sm font-medium text-slate-300">
                  No objects in this scene
                </p>
                <p className="text-xs text-slate-500 mt-2 mb-4 max-w-[220px]">
                  Add 3D models from the library below to populate your scene
                </p>
                <button className="px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400  hover:bg-blue-600/30 transition-colors flex items-center gap-1.5">
                  <Plus size={12} />
                  Add Object
                </button>
              </div>
            )}
            {currentScene?.objects.map((object) => {
              const hasQuests = object.quests && object.quests.length > 0;
              const questCount = object.quests?.length || 0;

              return (
                <div
                  key={object.id}
                  className={`group p-1  cursor-pointer border transition-all ${
                    selectedObjectId === object.id
                      ? "bg-gradient-to-r from-blue-500/20 to-blue-500/5 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                      : "hover:bg-slate-800/70 opacity-70 border-transparent hover:border-slate-700/50"
                  }`}
                  onClick={() => setSelectedObject(object.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-5 h-5 flex items-center justify-center  ${
                          selectedObjectId === object.id
                            ? "bg-blue-500/30"
                            : "bg-slate-800/70"
                        }`}
                      >
                        {getObjectTypeIcon(
                          object.type,
                          selectedObjectId === object.id
                        )}
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-xs font-medium truncate ${
                            selectedObjectId === object.id
                              ? "text-blue-100"
                              : "text-slate-200"
                          }`}
                        >
                          {object.name}
                        </span>
                        {hasQuests && (
                          <div className="flex items-center gap-1">
                            <Tooltip
                              position="top"
                              content={questCount + " quests"}
                            >
                              <ScrollText
                                size={12}
                                className="text-amber-400"
                              />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip content="Duplicate">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentSceneId || !selectedObjectId) return;
                            duplicateObject(currentSceneId, selectedObjectId);
                          }}
                          className="p-1.5  hover:bg-slate-700/70 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeObject(currentSceneId!, object.id);
                          }}
                          className="p-1.5  hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MODELS SECTION */}
        <section className="flex-1 flex flex-col overflow-hidden min-h-[200px]">
          <div
            className="px-3 py-2 bg-slate-800/30 border-b border-slate-800/50 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition-colors"
            onClick={() => setModelsExpanded(!modelsExpanded)}
          >
            <div className="flex items-center text-xs font-medium text-slate-200">
              <Package className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
              <span>Models Library</span>
            </div>
            <div className="flex items-center">
              <div className="relative w-36 mr-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full pl-7 pr-2 py-1.5 text-xs text-slate-200 bg-slate-800/80  border border-slate-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="text-slate-400">
                {modelsExpanded ? (
                  <div>
                    <Plus size={14} />
                  </div>
                ) : (
                  <div>
                    <Plus size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {modelsExpanded && (
            <div className="p-2 overflow-y-auto custom-scrollbar flex-grow">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-32 text-xs text-slate-500 p-4 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent -full mb-3"></div>
                  <p>Loading models...</p>
                </div>
              ) : models.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-xs text-slate-500 p-4 text-center">
                  <Package className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-sm">No models found</p>
                  {searchQuery && (
                    <p className="text-xs mt-1 text-slate-400">
                      Try a different search term
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className="bg-slate-800/40  overflow-hidden cursor-pointer transition-all border border-transparent hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50"
                    >
                      <div className="flex p-2">
                        <div className="w-16 h-16 bg-slate-900  overflow-hidden flex-shrink-0 border border-slate-800">
                          <img
                            src={model.thumbnail}
                            alt={model.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
                          <div className="text-xs  justify-between font-medium text-slate-200 truncate flex items-center gap-1">
                            <span>{model.name}</span>
                            {model?.animated && (
                              <span className="inline-flex  text-[10px] items-center px-1.5 py-0.5 rounded-full  font-medium bg-yellow-900/40 text-yellow-300 border border-yellow-700/50">
                                Animated
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              href={model.attribution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 flex items-center gap-1 hover:underline"
                            >
                              <User className="w-3 h-3" />
                              <span className="text-[10px] truncate">
                                {model.creator || "Unknown"}
                              </span>
                            </a>
                          </div>

                          <div className="flex items-center gap-1 mt-0.5">
                            <FileCode className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 truncate">
                              {model.licence || "No license"}
                            </span>
                          </div>
                        </div>
                        <Tooltip content="Add to scene">
                          <button
                            className="ml-2 p-1.5  bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 hover:text-purple-300 self-center flex-shrink-0 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddModelToScene(model);
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
