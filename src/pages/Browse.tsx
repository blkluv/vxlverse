import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Tag as TagIcon,
  Star,
  Users,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const GAMES = [
  {
    id: 1,
    title: "Dragon's Quest",
    description: "Embark on an epic journey through mystical lands",
    image: "https://images.unsplash.com/photo-1642479755125-d073df16ce7e",
    creator: "John Doe",
    rating: 4.8,
    players: 12500,
    lastUpdated: "2 days ago",
    tags: ["RPG", "Adventure", "Fantasy"],
  },
  // ... more games
];

const FILTERS = {
  categories: [
    "All",
    "RPG",
    "Action",
    "Adventure",
    "Strategy",
    "Puzzle",
    "Racing",
    "Sports",
  ],
  sortBy: ["Most Popular", "Newest", "Top Rated", "Most Played"],
  timeRange: ["All Time", "This Week", "This Month", "This Year"],
};

export function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const [selectedTime, setSelectedTime] = useState("All Time");

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Browse Games</h1>
            <p className="text-gray-400">
              Discover amazing games created by our community
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800  border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2  text-sm font-medium transition-all \${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort & Time Filters */}
          <div className="flex gap-4 ml-auto">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 bg-gray-800  border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILTERS.sortBy.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 bg-gray-800  border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILTERS.timeRange.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gray-800  overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-colors"
            >
              {/* Game Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                {/* Creator Info */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm  px-3 py-1">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=\${game.creator}`}
                    alt={game.creator}
                    className="w-6 h-6 "
                  />
                  <span className="text-sm text-white">{game.creator}</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700/50  text-sm text-gray-300 flex items-center gap-1"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
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

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-6 py-3 bg-blue-500 text-white  font-medium transform -translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                    Play Now
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
