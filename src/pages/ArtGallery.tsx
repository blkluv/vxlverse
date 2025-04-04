import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import { debounce, useEditorStore } from "../stores/editorStore";
import { Perf } from "r3f-perf";
import { useParams } from "react-router-dom";
import { EditorHeader } from "../components/editor/EditorHeader";
// import { Hero } from "../components/game/Hero";
import { Toolbar } from "../components/editor/Toolbar";
import { GalleryPropertiesPanel } from "../components/gallery/GalleryPropertiesPanel";
import { ArtEditor } from "../components/gallery/Editor";
import { PaintingToolbar } from "../components/gallery/PaintingToolbar";
import { usePaintingsStore } from "../stores/paintingsStore";
// Updated keyboard mapping for tools - same as Editor
const KEYBOARD_MAP = [
  { name: "translate", keys: ["KeyW"] },
  { name: "rotate", keys: ["KeyE"] },
  { name: "scale", keys: ["KeyR"] },
  { name: "brush", keys: ["KeyB"] },
  { name: "grid", keys: ["KeyG"] },
  { name: "snap", keys: ["KeyS"] },
  { name: "undo", keys: ["KeyZ"] },
  { name: "redo", keys: ["KeyY"] },
  { name: "focus", keys: ["KeyF"] },
  { name: "full screen", keys: ["Meta+KeyF"] },
  { name: "metrics", keys: ["KeyM"] },
  { name: "escape", keys: ["Escape"] },
  { name: "duplicate", keys: ["KeyD"] },
  { name: "add object", keys: ["KeyO"] },
  {
    name: "new scene",
    keys: ["KeyN"],
  },

  { name: "nextObject", keys: ["KeyK"] },
  { name: "prevObject", keys: ["KeyJ"] },
  { name: "sceneTab", keys: ["1"] },
  { name: "propertiesTab", keys: ["2"] },
  { name: "questTab", keys: ["3"] },
  { name: "shortcutInfo", keys: ["?"] },

  // Changed delete key to the dedicated Delete key
  { name: "delete", keys: ["Backspace"] },
];

export function ArtGallery() {
  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <_ArtGallery />
    </KeyboardControls>
  );
}

export function _ArtGallery() {
  const { scenes, currentSceneId, createNewScene, undo, redo } = useEditorStore();
  const [showMetrics, setShowMetrics] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [showGrid, setShowGrid] = useState(true);
  const [gridSnap, setGridSnap] = useState(false);
  const orbitControlsRef = useRef<any>(null);
  const focusOnObject = useEditorStore((state) => state.focusOnObject);
  const handleResize = debounce(() => {
    setForceUpdate((prev) => prev + 1);
  }, 1000);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scenes]);

  // Handle keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key is pressed with the command/ctrl key
      const isCommandOrCtrl = e.metaKey || e.ctrlKey;

      if (isCommandOrCtrl && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          // Command/Ctrl + Shift + Z = Redo
          redo();
        } else {
          // Command/Ctrl + Z = Undo
          undo();
        }
      } else if (isCommandOrCtrl && e.key === "y") {
        // Command/Ctrl + Y = Redo (alternative)
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  // Create a default scene if none exists
  useEffect(() => {
    if (scenes.length === 0) {
      createNewScene("Art Gallery");
    }
  }, [scenes, createNewScene]);

  const { id } = useParams<{ id: string }>();
  // const { paintings } = useGalleryStore();

  // Toggle functions for grid and grid snap
  const toggleGrid = () => setShowGrid((prev: boolean) => !prev);
  const toggleGridSnap = () => setGridSnap((prev: boolean) => !prev);

  // Get the selected painting from the store
  const selectedPaintingId = usePaintingsStore((state) => state.selectedPaintingId);

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900">
      {/* Main toolbar */}

      <EditorHeader setShowMetrics={setShowMetrics} showMetrics={showMetrics} />

      <div className="editorLayout">
        <div className="toolbar flex">
          {/* Show PaintingToolbar when a painting is selected, otherwise show regular Toolbar */}
          {selectedPaintingId ? (
            <PaintingToolbar
              setTransformMode={setTransformMode}
              setShowMetrics={setShowMetrics}
              showMetrics={showMetrics}
              showGrid={showGrid}
              toggleGrid={toggleGrid}
              gridSnap={gridSnap}
              toggleGridSnap={toggleGridSnap}
            />
          ) : (
            <Toolbar
              setTransformMode={setTransformMode}
              setShowMetrics={setShowMetrics}
              showMetrics={showMetrics}
            />
          )}
        </div>

        <div className="editor-canvas">
          {currentSceneId ? (
            <Canvas
              key={currentSceneId + forceUpdate}
              shadows
              gl={{ preserveDrawingBuffer: true }}
              camera={{ position: [5, 5, 5], fov: 50 }}
              className="w-full relative h-full"
            >
              {showMetrics && <Perf className="absolute z-10 w-80 top-0 left-0" />}

              <ArtEditor transformMode={transformMode} showGrid={showGrid} gridSnap={gridSnap} />
              <OrbitControls ref={orbitControlsRef} makeDefault />
            </Canvas>
          ) : (
            <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              No scene selected
            </div>
          )}
        </div>
        <GalleryPropertiesPanel />
      </div>
      <img
        className="absolute hidden md:block bottom-12 left-12 w-20 z-40"
        src="/icons/large-logo.png"
        alt="VXLverse"
      />
    </div>
  );
}
