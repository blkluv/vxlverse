import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader, X, Wand2 } from "lucide-react";
import { Model3D } from "../../types";
import { object } from "framer-motion/client";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";

interface AIGenerationInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating?: boolean;
}

const park = {
  name: "park",
  objects: [
    {
      name: "tree",
      position: { x: 2, y: 0, z: 5 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      name: "bench",
      position: { x: -2, y: 0, z: 4 },
      rotation: { x: 0, y: 1.5, z: 0 },
    },
    {
      name: "lamp",
      position: { x: 0, y: 0, z: 3 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      name: "flowerbed",
      position: { x: 3, y: 0, z: 2 },
      rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
      name: "fountain",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  ],
};

const MODEL_API =
  "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/data.json";

export function AIGenerationInput({
  onGenerate,
  isGenerating = false,
}: AIGenerationInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [models, setModels] = useState<Model3D[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt("");
    }
  };

  useEffect(() => {
    fetch(MODEL_API)
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
      });
  }, []);

  const _park = {
    objects: park.objects
      .map((object) => {
        const model = models.find((model) => model.name.match(object.name));
        return {
          ...model,
          position: new THREE.Vector3(0, 0, -4),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1, 1, 1),
        };
      })
      .filter((x) => x.name) as Model3D[],
  };
  const { currentSceneId, updateScene } = useEditorStore();

  const suggestions = [
    "Create a medieval fantasy village",
    "Generate a sci-fi space station",
    "Design a peaceful garden with fountains",
    "Build a mysterious ancient temple",
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-blue-500/20 shadow-xl overflow-hidden"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 border-b border-slate-800/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-200">
                  Suggestions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      if (currentSceneId)
                        updateScene(currentSceneId, {
                          objects: _park.objects,
                        });
                    }}
                    className="p-2 text-left text-sm bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-xl transition-colors ${
                isExpanded
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="w-full px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-200 placeholder-slate-400"
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`p-2 rounded-xl transition-all ${
                prompt.trim() && !isGenerating
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-slate-800/50 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
