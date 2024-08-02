import { create } from "zustand";
import { VideoDetails } from "@/types.ts";

export type VideoHistory = {
    video: VideoDetails,
    progress: number
}

interface HistoryState {
    history: VideoHistory[]
    addVideo: (video: VideoDetails) => void,
    updateProgress: (videoId: string, progress: number) => void

}

export const useHistoryStore = create<HistoryState>((set) => ({
    history: [],
    addVideo: (video) => set((state) => ({history: [...state.history, {video, progress: 0}]})),
    updateProgress: (videoId, progress) => {
        set(state => {
            const new_history = [...state.history]
            const index = new_history.findIndex(f => f.video.videoId === videoId)
            const hist = new_history[index]
            new_history[index] = {...hist, progress}
            return {
                history: new_history
            }
        })
    }
}))
