import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { Image, List, Box, Upload, Plus, X } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { useKeyboardControls } from "@react-three/drei";
import { ObjectHierarchyPanel } from "../editor/ObjectHierarchyPanel";
import { ObjectSettingsPanel } from "../editor/properties/ObjectSettingsPanel";
import { TransformPanel } from "../editor/properties/transform";
import { NoSelected } from "../no-selected";
import { GalleryUploadModal } from "./GalleryUploadModal";
import { usePaintingsStore } from "../../stores/paintingsStore";
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
  const [galleryImages, setGalleryImages] = useState<{ id: string; name: string; url: string }[]>([
    {
      id: "1",
      name: "Abstract Art",
      url: "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    },
    {
      id: "2",
      name: "Landscape",
      url: "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    },
  ]);

  // Track recently added objects to the scene
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);

  // Function to add an image to the scene
  const addImageToScene = useCallback(
    (image: { id: string; name: string; url: string }) => {
      // Add the painting using the paintingsStore
      const paintingId = addPainting(image.url, image.name);

      // Select the newly added painting
      selectPainting(paintingId);

      // Add to recently added
      setRecentlyAdded((prev) => [
        {
          id: paintingId,
          name: image.name,
          modelUrl: image.url,
        },
        ...prev.slice(0, 7),
      ]);
    },
    [addPainting, selectPainting]
  );

  // Function to remove an image from the gallery
  const removeGalleryImage = useCallback((id: string) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

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
          "grid mb-2 border-t md:border-t-0 border-white/10 h-8 grid-cols-2 border-b sticky top-0 z-20 bg-slate-900"
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
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <>
          <div className="h-full pb-20 no-scrollbar overflow-y-auto">
            <div className="p-2 space-y-2">
              {activeTab === "scene" && (
                <>
                  {/* Image Library Section - Now First */}
                  <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-sm mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <Image className="w-4 h-4 mr-2 text-blue-400" />
                        <h3 className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          Image Library
                        </h3>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-sm text-xs flex items-center shadow-sm"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>

                    {galleryImages.length === 0 ? (
                      <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-700/30 rounded-lg bg-slate-800/30">
                        <Image className="w-10 h-10 text-slate-600 mb-2" />
                        <p className="text-slate-400 text-sm mb-1">No images in your library</p>
                        <p className="text-slate-500 text-xs mb-3">
                          Upload images to add to your gallery
                        </p>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs flex items-center"
                        >
                          <Upload className="w-3 h-3 mr-1.5" />
                          <span>Upload Images</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {galleryImages.slice(0, 4).map((image) => (
                            <div
                              key={image.id}
                              className="relative group cursor-pointer"
                              onClick={() => addImageToScene(image)}
                            >
                              <div className="aspect-square overflow-hidden rounded-sm border border-slate-700/50 bg-slate-900/50">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                                <p className="text-xs text-white truncate">{image.name}</p>
                              </div>
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeGalleryImage(image.id);
                                  }}
                                  className="p-1 bg-red-500/80 hover:bg-red-600 rounded-full"
                                  title="Delete"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="p-1 bg-blue-500/80 hover:bg-blue-600 rounded-full"
                                  title="Add to scene"
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-slate-700/30 pt-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-medium text-slate-400">All Images</h4>
                            <p className="text-xs text-slate-500">{galleryImages.length} items</p>
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                            {galleryImages.map((image) => (
                              <div
                                key={image.id}
                                className="flex items-center p-1.5 rounded-sm hover:bg-slate-700/30 group"
                              >
                                <div className="w-6 h-6 mr-2 overflow-hidden rounded-sm border border-slate-700/50 bg-slate-900/50 flex-shrink-0">
                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs truncate flex-1">{image.name}</span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => addImageToScene(image)}
                                    className="p-1 bg-blue-500/80 hover:bg-blue-600 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Add to scene"
                                  >
                                    <Plus className="h-2.5 w-2.5" />
                                  </button>
                                  <button
                                    onClick={() => removeGalleryImage(image.id)}
                                    className="p-1 bg-red-500/80 hover:bg-red-600 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

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
            </div>
          </div>
        </>
      </div>

      {/* Gallery Upload Modal */}
      <GalleryUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  );
}
