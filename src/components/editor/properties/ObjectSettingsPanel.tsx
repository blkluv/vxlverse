import { useState } from "react";
import { Settings, Minimize, Maximize, Edit3, Check, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "../../../stores/editorStore";
import { Input } from "../../UI/input";
import { Select } from "../../UI/select";

export function ObjectSettingsPanel() {
  const [expanded, setExpanded] = useState(true);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Get data from the editor store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const updateObject = useEditorStore((state) => state.updateObject);

  // Find the current scene and selected object
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find(
    (obj) => obj.id === selectedObjectId
  );

  // Handle changes to object properties
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentSceneId && selectedObjectId) {
      updateObject(currentSceneId, selectedObjectId, { name: e.target.value });
      showSaveAnimation();
    }
  };

  const handleTypeChange = (value: string) => {
    if (currentSceneId && selectedObjectId) {
      updateObject(currentSceneId, selectedObjectId, { type: value });
      showSaveAnimation();
    }
  };

  const showSaveAnimation = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1500);
  };

  // If no object is selected, don't render anything
  if (!selectedObject) return null;

  return (
    <div className="bg-gradient-to-b from-slate-800/40 to-slate-800/30 border border-slate-700/40 overflow-hidden  shadow-md">
      <div
        className="flex justify-between items-center p-2.5 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xs font-medium text-slate-200 flex items-center">
          <Settings className="w-3.5 h-3.5 text-green-400 mr-1.5" />
          Object Settings
          {showSaveIndicator && (
            <div className="ml-2 flex items-center text-[10px] text-green-400">
              <Check className="w-3 h-3 mr-0.5" />
              <span>Saved</span>
            </div>
          )}
        </h3>
        <div className="flex items-center">
          <div className="text-[10px] text-slate-400 mr-2 px-1.5 py-0.5 bg-slate-700/30 ">
            ID: {selectedObject.id.substring(0, 6)}
          </div>
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
            <div className="flex h-8 items-center space-x-2 mb-3">
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center  bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30">
                <Edit3 className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-grow h-8 bg-slate-900/60  border border-slate-700/50  focus-within:border-green-500/50 focus-within:ring-1 focus-within:ring-green-500/30">
                <Input
                  value={selectedObject.name || ""}
                  onChange={handleNameChange}
                  className="w-full h-full text-xs bg-transparent border-0 outline-none text-slate-200 placeholder-slate-500"
                  placeholder="Enter object name"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center  bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <Tag className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-grow">
                <Select
                  value={selectedObject.type || "prop"}
                  onValueChange={handleTypeChange}
                  className="w-full text-xs bg-slate-900/60 border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                >
                  <option value="prop">Prop</option>
                  <option value="npc">NPC</option>
                  <option value="enemy">Enemy</option>
                  <option value="item">Item</option>
                  <option value="portal">Portal</option>
                  <option value="trigger">Trigger</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
