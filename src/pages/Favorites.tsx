import { motion } from "framer-motion";
import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/authStore";
import { GameCard } from "../components/game/GameCard";
import { useGames } from "../hooks/useGames";
import { Heart } from "lucide-react";

export function Favorites() {
  const { user } = useAuthStore();
  const { games } = useGames();
  // TODO: Implement actual favorites system
  const favoriteGames = games.slice(0, 3); // Temporary: just show first 3 games

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2  bg-red-500/20 text-red-400"
            >
              <Heart className="w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Favorite Games</h1>
          </div>
          <p className="text-gray-400">Games you've marked as favorites</p>
        </div>

        {/* Games Grid */}
        {favoriteGames.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favoriteGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-700 "
          >
            <div className="p-4  bg-red-500/20 text-red-400 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <div className="text-gray-400 text-center">
              <p className="mb-2">You haven't favorited any games yet.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Browse games →
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
