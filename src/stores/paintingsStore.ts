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

type BrushMode = "single" | "continuous";
type ArrangementType = "wall" | "circle";

interface PaintingsState {
  paintings: Painting[];
  selectedPaintingId: string | null;
  brushMode: BrushMode;
  rotationLock: boolean;

  // Actions
  addPainting: (imageUrl: string, name: string) => void;
  removePainting: (id: string) => void;
  selectPainting: (id: string | null) => void;
  updatePainting: (id: string, updates: Partial<Omit<Painting, "id">>) => void;
  placeWithBrush: (point: [number, number, number], rotation?: [number, number, number]) => void;
  setBrushMode: (mode: BrushMode) => void;
  toggleRotationLock: () => void;
  arrangePaintings: (arrangement: ArrangementType) => void;
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
  brushMode: "single",
  rotationLock: false,

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
    const { paintings, selectedPaintingId, rotationLock } = get();

    if (!selectedPaintingId) return;

    // Find the selected painting
    const paintingIndex = paintings.findIndex((p) => p.id === selectedPaintingId);
    if (paintingIndex === -1) return;

    // Update the painting position and rotation if provided
    const updatedPaintings = [...paintings];
    updatedPaintings[paintingIndex] = {
      ...updatedPaintings[paintingIndex],
      position: point,
      // Use provided rotation if not locked, otherwise keep existing rotation
      rotation: (!rotationLock && rotation) ||
        updatedPaintings[paintingIndex].rotation || [0, 0, 0],
    };

    set({ paintings: updatedPaintings });
    console.log(
      `Placed painting at point: [${point}]${rotation ? ` with rotation: [${rotation}]` : ""}`
    );
  },

  // Set the brush mode (single or continuous)
  setBrushMode: (mode) => {
    set({ brushMode: mode });
  },

  // Toggle rotation lock for paintings
  toggleRotationLock: () => {
    set((state) => ({ rotationLock: !state.rotationLock }));
  },

  // Arrange paintings in different patterns
  arrangePaintings: (arrangement) => {
    const { paintings } = get();
    if (paintings.length === 0) return;

    const updatedPaintings = [...paintings];

    if (arrangement === "wall") {
      // Arrange in a line along the wall
      const wallX = 8; // Wall width
      const spacing = 1.5; // Space between paintings
      const startX = -wallX / 2;

      updatedPaintings.forEach((painting, index) => {
        painting.position = [startX + index * spacing, 1.5, -5];
        painting.rotation = [0, 0, 0];
      });
    } else if (arrangement === "circle") {
      // Arrange in a circle
      const radius = 5;
      const centerX = 0;
      const centerZ = 0;

      updatedPaintings.forEach((painting, index) => {
        const angle = (index / paintings.length) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle);
        const z = centerZ + radius * Math.sin(angle);

        painting.position = [x, 1.5, z];
        // Make paintings face the center
        const rotationY = Math.atan2(x - centerX, z - centerZ) + Math.PI;
        painting.rotation = [0, rotationY, 0];
      });
    }

    set({ paintings: updatedPaintings });
  },
}));
