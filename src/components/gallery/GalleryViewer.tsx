import { useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { Loader } from "../shared/Loader";
import { X, Trash2, Eye, Image as ImageIcon, RefreshCw, Plus } from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";
import { GameObject } from "../../types";

export function GalleryViewer() {
  const { images, isLoading, isError, mutate } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState(images);
  const [addingToScene, setAddingToScene] = useState<string | null>(null);

  // Get current scene ID from editor store
  const currentSceneId = useEditorStore((state) => state.currentSceneId);

  // Filter images based on search term

  // Confirm deletion
  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(id);
  };

  // Handle image deletion
  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      setDeleteLoading(imageToDelete);
      await pb.collection("gallery").delete(imageToDelete);
      mutate(); // Refresh the gallery data
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setDeleteLoading(null);
      setImageToDelete(null);
    }
  };

  // Handle adding image to scene
  const handleAddToScene = (imageId: string, imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSceneId) {
      return;
    }
    setAddingToScene(imageId);
    try {
      const id = new THREE.Object3D().uuid;
      const newObject: GameObject = {
        id,
        name: `Painting ${imageId.slice(-6)}`,
        modelUrl: "", // We'll use a plane with the image as texture
        type: "prop",
        description: "Gallery painting",
        position: new THREE.Vector3(0, 1, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        imageUrl,
      };

      useEditorStore.getState().addObject(currentSceneId, newObject);
    } catch (error) {
      console.error("Error adding image to scene:", error);
    } finally {
      setAddingToScene(null);
    }
  };

  // Helper to get selected image data
  const selectedImageData = images.find((img) => img.id === selectedImage);

  // Component for each gallery list item
  const GalleryListItem = ({ image }: { image: any }) => (
    <div
      key={image.id}
      className="flex items-center p-3 rounded-xl hover:bg-slate-800/50 border border-slate-700/30 group transition-all duration-200 hover:border-indigo-500/30 hover:shadow-md"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-slate-700/50 shadow-md">
        <img
          src={image.imageUrl}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">
          Gallery Image {image.id.slice(-6)}
        </p>
        <p className="text-xs text-slate-500 truncate">{new Date().toLocaleDateString()}</p>
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={() => setSelectedImage(image.id)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-all duration-200 hover:scale-105"
          title="View"
        >
          <Eye size={16} />
        </button>
        {currentSceneId && (
          <button
            onClick={(e) => handleAddToScene(image.id, image.imageUrl, e)}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all duration-200 hover:scale-105"
            title="Add to Scene"
            disabled={addingToScene === image.id}
          >
            {addingToScene === image.id ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
          </button>
        )}
        <button
          onClick={(e) => confirmDelete(image.id, e)}
          className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-all duration-200 hover:scale-105"
          title="Delete"
          disabled={deleteLoading === image.id}
        >
          {deleteLoading === image.id ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );

  // Component for the lightbox modal
  const LightboxModal = () => {
    if (!selectedImageData) return null;
    return (
      <div
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <button
          className="absolute top-6 right-6 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 shadow-xl transition-all duration-200 hover:scale-105"
          onClick={() => setSelectedImage(null)}
        >
          <X size={24} />
        </button>
        <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
            <img
              src={selectedImageData.imageUrl}
              alt=""
              className="max-w-full max-h-[85vh] object-contain bg-black/50 p-1 relative z-10"
            />
          </div>
          <div className="mt-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 p-4 flex justify-between items-center shadow-xl">
            <div>
              <h3 className="text-white text-lg font-medium">
                Gallery Image {selectedImageData.id.slice(-6)}
              </h3>
              <p className="text-slate-400 text-sm">Added on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3">
              {currentSceneId && (
                <button
                  onClick={(e) =>
                    handleAddToScene(selectedImageData.id, selectedImageData.imageUrl, e)
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white flex items-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  disabled={addingToScene === selectedImageData.id}
                >
                  {addingToScene === selectedImageData.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus size={18} className="mr-2" />
                  )}
                  <span>Add to Scene</span>
                </button>
              )}
              <button
                onClick={(e) => confirmDelete(selectedImageData.id, e)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white flex items-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                disabled={deleteLoading === selectedImageData.id}
              >
                {deleteLoading === selectedImageData.id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Trash2 size={18} className="mr-2" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Loader size="lg" fullScreen={false} />
          </div>
        </div>
        <p className="text-indigo-300 font-medium animate-pulse">Loading your gallery...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <X size={32} className="text-red-500" />
        </div>
        <h3 className="text-red-400 font-medium mb-2">Failed to load gallery images</h3>
        <p className="text-slate-400 text-sm mb-4">There was a problem connecting to the server</p>
        <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm font-medium flex items-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <ImageIcon size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-indigo-400 font-medium mb-2">Your gallery is empty</h3>
        <p className="text-slate-400 text-sm mb-4">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* (Optional) Search and Controls Bar can be added here */}
      <div className="px-4 pb-4 space-y-2">
        {filteredImages.map((image) => (
          <GalleryListItem key={image.id} image={image} />
        ))}
      </div>
      {selectedImage && <LightboxModal />}
      <ConfirmationModal
        isOpen={imageToDelete !== null}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
