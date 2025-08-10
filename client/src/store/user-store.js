// client/src/store/user-store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUser = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "auth" } // key ใน localStorage
  )
);
