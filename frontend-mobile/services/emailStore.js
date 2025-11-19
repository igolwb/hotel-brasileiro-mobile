import { create } from "zustand";

export const useEmailStore = create((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));