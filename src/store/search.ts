import { create } from "zustand";

interface SearchState {
    keyword: string
    search: (keyword: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
    keyword: "",
    search: (keyword) => set((_) => ({ keyword: keyword })),
}))
