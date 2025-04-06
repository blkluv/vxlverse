import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls, Environment } from "@react-three/drei";
import { useState, useRef, Suspense, useEffect } from "react";
import { Perf } from "r3f-perf";
import { EditorHeader } from "../components/editor/EditorHeader";
import { GalleryPropertiesPanel } from "../components/gallery/GalleryPropertiesPanel";
import { ArtEditor } from "../components/gallery/Editor";
import { SEO } from "../components/shared/SEO";
import { ContentModerationAlert } from "../components/legal/ContentModerationAlert";
import { Toolbar } from "../components/editor/Toolbar";
import { KEYBOARD_MAP } from "./Editor";
import { useEditorStore } from "../stores/editorStore";

export function ArtGallery() {
  const { createNewScene } = useEditorStore();
  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (!ref.current) {
      createNewScene("Art Gallery");
      ref.current = true;
    }
  }, []);
  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <_ArtGallery />
    </KeyboardControls>
  );
}

export function _ArtGallery() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [forceUpdate] = useState(0);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [showGrid] = useState(true);
  const [gridSnap] = useState(false);
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const [moderationMessage] = useState("");
  const orbitControlsRef = useRef<any>(null);

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
      {/* {isLoading && <Loader message="Loading Art Gallery Editor..." />} */}

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
          <Toolbar
            setTransformMode={setTransformMode}
            setShowMetrics={setShowMetrics}
            showMetrics={showMetrics}
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
