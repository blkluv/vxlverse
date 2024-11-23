import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Plus, Trash2, Layout, Edit3, FolderPlus, Box, ChevronRight, ChevronDown } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

export function ScenePanel() {
  const {
    scenes,
    currentSceneId,
    selectedObjectId,
    showModelSelector,
    addScene,
    removeScene,
    setCurrentScene,
    removeObject,
    setSelectedObject,
    setShowModelSelector,
    editingSceneName,
    setEditingSceneName,
    updateSceneName
  } = useEditorStore();

  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set([currentSceneId || '']));

  const handleAddScene = () => {
    const newScene = {
      id: new THREE.Object3D().uuid,
      name: `Scene ${scenes.length + 1}`,
      objects: []
    };
    addScene(newScene);
  };

  const toggleSceneExpanded = (sceneId: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      if (next.has(sceneId)) {
        next.delete(sceneId);
      } else {
        next.add(sceneId);
      }
      return next;
    });
  };

  return (
    <div className="w-80 bg-slate-900 flex flex-col h-full border-r border-slate-800">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-100">Scenes</h2>
        <button
          onClick={handleAddScene}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
          title="Add New Scene"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {scenes.map((scene) => (
          <div key={scene.id}>
            <div
              className={`group rounded-lg transition-all ${
                currentSceneId === scene.id
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <div className="flex items-center p-2">
                <button
                  onClick={() => toggleSceneExpanded(scene.id)}
                  className="p-0.5 text-slate-400 hover:text-slate-100"
                >
                  {expandedScenes.has(scene.id) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                <button
                  className="flex-1 flex items-center gap-2 min-w-0 ml-1"
                  onClick={() => setCurrentScene(scene.id)}
                >
                  <Layout className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {editingSceneName === scene.id ? (
                    <input
                      autoFocus
                      type="text"
                      defaultValue={scene.name}
                      onBlur={(e) => updateSceneName(scene.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateSceneName(scene.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingSceneName(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent text-xs text-slate-100 focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs text-slate-100 truncate">
                      {scene.name}
                      <span className="ml-1 text-[10px] text-slate-400">
                        ({scene.objects.length})
                      </span>
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingSceneName(scene.id)}
                    className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-700/50 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeScene(scene.id)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700/50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Objects List */}
              <AnimatePresence>
                {expandedScenes.has(scene.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 pr-2 pb-1 space-y-1">
                      {scene.objects.map((object) => (
                        <motion.div
                          key={object.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`group p-2 rounded-lg cursor-pointer ${
                            selectedObjectId === object.id
                              ? 'bg-blue-500/10 border border-blue-500/30'
                              : 'hover:bg-slate-800/70 border border-transparent'
                          }`}
                          onClick={() => setSelectedObject(object.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Box className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-xs text-slate-100 truncate">{object.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeObject(scene.id, object.id);
                              }}
                              className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700/50 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      <button
                        onClick={() => setShowModelSelector(true)}
                        className="w-full p-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Object
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModelSelector && <ModelSelector />}
      </AnimatePresence>
    </div>
  );
}