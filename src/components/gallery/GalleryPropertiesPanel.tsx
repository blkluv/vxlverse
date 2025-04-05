import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { Image, List, Box, Paintbrush } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { useKeyboardControls } from "@react-three/drei";
import { usePaintingsStore } from "../../stores/paintingsStore";
import { PaintingTransformControls } from "./PaintingTransformControls";

type TabType = "transform" | "library" | "hierarchy" | "brush";

export function GalleryPropertiesPanel() {
  const { setSelectedObject, selectedObjectId, currentSceneId, scenes } = useEditorStore(
    (state) => state
  );

  // Get paintings store state and actions
  const { paintings, selectedPaintingId, selectPainting, removePainting } = usePaintingsStore();
  const [activeTab, setActiveTab] = useState<TabType>("transform");
  const hasSelectedObject = Boolean(selectedObjectId);
  const hasSelectedPainting = Boolean(selectedPaintingId);
  const selectedPainting = paintings.find((p) => p.id === selectedPaintingId);

  // State for image library
  const [images, setImages] = useState<{ id: string; name: string; url: string }[]>([
    {
      id: "1",
      name: "Art Piece 1",
      url: "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    },
    {
      id: "2",
      name: "Art Piece 2",
      url: "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    },
    {
      id: "3",
      name: "Art Piece 3",
      url: "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    },
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);

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
          setActiveTab("transform");
        }
      }
    );
    const unsubscribeLibraryTab = subscribeKeys(
      (state) => state.propertiesTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("library");
        }
      }
    );
    const unsubscribeHierarchyTab = subscribeKeys(
      (state) => state.questTab,
      (pressed) => {
        if (pressed) {
          setActiveTab("hierarchy");
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    // Simulate upload delay
    setTimeout(() => {
      const newImages = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setImages([...images, ...newImages]);
      setUploadingImage(false);
    }, 1000);
  };

  // Handle image delete
  const handleDeleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Common tab button styles
  const getTabButtonClasses = (tab: TabType) =>
    clsx(
      "flex-1 border-r last:border-r-0 py-1.5 border-white/10 text-xs font-medium transition-colors",
      {
        "disabled:cursor-not-allowed disabled:text-slate-600":
          !hasSelectedObject && tab === "hierarchy",
        "text-blue-200 bg-blue-900/90": activeTab === tab,
        "text-slate-400 hover:text-slate-300": activeTab !== tab,
      }
    );

  return (
    <div className="h-full inspector flex flex-col bg-slate-900/90 border-l border-slate-800/50 z-10">
      {/* Tab Navigation */}
      <div
        className={clsx(
          "grid mb-2 border-t md:border-t-0 border-white/10 h-8 grid-cols-4 border-b sticky top-0 z-20 bg-slate-900"
        )}
      >
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
            <Image className="w-3.5 h-3.5 mr-1.5" />
            Library
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("hierarchy")}
          onClick={() => setActiveTab("hierarchy")}
          aria-selected={activeTab === "hierarchy"}
        >
          <div className="flex items-center justify-center">
            <List className="w-3.5 h-3.5 mr-1.5" />
            Hierarchy
          </div>
        </button>
        <button
          type="button"
          className={getTabButtonClasses("brush")}
          onClick={() => setActiveTab("brush")}
          aria-selected={activeTab === "brush"}
        >
          <div className="flex items-center justify-center">
            <Paintbrush className="w-3.5 h-3.5 mr-1.5" />
            Brush
          </div>
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <>
          <div className="h-full pb-20 no-scrollbar overflow-y-auto">
            <div className="p-2 space-y-2">
              {/* Transform Tab */}
              {activeTab === "transform" && (
                <>
                  {hasSelectedPainting && selectedPainting ? (
                    <>
                      <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-blue-300">Painting Transform</h3>
                          <button
                            onClick={() => selectedPaintingId && removePainting(selectedPaintingId)}
                            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Use the PaintingTransformControls component */}
                        <PaintingTransformControls />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="bg-slate-800/40 border border-slate-700/30 p-8 shadow-lg max-w-xs">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-blue-500/20">
                          <Box className="w-8 h-8 text-blue-400/80" />
                        </div>
                        <h3 className="text-blue-300 font-medium mb-2">No Painting Selected</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Select a painting in the scene to view and edit its properties.
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-800/60 p-2 border border-slate-700/40">
                          Tip: Use the Library tab to add paintings to your gallery
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Library Tab */}
              {activeTab === "library" && (
                <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-blue-300">Art Gallery Library</h3>
                    <label
                      htmlFor="image-upload"
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs cursor-pointer"
                    >
                      {uploadingImage ? "Uploading..." : "Upload New"}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                    />
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {images.length === 0 ? (
                      <div className="col-span-2 text-gray-400 text-center py-4 bg-slate-900/50 rounded">
                        No images uploaded yet
                      </div>
                    ) : (
                      images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-sm border border-slate-700/50 bg-slate-900/50">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-xs text-white truncate">{image.name}</p>
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <button
                              className="p-1 bg-blue-500/80 hover:bg-blue-600 rounded-sm"
                              onClick={() => {
                                // Add to scene as a painting
                                usePaintingsStore.getState().addPainting(image.url, image.name);
                              }}
                              title="Add to scene"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-1 bg-red-500/80 hover:bg-red-600 rounded-sm"
                              onClick={() => handleDeleteImage(image.id)}
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Brush Tab */}
              {activeTab === "brush" && (
                <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-blue-300">Painting Brush</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 block">Brush Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className={clsx(
                            "px-3 py-2 text-xs rounded-sm flex items-center justify-center",
                            usePaintingsStore.getState().brushMode === "single"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          )}
                          onClick={() => usePaintingsStore.getState().setBrushMode("single")}
                        >
                          <Box className="w-3 h-3 mr-1.5" />
                          Single
                        </button>
                        <button
                          className={clsx(
                            "px-3 py-2 text-xs rounded-sm flex items-center justify-center",
                            usePaintingsStore.getState().brushMode === "continuous"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          )}
                          onClick={() => usePaintingsStore.getState().setBrushMode("continuous")}
                        >
                          <Paintbrush className="w-3 h-3 mr-1.5" />
                          Continuous
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 block">Selected Painting</label>
                      <div className="p-2 bg-slate-900/50 rounded-sm border border-slate-700/30">
                        {selectedPainting ? (
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-2 overflow-hidden rounded-sm border border-slate-700/50">
                              <img
                                src={selectedPainting.imageUrl}
                                alt={selectedPainting.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-300 truncate">
                                {selectedPainting.name}
                              </p>
                              <p className="text-xs text-slate-500">Click on walls to place</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 text-center py-2">
                            Select a painting from the Library tab first
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 block">Brush Settings</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400">Grid Snap</label>
                          <button
                            className={clsx(
                              "px-3 py-2 text-xs rounded-sm w-full",
                              useEditorStore.getState().gridSnap
                                ? "bg-blue-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            )}
                            onClick={() => useEditorStore.getState().toggleGridSnap()}
                          >
                            {useEditorStore.getState().gridSnap ? "On" : "Off"}
                          </button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400">Rotation Lock</label>
                          <button
                            className={clsx(
                              "px-3 py-2 text-xs rounded-sm w-full",
                              usePaintingsStore.getState().rotationLock
                                ? "bg-blue-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            )}
                            onClick={() => usePaintingsStore.getState().toggleRotationLock()}
                          >
                            {usePaintingsStore.getState().rotationLock ? "On" : "Off"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/30">
                      <p className="text-xs text-slate-500 italic">
                        Tip: Use the brush tool to quickly place paintings on walls. Select a
                        painting from the Library tab first, then click on walls to place it.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hierarchy Tab */}
              {activeTab === "hierarchy" && (
                <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-blue-300">Paintings</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => usePaintingsStore.getState().arrangePaintings("wall")}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                        title="Arrange in a line"
                      >
                        Wall
                      </button>
                      <button
                        onClick={() => usePaintingsStore.getState().arrangePaintings("circle")}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                        title="Arrange in a circle"
                      >
                        Circle
                      </button>
                    </div>
                  </div>

                  {paintings.length > 0 ? (
                    <div className="space-y-1">
                      {paintings.map((painting) => (
                        <div
                          key={painting.id}
                          className={`flex items-center p-1.5 rounded-sm cursor-pointer ${painting.id === selectedPaintingId ? "bg-blue-900/30 border border-blue-500/30" : "hover:bg-slate-700/50"}`}
                          onClick={() => selectPainting(painting.id)}
                        >
                          <Box
                            className={`w-3.5 h-3.5 mr-2 ${painting.id === selectedPaintingId ? "text-blue-400" : "text-slate-400"}`}
                          />
                          <span className="text-xs truncate flex-1">{painting.name}</span>
                          <button
                            className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePainting(painting.id);
                            }}
                            title="Remove"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-4 bg-slate-900/50 rounded text-xs">
                      No paintings in the gallery
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
