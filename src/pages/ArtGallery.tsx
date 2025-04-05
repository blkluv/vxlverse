import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls, Environment } from "@react-three/drei";
import { useEffect, useState, useRef, Suspense } from "react";
import { debounce, useEditorStore } from "../stores/editorStore";
import { Perf } from "r3f-perf";
import { useParams, useNavigate } from "react-router-dom";
import { EditorHeader } from "../components/editor/EditorHeader";
import { GalleryPropertiesPanel } from "../components/gallery/GalleryPropertiesPanel";
import { ArtEditor } from "../components/gallery/Editor";
import { PaintingToolbar } from "../components/gallery/PaintingToolbar";
import { usePaintingsStore } from "../stores/paintingsStore";
import { SEO } from "../components/shared/SEO";
import { Loader } from "../components/shared/Loader";
import { ContentModerationAlert } from "../components/legal/ContentModerationAlert";
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
  const navigate = useNavigate();
  const { scenes, createNewScene, undo, redo } = useEditorStore();
  const [showMetrics, setShowMetrics] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [showGrid, setShowGrid] = useState(true);
  const [gridSnap, setGridSnap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const [moderationMessage, setModerationMessage] = useState("");
  const orbitControlsRef = useRef<any>(null);

  // Get gallery information
  const { id } = useParams<{ id: string }>();
  const { paintings, selectedPaintingId, selectPainting } = usePaintingsStore();

  // Simple auto-save simulation
  const autoSave = debounce(() => {
    console.log("Auto-saved gallery");
    // In a real implementation, this would save to the backend
  }, 5000);

  const handleResize = debounce(() => {
    setForceUpdate((prev) => prev + 1);
  }, 1000);

  // Handle keyboard events directly
  const handleKeyDown = (event: KeyboardEvent) => {
    // Focus on selected object (F key)
    if (event.key === "f" || event.key === "F") {
      if (selectedPaintingId && orbitControlsRef.current) {
        const painting = paintings.find((p) => p.id === selectedPaintingId);
        if (painting && painting.position) {
          // Focus the camera on the painting position
          orbitControlsRef.current.target.set(
            painting.position[0],
            painting.position[1],
            painting.position[2]
          );
          console.log("Focusing on painting:", painting.name);
        }
      }
    }

    // Next object (K key) - Improved implementation
    else if (event.key === "k" || event.key === "K") {
      event.preventDefault(); // Prevent default browser behavior
      if (paintings.length > 0) {
        // Find current index, default to -1 if no painting is selected
        const currentIndex = selectedPaintingId
          ? paintings.findIndex((p) => p.id === selectedPaintingId)
          : -1;

        // Calculate next index with bounds checking
        const nextIndex = (currentIndex + 1) % paintings.length;

        // Only proceed if we have a valid painting
        if (nextIndex >= 0 && nextIndex < paintings.length) {
          selectPainting(paintings[nextIndex].id);
          console.log("Selected next painting:", paintings[nextIndex].name);
        }
      }
    }

    // Previous object (J key) - Improved implementation
    else if (event.key === "j" || event.key === "J") {
      event.preventDefault(); // Prevent default browser behavior
      if (paintings.length > 0) {
        // Find current index, default to last painting if none selected
        const currentIndex = selectedPaintingId
          ? paintings.findIndex((p) => p.id === selectedPaintingId)
          : paintings.length - 1;

        // Calculate previous index with bounds checking
        const prevIndex = currentIndex <= 0 ? paintings.length - 1 : currentIndex - 1;

        // Only proceed if we have a valid painting
        if (prevIndex >= 0 && prevIndex < paintings.length) {
          selectPainting(paintings[prevIndex].id);
          console.log("Selected previous painting:", paintings[prevIndex].name);
        }
      }
    }

    // Escape key to deselect - Improved implementation
    else if (event.key === "Escape") {
      event.preventDefault(); // Prevent default browser behavior
      if (selectedPaintingId) {
        selectPainting(null); // Deselect painting
        console.log("Deselected painting");
      }
    }
  };

  // Setup keyboard event listeners
  useEffect(() => {
    // Add keyboard event listeners - use capture phase for better reliability
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", handleResize);

    // Add some sample paintings if none exist (for testing)
    if (paintings.length === 0) {
      // This would normally come from an API or user upload
      const dummyPainting = {
        id: "test-painting-1",
        name: "Test Painting",
        imageUrl: "https://picsum.photos/800/600",
        position: [0, 1.5, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        width: 1.5,
        height: 1.2,
        createdAt: new Date().toISOString(),
      };

      // Use the store's addPainting method if available
      if (usePaintingsStore.getState().addPainting) {
        usePaintingsStore.getState().addPainting(dummyPainting.imageUrl, dummyPainting.name);
      }
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      // Clean up event listeners
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [scenes, paintings, selectedPaintingId, selectPainting, orbitControlsRef]);

  // Create a default scene if none exists
  useEffect(() => {
    if (scenes.length === 0) {
      createNewScene("Art Gallery");
    }
  }, [scenes, createNewScene]);

  // Toggle functions for grid and grid snap
  const toggleGrid = () => setShowGrid((prev: boolean) => !prev);
  const toggleGridSnap = () => setGridSnap((prev: boolean) => !prev);

  // Handle content moderation alerts
  const handleModerationAlert = (message: string) => {
    setModerationMessage(message);
    setShowModerationAlert(true);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900">
      {/* SEO Optimization */}
      <SEO
        title="Art Gallery Editor"
        description="Create and customize your virtual 3D art gallery. Upload images, arrange paintings, and design your perfect exhibition space."
        keywords="virtual art gallery, 3D gallery editor, art exhibition, digital art space, online gallery creator"
        ogType="website"
      />

      {/* Loading Screen */}
      {isLoading && <Loader message="Loading Art Gallery Editor..." />}

      {/* Content Moderation Alert */}
      {showModerationAlert && (
        <ContentModerationAlert
          message={moderationMessage}
          onClose={() => setShowModerationAlert(false)}
        />
      )}

      {/* Main toolbar */}
      <EditorHeader setShowMetrics={setShowMetrics} showMetrics={showMetrics} />

      <div className="editorLayout">
        <div className="toolbar flex">
          {/* Show PaintingToolbar when a painting is selected, otherwise show regular Toolbar */}
          <PaintingToolbar
            setTransformMode={setTransformMode}
            setShowMetrics={setShowMetrics}
            showMetrics={showMetrics}
            showGrid={showGrid}
            toggleGrid={toggleGrid}
            gridSnap={gridSnap}
            toggleGridSnap={toggleGridSnap}
            onModerationAlert={handleModerationAlert}
          />
        </div>

        <div className="editor-canvas">
          <Canvas
            key={forceUpdate}
            shadows
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            camera={{ position: [5, 5, 5], fov: 50 }}
            className="w-full relative h-full"
          >
            {showMetrics && <Perf className="absolute z-10 w-80 top-0 left-0" />}

            <Suspense fallback={null}>
              <ArtEditor transformMode={transformMode} showGrid={showGrid} gridSnap={gridSnap} />
              <Environment preset="apartment" background={false} />
              <OrbitControls
                ref={orbitControlsRef}
                makeDefault
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.75}
              />
            </Suspense>
          </Canvas>
        </div>
        <GalleryPropertiesPanel />
      </div>
    </div>
  );
}
