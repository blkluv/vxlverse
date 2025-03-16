import useSWR from "swr";
import { pb } from "../lib/pocketbase";
import { EditorState, useEditorStore } from "../stores/editorStore";

export interface Game {
  id: string;
  gameConf: EditorState;
  name: string;
  description: string;
  thumbnail?: string;
  creator: string;
  players?: number;
  rating?: number;
  lastUpdated?: string;
}

const fetcher = async (id: string) => {
  const records = await pb.collection("games").getOne<Game>(id);
  return records as Game;
};

export function useGame(id: string) {
  localStorage.removeItem("editor-store");
  const { data, error, isLoading, mutate } = useSWR(id, fetcher, {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      useEditorStore.setState((s) => ({
        ...s,
        currentSceneId: data?.gameConf?.scenes[0]?.id ?? "",
        scenes: data?.gameConf?.scenes ?? [],
      }));
    },
  });

  return {
    game: data,
    isLoading,
    isError: error,
    mutate,
  };
}
