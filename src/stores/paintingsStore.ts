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
  placeWithBrush: (point: [number, number, number], rotation?: [number, number, number]) => void;
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

  // Place a painting using a brush-like system at the specified point with optional rotation
  placeWithBrush: (point, rotation) => {
    const { paintings, selectedPaintingId } = get();

    if (!selectedPaintingId) return;

    // Find the selected painting
    const paintingIndex = paintings.findIndex((p) => p.id === selectedPaintingId);
    if (paintingIndex === -1) return;

    // Update the painting position and rotation if provided
    const updatedPaintings = [...paintings];
    updatedPaintings[paintingIndex] = {
      ...updatedPaintings[paintingIndex],
      position: point,
      // Use provided rotation or keep existing rotation or default to facing forward
      rotation: rotation || updatedPaintings[paintingIndex].rotation || [0, 0, 0],
    };

    set({ paintings: updatedPaintings });
    console.log(
      `Placed painting at point: [${point}]${rotation ? ` with rotation: [${rotation}]` : ""}`
    );
  },
}));
