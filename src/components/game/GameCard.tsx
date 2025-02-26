import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { pb } from "../../lib/pocketbase";
import {
  Star,
  Users,
  Clock,
  Trash2,
  Edit3,
  PlayCircle,
  Heart,
} from "lucide-react";
import { useState } from "react";

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  creator: string;
  rating?: number;
  players?: number;
  updated?: string;
  tags?: string[];
}

interface GameCardProps {
  game: Game;
  index: number;
  onDelete?: () => void;
}

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

export function GameCard({ game, index, onDelete }: GameCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === game.creator;
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      await pb.collection("games").delete(game.id);
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-[20rem]  overflow-hidden backdrop-blur-sm bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 border border-gray-700/30 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col"
    >
      {/* Thumbnail with glass effect */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={
            game.thumbnail
              ? pb.files.getURL(game, game.thumbnail, { thumb: "300x300" })
              : DEFAULT_THUMBNAIL
          }
          alt={game.title}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Link to={`/play/${game.id}`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 p-3  shadow-lg shadow-blue-500/25 backdrop-blur-sm"
            >
              <PlayCircle className="w-6 h-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Like button */}
        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2 p-1.5  backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isLiked ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
        </motion.button>
      </div>

      {/* Content with glass effect */}
      <div className="relative flex-1 p-4 flex flex-col">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-500/10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Title and Actions */}
        <div className="relative flex items-start justify-between gap-2 mb-2">
          <motion.h3
            animate={{ color: isHovered ? "#60A5FA" : "#FFFFFF" }}
            transition={{ duration: 0.3 }}
            className="text-base font-bold truncate"
          >
            {game.title}
          </motion.h3>
          {isOwner && (
            <div className="flex gap-1 flex-shrink-0">
              <Link
                to={`/editor/${game.id}`}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10  backdrop-blur-sm transition-all duration-300"
              >
                <Edit3 className="w-3 h-3" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10  backdrop-blur-sm transition-all duration-300"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="relative text-gray-300 text-xs line-clamp-2 leading-relaxed mb-2">
          {game.description || "No description available"}
        </p>

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="relative flex flex-wrap gap-1 mb-2 max-h-12 overflow-y-auto">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] font-medium text-blue-300 bg-blue-500/10  border border-blue-500/20 backdrop-blur-sm whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats with glass effect */}
        <div className="relative flex items-center gap-3 text-[10px] mt-auto">
          <div className="flex items-center gap-1">
            <div className="p-1  bg-yellow-500/10 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500" />
            </div>
            <span className="text-yellow-500 font-medium">
              {game.rating?.toFixed(1) || "4.5"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="p-1  bg-blue-500/10 backdrop-blur-sm">
              <Users className="w-3 h-3 text-blue-400" />
            </div>
            <span className="text-blue-400 font-medium">
              {game.players || "128"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="p-1  bg-purple-500/10 backdrop-blur-sm">
              <Clock className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-purple-400 font-medium">
              {game.updated
                ? new Date(game.updated).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
