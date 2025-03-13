import { useState } from "react";
import { Scene } from "../../types";
import {
  Box,
  Copy,
  Trash2,
  User,
  Package,
  ScrollText,
  ArrowUpRight,
  Target,
  Skull,
  Minimize,
  Maximize,
  Plus,
  Check,
} from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { Tooltip } from "../UI/Tooltip";

interface ObjectHierarchyPanelProps {
  scene: Scene;
}

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

export function ObjectHierarchyPanel({ scene }: ObjectHierarchyPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Get data from the editor store
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);
  const removeObject = useEditorStore((state) => state.removeObject);
  const duplicateObject = useEditorStore((state) => state.duplicateObject);

  // Show save animation
  const showSaveAnimation = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1500);
  };

  return (
    <div className="bg-gradient-to-b from-slate-800/40 to-slate-800/30 border border-slate-700/40 overflow-hidden shadow-md mt-2">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Box className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          {scene.objects?.length
            ? `Hierarchy (${scene.objects.length})`
            : "Hierarchy"}
          {showSaveIndicator && (
            <div className="ml-2 flex items-center text-[10px] text-green-400">
              <Check className="w-3 h-3 mr-0.5" />
              <span>Saved</span>
            </div>
          )}
        </h3>
        <div className="flex items-center">
          {expanded ? (
            <Minimize className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="overflow-hidden">
          <div className="p-3 pt-2 border-t border-slate-700/30">
            <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {scene.objects?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-center bg-slate-800/20 border border-slate-700/20">
                  <Box className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
                  <p className="text-xs font-medium text-slate-300">
                    No objects in this scene
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 mb-3 max-w-[180px]">
                    Add 3D models from the library to populate your scene
                  </p>
                  <button className="px-2 py-1 text-[10px] font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center gap-1">
                    <Plus size={10} />
                    Add Object
                  </button>
                </div>
              ) : (
                scene.objects?.map((object) => {
                  const hasQuests = object.quests && object.quests.length > 0;
                  const questCount = object.quests?.length || 0;

                  return (
                    <div
                      key={object.id}
                      className={`group p-1 cursor-pointer border transition-all ${
                        selectedObjectId === object.id
                          ? "bg-gradient-to-r from-blue-500/20 to-blue-500/5 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                          : "hover:bg-slate-800/70 opacity-70 border-transparent hover:border-slate-700/50"
                      }`}
                      onClick={() => setSelectedObject(object.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={`w-5 h-5 flex items-center justify-center ${
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
                                if (!scene.id || !selectedObjectId) return;
                                duplicateObject(scene.id, selectedObjectId);
                                showSaveAnimation();
                              }}
                              className="p-1.5 hover:bg-slate-700/70 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <Copy size={12} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeObject(scene.id, object.id);
                                showSaveAnimation();
                              }}
                              className="p-1.5 hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
