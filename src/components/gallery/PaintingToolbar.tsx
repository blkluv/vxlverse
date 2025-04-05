import { useState, useEffect } from "react";
import {
  Move,
  RotateCcw,
  Maximize2,
  Trash,
  Grid3X3,
  Magnet,
  Gauge,
  Image as ImageIcon,
  Brush,
} from "lucide-react";
import { Tooltip } from "../../components/UI/Tooltip";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { useKeyboardControls } from "@react-three/drei";
import { TermsOfService } from "../legal/TermsOfService";
import { detectNudityContent } from "../../utils/imageModeration";
import { useEditorStore } from "../../stores/editorStore";
// import { cn } from "../../components/UI";

type PaintingToolbarProps = {
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
  setShowMetrics: (show: boolean | ((s: boolean) => boolean)) => void;
  showMetrics: boolean;
  showGrid: boolean;
  toggleGrid: () => void;
  gridSnap: boolean;
  toggleGridSnap: () => void;
  onModerationAlert?: (message: string) => void;
};

export const PaintingToolbar: React.FC<PaintingToolbarProps> = ({
  setTransformMode,
  setShowMetrics,
  showMetrics,
  showGrid,
  toggleGrid,
  gridSnap,
  toggleGridSnap,
  onModerationAlert,
}) => {
  // Local state
  const [activeTool, setActiveTool] = useState<string>("move");
  const [scaleLinked, setScaleLinked] = useState<boolean>(true);
  const [showTerms, setShowTerms] = useState<boolean>(true);
  const [pendingUpload, setPendingUpload] = useState<(() => void) | null>(null);

  // Get paintings store state and actions
  const { toggleBrushMode, brushActive } = useEditorStore();
  const { paintings, selectedPaintingId, removePainting, updatePainting } = usePaintingsStore();

  // Get selected painting
  const selectedPainting = paintings.find((p) => p.id === selectedPaintingId);

  // Handle keyboard controls
  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    // Translate tool (W key in KEYBOARD_MAP)
    const unsubscribeTranslate = subscribeKeys(
      (state: any) => state.translate,
      (pressed: boolean) => {
        if (pressed && selectedPaintingId) {
          setActiveTool("move");
          setTransformMode("translate");
        }
      }
    );

    // Rotate tool (E key in KEYBOARD_MAP)
    const unsubscribeRotate = subscribeKeys(
      (state: any) => state.rotate,
      (pressed: boolean) => {
        if (pressed && selectedPaintingId) {
          setActiveTool("rotate");
          setTransformMode("rotate");
        }
      }
    );

    // Brush tool
    const unsubscribeBrush = subscribeKeys(
      (state) => state.brush,
      (pressed) => {
        if (pressed && selectedPaintingId) {
          setActiveTool("brush");
          console.log("Brush mode: ", pressed);
          toggleBrushMode(pressed);
        }
      }
    );

    // Scale tool (R key in KEYBOARD_MAP)
    const unsubscribeScale = subscribeKeys(
      (state: any) => state.scale,
      (pressed: boolean) => {
        if (pressed && selectedPaintingId) {
          setActiveTool("scale");
          setTransformMode("scale");
        }
      }
    );

    // Delete selected painting (Backspace key)
    const unsubscribeDelete = subscribeKeys(
      (state) => state.delete,
      (pressed) => {
        if (pressed && selectedPaintingId) {
          removePainting(selectedPaintingId);
        }
      }
    );

    // Navigate to next painting (K key)
    const unsubscribeNextObject = subscribeKeys(
      (state: any) => state.nextObject,
      (pressed: boolean) => {
        if (pressed && paintings.length > 0) {
          const currentIndex = selectedPaintingId
            ? paintings.findIndex((p) => p.id === selectedPaintingId)
            : -1;
          const nextIndex =
            currentIndex === -1 || currentIndex === paintings.length - 1 ? 0 : currentIndex + 1;
          updatePainting(paintings[nextIndex].id, {});
        }
      }
    );

    // Navigate to previous painting (J key)
    const unsubscribePrevObject = subscribeKeys(
      (state: any) => state.prevObject,
      (pressed: boolean) => {
        if (pressed && paintings.length > 0) {
          const currentIndex = selectedPaintingId
            ? paintings.findIndex((p) => p.id === selectedPaintingId)
            : -1;
          const prevIndex = currentIndex <= 0 ? paintings.length - 1 : currentIndex - 1;
          updatePainting(paintings[prevIndex].id, {});
        }
      }
    );

    // Escape key to deselect
    const unsubscribeEscape = subscribeKeys(
      (state: any) => state.escape,
      (pressed: boolean) => {
        if (pressed && selectedPaintingId) {
          toggleBrushMode(false);
          updatePainting("", {}); // Deselect by setting empty ID
        }
      }
    );

    return () => {
      unsubscribeTranslate();
      unsubscribeRotate();
      unsubscribeScale();
      unsubscribeDelete();
      unsubscribeNextObject();
      unsubscribePrevObject();
      unsubscribeEscape();
      unsubscribeBrush();
    };
  }, [
    selectedPaintingId,
    paintings,
    setTransformMode,
    removePainting,
    updatePainting,
    subscribeKeys,
    toggleBrushMode,
  ]);

  // Reset painting transform
  const resetTransform = () => {
    if (selectedPaintingId) {
      updatePainting(selectedPaintingId, {
        position: [0, 1.5, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });
    }
  };

  // Handle brush toggle
  const handleBrushToggle = () => {
    if (selectedPaintingId && activeTool === "brush") {
      setActiveTool("move");
      toggleBrushMode(false);
    } else {
      setActiveTool("brush");
      toggleBrushMode(true);
    }
  };

  return (
    <div className="w-10 flex flex-col  bg-slate-900 border-r border-slate-600">
      {/* Add Painting Tool */}
      <Tooltip position="right" content="Add Painting">
        <button
          onClick={() => {
            // Show Terms of Service before allowing upload
            setShowTerms(true);

            // Store the upload function to execute after terms acceptance
            setPendingUpload(() => {
              return () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // Run content moderation check
                    try {
                      const moderationResult = await detectNudityContent(file);

                      if (moderationResult.isNSFW) {
                        // Show moderation alert if content is inappropriate
                        if (onModerationAlert) {
                          onModerationAlert(moderationResult.message);
                        } else {
                          alert(moderationResult.message);
                        }
                        return;
                      }

                      // If content is appropriate, proceed with upload
                      const imageUrl = URL.createObjectURL(file);
                      const name = file.name.split(".")[0];
                      updatePainting(selectedPaintingId || "", { imageUrl, name });
                    } catch (error) {
                      console.error("Error during content moderation:", error);
                      if (onModerationAlert) {
                        onModerationAlert(
                          "An error occurred during content moderation. Please try again."
                        );
                      }
                    }
                  }
                };
                input.click();
              };
            });
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-green-900/30 hover:text-green-300`}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Transform Tools Group */}
      <Tooltip position="right" content="Move Tool (W)">
        <button
          disabled={!selectedPaintingId}
          onClick={() => {
            setActiveTool("move");
            setTransformMode("translate");
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedPaintingId && activeTool === "move"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Move className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Rotate Tool (E)">
        <button
          disabled={!selectedPaintingId}
          onClick={() => {
            setActiveTool("rotate");
            setTransformMode("rotate");
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedPaintingId && activeTool === "rotate"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Scale Tool (R)">
        <button
          disabled={!selectedPaintingId}
          onClick={() => {
            setActiveTool("scale");
            setTransformMode("scale");
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedPaintingId && activeTool === "scale"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Reset Transform */}
      <Tooltip position="right" content="Reset Transform">
        <button
          onClick={resetTransform}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          disabled={!selectedPaintingId}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Delete Painting */}
      <Tooltip position="right" content="Delete Painting (Backspace)">
        <button
          onClick={() => selectedPaintingId && removePainting(selectedPaintingId)}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-red-900/30 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          disabled={!selectedPaintingId}
        >
          <Trash className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Brush Tool (B)">
        <button
          disabled={!selectedPaintingId}
          onClick={handleBrushToggle}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            brushActive
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Brush className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Grid Controls */}
      <Tooltip position="right" content="Toggle Grid">
        <button
          onClick={toggleGrid}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            showGrid
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Toggle Grid Snap">
        <button
          onClick={toggleGridSnap}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            gridSnap
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Performance Controls */}
      <Tooltip position="right" content="Toggle Performance Metrics">
        <button
          onClick={() => setShowMetrics((prev) => !prev)}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            showMetrics
              ? "bg-gradient-to-b from-green-600/30 to-green-500/20 text-green-300 border-l-2 border-green-400 shadow-[0_2px_4px_rgba(74,222,128,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Gauge className="w-4 h-4" />
        </button>
      </Tooltip>
      {showTerms && (
        <TermsOfService
          onAccept={() => {
            setShowTerms(false);
            if (pendingUpload) {
              pendingUpload();
              setPendingUpload(null);
            }
          }}
          onClose={() => {
            setShowTerms(false);
            setPendingUpload(null);
          }}
        />
      )}
    </div>
  );
};
