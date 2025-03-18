import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FileCode, Settings, Box, Layout } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { QuestPanel } from "./QuestPanel";
import { SceneSettingsPanel } from "./SceneSettingsPanel";
import { ObjectSettingsPanel } from "./properties/ObjectSettingsPanel";
import { TransformPanel } from "./properties/transform";
import { AnimationsPanel } from "./properties/animations";
import { PhysicsPanel } from "./properties/PhysicsPanel";
import { useKeyboardControls } from "@react-three/drei";

type TabType = "properties" | "quest" | "scene";

export function PropertiesPanel() {
  const { setSelectedObject, selectedObjectId, currentSceneId, scenes } = useEditorStore(
    (state) => state
  );
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  const updateObject = useEditorStore((state) => state.updateObject);
  const updateScene = useEditorStore((state) => state.updateScene);
  const [activeTab, setActiveTab] = useState<TabType>("scene");
  const hasSelectedObject = Boolean(selectedObjectId);

  const selectObject = useCallback(
    (dir: "next" | "prev") => {
      // Retrieve the current scene
      const currentScene = scenes.find((scene) => scene.id === currentSceneId);
      if (!currentScene) return;

      // Find the index of the currently selected object
      const currentIndex =
        currentScene.objects.findIndex((obj) => obj.id === selectedObjectId) ?? 0;

      // Calculate the new index based on the direction
      let newIndex = dir === "next" ? currentIndex + 1 : currentIndex - 1;

      // Optional: Wrap around if out of bounds
      if (newIndex < 0) {
        newIndex = currentScene.objects.length - 1;
      } else if (newIndex >= currentScene.objects.length) {
        newIndex = 0;
      }

      // Set the selected object using the new index
      const nextObject = currentScene.objects[newIndex];
      if (nextObject) {
        setSelectedObject(nextObject.id);
      }
    },
    [currentSceneId, selectedObjectId, scenes, setSelectedObject]
  );

  const [subscribeKeys] = useKeyboardControls();
  useEffect(() => {
    const unsubscribeSceneTab = subscribeKeys(
      (state) => state.sceneTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("scene");
        }
      }
    );
    const unsubscribePropertiesTab = subscribeKeys(
      (state) => state.propertiesTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("properties");
        }
      }
    );
    const unsubscribeQuestTab = subscribeKeys(
      (state) => state.questTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("quest");
        }
      }
    );
    const unsubscribeNextObject = subscribeKeys(
      (state) => state.nextObject,
      (pressed) => {
        if (pressed) {
          selectObject("next");
        }
      }
    );
    const unsubscribePrevObject = subscribeKeys(
      (state) => state.prevObject,
      (pressed) => {
        if (pressed) {
          selectObject("prev");
        }
      }
    );
    return () => {
      unsubscribeSceneTab();
      unsubscribePropertiesTab();
      unsubscribeQuestTab();
      unsubscribeNextObject();
      unsubscribePrevObject();
    };
  }, [subscribeKeys, selectObject]);

  // Common tab button styles
  const getTabButtonClasses = (tab: TabType) =>
    clsx(
      "flex-1 border-r  last:border-r-0 py-1.5 border-white/10 text-xs font-medium transition-colors",
      {
        "disabled:cursor-not-allowed disabled:text-slate-600": !hasSelectedObject,
        "text-blue-200 bg-blue-900/90": activeTab === tab,
        "text-slate-400 hover:text-slate-300": activeTab !== tab,
      }
    );

  return (
    <div className="h-full inspector flex flex-col bg-slate-900/90 border-l border-slate-800/50 z-10">
      {/* Tab Navigation */}
      <div
        className={clsx(
          "grid mb-2 border-t md:border-t-0 border-white/10 h-8 grid-cols-3 border-b  sticky top-0 z-20 bg-slate-900"
        )}
      >
        <button
          type="button"
          className={getTabButtonClasses("scene")}
          onClick={() => setActiveTab("scene")}
          aria-selected={activeTab === "scene"}
        >
          <div className="flex items-center justify-center">
            <Layout className="w-3.5 h-3.5 mr-1.5" />
            Scene
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("properties")}
          onClick={() => setActiveTab("properties")}
          aria-selected={activeTab === "properties"}
        >
          <div className="flex items-center justify-center">
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Properties
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("quest")}
          onClick={() => setActiveTab("quest")}
          aria-selected={activeTab === "quest"}
        >
          <div className="flex items-center justify-center">
            <FileCode className="w-3.5 h-3.5 mr-1.5" />
            Quest
          </div>
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <>
          <div className="h-full pb-20 no-scrollbar overflow-y-auto">
            <div className="p-2 space-y-2">
              {activeTab === "properties" && (
                <>
                  {hasSelectedObject ? (
                    <>
                      <ObjectSettingsPanel />
                      <TransformPanel />
                      <PhysicsPanel />
                      <AnimationsPanel />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="bg-slate-800/40 border border-slate-700/30  p-8 shadow-lg max-w-xs">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4  mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-blue-500/20">
                          <Box className="w-8 h-8 text-blue-400/80" />
                        </div>
                        <h3 className="text-blue-300 font-medium mb-2">No Object Selected</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Select an object in the scene to view and edit its properties.
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-800/60 p-2  border border-slate-700/40">
                          Tip: Use the toolbar to add new objects to your scene
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "quest" && (
                <>
                  {hasSelectedObject ? (
                    <QuestPanel
                      object={selectedObjectId}
                      onChange={(updates) => {
                        if (currentSceneId) {
                          updateObject(currentSceneId, selectedObjectId, updates);
                          toast.success("Quest settings updated");
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="bg-slate-800/40 border border-slate-700/30  p-8 shadow-lg max-w-xs">
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4  mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-indigo-500/20">
                          <FileCode className="w-8 h-8 text-indigo-400/80" />
                        </div>
                        <h3 className="text-indigo-300 font-medium mb-2">No Object Selected</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Select an object in the scene to create and manage quests.
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-800/60 p-2  border border-slate-700/40">
                          Tip: Quests allow players to interact with objects and complete tasks
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "scene" && currentScene && (
                <SceneSettingsPanel
                  scene={currentScene}
                  onChange={(updates) => {
                    updateScene(currentScene.id, updates);
                    toast.success("Scene settings updated");
                  }}
                />
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
