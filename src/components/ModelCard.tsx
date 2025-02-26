import { forwardRef } from "react";
import { Model3D } from "../types";
import { motion } from "framer-motion";

interface ModelCardProps {
  model: Model3D;
  isSelected: boolean;
  onSelect: (model: Model3D) => void;
}

export const ModelCard = forwardRef<HTMLButtonElement, ModelCardProps>(
  ({ model, isSelected, onSelect }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelect(model)}
        className={`w-full p-4  transition-all ${
          isSelected
            ? "bg-blue-500 ring-2 ring-blue-400"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={model.thumbnail}
              alt={model.name}
              className="w-full h-full object-cover "
              loading="lazy"
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-medium truncate">{model.name}</h3>
            <p className="text-sm text-gray-400 truncate">{model.creator}</p>
            <div className="mt-1 h-16 overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-1">
                {model.tags.split(",").map((tag, index) => (
                  <span
                    key={`${model.id}-${tag.trim()}-${index}`}
                    className="inline-block px-2 py-0.5 text-xs  bg-gray-700 text-gray-300 whitespace-nowrap"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.button>
    );
  }
);

ModelCard.displayName = "ModelCard";
