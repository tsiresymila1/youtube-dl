use std::path::{Path, PathBuf};
use rusty_ytdl::{DownloadOptions, Video, VideoInfo, VideoOptions, VideoQuality, VideoSearchOptions};
use tauri::{AppHandle, command, Manager, Window, Wry};
use tauri_plugin_store::{StoreCollection, with_store};

use crate::AppState;
use crate::serialize::error_serialize::SerializableVideoError;
use crate::serialize::search::SerializableSearchResult;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[command]
pub async fn get_video_info(url: &str) -> Result<VideoInfo, SerializableVideoError> {
    let video = Video::new(url).unwrap();
    match video.get_info().await {
        Ok(e) => Ok(e),
        Err(e) => Err(e.into()),
    }
}

#[command]
pub async fn search_video(state: tauri::State<'_, AppState>, key: String) -> Result<Vec<SerializableSearchResult>, SerializableVideoError> {
    match state.youtube.search(key, None).await {
        Ok(results) => Ok(results.into_iter().map(SerializableSearchResult::from).collect()),
        Err(e) => Err(e.into()),
    }
}

#[command]
pub async fn suggest_video(state: tauri::State<'_, AppState>, key: String) -> Result<Vec<String>, SerializableVideoError> {
    match state.youtube.suggestion(key, None).await {
        Ok(e) => Ok(e),
        Err(e) => Err(e.into()),
    }
}

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    id: String,
    progress: u64,
}
#[tauri::command]
pub async fn download_video(id: String, filename: String, window: Window, app: AppHandle) {
    println!("id: {}", id);
    println!("filename: {}", filename);

    let download_dir = fetch_setting(&app, "downloadDirectory".to_string());
    println!("download_dir: {}", download_dir);

    let video_quality = fetch_setting(&app, "videoQuality".to_string());
    println!("video_quality: {}", video_quality);

    //select the video quality enum based on the video quality string
    let video_quality_enum = match video_quality.as_str() {
        "Highest" => VideoQuality::Highest,
        "Lowest" => VideoQuality::Lowest,
        _ => VideoQuality::HighestVideo,
    };

    let video_options = VideoOptions {
        quality: video_quality_enum,
        filter: VideoSearchOptions::VideoAudio,
        download_options: DownloadOptions {
            dl_chunk_size: Some(1024 * 1024 * 5_u64),
        },
        ..Default::default()
    };

    let video = Video::new_with_options(&id, video_options).unwrap();
    let stream = video.stream().await.unwrap();
    let total = stream.content_length();

    println!("total size: {}", total);
    let mut total_downloaded = 0;

    while let Some(chunk) = stream.chunk().await.unwrap() {
        let window = window.clone();
        let id = id.clone();
        let download_event_name = format!("download_progress_{}", id);

        total_downloaded += chunk.len();
        let percentage = (total_downloaded as f64 / total as f64) * 100.0;
        println!("percentage: {}", percentage);
        app.emit_all(
            &download_event_name,
            ProgressPayload {
                id,
                progress: percentage as u64,
            },
        ).unwrap();
    }

    let path = Path::new(&download_dir).join(filename);
    video.download(path).await.unwrap();
    println!("download done!");
}


fn fetch_setting(app: &AppHandle, key: String) -> String {
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".settings.dat");
    let store_value = with_store(app.app_handle().to_owned(), stores, path, |store| {
        Ok(store
            .get(key)
            .and_then(|val| val.as_str().map(|s| s.to_string()))
            .unwrap())
    }).unwrap();
    store_value
}
