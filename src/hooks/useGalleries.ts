import { useState, useEffect } from "react";
import { Object3D } from "three";
const ID = new Object3D().uuid;
// Sample galleries for demo purposes
const sampleGalleries = [
  {
    id: ID,
    title: "Modern Art Collection",
    description: "A collection of contemporary art pieces showcasing modern artistic expressions",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    creator: {
      id: "user1",
      username: "ArtisticSoul",
    },
    paintingCount: 12,
    tags: ["modern", "abstract", "contemporary"],
  },
  {
    id: ID,
    title: "Nature Landscapes",
    description: "Beautiful landscapes capturing the essence of nature in various seasons",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    creator: {
      id: "user2",
      username: "NatureExplorer",
    },
    paintingCount: 8,
    tags: ["nature", "landscape", "seasons"],
  },
  {
    id: ID,
    title: "Portrait Studies",
    description: "A series of portrait studies exploring human emotions and expressions",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    creator: {
      id: "user3",
      username: "PortraitMaster",
    },
    paintingCount: 15,
    tags: ["portrait", "human", "emotion"],
  },
  {
    id: ID,
    title: "Abstract Expressions",
    description: "Bold and vibrant abstract expressions pushing the boundaries of form and color",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    creator: {
      id: "user4",
      username: "ColorExplorer",
    },
    paintingCount: 9,
    tags: ["abstract", "vibrant", "experimental"],
  },
  {
    id: ID,
    title: "Digital Art Showcase",
    description: "Cutting-edge digital art created using various digital techniques and tools",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    creator: {
      id: "user5",
      username: "DigitalArtist",
    },
    paintingCount: 11,
    tags: ["digital", "technology", "modern"],
  },
  {
    id: ID,
    title: "Classical Masterpieces",
    description: "Recreations and studies of classical art masterpieces throughout history",
    thumbnailUrl:
      "https://api.vxlverse.com/api/files/ynhvwvg2jyy6mdv/6b2v99o3632rad6/6115451_md5b6bessb.jpeg?thumb=300x300",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    creator: {
      id: "user1",
      username: "ArtisticSoul",
    },
    paintingCount: 7,
    tags: ["classical", "historical", "masterpiece"],
  },
];

export interface Gallery {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
  creator: {
    id: string;
    username: string;
  };
  paintingCount: number;
  tags: string[];
}

export function useGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchGalleries = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setGalleries(sampleGalleries);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const mutate = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would refresh data from the API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGalleries(sampleGalleries);
    } catch (error) {
      console.error("Error refreshing galleries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { galleries, isLoading, mutate };
}
