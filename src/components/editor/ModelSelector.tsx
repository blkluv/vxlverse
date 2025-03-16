import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { Model3D } from "../../types";
import {
  Search,
  X,
  Plus,
  Package,
  User,
  ChevronRight,
  ExternalLink,
  Play,
  Sparkles,
  FileText,
  FileCode,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";
import { GLTF } from "three-stdlib";
import { Model } from "../Model";
import { Portal } from "../Portal";
import * as THREE from "three";
import { Input } from "../UI";
import useSWR from "swr";
import { pb } from "../../lib/pocketbase";

// Animated model component
type AnimatedModelProps = {
  url: string;
  isPlaying: boolean;
  selectedAnimation: string;
  onAnimationsLoad?: (animations: string[]) => void;
};

const AnimatedModel = ({
  url,
  isPlaying,
  selectedAnimation,
  onAnimationsLoad,
}: AnimatedModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url) as GLTF;
  const { actions, mixer } = useAnimations(animations, group);

  // Notify parent component about available animations
  useEffect(() => {
    if (animations.length > 0 && onAnimationsLoad) {
      const animationNames = animations.map((anim) => anim.name);
      onAnimationsLoad(animationNames);
    }
  }, [animations, onAnimationsLoad]);

  // Control animation playback
  useEffect(() => {
    // Only proceed if we have animations
    if (animations.length === 0) return;

    // Stop all animations first
    if (mixer) mixer.stopAllAction();

    // Determine which animation to play
    const animName = selectedAnimation || animations[0].name;
    const action = actions[animName];

    if (action) {
      // Configure the action
      action.reset();
      action.clampWhenFinished = false;
      action.timeScale = 1;
      action.loop = THREE.LoopRepeat;

      // Play or pause based on isPlaying state
      if (isPlaying) {
        action.play();
      } else {
        action.play();
        action.paused = true;
      }
    }

    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [actions, animations, isPlaying, mixer, selectedAnimation]);

  // Update the animation in the render loop
  useFrame((_, delta) => {
    if (isPlaying && mixer) {
      mixer.update(delta);
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
};

// Helper function to get license URL
const getLicenseUrl = (license: string): string => {
  const licenseMap: Record<string, string> = {
    CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC-BY": "https://creativecommons.org/licenses/by/4.0/",
    "CC-BY-SA": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC-BY-NC": "https://creativecommons.org/licenses/by-nc/4.0/",
    "CC-BY-NC-SA": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "CC-BY-ND": "https://creativecommons.org/licenses/by-nd/4.0/",
    "CC-BY-NC-ND": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    MIT: "https://opensource.org/licenses/MIT",
    "Apache-2.0": "https://opensource.org/licenses/Apache-2.0",
    "GPL-3.0": "https://www.gnu.org/licenses/gpl-3.0.en.html",
  };

  // Check for exact matches
  if (licenseMap[license]) {
    return licenseMap[license];
  }

  // Check for partial matches
  for (const [key, url] of Object.entries(licenseMap)) {
    if (license.includes(key)) {
      return url;
    }
  }

  // Default to a search
  return `https://search.creativecommons.org/search?q=${encodeURIComponent(
    license
  )}`;
};

// Custom hook for fetching models with PocketBase
const useModels = (
  searchTerm: string,
  category: string = "All",
  onlyAnimated: boolean = false,
  page: number = 1,
  perPage: number = 12
) => {
  const { data, error, mutate } = useSWR(
    `models-${searchTerm}-${category}-${onlyAnimated}-${page}-${perPage}`,
    async () => {
      // Build filter based on search term, category, and animation flag
      let filter = searchTerm
        ? `(name ~ "${searchTerm}" || tags ~ "${searchTerm}")`
        : "";

      // Add category filter if not "All"
      if (category && category !== "All") {
        filter = filter
          ? `${filter} && (category = "${category}")`
          : `category = "${category}"`;
      }

      // Add animated filter if requested
      if (onlyAnimated) {
        filter = filter ? `${filter} && (animated = true)` : `animated = true`;
      }

      const res = await pb
        .collection("3d_models")
        .getList<Model3D>(page, perPage, {
          sort: "-created", // Sort by newest first
          filter: filter,
        });

      return {
        items: res.items?.map((obj) => ({
          ...obj,
          thumbnail: pb.files.getURL(obj, obj.thumbnail),
          glb: pb.files.getURL(obj, obj.glb),
        })),
        totalItems: res.totalItems,
        totalPages: res.totalPages,
        page: res.page,
      };
    }
  );

  return {
    models: data?.items || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || page,
    loading: !data && !error,
    error,
    mutate,
  };
};

export function ModelSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyAnimated, setOnlyAnimated] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string>("");
  const ITEMS_PER_PAGE = 12;

  const { models, loading, totalPages, totalItems } = useModels(
    searchQuery,
    selectedCategory,
    onlyAnimated,
    currentPage,
    ITEMS_PER_PAGE
  );

  const { currentSceneId, setShowModelSelector, showModelSelector } =
    useEditorStore();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, onlyAnimated]);

  // Reset animation state when model changes
  useEffect(() => {
    setIsAnimationPlaying(false);
    setAvailableAnimations([]);
    setSelectedAnimation("");

    // Clear Three.js cache when switching models to prevent disappearing
    if (selectedModel) {
      // Force Three.js to release cached resources
      useGLTF.clear(selectedModel.glb);
    }
  }, [selectedModel]);

  const categories = [
    "All",
    "Animals",
    "Buildings",
    "Buildings (Architecture)",
    "Clutter",
    "Food & Drink",
    "Furniture & Decor",
    "Nature",
    "Objects",
    "Other",
    "People & Characters",
    "Scenes & Levels",
    "Transport",
    "Weapons",
  ];

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className=" space-y-1 sticky bottom-0  bg-slate-900 border-t border-slate-800 items-center justify-between mt-4 px-4 py-2 bg-slate-800/30 rounded">
        <div className="flex w-full items-center justify-evenly gap-1">
          {/* First page button */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-800/50 text-slate-400 disabled:opacity-50 hover:bg-slate-700/50"
            title="First page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>

          {/* Previous page button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-800/50 text-slate-400 disabled:opacity-50 hover:bg-slate-700/50"
            title="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium ${
                currentPage === number
                  ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              {number}
            </button>
          ))}

          {/* Next page button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-800/50 text-slate-400 disabled:opacity-50 hover:bg-slate-700/50"
            title="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Last page button */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-800/50 text-slate-400 disabled:opacity-50 hover:bg-slate-700/50"
            title="Last page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

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
  if (!showModelSelector) return null;
  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        onClick={() => setShowModelSelector(false)}
      >
        <div
          className="bg-slate-900  w-[85vw] h-[85vh] flex overflow-hidden border border-slate-800/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel */}
          <div className="w-96 flex flex-col border-r border-slate-800/50">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/50">
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">
                        Add Object
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setOnlyAnimated(!onlyAnimated)}
                    className={`p-2 flex items-center gap-1.5 ${
                      onlyAnimated
                        ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                        : "bg-slate-800/50 text-slate-400"
                    } hover:bg-slate-800 transition-colors rounded`}
                    title="Show only animated models"
                  >
                    <Play
                      className="w-3.5 h-3.5"
                      fill={onlyAnimated ? "currentColor" : "none"}
                    />
                    <span className="text-xs font-medium">Animated</span>
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-slate-700/50 text-slate-300">
                      {onlyAnimated ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>

                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setCurrentPage(1);
                      setSearchQuery("");
                      setSelectedCategory(category);
                    }}
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
                <div className="text-xs text-slate-400">
                  Showing {models.length} of {totalItems} models
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent  mx-auto mb-4" />
                    <p className="text-slate-400">Loading models...</p>
                  </div>
                ) : models.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No models found</p>
                    {searchQuery && (
                      <p className="text-xs mt-1 text-slate-400">
                        Try a different search term
                      </p>
                    )}
                    {onlyAnimated && (
                      <p className="text-xs mt-1 text-slate-400">
                        Try disabling the "Animated only" filter
                      </p>
                    )}
                  </div>
                ) : (
                  models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full p-4  transition-all ${
                        selectedModel?.id === model.id
                          ? "bg-blue-500/20 ring-1 ring-blue-500/30"
                          : "bg-slate-800/50 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 overflow-hidden bg-slate-800 flex-shrink-0 relative rounded">
                          <img
                            src={model.thumbnail}
                            alt={model.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {model?.animated && (
                            <div className="absolute bottom-1 right-1 bg-purple-900/70 p-0.5 rounded-full">
                              <Play
                                className="w-3 h-3 text-purple-300"
                                fill="currentColor"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-medium text-slate-100 truncate">
                            {model.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {model.attribution_url ? (
                              <>
                                <User className="w-3 h-3" />
                                <span className="text-[10px] truncate">
                                  {model.creator || "Unknown"}
                                </span>
                              </>
                            ) : (
                              <div className="text-slate-400 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="text-[10px] truncate">
                                  {model.creator || "Unknown"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-0.5">
                            <FileCode className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 truncate">
                              {model.licence || "No license"}
                            </span>
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
                    </button>
                  ))
                )}
                {!loading && models.length > 0 && renderPagination()}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-slate-950 relative">
            <button
              onClick={() => setShowModelSelector(false)}
              className="p-2 z-50 hover:bg-slate-800/50  transition-colors absolute top-2 right-2"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            {selectedModel ? (
              <>
                <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                  <axesHelper position={[0, -1, 0]} />
                  <gridHelper position={[0, -1, 0]} />
                  <Stage environment="city" intensity={0.6}>
                    <Suspense fallback={null}>
                      {selectedModel?.animated ? (
                        <AnimatedModel
                          url={selectedModel.glb}
                          isPlaying={isAnimationPlaying}
                          selectedAnimation={selectedAnimation}
                          onAnimationsLoad={setAvailableAnimations}
                        />
                      ) : (
                        <Model url={selectedModel.glb} />
                      )}
                    </Suspense>
                  </Stage>
                  <OrbitControls />
                </Canvas>

                <div className="col-span-2 absolute top-2 left-2 flex items-start justify-between bg-slate-800/30 p-3 rounded">
                  <div className="flex items-center gap-3">
                    {selectedModel?.animated && (
                      <button
                        onClick={() =>
                          setIsAnimationPlaying(!isAnimationPlaying)
                        }
                        className="bg-purple-500/20 p-2 rounded-full hover:bg-purple-500/40 transition-colors"
                        title={
                          isAnimationPlaying
                            ? "Pause animation"
                            : "Play animation"
                        }
                      >
                        {isAnimationPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-purple-400"
                          >
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                        ) : (
                          <Play
                            className="w-5 h-5 text-purple-400"
                            fill="currentColor"
                          />
                        )}
                      </button>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {selectedModel.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                          {selectedModel.category || "Uncategorized"}
                        </span>
                        {selectedModel?.animated && (
                          <span className="text-xs px-2 py-0.5 bg-purple-900/40 text-purple-300 rounded border border-purple-700/50">
                            {isAnimationPlaying
                              ? "Animation Playing"
                              : "Animated Model"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animation Controls */}
                {selectedModel?.animated && availableAnimations.length > 0 && (
                  <div className="absolute top-2 right-12 bg-slate-800/30 p-3 rounded">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-medium text-slate-300">
                        Animations
                      </h4>
                      <div className="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {availableAnimations.map((anim, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnimation(anim)}
                            className={`text-xs px-3 py-1.5 text-left ${
                              selectedAnimation === anim ||
                              (index === 0 && !selectedAnimation)
                                ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                            }`}
                          >
                            {anim}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Model Details */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-slate-950/0 p-6">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 bg-slate-800/20 p-3 rounded">
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Attribution
                        </div>
                        {selectedModel.creator ? (
                          <a
                            href={selectedModel.attribution_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                          >
                            By {selectedModel.creator}
                            {selectedModel.attribution_url && (
                              <ExternalLink className="w-3 h-3" />
                            )}
                          </a>
                        ) : (
                          <div className="text-sm text-slate-400">Unknown</div>
                        )}
                      </div>

                      <div className="space-y-2 bg-slate-800/20 p-3 rounded">
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          License
                        </div>
                        {selectedModel.licence ? (
                          <a
                            href={getLicenseUrl(selectedModel.licence)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-400 hover:underline flex items-center gap-1"
                          >
                            {selectedModel.licence}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <div className="text-sm text-slate-400">
                            No license information
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attribution & Preview Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddToScene}
                          disabled={!selectedModel}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white transition-all duration-300 disabled:opacity-50 disabled:hover:from-blue-500 disabled:hover:to-violet-500 rounded-md"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Scene
                        </button>
                      </div>
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
        </div>
      </div>
    </Portal>
  );
}
