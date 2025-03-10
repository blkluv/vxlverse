import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FileCode, Settings, Box, Layout } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { QuestPanel } from "./QuestPanel";
import { SceneSettingsPanel } from "./SceneSettingsPanel";
import { ObjectSettingsPanel } from "./properties/ObjectSettingsPanel";
import { TransformPanel } from "./properties/transform";
import { AnimationsPanel } from "./properties/animations";
import { SoundPanel } from "./properties/sounds";
import { PhysicsPanel } from "./properties/PhysicsPanel";

type TabType = "properties" | "quest" | "scene";

export function PropertiesPanel() {
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find(
    (obj) => obj.id === selectedObjectId
  );
  const updateObject = useEditorStore((state) => state.updateObject);
  const updateScene = useEditorStore((state) => state.updateScene);

  // Grid and snapping state/actions
  const gridSnap = useEditorStore((state) => state.gridSnap);
  const showGrid = useEditorStore((state) => state.showGrid);
  const gridSize = useEditorStore((state) => state.gridSize);
  const snapPrecision = useEditorStore((state) => state.snapPrecision);
  const toggleGridSnap = useEditorStore((state) => state.toggleGridSnap);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const setGridSize = useEditorStore((state) => state.setGridSize);
  const setSnapPrecision = useEditorStore((state) => state.setSnapPrecision);

  const [activeTab, setActiveTab] = useState<TabType>("properties");
  const hasSelectedObject = Boolean(selectedObject);

  // Common tab button styles
  const getTabButtonClasses = (tab: TabType) =>
    clsx(
      "flex-1 border-r  last:border-r-0 py-1.5 border-white/10 text-xs font-medium transition-colors",
      {
        "disabled:cursor-not-allowed disabled:text-slate-600":
          !hasSelectedObject,
        "text-blue-200 bg-blue-900/90": activeTab === tab,
        "text-slate-400 hover:text-slate-300": activeTab !== tab,
      }
    );

  return (
    <div className="h-full z-50  flex flex-col bg-slate-900/90 border-l border-slate-800/50">
      {/* Tab Navigation */}
      <div
        className={clsx(
          "grid mb-2 h-8 grid-cols-3 border-b border-white/10",
          {}
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
      <div className="flex-1 overflow-auto ">
        <>
          <div className="h-screen pb-20 no-scrollbar overflow-y-auto">
            <div className="p-2 space-y-2">
              {activeTab === "properties" && (
                <>
                  {hasSelectedObject ? (
                    <>
                      <ObjectSettingsPanel />
                      <TransformPanel />
                      <PhysicsPanel />
                      <AnimationsPanel />
                      <SoundPanel />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
                      <div className="bg-slate-800/40 border border-slate-700/30  p-8 shadow-lg max-w-xs">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4  mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-blue-500/20">
                          <Box className="w-8 h-8 text-blue-400/80" />
                        </div>
                        <h3 className="text-blue-300 font-medium mb-2">
                          No Object Selected
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Select an object in the scene to view and edit its
                          properties.
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
                      object={selectedObject}
                      onChange={(updates) => {
                        if (currentSceneId) {
                          updateObject(
                            currentSceneId,
                            selectedObject.id,
                            updates
                          );
                          toast.success("Quest settings updated");
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
                      <div className="bg-slate-800/40 border border-slate-700/30  p-8 shadow-lg max-w-xs">
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4  mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-indigo-500/20">
                          <FileCode className="w-8 h-8 text-indigo-400/80" />
                        </div>
                        <h3 className="text-indigo-300 font-medium mb-2">
                          No Object Selected
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Select an object in the scene to create and manage
                          quests.
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-800/60 p-2  border border-slate-700/40">
                          Tip: Quests allow players to interact with objects and
                          complete tasks
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
                  showGrid={showGrid}
                  onToggleGrid={toggleGrid}
                  gridSnap={gridSnap}
                  onToggleGridSnap={toggleGridSnap}
                  gridSize={gridSize}
                  onGridSizeChange={setGridSize}
                  snapPrecision={snapPrecision}
                  onSnapPrecisionChange={setSnapPrecision}
                />
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
