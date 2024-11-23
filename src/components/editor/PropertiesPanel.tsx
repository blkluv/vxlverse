import { useEditorStore } from '../../stores/editorStore';
import { TransformPanel } from './TransformPanel';
import { QuestPanel } from './QuestPanel';
import { SceneSettingsPanel } from './SceneSettingsPanel';
import { FileCode } from 'lucide-react';

export function PropertiesPanel() {
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find((obj) => obj.id === selectedObjectId);
  const updateObject = useEditorStore((state) => state.updateObject);
  const updateScene = useEditorStore((state) => state.updateScene);

  if (!currentScene) return null;

  return (
    <div className="absolute top-0 right-0 w-[380px] h-full bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          {selectedObject ? (
            <>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileCode className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-medium text-slate-100">{selectedObject.name}</h2>
                <div className="text-xs text-slate-400 mt-0.5">Properties</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FileCode className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-medium text-slate-100">Scene Settings</h2>
                <div className="text-xs text-slate-400 mt-0.5">{currentScene.name}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {selectedObject ? (
          <div className="p-4 space-y-6">
            <TransformPanel
              object={selectedObject}
              onChange={(updates) => {
                if (currentSceneId) {
                  updateObject(currentSceneId, selectedObject.id, updates);
                }
              }}
            />

            <QuestPanel
              object={selectedObject}
              onChange={(updates) => {
                if (currentSceneId) {
                  updateObject(currentSceneId, selectedObject.id, updates);
                }
              }}
            />
          </div>
        ) : (
          <SceneSettingsPanel 
            scene={currentScene}
            onChange={(updates) => updateScene(currentScene.id, updates)}
          />
        )}
      </div>
    </div>
  );
}