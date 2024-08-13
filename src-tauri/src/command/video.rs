use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::string::ToString;

use rusty_ytdl::{DownloadOptions, Video, VideoError, VideoFormat, VideoInfo, VideoOptions, VideoQuality, VideoSearchOptions};
use tauri::{AppHandle, command, Manager, Wry};
use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri_plugin_store::{StoreCollection, with_store};

use crate::AppState;
use crate::command::r#struct::stream_with_format;
use crate::serialize::error_serialize::SerializableVideoError;
use crate::serialize::search::SerializableSearchResult;

const APP_EVENT_NAME: &str = "app_event";

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    id: String,
    progress: u64,
    storage: String,
}

#[derive(Clone, serde::Serialize)]
struct AppEventPayload {
    event: String,
    message: String,
}

fn fetch_setting(app: &AppHandle, key: String) -> String {
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("settings.dat");
    if fs::metadata(path.clone()).is_ok() {
        let store_value = with_store(app.app_handle().to_owned(), stores, path.clone(), |store| {
            Ok(store
                .get(key)
                .and_then(|val| val.as_str().map(|s| s.to_string()))
                .unwrap())
        }).unwrap();
        return store_value;
    }
    if key == "videoQuality".to_string() {
        return "Highest".to_string();
    }
    let folder_path = FileDialogBuilder::new().pick_folder().unwrap();
    folder_path.to_string_lossy().to_string()
}

#[command]
pub fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open")
                .arg(&new_path)
                .spawn()
                .unwrap();
        } else {
            if let Ok(Fork::Child) = daemon(false, false) {
                Command::new("dbus-send")
                    .args(["--session", "--dest=org.freedesktop.FileManager1", "--type=method_call",
                        "/org/freedesktop/FileManager1", "org.freedesktop.FileManager1.ShowItems",
                        format!("array:string:\"file://{path}\"").as_str(), "string:\"\""])
                    .spawn()
                    .unwrap();
            }
        }
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .unwrap();
    }
}


async fn download_audio(id: String, download_dir: String, filename: String) {
    let video_options = VideoOptions {
        filter: VideoSearchOptions::Audio,
        quality: VideoQuality::HighestAudio,
        download_options: DownloadOptions {
            dl_chunk_size: Some(1024 * 1024 * 5_u64),
        },
        ..Default::default()
    };
    let video = Video::new_with_options(&id, video_options).unwrap();
    let path = Path::new(&download_dir).join(format!("{id}_Audio_{filename}"));
    video.download(path).await.unwrap();
}

async fn download_video_format(app: AppHandle, download_event_name: String, id: String, format: VideoFormat, download_dir: String, filename: String) {
    let stream = stream_with_format(format).await.unwrap();
    let total = stream.content_length();
    println!("total size: {}", total);
    let mut total_downloaded = 0;
    let id = id.clone();
    let path = Path::new(&download_dir).join(format!("{id}_Video_{filename}"));
    let mut file = File::create(path).map_err(|e| VideoError::DownloadError(e.to_string())).unwrap();
    while let Some(chunk) = stream.chunk().await.unwrap() {
        total_downloaded += chunk.len();
        let percentage = (total_downloaded as f64 / total.clone() as f64) * 100.0;
        println!("percentage: {}  => total:{} , downloaded : {}", percentage, total, total_downloaded);
        app.emit_all(
            &download_event_name,
            ProgressPayload {
                id: id.clone(),
                progress: percentage as u64,
                storage: "".to_string(),
            },
        ).unwrap();
        file.write_all(&chunk).unwrap()
    }
}

pub async fn merge_video_audio(app: AppHandle, id: String, download_dir: String, filename: String) {
    let video_path = Path::new(&download_dir).join(format!("{id}_Video_{filename}"));
    let audio_path = Path::new(&download_dir).join(format!("{id}_Audio_{filename}"));
    let output_path = Path::new(&download_dir).join(filename);
    if video_path.exists() && audio_path.exists() {
        Command::new("ffmpeg")
            .args(&[
                "-i", video_path.to_string_lossy().to_string().as_str(),
                "-i", audio_path.to_string_lossy().to_string().as_str(),
                "-c:v",
                "copy",
                "-c:a",
                "aac",
                "-strict",
                "experimental",
                "-shortest",
                output_path.to_string_lossy().to_string().as_str(),
            ]).status().unwrap();
        fs::remove_file(video_path).unwrap();
        fs::remove_file(audio_path).unwrap();
    } else {
        println!("Video or Audio file not found ");
        app.emit_all(
            APP_EVENT_NAME,
            AppEventPayload {
                event: format!("{}", "error"),
                message: "Video or Audio file not found ".to_string(),
            },
        ).unwrap();
    }
}

#[command]
pub fn check_ffmpeg_installed() -> bool {
    let output = Command::new("ffmpeg")
        .arg("-version")
        .output();

    return match output {
        Ok(output) => {
            if output.status.success() {
                true
            } else {
                false
            }
        }
        Err(_e) => {
            false
        }
    };
}

#[command]
pub async fn get_video_info(url: &str) -> Result<VideoInfo, SerializableVideoError> {
    let video = Video::new(url);
    match video {
        Ok(v) => {
            match v.get_info().await {
                Ok(e) => Ok(e),
                Err(e) => Err(e.into()),
            }
        }
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

#[command]
pub async fn download_video(id: String, format: u64, filename: String, app: AppHandle) -> Result<String, ()> {
    println!("id: {}", id);
    println!("filename: {}", filename);
    let origin = Video::new(&id).unwrap();
    let formats = origin.get_info().await.unwrap().formats;
    let download_format = formats.iter().find(|f| f.itag.eq(&format)).unwrap();
    let download_dir = fetch_setting(&app, "downloadDirectory".to_string());
    println!("download_dir: {}", download_dir);
    let download_event_name = format!("download_progress_{}", id.clone());
    println!("Starting  download!");
    tokio::join!(download_audio(
            id.clone(),
            download_dir.clone(),
            filename.clone(),
        ),
        download_video_format(
            app.clone(),
            download_event_name.clone(),
            id.clone(),
            download_format.clone(),
            download_dir.clone(),
            filename.clone(),
        )
    );
    merge_video_audio(
        app.clone(),
        id.clone(),
        download_dir.clone(),
        filename.clone(),
    ).await;
    app.emit_all(
        &download_event_name,
        ProgressPayload {
            id,
            progress: 100u64,
            storage: Path::new(&download_dir.clone()).join(filename.clone()).to_string_lossy().to_string(),
        },
    ).unwrap();
    println!("Video merged");
    app.emit_all(
        APP_EVENT_NAME,
        AppEventPayload {
            event: format!("{}", "success"),
            message: format!("{} downloaded", filename.clone()),
        },
    ).unwrap();
    Ok(download_dir)
}


