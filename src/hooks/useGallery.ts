import useSWR from "swr";
import { pb } from "../lib/pocketbase";

export interface GalleryImage {
  id: string;
  image: string;
  created: string;
  updated: string;
  user: string;
  collectionId: string;
  collectionName: string;
  imageUrl: string;
}

// Fetcher function for SWR
const fetcher = async (): Promise<GalleryImage[]> => {
  try {
    const records = await pb.collection("gallery").getFullList<GalleryImage>({
      sort: "-created",
      expand: "user",
    });

    // Transform the records to include the full image URL
    return records.map((record) => ({
      ...record,
      imageUrl: pb.files.getURL(record, record.image),
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
};

export function useGallery() {
  const { data, error, isLoading, mutate } = useSWR("gallery", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 seconds
  });

  return {
    images: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate, // Function to manually revalidate the data
  };
}

// Hook to fetch a single gallery image by ID
export function useGalleryImage(id: string | null) {
  const fetcher = async () => {
    if (!id) return null;
    try {
      const record = await pb.collection("gallery").getOne(id);
      return {
        ...record,
        imageUrl: pb.files.getURL(record, record.image),
      };
    } catch (error) {
      console.error(`Error fetching gallery image ${id}:`, error);
      throw error;
    }
  };

  const { data, error, isLoading, mutate } = useSWR(id ? `gallery/${id}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    image: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
