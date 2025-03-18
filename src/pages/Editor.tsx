import { Canvas } from "@react-three/fiber";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import { debounce, useEditorStore } from "../stores/editorStore";
import { Perf } from "r3f-perf";
import { EditorScene } from "../components/editor/EditorScene";
import { Hero } from "../components/game/Hero";
import { useParams } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import { ModelSelector } from "../components/editor/ModelSelector";
import { Toolbar } from "../components/editor/Toolbar";
import { SceneSelector } from "../components/editor/toolbar/SceneSelector";
import { EditorHeader } from "../components/editor/EditorHeader";
// import { pb } from "../lib/pocketbase";

// Updated keyboard mapping for tools
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

export function Editor() {
  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <_Editor />
    </KeyboardControls>
  );
}

export function _Editor() {
  const { scenes, currentSceneId, gridSnap, showGrid, createNewScene, undo, redo } =
    useEditorStore();
  const [showMetrics, setShowMetrics] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const orbitControlsRef = useRef();
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
      createNewScene("New Scene");
    }
  }, [scenes, createNewScene]);
  const { id } = useParams<{ id: string }>();
  useGame(id!);

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900">
      {/* Main toolbar */}
      <ModelSelector />

      <EditorHeader setShowMetrics={setShowMetrics} showMetrics={showMetrics} />

      <div className="editorLayout">
        <div className="scene-selector">
          <SceneSelector />
        </div>
        <div className="toolbar flex">
          <Toolbar
            setTransformMode={setTransformMode}
            setShowMetrics={setShowMetrics}
            showMetrics={showMetrics}
          />
        </div>

        <div className="editor-canvas  ">
          {currentSceneId ? (
            <Canvas
              key={currentSceneId + forceUpdate}
              shadows
              gl={{ preserveDrawingBuffer: true }}
              camera={{ position: [5, 5, 5], fov: 50 }}
              className="w-full relative h-full"
            >
              {showMetrics && <Perf className="absolute z-10 w-80 top-0 left-0" />}

              <group position={[0, 0.3, 0]} rotation={[1.2, 0, 0]}>
                <Hero />
              </group>
              <axesHelper />
              <EditorScene
                showGrid={showGrid}
                gridSnap={gridSnap}
                transformMode={transformMode}
                focusOnObject={focusOnObject}
                orbitControlsRef={orbitControlsRef}
              />
              {/* @ts-ignore */}
              <OrbitControls ref={orbitControlsRef} makeDefault />
            </Canvas>
          ) : (
            <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              No scene selected
            </div>
          )}
        </div>
        <PropertiesPanel />
      </div>
      <img
        className="absolute hidden md:block bottom-12 left-12 w-20 z-40"
        src="/icons/large-logo.png"
        alt="VXLverse"
      />
    </div>
  );
}
