import { useState, useEffect } from "react";

// Common art tags
const commonTags = [
  "abstract",
  "landscape",
  "portrait",
  "modern",
  "classical",
  "digital",
  "nature",
  "experimental",
  "historical",
  "contemporary",
  "vibrant",
  "minimalist",
  "surreal",
  "impressionist",
  "expressionist",
];

interface GalleryFiltersProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function GalleryFilters({ selectedTags, onTagsChange }: GalleryFiltersProps) {
  const [availableTags, setAvailableTags] = useState<string[]>(commonTags);

  // In a real app, you might fetch these tags from an API
  useEffect(() => {
    // Simulate fetching tags
    setAvailableTags(commonTags);
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-300 mb-3">Filter by Style/Theme</h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
