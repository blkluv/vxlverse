import { Model3D } from "../types";
import { motion } from "framer-motion";
import { Calendar, User, Tag, FileKey, Info } from "lucide-react";

interface ModelDetailsProps {
  model: Model3D;
}

export function ModelDetails({ model }: ModelDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-8 bg-gray-800  p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-400" />
        Model Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <User className="w-4 h-4" />
            <h3>Creator</h3>
          </div>
          <p>{model.creator}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <FileKey className="w-4 h-4" />
            <h3>License</h3>
          </div>
          <p>{model.licence}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Calendar className="w-4 h-4" />
            <h3>Created</h3>
          </div>
          <p>{new Date(model.created).toLocaleDateString()}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Tag className="w-4 h-4" />
            <h3>Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {model.tags.split(",").map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-700  text-sm">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Info className="w-4 h-4" />
            <h3>Attribution</h3>
          </div>
          <p className="text-sm">{model.attribution}</p>
        </div>
      </div>
    </motion.div>
  );
}
