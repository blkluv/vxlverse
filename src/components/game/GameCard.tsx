import { Edit, Play, Trash } from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    creator: string;
  };
  onDelete?: () => void;
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === game.creator;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      await pb.collection("games").delete(game.id);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="aspect-video bg-gray-700 relative">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No thumbnail
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.description}</p>
        <div className="flex items-center gap-2">
          <Link
            to={`/play/${game.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Play
          </Link>
          {isOwner && (
            <>
              <Link
                to={`/edit/${game.id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
