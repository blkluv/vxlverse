import useSWR from "swr";
import { pb } from "../lib/pocketbase";
import { GameObject } from "../types";

// Fetch templates from PocketBase
const fetcher = async () => {
  try {
    const response = await pb.collection<Template>("templates").getList(1, 50, {
      sort: "-created",
    });
    console.log("Templates fetched:", response.items);
    return response.items;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};
export type Template = {
  id: string;
  name: string;
  userId: string;
  template: GameObject[];
};

export const useTemplates = () => {
  const {
    data: templates,
    error,
    isLoading,
  } = useSWR<Template[]>("templates", fetcher, {
    onError: (err) => console.error("SWR Error:", err),
    revalidateOnFocus: false,
  });

  return {
    templates,
    error,
    isLoading,
  };
};
