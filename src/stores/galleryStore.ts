import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Sample paintings for initial state
const samplePaintings = [
  {
    id: uuidv4(),
    title: "Starry Night",
    description: "A beautiful night sky",
    imageUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date().toISOString(),
    width: 1.5,
    height: 1.2,
  },
  {
    id: uuidv4(),
    title: "Abstract Composition",
    description: "Modern abstract art",
    imageUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date().toISOString(),
    width: 1.5,
    height: 1.5,
  },
  {
    id: uuidv4(),
    title: "Landscape",
    description: "Beautiful mountain landscape",
    imageUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date().toISOString(),
    width: 1.8,
    height: 1.2,
  },
  {
    id: uuidv4(),
    title: "Portrait",
    description: "Portrait study",
    imageUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date().toISOString(),
    width: 1.2,
    height: 1.8,
  },
];

interface Painting {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  width: number;
  height: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

interface GalleryState {
  paintings: Painting[];
  viewMode: "circle" | "wall" | "custom";
  addPainting: (painting: Painting) => void;
  removePainting: (id: string) => void;
  rearrangePaintings: (mode: "circle" | "wall" | "custom") => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  paintings: samplePaintings,
  viewMode: "circle",

  addPainting: (painting) => {
    set((state) => {
      const newPaintings = [...state.paintings, painting];
      return {
        paintings: arrangePaintings(newPaintings, state.viewMode),
      };
    });
  },

  removePainting: (id) => {
    set((state) => {
      const newPaintings = state.paintings.filter((p) => p.id !== id);
      return {
        paintings: arrangePaintings(newPaintings, state.viewMode),
      };
    });
  },

  rearrangePaintings: (mode) => {
    set((state) => ({
      viewMode: mode,
      paintings: arrangePaintings(state.paintings, mode),
    }));
  },
}));

// Helper function to arrange paintings based on view mode
function arrangePaintings(paintings: Painting[], mode: "circle" | "wall" | "custom"): Painting[] {
  switch (mode) {
    case "circle": {
      const radius = 5;
      const angleStep = (2 * Math.PI) / paintings.length;

      return paintings.map((painting, index) => {
        const angle = index * angleStep;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);

        return {
          ...painting,
          position: [x, 1.5, z],
          rotation: [0, -angle + Math.PI, 0],
        };
      });
    }

    case "wall": {
      const wallWidth = 8;
      const spacing = wallWidth / (paintings.length + 1);

      return paintings.map((painting, index) => {
        const x = -wallWidth / 2 + spacing * (index + 1);

        return {
          ...painting,
          position: [x, 1.5, -9.5],
          rotation: [0, 0, 0],
        };
      });
    }

    case "custom":
    default: {
      // Custom arrangement - for now just place them randomly
      return paintings.map((painting) => {
        const x = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        const rotY = Math.random() * Math.PI * 2;

        return {
          ...painting,
          position: [x, 1.5, z],
          rotation: [0, rotY, 0],
        };
      });
    }
  }
}
