import { Plus, Trash } from "lucide-react";
import { useEditorStore } from "../../../stores/editorStore";
import { NewSceneModal } from "../NewSceneModal";
import { useEffect, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";

export function SceneSelector() {
  const [showNewSceneModal, setShowNewSceneModal] = useState(false);
  const {
    scenes,
    currentSceneId,
    toggleBrushMode,
    setSelectedObject,
    setCurrentScene,
    removeScene,
  } = useEditorStore();

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeEsc = subscribeKeys(
      (state) => state.escape,
      (pressed) => {
        if (pressed) {
          setShowNewSceneModal(false);
        }
      }
    );
    const unsubscribeNewScene = subscribeKeys(
      (state) => state["new scene"],
      (pressed) => {
        if (pressed) {
          setShowNewSceneModal(true);
        }
      }
    );

    return () => {
      unsubscribeEsc();
      unsubscribeNewScene();
    };
  }, [subscribeKeys]);

  return (
    <div className="h-full w-full no-scrollbar top-0 left-0 right-0 z-50 flex overflow-x-auto bg-slate-900 backdrop-blur-sm border-b border-slate-800">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => {
            toggleBrushMode(false);

            setSelectedObject(null);
            setCurrentScene(scene.id);
          }}
          className={`px-4 py-2 text-[10px] font-medium flex items-center gap-2 whitespace-nowrap border-r border-slate-800/50 min-w-[150px] max-w-[180px] transition-all ${
            scene.id === currentSceneId
              ? "bg-slate-800 text-white border-b-2 border-blue-500"
              : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/30"
          }`}
        >
          <span className="truncate text-[10px] mr-auto">{scene.name}</span>
          <Trash
            size={12}
            className="ml-2  min-w-6 text-slate-500 hover:text-red-500"
            onClick={(e) => {
              confirm("Are you sure you want to delete this scene?") && removeScene(scene.id);
            }}
          />
        </button>
      ))}
      <button
        onClick={() => setShowNewSceneModal(true)}
        className="px-2 w-fit text-blue-500 bg-slate-900/50  text- font-medium flex items-center gap-2 whitespace-nowrap transition-all"
        title="Add New Scene"
      >
        <Plus size={14} className="text-white" />
      </button>

      {/* New Scene Modal */}
      {showNewSceneModal && <NewSceneModal onClose={() => setShowNewSceneModal(false)} />}
    </div>
  );
}
