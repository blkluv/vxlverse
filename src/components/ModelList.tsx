import { Model3D } from "../types";
import { ModelCard } from "./ModelCard";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

interface ModelListProps {
  models: Model3D[];
  selectedModel: Model3D | null;
  onSelectModel: (model: Model3D) => void;
  loading: boolean;
}

export function ModelList({
  models,
  selectedModel,
  onSelectModel,
  loading,
}: ModelListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-400"
      >
        No models found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          isSelected={selectedModel?.id === model.id}
          onSelect={onSelectModel}
        />
      ))}
    </div>
  );
}
