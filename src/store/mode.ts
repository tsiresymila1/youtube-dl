import { create } from "zustand";
import { PaletteMode } from "@mui/material";
import { createJSONStorage, persist } from "zustand/middleware";

interface ModeState {
    mode: PaletteMode
    toggleMode: () => void
}

export const useModeStore = create(persist<ModeState>((set) => ({
    mode: "light",
    toggleMode: () => set((old) => ({mode: old.mode === "light" ? "dark" : "light"})),
}), {
    name: 'mode-storage',
    storage: createJSONStorage(() => localStorage)
}))
