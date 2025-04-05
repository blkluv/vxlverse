import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { List, Box } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { useKeyboardControls } from "@react-three/drei";
import { ObjectHierarchyPanel } from "../editor/ObjectHierarchyPanel";
import { ObjectSettingsPanel } from "../editor/properties/ObjectSettingsPanel";
import { TransformPanel } from "../editor/properties/transform";
import { NoSelected } from "../no-selected";
import { GalleryUploadModal } from "./GalleryUploadModal";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { useGallery } from "../../hooks/useGallery";
import { pb } from "../../lib/pocketbase";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import { GalleryViewer } from "./GalleryViewer";
type TabType = "transform" | "library" | "scene" | "brush" | "settings";

export function GalleryPropertiesPanel() {
  const { setSelectedObject, selectedObjectId, currentSceneId, scenes } = useEditorStore(
    (state) => state
  );

  // Get paintings store state and actions
  const { addPainting, selectPainting } = usePaintingsStore();
  const [activeTab, setActiveTab] = useState<TabType>("transform");
  const hasSelectedObject = Boolean(selectedObjectId);

  // Gallery state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { images: galleryImages, isLoading, isError, mutate } = useGallery();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Track recently added objects to the scene
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);

  // Function to add an image to the scene
  const addImageToScene = useCallback(
    (image: { id: string; imageUrl: string }) => {
      // Add the painting using the paintingsStore
      const paintingId = addPainting(image.imageUrl, image.id);

      // Select the newly added painting
      selectPainting(paintingId);

      // Add to recently added
      setRecentlyAdded((prev) => [
        {
          id: paintingId,
          name: image.id,
          modelUrl: image.imageUrl,
        },
        ...prev.slice(0, 7),
      ]);
    },
    [addPainting, selectPainting]
  );

  // Function to show delete confirmation
  const confirmDelete = useCallback((id: string) => {
    setImageToDelete(id);
  }, []);

  // Function to remove an image from the gallery
  const removeGalleryImage = useCallback(async () => {
    if (!imageToDelete) return;

    try {
      setDeleteLoading(imageToDelete);
      await pb.collection("gallery").delete(imageToDelete);
      // Refresh the gallery data
      mutate();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setDeleteLoading(null);
      setImageToDelete(null);
    }
  }, [imageToDelete, mutate]);

  // Function to refresh gallery images
  const refreshGallery = useCallback(async () => {
    setRefreshing(true);
    try {
      await mutate();
    } finally {
      setTimeout(() => setRefreshing(false), 500); // Add a small delay for better UX
    }
  }, [mutate]);

  const selectObject = useCallback(
    (dir: "next" | "prev") => {
      // Retrieve the current scene
      const currentScene = scenes.find((scene) => scene.id === currentSceneId);
      if (!currentScene) return;

      // Find the index of the currently selected object
      const currentIndex =
        currentScene.objects.findIndex((obj) => obj.id === selectedObjectId) ?? 0;

      // Calculate the new index based on the direction
      let newIndex = dir === "next" ? currentIndex + 1 : currentIndex - 1;

      // Optional: Wrap around if out of bounds
      if (newIndex < 0) {
        newIndex = currentScene.objects.length - 1;
      } else if (newIndex >= currentScene.objects.length) {
        newIndex = 0;
      }

      // Set the selected object using the new index
      const nextObject = currentScene.objects[newIndex];
      if (nextObject) {
        setSelectedObject(nextObject.id);
      }
    },
    [currentSceneId, selectedObjectId, scenes, setSelectedObject]
  );

  // Set up keyboard controls
  const [subscribeKeys] = useKeyboardControls();
  useEffect(() => {
    const unsubscribeTransformTab = subscribeKeys(
      (state) => state.sceneTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("scene");
        }
      }
    );
    const unsubscribeLibraryTab = subscribeKeys(
      (state) => state.propertiesTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("transform");
        }
      }
    );
    const unsubscribeHierarchyTab = subscribeKeys(
      (state) => state.questTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("library");
        }
      }
    );
    const unsubscribeNextObject = subscribeKeys(
      (state) => state.nextObject,
      (pressed) => {
        if (pressed) {
          selectObject("next");
        }
      }
    );
    const unsubscribePrevObject = subscribeKeys(
      (state) => state.prevObject,
      (pressed) => {
        if (pressed) {
          selectObject("prev");
        }
      }
    );
    return () => {
      unsubscribeTransformTab();
      unsubscribeLibraryTab();
      unsubscribeHierarchyTab();
      unsubscribeNextObject();
      unsubscribePrevObject();
    };
  }, [subscribeKeys, selectObject]);

  // Handle file upload

  // Common tab button styles
  const getTabButtonClasses = (tab: TabType) =>
    clsx(
      "flex-1 border-r last:border-r-0 py-1.5 border-white/10 text-xs font-medium transition-colors",
      {
        "disabled:cursor-not-allowed disabled:text-slate-600":
          !hasSelectedObject && tab === "scene",
        "text-blue-200 bg-blue-900/90": activeTab === tab,
        "text-slate-400 hover:text-slate-300": activeTab !== tab,
      }
    );

  return (
    <div className="h-full inspector flex flex-col bg-slate-900/90 border-l border-slate-800/50 z-10">
      {/* Tab Navigation */}
      <div
        className={clsx(
          "grid mb-2 border-t md:border-t-0 border-white/10 h-8 grid-cols-3 border-b sticky top-0 z-20 bg-slate-900"
        )}
      >
        <button
          type="button"
          className={getTabButtonClasses("scene")}
          onClick={() => setActiveTab("scene")}
          aria-selected={activeTab === "scene"}
        >
          <div className="flex items-center justify-center">
            <List className="w-3.5 h-3.5 mr-1.5" />
            Scene
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("transform")}
          onClick={() => setActiveTab("transform")}
          aria-selected={activeTab === "transform"}
        >
          <div className="flex items-center justify-center">
            <Box className="w-3.5 h-3.5 mr-1.5" />
            Transform
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("library")}
          onClick={() => setActiveTab("library")}
          aria-selected={activeTab === "library"}
        >
          <div className="flex items-center justify-center">
            <List className="w-3.5 h-3.5 mr-1.5" />
            Library
          </div>
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <>
          <div className="h-full pb-20 no-scrollbar overflow-y-auto">
            <div className="p-2 space-y-2">
              {activeTab === "scene" && (
                <>
                  {/* Image Library Section - Now First */}

                  {/* Scene Hierarchy */}
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-sm overflow-hidden">
                    <div className="p-3 pb-2 border-b border-slate-700/30 mb-1">
                      <div className="flex items-center">
                        <List className="w-4 h-4 mr-2 text-blue-400" />
                        <h3 className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          Scene Hierarchy
                        </h3>
                      </div>
                    </div>
                    <ObjectHierarchyPanel />
                  </div>
                </>
              )}
              {activeTab === "transform" &&
                (selectedObjectId ? (
                  <>
                    <ObjectSettingsPanel />
                    <TransformPanel />
                  </>
                ) : (
                  <NoSelected />
                ))}
              {activeTab === "library" && (
                <div className="bg-slate-900 border relative border-slate-700/50 rounded-sm mb-4 ">
                  <div className="p-3 flex sticky top-0 z-50 bg-slate-900 justify-between pb-2 border-b border-slate-700/30">
                    <div className="flex items-center">
                      <Box className="w-4 h-4 mr-2 text-blue-400" />
                      <h3 className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        Image Gallery
                      </h3>
                    </div>
                    <div className=" flex justify-end">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 w-full py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-sm text-xs flex items-center shadow-sm"
                      >
                        <span>Upload Images</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-auto custom-scrollbar">
                    <GalleryViewer />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      </div>

      {/* Gallery Upload Modal */}
      <GalleryUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          // Refresh gallery images when modal closes
          mutate();
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={imageToDelete !== null}
        onClose={() => setImageToDelete(null)}
        onConfirm={removeGalleryImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
