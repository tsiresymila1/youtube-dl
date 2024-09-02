import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware'

import { Format, VideoDetails } from "@/types.ts";

export type VideoHistory = {
    video: VideoDetails,
    progress: number,
    storage: string,
    format: Format,
    merging?: boolean
    failed?: boolean
    timestamp: string
}

interface HistoryState {
    history: VideoHistory[]
    addVideo: (video: VideoDetails, format: Format, timestamp: string) => void,
    updateHistory: (videoId: string,timestamp: string, key: keyof VideoHistory, value: VideoHistory[keyof VideoHistory]) => void
    deleteHistory: (videoId: string,timestamp: string) => void
}

export const useHistoryStore = create(
    persist<HistoryState>((set) => ({
            history: [],
            addVideo: (video, format,timestamp) => set((state) => ({
                history: [...state.history, {video, progress: 0, storage: "", format, timestamp}]
            })),
            updateHistory: (videoId, timestamp,key, value) => {
                set(state => {
                    const new_history = [...state.history]
                    const index = new_history.findIndex(f => f.video.videoId === videoId && f.timestamp === timestamp)
                    const hist = new_history[index]
                    new_history[index] = {...hist, [key]: value}
                    return {
                        history: new_history
                    }
                })
            },
            deleteHistory: (_videoId: string,timestamp) => {
                set(state => ({...state, history: state.history.filter(f => f.timestamp !== timestamp)}))
            }
        }),
        {
            name: 'history-storage',
            storage: createJSONStorage(() => localStorage)
        },
    )
)
