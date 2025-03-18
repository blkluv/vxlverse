import { useState, useEffect } from "react";
import {
  Play,
  Minimize,
  Maximize,
  Loader2,
  RefreshCw,
  Check,
  MousePointer,
  HandMetal,
  Activity,
  Info,
  Plus,
} from "lucide-react";
import { Button } from "../../UI/Button";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEditorStore } from "../../../stores/editorStore";

// Animation state type
type AnimationState = "idle" | "click" | "hit";

// Animation state configuration
const ANIMATION_STATES: {
  id: AnimationState;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}[] = [
  {
    id: "idle",
    label: "Idle",
    icon: <Activity className="w-3 h-3" />,
    color: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    description: "Default animation when no interaction occurs",
  },
  {
    id: "click",
    label: "Click",
    icon: <MousePointer className="w-3 h-3" />,
    color: "bg-amber-500/20 border-amber-500/30 text-amber-400",
    description: "Animation played when player clicks on object",
  },
  {
    id: "hit",
    label: "Hit",
    icon: <HandMetal className="w-3 h-3" />,
    color: "bg-red-500/20 border-red-500/30 text-red-400",
    description: "Animation played when object is hit or damaged",
  },
];

export function AnimationsPanel() {
  const [expanded, setExpanded] = useState(true);
  const [modelAnimations, setModelAnimations] = useState<string[]>([]);
  const [isLoadingAnimations, setIsLoadingAnimations] = useState(false);
  const [selectedState, setSelectedState] = useState<AnimationState>("idle");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Get state from the store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const updateObject = useEditorStore((state) => state.updateObject);

  // Get the current scene and selected object
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find((obj) => obj.id === selectedObjectId);

  // If no scene or no selected object, don't render
  if (!currentScene || !selectedObject) return null;

  // Get animations for the selected object
  const animations = selectedObject.animations || {};

  // Split animation loading into smaller, focused functions
  const preloadModel = async (url: string) => {
    try {
      useGLTF.preload(url);
      return true;
    } catch (error) {
      console.error("Error preloading model:", error);
      return false;
    }
  };

  const extractAnimationNames = (gltf: GLTF) => {
    if (!gltf?.animations?.length) return [];

    return gltf.animations.map((animation) => animation.name).filter((name) => name); // Filter out empty names
  };

  const loadModelAnimations = async (url: string) => {
    try {
      setIsLoadingAnimations(true);
      const preloaded = await preloadModel(url);
      if (!preloaded) {
        throw new Error("Failed to preload model");
      }

      const gltf = await useGLTF(url);
      const animations = extractAnimationNames(gltf);
      setModelAnimations(animations);

      return animations;
    } catch (error) {
      console.error("Error loading animations:", error);
      return [];
    } finally {
      setIsLoadingAnimations(false);
    }
  };

  // Effect to load animations when the model URL changes
  useEffect(() => {
    if (selectedObject && selectedObject.modelUrl) {
      loadModelAnimations(selectedObject.modelUrl);
    } else {
      setModelAnimations([]);
    }
  }, [selectedObject?.modelUrl]);

  // Handle refreshing animations
  const handleRefreshAnimations = async () => {
    if (selectedObject?.modelUrl) {
      const animations = await loadModelAnimations(selectedObject.modelUrl);
      if (animations.length > 0) {
        toast.success(`Found ${animations.length} animations`);
      } else {
        toast.error("No animations found in model");
      }
    }
  };

  // Handle selecting an animation for a specific state
  const handleAnimationSelect = (animationName: string, state: AnimationState) => {
    if (currentScene.id) {
      // Create updated animations object
      const updatedAnimations = {
        ...(selectedObject.animations || {}),
        [state]: animationName,
      };

      // Update the object
      updateObject(currentScene.id, selectedObject.id, {
        animations: updatedAnimations,
      });
    }
  };

  // Toggle animation preview
  const toggleAnimationPreview = (animationName: string) => {
    if (currentScene.id) {
      // Set as active animation for preview
      updateObject(currentScene.id, selectedObject.id, {
        activeAnimation: animationName,
      });
    }
  };

  // Get the current animation for the selected state
  const getCurrentStateAnimation = (state: AnimationState) => {
    return selectedObject.animations?.[state] || null;
  };

  // Get state configuration by id
  const getStateConfig = (stateId: AnimationState) => {
    return ANIMATION_STATES.find((state) => state.id === stateId) || ANIMATION_STATES[0];
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 overflow-hidden ">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Play className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
          Animations
        </h3>
        {expanded ? (
          <Minimize className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-700/30">
          {selectedObject?.modelUrl ? (
            <div className="p-3 space-y-4">
              {/* Animation States Tabs */}
              <div className="flex space-x-1 bg-slate-800/40 p-1 ">
                {ANIMATION_STATES.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => setSelectedState(state.id)}
                    className={`flex-1 flex items-center justify-center text-[10px] py-1.5 px-2  transition-all duration-200 relative ${
                      selectedState === state.id
                        ? `${state.color} border`
                        : "text-slate-400 hover:bg-slate-700/40"
                    }`}
                    onMouseEnter={() => setShowTooltip(state.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    {state.icon}
                    <span className="ml-1.5">{state.label}</span>

                    {/* Tooltip */}
                    {showTooltip === state.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-36 p-1.5 bg-slate-900 border border-slate-700  shadow-lg z-10 text-[9px] text-slate-300">
                        {state.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Current State Info */}
              {selectedState && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`text-[11px] font-medium ${
                          getStateConfig(selectedState).color.split(" ")[2]
                        }`}
                      >
                        {getStateConfig(selectedState).label} Animation
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleRefreshAnimations}
                      disabled={isLoadingAnimations}
                      className="text-[10px] h-5 px-1.5 text-purple-400 hover:text-purple-300"
                    >
                      {isLoadingAnimations ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  {/* Animation Selection */}
                  {isLoadingAnimations ? (
                    <div className="flex items-center justify-center py-4 bg-slate-800/40  border border-slate-700/30">
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-2" />
                      <span className="text-[11px] text-slate-300">Loading animations...</span>
                    </div>
                  ) : modelAnimations.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/30">
                      {modelAnimations.map((anim) => {
                        const isCurrentStateAnimation =
                          getCurrentStateAnimation(selectedState) === anim;
                        const stateConfig = getStateConfig(selectedState);

                        return (
                          <div
                            key={anim}
                            className={`flex items-center justify-between p-2  ${
                              isCurrentStateAnimation
                                ? `${stateConfig.color.split(" ").slice(0, 2).join(" ")} border`
                                : "bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex-1 truncate">
                              <span
                                className={`text-[11px] font-medium ${
                                  isCurrentStateAnimation
                                    ? stateConfig.color.split(" ")[2]
                                    : "text-slate-300"
                                }`}
                              >
                                {anim}
                              </span>
                            </div>
                            <div className="flex space-x-1.5">
                              <button
                                onClick={() => toggleAnimationPreview(anim)}
                                className="h-6 w-6 flex items-center justify-center bg-slate-900/60 hover:bg-slate-900/80  text-purple-400 hover:text-purple-300 transition-colors"
                                title="Preview Animation"
                              >
                                <Play className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleAnimationSelect(anim, selectedState)}
                                className={`h-6 w-6 flex items-center justify-center  transition-colors ${
                                  isCurrentStateAnimation
                                    ? `${stateConfig.color
                                        .split(" ")[2]
                                        .replace("text-", "bg-")
                                        .replace("400", "600")} text-white`
                                    : `bg-slate-900/60 hover:bg-slate-900/80 ${
                                        stateConfig.color.split(" ")[2]
                                      } hover:text-white`
                                }`}
                                title={`Set as ${getStateConfig(selectedState).label} Animation`}
                              >
                                {isCurrentStateAnimation ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Plus className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 text-center py-4 px-3 bg-slate-800/40  border border-slate-700/30 flex items-center justify-center">
                      <Info className="w-4 h-4 mr-2 text-slate-500" />
                      No animations found in this model. Try a different model with animations.
                    </div>
                  )}
                </div>
              )}

              {/* Animation States Summary */}
              <div className="pt-2 border-t border-slate-700/20">
                <div className="text-[10px] font-medium text-slate-400 mb-2">Animation States</div>
                <div className="space-y-2">
                  {ANIMATION_STATES.map((state) => {
                    const currentAnim = getCurrentStateAnimation(state.id);
                    return (
                      <div
                        key={state.id}
                        className={`flex items-center justify-between p-1.5  ${
                          currentAnim
                            ? `${state.color.split(" ").slice(0, 2).join(" ")} border`
                            : "bg-slate-800/40 border border-slate-700/30"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5  flex items-center justify-center ${
                              state.color.split(" ")[0]
                            } mr-2`}
                          >
                            {state.icon}
                          </div>
                          <div>
                            <div className={`text-[10px] font-medium ${state.color.split(" ")[2]}`}>
                              {state.label}
                            </div>
                            {currentAnim ? (
                              <div className="text-[9px] text-slate-400 truncate max-w-[120px]">
                                {currentAnim}
                              </div>
                            ) : (
                              <div className="text-[9px] text-slate-500">Not set</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedState(state.id)}
                          className={`text-[9px] px-2 py-0.5  ${
                            currentAnim
                              ? `${state.color
                                  .split(" ")[2]
                                  .replace("text-", "bg-")
                                  .replace("400", "600")} text-white`
                              : "bg-slate-700/50 text-slate-300"
                          }`}
                        >
                          {currentAnim ? "Change" : "Set"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col p-6 text-center">
              <div className="w-10 h-10 -full bg-slate-800/60 flex items-center justify-center mb-2">
                <Play className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 max-w-[200px]">
                Select a 3D model object with animations to configure animation states.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
