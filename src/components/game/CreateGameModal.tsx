import { useState } from "react";
import { Modal } from "../UI/Modal";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { Image, X, Loader2 } from "lucide-react";
import { Input } from "../UI/input";
import { useNavigate } from "react-router-dom";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GAME_TAGS = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Puzzle",
  "Shooter",
  "Racing",
  "Sports",
  "Simulation",
  "Horror",
];

export function CreateGameModal({ isOpen, onClose, onSuccess }: CreateGameModalProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
    gameConf: {},
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("owner", user.id);
      formDataToSend.append("isPublic", String(formData.isPublic));
      // formDataToSend.append("tags", JSON.stringify(selectedTags));
      formDataToSend.append("gameConf", JSON.stringify(formData.gameConf));

      if (thumbnail) {
        formDataToSend.append("thumbnail", thumbnail);
      }

      const x = await pb.collection("games").create(formDataToSend);
      onSuccess();
      onClose();
      setFormData({ title: "", description: "", isPublic: true, gameConf: {} });
      setThumbnail(null);
      setThumbnailPreview("");
      setSelectedTags([]);
      console.log(x);
      navigate(`/editor/${x.id}`);
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Game">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
          <div className="relative aspect-video  overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 border-dashed border-white/10 hover:border-blue-400/50 transition-all duration-300 group">
            {thumbnailPreview ? (
              <div className="relative h-full">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview("");
                  }}
                  className="absolute top-4 right-4 p-2.5  bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/30 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group-hover:bg-white/5 transition-all duration-300">
                <div className="p-4  bg-gradient-to-br from-blue-500/10 to-violet-500/10 group-hover:scale-110 transition-all duration-300">
                  <Image className="w-8 h-8 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-blue-400 mt-4 transition-colors duration-300">
                  Click to upload thumbnail
                </span>
                <span className="text-xs text-gray-600 mt-1">Recommended: 1920x1080px</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            placeholder="Enter game title"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-none"
            placeholder="Enter game description"
            rows={4}
            required
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2">
            {GAME_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2  text-sm font-medium transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-gradient-to-br from-gray-900/80 to-gray-800/80 text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Visibility</label>
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
              className="w-4 h-4  border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 text-blue-500 focus:ring-blue-500/50"
            />
            <span className="text-sm text-gray-400">Make this game public</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5  transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 disabled:opacity-50 disabled:hover:from-blue-500 disabled:hover:to-violet-500 text-white  transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Game"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
