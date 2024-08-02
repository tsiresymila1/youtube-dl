import { invoke } from "@tauri-apps/api"
import { VideoInfo } from "@/types.ts";

export interface Video {
    id: string;
    url: string;
    title: string;
    description: string;
    duration: number;
    durationRaw: string;
    thumbnails?: Thumbnail[];
    channel: Channel;
    uploadedAt: string;
    views: number;
}

export interface Movie {
    Video: Video
}

export interface Channel {
    id: string;
    name: string;
    url: string;
    icon: Thumbnail[];
    verified: boolean;
    subscribers: number;
}

export interface Thumbnail {
    width: number;
    height: number;
    url: string;
}

export const searchYoutube = async (key: String) => {
    return await invoke<Movie[]>("search_video", {key})
}

export const getVideoInfo = async (videoId: String) => {
    return await invoke<VideoInfo>("get_video_info", {url: videoId})
}

export const downloadVideo = async (id: String, quality: String, filename: String) => {
    return await invoke<void>("download_video", {id, quality, filename})
}
