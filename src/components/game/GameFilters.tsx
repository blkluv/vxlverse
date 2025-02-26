import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../UI/input";

const TAGS = [
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

interface GameFiltersProps {
  onSearchChange: (search: string) => void;
  onTagsChange: (tags: string[]) => void;
  selectedTags: string[];
}

export function GameFilters({
  onSearchChange,
  onTagsChange,
  selectedTags,
}: GameFiltersProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search games..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
        {search && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Filter by Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5  text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
