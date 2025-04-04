import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface Painting {
  id: string;
  name: string;
  imageUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  width: number;
  height: number;
  createdAt: string;
}

interface PaintingsState {
  paintings: Painting[];
  selectedPaintingId: string | null;

  // Actions
  addPainting: (imageUrl: string, name: string) => void;
  removePainting: (id: string) => void;
  selectPainting: (id: string | null) => void;
  updatePainting: (id: string, updates: Partial<Omit<Painting, "id">>) => void;
  arrangePaintings: (arrangement: "wall" | "circle" | "custom") => void;
}

// Find a suitable position for a new painting
const findNewPosition = (paintings: Painting[]): [number, number, number] => {
  if (paintings.length === 0) {
    return [0, 1.5, -5]; // First painting goes in front
  }

  // Place along the wall with some spacing
  const wallX = 8; // Wall width
  const spacing = 1.5; // Space between paintings
  const startX = -wallX / 2;

  return [startX + paintings.length * spacing, 1.5, -5];
};

export const usePaintingsStore = create<PaintingsState>((set, get) => ({
  paintings: [],
  selectedPaintingId: null,

  addPainting: (imageUrl, name) => {
    const { paintings } = get();
    const newPosition = findNewPosition(paintings);

    const newPainting: Painting = {
      id: uuidv4(),
      name,
      imageUrl,
      position: newPosition,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      width: 1,
      height: 1.5, // Default to portrait orientation
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      paintings: [...state.paintings, newPainting],
      selectedPaintingId: newPainting.id, // Select the new painting
    }));
  },

  removePainting: (id) => {
    set((state) => ({
      paintings: state.paintings.filter((p) => p.id !== id),
      selectedPaintingId: state.selectedPaintingId === id ? null : state.selectedPaintingId,
    }));
  },

  selectPainting: (id) => {
    set({ selectedPaintingId: id });
  },

  updatePainting: (id, updates) => {
    set((state) => ({
      paintings: state.paintings.map((painting) =>
        painting.id === id ? { ...painting, ...updates } : painting
      ),
    }));
  },

  arrangePaintings: (arrangement) => {
    const { paintings } = get();
    let updatedPaintings: Painting[] = [];

    switch (arrangement) {
      case "wall": {
        // Arrange paintings along a wall
        const wallWidth = 10;
        const spacing = wallWidth / (paintings.length + 1);

        updatedPaintings = paintings.map((painting, index) => {
          const x = -wallWidth / 2 + spacing * (index + 1);
          return {
            ...painting,
            position: [x, 1.5, -5],
            rotation: [0, 0, 0],
          };
        });
        break;
      }

      case "circle": {
        // Arrange paintings in a circle
        const radius = 5;
        const angleStep = (2 * Math.PI) / paintings.length;

        updatedPaintings = paintings.map((painting, index) => {
          const angle = index * angleStep;
          const x = radius * Math.sin(angle);
          const z = radius * Math.cos(angle);

          return {
            ...painting,
            position: [x, 1.5, z],
            rotation: [0, -angle + Math.PI, 0], // Face toward center
          };
        });
        break;
      }

      case "custom":
      default:
        // Keep current positions
        updatedPaintings = [...paintings];
        break;
    }

    set({ paintings: updatedPaintings });
  },
}));
