import { useEffect, useState, useMemo } from "react";
import { Model3D } from "../types";

const DATA_URL =
  "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/data.json";

export function useModels(searchQuery: string, selectedCategory: string) {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchModels() {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        if (mounted) setModels(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load models");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchModels();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(models.map((model) => model.category));
    return ["All", ...Array.from(uniqueCategories)].sort();
  }, [models]);

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesCategory = selectedCategory === "All" || model.category === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        model.name.toLowerCase().includes(searchLower) ||
        model.creator.toLowerCase().includes(searchLower) ||
        model.tags.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [models, selectedCategory, searchQuery]);

  return { models: filteredModels, categories, loading, error };
}
