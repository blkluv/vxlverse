import { useState, useEffect } from "react";
import { useGallery } from "../../hooks/useGallery";
import { Loader } from "../shared/Loader";
import { X, Trash2, Eye, Image as ImageIcon, RefreshCw } from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

export function GalleryViewer() {
  const { images, isLoading, isError, mutate } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState(images);

  // Filter images based on search term
  useEffect(() => {
    if (!images) return;

    if (searchTerm.trim() === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) =>
        image.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [images, searchTerm]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Handle image deletion confirmation
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
      // Refresh the gallery data
      mutate();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete the image");
    } finally {
      setDeleteLoading(null);
      setImageToDelete(null);
    }
  };

  // Handle image download
  const handleDownload = (url: string, filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "gallery-image.webp";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm font-medium flex items-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
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
      {/* Search and Controls Bar */}

      <AnimatePresence mode="wait">
        /* List View */
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4 space-y-2"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center p-3 rounded-xl hover:bg-slate-800/50 border border-slate-700/30 group transition-all duration-200 hover:border-indigo-500/30 hover:shadow-md"
              onMouseEnter={() => setHoverImage(image.id)}
              onMouseLeave={() => setHoverImage(null)}
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
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="absolute top-6 right-6 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 shadow-xl transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {images.find((img) => img.id === selectedImage) && (
                <>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
                    <img
                      src={images.find((img) => img.id === selectedImage)?.imageUrl}
                      alt=""
                      className="max-w-full max-h-[85vh] object-contain bg-black/50 p-1 relative z-10"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mt-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 p-4 flex justify-between items-center shadow-xl"
                  >
                    <div>
                      <h3 className="text-white text-lg font-medium">
                        Gallery Image {selectedImage?.slice(-6)}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Added on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedImage) confirmDelete(selectedImage, e);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white flex items-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        disabled={deleteLoading === selectedImage}
                      >
                        {deleteLoading === selectedImage ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                          <Trash2 size={18} className="mr-2" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
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
