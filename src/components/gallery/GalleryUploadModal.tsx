import { useState, useRef, useCallback } from "react";
import { Modal } from "../UI/Modal";
import { Upload, X, Plus, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { usePaintingsStore } from "../../stores/paintingsStore";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImagePreview {
  id: string;
  name: string;
  url: string;
  file: File;
}

export function GalleryUploadModal({ isOpen, onClose }: GalleryUploadModalProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPainting } = usePaintingsStore();

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
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke object URLs to prevent memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const uploadImages = async () => {
    if (images.length === 0) return;

    setUploading(true);

    try {
      // Add each image as a painting to the gallery
      for (const image of images) {
        // Add the painting using the paintingsStore
        addPainting(image.url, image.name);
      }

      // Clear the images after successful upload
      setImages([]);
      onClose();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
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
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                  <div className="aspect-square overflow-hidden rounded-sm border border-slate-700/50 bg-slate-900/50">
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <p className="text-xs text-white truncate">{image.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div
                onClick={triggerFileInput}
                className="aspect-square flex items-center justify-center border border-dashed border-slate-700/50 rounded-sm bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer"
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
            className="px-4 py-2 text-sm rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={uploadImages}
            disabled={images.length === 0 || uploading}
            className={`px-4 py-2 text-sm rounded-sm flex items-center ${
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
