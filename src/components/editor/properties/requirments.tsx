import { useState } from "react";
import { GAME_ITEMS } from "../../../types";
import {
  Key,
  Minimize,
  Maximize,
  PlusCircle,
  X,
  Trophy,
  Trash2,
  Package,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../UI/Button";
import { ItemSelector } from "../ItemSelector";
import { useEditorStore } from "../../../stores/editorStore";
import { Slider } from "../../UI/slider";
import toast from "react-hot-toast";

export function RequirementsPanel() {
  const [expanded, setExpanded] = useState(true);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const RequirementSection = ({
    id,
    title,
    icon,
    iconColor,
    children,
    action,
  }: {
    id: string;
    title: string;
    icon: React.ReactNode;
    iconColor: string;
    children: React.ReactNode;
    action?: React.ReactNode;
  }) => (
    <div className="mb-3 last:mb-0 overflow-hidden bg-slate-800/30 border border-slate-700/40  shadow-sm">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-800/60 transition-colors"
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-center">
          <div
            className={`w-6 h-6 flex-shrink-0 flex items-center justify-center  ${iconColor} mr-2`}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {activeSection === id ? (
            <Minimize className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {activeSection === id && (
        <div className="overflow-hidden border-t border-slate-700/40 bg-slate-900/30 backdrop-blur-sm">
          <div className="p-3">{children}</div>
        </div>
      )}
    </div>
  );
  // Get state from the store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const updateObject = useEditorStore((state) => state.updateObject);

  // Get the current scene and selected object
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find(
    (obj) => obj.id === selectedObjectId
  );

  // If no scene or no selected object, don't render
  if (!currentScene || !selectedObject) return null;

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Reusable section component with improved animation and styling

  // Render item card with improved UI
  const ItemCard = ({
    item,
    onRemove,
  }: {
    item: any;
    onRemove: () => void;
  }) => {
    const gameItem = GAME_ITEMS.find((gi) => gi.id === item.id);
    if (!gameItem) return null;

    return (
      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-slate-800/90 to-slate-800/60 border border-slate-700/50  hover:border-amber-500/30 transition-colors shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center text-xl bg-slate-900/50  border border-slate-700/50">
            {gameItem?.emoji || "🔍"}
          </div>
          <div>
            <div className="text-xs font-medium text-amber-300">
              {gameItem?.name || "Unknown Item"}
            </div>
            <div className="text-[9px] text-slate-400 max-w-[180px] truncate">
              {gameItem?.description || "No description"}
            </div>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-300 bg-slate-900/60 hover:bg-red-900/20  border border-slate-700/50 hover:border-red-700/30 transition-all"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/30  overflow-hidden shadow-sm">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Shield className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Requirements
        </h3>
        {expanded ? (
          <Minimize className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="overflow-hidden">
          <div className="p-3 pt-2 border-t border-slate-700/30 space-y-3">
            {/* Required Items Section */}
            <RequirementSection
              id="items"
              title="Required Items"
              icon={<Package className="w-3.5 h-3.5 text-amber-400" />}
              iconColor="bg-amber-500/20 border border-amber-500/30"
              action={
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowItemSelector(true);
                  }}
                  className="text-[10px] h-6 px-2 text-amber-400 hover:text-amber-300 bg-slate-800/60 border border-amber-500/30"
                >
                  <PlusCircle className="w-3 h-3 mr-1" />
                  Add
                </Button>
              }
            >
              {/* List of required items */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {selectedObject.requiredItems?.length ? (
                  selectedObject.requiredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => {
                        updateObject(currentScene.id, selectedObject.id, {
                          requiredItems: selectedObject.requiredItems?.filter(
                            (i) => i.id !== item.id
                          ),
                        });
                        toast.success(
                          `Removed ${item.name || "item"} requirement`
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 px-3 bg-slate-800/40 border border-slate-700/30 ">
                    <AlertCircle className="w-5 h-5 text-slate-500 mb-2" />
                    <div className="text-xs text-slate-400 text-center">
                      No required items. Add items that the player needs to
                      interact with this object.
                    </div>
                  </div>
                )}
              </div>
            </RequirementSection>

            {/* Level Requirement */}
            <RequirementSection
              id="level"
              title="Level Requirement"
              icon={<Trophy className="w-3.5 h-3.5 text-blue-400" />}
              iconColor="bg-blue-500/20 border border-blue-500/30"
            >
              <div className="bg-slate-800/50 border border-slate-700/50 p-3 ">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-blue-300 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    Minimum Level:
                    <span className="font-bold ml-1 text-white">
                      {selectedObject.requiredLvl || 0}
                    </span>
                  </span>
                  <div className="flex items-center bg-slate-900/60 border border-slate-700/80 p-0.5 ">
                    <button
                      onClick={() => {
                        if (
                          currentSceneId &&
                          (selectedObject.requiredLvl || 0) > 0
                        ) {
                          updateObject(currentSceneId, selectedObject.id, {
                            requiredLvl: (selectedObject.requiredLvl || 0) - 1,
                          });
                        }
                      }}
                      className={`w-6 h-6 flex items-center justify-center -sm ${
                        (selectedObject.requiredLvl || 0) > 0
                          ? "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300"
                          : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                      } transition-colors duration-150`}
                      title="Decrease level"
                      disabled={(selectedObject.requiredLvl || 0) <= 0}
                    >
                      <span className="text-xs">-</span>
                    </button>
                    <div className="px-2 min-w-[30px] text-center">
                      <span className="text-xs text-blue-300 font-medium">
                        {selectedObject.requiredLvl || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          currentSceneId &&
                          (selectedObject.requiredLvl || 0) < 50
                        ) {
                          updateObject(currentSceneId, selectedObject.id, {
                            requiredLvl: (selectedObject.requiredLvl || 0) + 1,
                          });
                        }
                      }}
                      className={`w-6 h-6 flex items-center justify-center -sm ${
                        (selectedObject.requiredLvl || 0) < 50
                          ? "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300"
                          : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                      } transition-colors duration-150`}
                      title="Increase level"
                      disabled={(selectedObject.requiredLvl || 0) >= 50}
                    >
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                </div>

                <div className="relative mb-2">
                  <div className="h-2 w-full bg-slate-700/70 -full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 -full"></div>
                  </div>
                  <Slider
                    value={[selectedObject.requiredLvl || 0]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(values) => {
                      if (currentSceneId) {
                        updateObject(currentSceneId, selectedObject.id, {
                          requiredLvl: values[0],
                        });
                      }
                    }}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                </div>

                <div className="mt-3 flex items-start text-[10px] text-slate-400 bg-slate-900/40 p-2  border border-slate-700/40">
                  <Info className="w-3.5 h-3.5 text-blue-400 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>
                    Players below this level will not be able to interact with
                    this object. Set to 0 to allow all players to interact.
                  </span>
                </div>
              </div>
            </RequirementSection>
          </div>
        </div>
      )}

      {/* Item selector modal with improved styling */}
      {showItemSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4 max-h-[70vh] w-[90vw] max-w-[500px] overflow-y-auto bg-slate-900/95 border border-slate-700/50  shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-200 flex items-center">
                <Package className="w-4 h-4 text-amber-400 mr-1.5" />
                Select Required Items
              </h3>
              <button
                onClick={() => setShowItemSelector(false)}
                className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800  transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ItemSelector
              initialSelectedItems={selectedObject.requiredItems || []}
              onClose={() => setShowItemSelector(false)}
              onSelect={(items) => {
                updateObject(currentScene.id, selectedObject.id, {
                  requiredItems: items,
                });
                setShowItemSelector(false);
                toast.success(`Updated required items`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
