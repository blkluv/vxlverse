import { useState, useRef, useCallback } from "react";
import { Modal } from "../UI/Modal";
import { Upload, X, Plus, Check, Settings, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { pb } from "../../lib/pocketbase";
import { useGallery } from "../../hooks/useGallery";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImagePreview {
  id: string;
  name: string;
  url: string;
  file: File;
  optimizedUrl?: string;
  optimizedSize?: number;
  originalSize: number;
  optimizing?: boolean;
  error?: string;
}

export function GalleryUploadModal({ isOpen, onClose }: GalleryUploadModalProps) {
  const { images: galleryImages, mutate } = useGallery();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [globalOptimizing, setGlobalOptimizing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [quality, setQuality] = useState(80); // WebP quality (0-100)
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Process files: filter image files and create preview objects
  const processFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const newImages = imageFiles.map((file) => ({
      id: uuidv4(),
      name: file.name.replace(/\.[^/.]+$/, ".webp"), // Rename extension to .webp
      url: URL.createObjectURL(file),
      file,
      originalSize: file.size,
      optimizing: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((image) => {
      optimizeImage(image.id, image.file, quality);
    });
  };

  // Optimize image using browser-based canvas conversion to WebP
  const optimizeImage = async (imageId: string, file: File, quality: number) => {
    setGlobalOptimizing(true);
    try {
      // Mark image as optimizing
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, optimizing: true } : img))
      );

      // Load the image
      const img = new Image();
      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      await loadPromise;

      // Resize if needed while keeping the aspect ratio
      const canvas = document.createElement("canvas");
      const MAX_DIMENSION = 2048;
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to WebP blob
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create WebP image"));
          },
          "image/webp",
          quality / 100
        );
      });
      const optimizedUrl = URL.createObjectURL(webpBlob);
      URL.revokeObjectURL(objectUrl);

      // Update image with optimized data
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, optimizing: false, optimizedUrl, optimizedSize: webpBlob.size }
            : img
        )
      );
    } catch (error) {
      console.error("Error optimizing image:", error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, optimizing: false, error: "Failed to optimize" } : img
        )
      );
    } finally {
      setImages((prev) => {
        const stillOptimizing = prev.some((img) => img.optimizing);
        if (!stillOptimizing) setGlobalOptimizing(false);
        return prev;
      });
    }
  };

  // Remove image and clean up URLs
  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
        if (removed.optimizedUrl) URL.revokeObjectURL(removed.optimizedUrl);
      }
      return filtered;
    });
  };

  // Upload all images to PocketBase
  const uploadImages = async () => {
    if (images.length === 0) return;
    setUploading(true);

    try {
      // Upload each image individually to ensure proper handling
      const uploadPromises = images.map(async (image) => {
        // Create a new FormData for each image
        const formData = new FormData();

        let imageBlob: Blob;

        // Get the blob (optimized if available, otherwise original)
        if (image.optimizedUrl) {
          const response = await fetch(image.optimizedUrl);
          imageBlob = await response.blob();
        } else {
          const response = await fetch(image.url);
          imageBlob = await response.blob();
        }

        // Create a file from the blob
        const file = new File([imageBlob], image.name, { type: "image/webp" });

        // Add the file to FormData with the correct field name
        // The field name must match the field in the PocketBase collection
        formData.append("image", file);

        // Add user ID if available
        if (pb.authStore.model?.id) {
          formData.append("user", pb.authStore.model.id);
        }

        // Upload the image
        return await pb.collection("gallery").create(formData);
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);

      // Log success
      console.log(`Successfully uploaded ${results.length} images`);

      // Refresh the gallery data
      mutate();

      // Close the modal and clear images
      setImages([]);
      onClose();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  // Reprocess all images when quality changes
  const reprocessAllImages = () => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        optimizing: true,
        optimizedUrl: undefined,
        optimizedSize: undefined,
        error: undefined,
      }))
    );
    images.forEach((image) => {
      if (image.optimizedUrl) URL.revokeObjectURL(image.optimizedUrl);
      optimizeImage(image.id, image.file, quality);
    });
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (images.length > 0) {
      reprocessAllImages();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Gallery Images">
      <div className="p-6 space-y-4">
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed  p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto mb-2 text-slate-400" />
          <p className="text-slate-300 mb-1">Drag and drop images here</p>
          <p className="text-slate-500 text-sm">or click to browse</p>
        </div>

        {/* Settings */}
        {images.length > 0 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center text-xs text-blue-400 hover:text-blue-300 px-2 py-1"
            >
              <Settings className="w-3 h-3 mr-1" />
              WebP Settings
            </button>
            <div className="text-xs text-slate-400">{globalOptimizing ? "Optimizing..." : ""}</div>
          </div>
        )}
        {showSettings && images.length > 0 && (
          <div className="p-3 bg-slate-800/50  border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quality" className="text-xs text-slate-300">
                WebP Quality: {quality}%
              </label>
              <span className="text-xs text-slate-400">
                Lower = smaller file size, higher = better quality
              </span>
            </div>
            <input
              id="quality"
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => handleQualityChange(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        )}

        {/* Preview Grid */}
        {images.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-blue-300">
                Selected Images ({images.length})
              </h3>
              <button
                onClick={() => setImages([])}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square overflow-hidden -sm border border-slate-700/50 bg-slate-900/50">
                    <img
                      src={image.optimizedUrl || image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <p className="text-xs text-white truncate">{image.name}</p>
                    {image.optimizing ? (
                      <p className="text-[10px] text-blue-400 flex items-center">
                        <span className="animate-pulse mr-1">•</span> Optimizing...
                      </p>
                    ) : image.error ? (
                      <p className="text-[10px] text-red-400 flex items-center">
                        <AlertCircle className="w-2 h-2 mr-1" /> {image.error}
                      </p>
                    ) : image.optimizedSize ? (
                      <p className="text-[10px] text-green-400">
                        {(image.optimizedSize / 1024).toFixed(1)} KB{" "}
                        {image.originalSize > 0 && (
                          <span className="text-slate-400">
                            ({Math.round((1 - image.optimizedSize / image.originalSize) * 100)}%
                            smaller)
                          </span>
                        )}
                      </p>
                    ) : null}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 -full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div
                onClick={triggerFileInput}
                className="aspect-square flex items-center justify-center border border-dashed border-slate-700/50 -sm bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer"
              >
                <Plus className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm -sm bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={uploadImages}
            disabled={images.length === 0 || uploading}
            className={`px-4 py-2 text-sm -sm flex items-center ${
              images.length === 0 || uploading
                ? "bg-blue-700/50 text-blue-300/50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" />
                Add to Gallery
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
