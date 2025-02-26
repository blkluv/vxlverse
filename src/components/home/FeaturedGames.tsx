import { motion } from "framer-motion";
import { Star, Users, Clock } from "lucide-react";

const FEATURED_GAMES = [
  {
    id: 1,
    title: "Dragon's Quest",
    description: "Embark on an epic journey through mystical lands",
    image: "https://images.unsplash.com/photo-1642479755125-d073df16ce7e",
    rating: 4.8,
    players: 12500,
    lastUpdated: "2 days ago",
  },
  {
    id: 2,
    title: "Space Odyssey",
    description: "Explore the vast universe in this sci-fi adventure",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679",
    rating: 4.6,
    players: 8300,
    lastUpdated: "5 days ago",
  },
  {
    id: 3,
    title: "Medieval Legends",
    description: "Build your kingdom and conquer new territories",
    image: "https://images.unsplash.com/photo-1615672968435-75de2c710c1b",
    rating: 4.9,
    players: 15200,
    lastUpdated: "1 day ago",
  },
];

export function FeaturedGames() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden  bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-gray-700/50"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Users className="w-4 h-4" />
                    <span>{game.players.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Clock className="w-4 h-4" />
                    <span>{game.lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
