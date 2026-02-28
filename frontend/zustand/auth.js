import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      setUser: (userData) => set({ isAuthenticated: !!userData, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-store",
    }
  )
);
