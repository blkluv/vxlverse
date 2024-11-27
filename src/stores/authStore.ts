import { create } from "zustand";
import { pb } from "../lib/pocketbase";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: pb.authStore.model,
  isAuthenticated: pb.authStore.isValid,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
