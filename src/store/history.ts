import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware'

import { VideoDetails } from "@/types.ts";

export type VideoHistory = {
    video: VideoDetails,
    progress: number,
    storage: string,
    format: number,
    merging?: boolean
    failed?: boolean
}

interface HistoryState {
    history: VideoHistory[]
    addVideo: (video: VideoDetails, format: number) => void,
    updateHistory: (videoId: string, key: keyof VideoHistory, value: VideoHistory[keyof VideoHistory]) => void
    deleteHistory: (videoId: string) => void
}

export const useHistoryStore = create(
    persist<HistoryState>((set) => ({
            history: [],
            addVideo: (video, format) => set((state) => ({
                history: [...state.history, {video, progress: 0, storage: "", format}]
            })),
            updateHistory: (videoId, key, value) => {
                set(state => {
                    const new_history = [...state.history]
                    const index = new_history.findIndex(f => f.video.videoId === videoId)
                    const hist = new_history[index]
                    new_history[index] = {...hist, [key]: value}
                    return {
                        history: new_history
                    }
                })
            },
            deleteHistory: (videoId) => {
                set(state => ({...state, history: state.history.filter(f => f.video.videoId !== videoId)}))
            }
        }),
        {
            name: 'history-storage',
            storage: createJSONStorage(() => sessionStorage)
        },
    )
)
