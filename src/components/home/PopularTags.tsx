import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TAGS = [
  { name: "Action", count: 1234 },
  { name: "Adventure", count: 890 },
  { name: "RPG", count: 567 },
  { name: "Strategy", count: 432 },
  { name: "Puzzle", count: 345 },
  { name: "Racing", count: 234 },
  { name: "Sports", count: 123 },
  { name: "Simulation", count: 89 },
];

export function PopularTags() {
  const navigate = useNavigate();

  const handleTagClick = (tagName: string) => {
    navigate(`/games?tag=${tagName.toLowerCase()}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl font-bold">Popular Tags</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TAGS.map((tag, index) => (
            <motion.button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-4  bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20
                       hover:from-purple-500/20 hover:to-purple-700/20 hover:border-purple-500/30 transition-all group"
            >
              <div className="text-lg font-medium text-purple-300 group-hover:text-purple-200">
                {tag.name}
              </div>
              <div className="text-sm text-purple-400/60">
                {tag.count.toLocaleString()} games
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
