use std::fs;
use std::fs::File;
// #[cfg(target_os = "linux")]
// use std::{fs::metadata};
// #[cfg(target_os = "linux")]
// use fork::{daemon, Fork};
use std::io::Write;
use std::path::{Path, PathBuf};
// use std::process::Command;
use std::string::ToString;

use rusty_ytdl::{DownloadOptions, Video, VideoError, VideoFormat, VideoInfo, VideoOptions, VideoQuality, VideoSearchOptions};
use tauri::{AppHandle, command, Manager, Wry};
use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri::api::process::Command;
use tauri::regex::Regex;
use tauri_plugin_store::{StoreCollection, with_store};

use crate::AppState;
use crate::command::r#struct::{get_ffmpeg_command, stream_with_format};
use crate::serialize::error_serialize::SerializableVideoError;
use crate::serialize::search::SerializableSearchResult;

const APP_EVENT_NAME: &str = "app_event";
const APP_EVENT_MERGING: &str = "merging_state";

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    id: String,
    progress: u64,
    storage: String,
    timestamp: String,
}

#[derive(Clone, serde::Serialize)]
struct AppEventPayload {
    event: String,
    message: String,
    timestamp: String,
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

fn find_available_name(storage: String, old_filename: String) -> PathBuf {
    let path = Path::new(&storage.clone()).join(old_filename.clone());
    if !path.exists() {
        println!("File {:?} not exit.", path);
        return path; // Return original name if it doesn't exist
    }

    let filename = path.file_stem().unwrap().to_str().unwrap();
    let extension  = path.extension().map_or(String::new(), |ext| format!(".{}", ext.to_str().unwrap()));
    let mut counter = 1;
    let mut new_name = format!("{}({}){}",filename,counter,extension);
    println!("File {:?} exit ... creating new name with {}:{}", path, new_name,extension);
    while Path::new(&storage.clone()).join(new_name.clone()).exists() {
        counter += 1;
        new_name = format!("{}({}){}",filename,counter,extension);
    }
    let new_path = Path::new(&storage.clone()).join(new_name.as_str());
    println!("Path name :::{:?}",new_path);
    new_path
}

async fn download_audio(app: AppHandle, download_event_name: String, id: String, format: VideoFormat, download_dir: String, filename: String, timestamp: String) -> Result<(), VideoError> {
    let video_options = VideoOptions {
        filter: VideoSearchOptions::Audio,
        quality: VideoQuality::HighestAudio,
        download_options: DownloadOptions {
            dl_chunk_size: Some(1024 * 1024 * 5_u64),
        },
        ..Default::default()
    };
    let video = Video::new_with_options(&id, video_options).unwrap();
    let path = Path::new(&download_dir).join(format!("{id}_Audio_{timestamp}_{filename}"));
    if !format.has_video {
        let stream = stream_with_format(format).await.unwrap();
        let total = stream.content_length();
        let mut total_downloaded = 0;
        let mut file = File::create(path.clone()).map_err(|e| VideoError::DownloadError(e.to_string())).unwrap();
        while let Some(chunk) = stream.chunk().await.unwrap() {
            total_downloaded += chunk.len();
            let percentage = (total_downloaded as f64 / total.clone() as f64) * 100.0;
            println!("MP3 percentage: {}  => total:{} , downloaded : {}, timestamp : {}", percentage, total, total_downloaded, timestamp.clone());
            app.emit_all(
                &download_event_name,
                ProgressPayload {
                    id: id.clone(),
                    progress: percentage as u64,
                    storage: "".to_string(),
                    timestamp: timestamp.clone(),
                },
            ).unwrap();
            file.write_all(&chunk).unwrap()
        }
        Ok(())
    } else {
        let res = video.download(path.clone()).await;
        println!("Audio downloaded at :: {:?} {}", path.clone(), path.exists());
        res
    }
}

async fn download_video_format(app: AppHandle, download_event_name: String, id: String, format: VideoFormat, download_dir: String, filename: String, timestamp: String) -> Result<(), VideoError> {
    if !format.has_video {
        return Ok(());
    }
    let stream = stream_with_format(format).await.unwrap();
    let total = stream.content_length();
    println!("total size: {}", total);
    let mut total_downloaded = 0;
    let id = id.clone();
    let path = Path::new(&download_dir).join(format!("{id}_Video_{timestamp}_{filename}"));
    println!("Path :: {:?}", path);
    let mut file = File::create(path.clone()).map_err(|e| VideoError::DownloadError(e.to_string())).unwrap();
    while let Some(chunk) = stream.chunk().await.unwrap() {
        total_downloaded += chunk.len();
        let percentage = (total_downloaded as f64 / total.clone() as f64) * 100.0;
        println!("percentage: {}  => total:{} , downloaded : {}, timestamp : {}", percentage, total, total_downloaded, timestamp.clone());
        app.emit_all(
            &download_event_name,
            ProgressPayload {
                id: id.clone(),
                progress: percentage as u64,
                storage: "".to_string(),
                timestamp: timestamp.clone(),
            },
        ).unwrap();
        file.write_all(&chunk).unwrap()
    }
    Ok(())
}

pub async fn merge_video_audio(app: AppHandle, id: String, format: VideoFormat, download_dir: String, filename: String, output_path: PathBuf,timestamp: String) {
    let video_path = Path::new(&download_dir).join(format!("{id}_Video_{timestamp}_{filename}"));
    let audio_path = Path::new(&download_dir).join(format!("{id}_Audio_{timestamp}_{filename}"));
    if format.has_video {
        println!("Merging video and audio at {:?}.",output_path.clone());
        if video_path.exists() && audio_path.exists() {
            let status = Command::new_sidecar("ffmpeg").unwrap()
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
                ]).status();
            match status {
                Ok(e) => {
                    if !e.success() {
                        app.emit_all(
                            APP_EVENT_NAME,
                            AppEventPayload {
                                event: format!("{}", "error"),
                                message: "Error when merging video or audio file.".to_string(),
                                timestamp: timestamp.clone(),
                            },
                        ).unwrap();
                    }
                }
                Err(e) => {
                    println!("Error {}", e.to_string());
                    app.emit_all(
                        APP_EVENT_NAME,
                        AppEventPayload {
                            event: format!("{}", "error"),
                            message: e.to_string(),
                            timestamp: timestamp.clone(),
                        },
                    ).unwrap();
                }
            }
            println!("Removing split video and audio ...");
            fs::remove_file(video_path).unwrap();
            fs::remove_file(audio_path).unwrap();
            drop(output_path);
        } else {
            println!("Video or Audio file not found");
            app.emit_all(
                APP_EVENT_NAME,
                AppEventPayload {
                    event: format!("{}", "error"),
                    message: "Video or Audio file not found ".to_string(),
                    timestamp: timestamp.clone(),
                },
            ).unwrap();
        }
    } else {
        println!("Converting audio to mp3 ...");
        if audio_path.exists() {
            let status = Command::new_sidecar("ffmpeg").unwrap()
                .args(&[
                    "-i", audio_path.to_string_lossy().to_string().as_str(),
                    "-vn",
                    "-f",
                    "mp3",
                    "-ar",
                    "44100",
                    "-ab",
                    "192k",
                    output_path.to_string_lossy().to_string().as_str(),
                ]).status();
            match status {
                Ok(e) => {
                    if !e.success() {
                        app.emit_all(
                            APP_EVENT_NAME,
                            AppEventPayload {
                                event: format!("{}", "error"),
                                message: "Error when converting audio file to mp3.".to_string(),
                                timestamp: timestamp.clone(),
                            },
                        ).unwrap();
                    }
                }
                Err(e) => {
                    println!("Error {}", e.to_string());
                    app.emit_all(
                        APP_EVENT_NAME,
                        AppEventPayload {
                            event: format!("{}", "error"),
                            message: e.to_string(),
                            timestamp: timestamp.clone(),
                        },
                    ).unwrap();
                }
            }
            println!("Removing audio ... {:?}", audio_path.clone());
            fs::remove_file(audio_path).unwrap();
        }
    }
}

#[command]
pub fn check_ffmpeg_installed() -> bool {
    return match get_ffmpeg_command() {
        Ok(_) => {
            true
        }
        Err(_) => {
            false
        }
    };
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
        // let new_path = match metadata(&path).unwrap().is_dir() {
        //     true => path,
        //     false => {
        //         let mut path2 = PathBuf::from(path);
        //         path2.pop();
        //         path2.into_os_string().into_string().unwrap()
        //     }
        // };
        Command::new("xdg-open")
            .args([&path])
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .unwrap();
    }
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

fn remove_special_characters(filename: &str) -> String {
    let re = Regex::new(r"[^a-zA-Z0-9._]+").unwrap();
    let cleaned_filename = re.replace_all(filename, "_");
    cleaned_filename.into_owned()
}

#[command]
pub async fn download_video(id: String, format: u64, filename: String, timestamp: String, app: AppHandle) -> Result<String, ()> {
    println!("id: {}", id);
    let filename = remove_special_characters(filename.as_str());
    println!("filename: {}, timestamp {}", filename, timestamp.clone());
    let origin = Video::new(&id).unwrap();
    let formats = origin.get_info().await.unwrap().formats;
    let download_format = formats.iter().find(|f| f.itag.eq(&format)).unwrap();
    let download_dir = fetch_setting(&app, "downloadDirectory".to_string());
    println!("download_dir: {}", download_dir);
    let download_event_name = format!("download_progress_{}_{}", id.clone(), timestamp.clone());
    println!("Starting  download!");
    let res = tokio::join!(download_audio(
            app.clone(),
            download_event_name.clone(),
            id.clone(),
            download_format.clone(),
            download_dir.clone(),
            filename.clone(),
           timestamp.clone()
        ),
        download_video_format(
            app.clone(),
            download_event_name.clone(),
            id.clone(),
            download_format.clone(),
            download_dir.clone(),
            filename.clone(),
             timestamp.clone()
        )
    );
    match res {
        (Ok(_), Ok(_)) => {
            let output_path = find_available_name(download_dir.clone(), filename.clone());
            app.emit_all(
                &download_event_name,
                ProgressPayload {
                    id: id.clone(),
                    progress: 100u64,
                    storage: output_path.clone().to_string_lossy().to_string(),
                    timestamp: timestamp.clone(),
                },
            ).unwrap();
            merge_video_audio(
                app.clone(),
                id.clone(),
                download_format.clone(),
                download_dir.clone(),
                filename.clone(),
                output_path,
                timestamp.clone(),
            ).await;
            println!("Merged ...{}", timestamp.clone());
            app.emit_all(
                &format!("{}_{}_{}", APP_EVENT_MERGING, id.clone(), timestamp.clone()),
                id.clone(),
            ).unwrap();
            app.emit_all(
                APP_EVENT_NAME,
                AppEventPayload {
                    event: format!("{}", "success"),
                    message: format!("{} downloaded", filename.clone()),
                    timestamp: timestamp.clone(),
                },
            ).unwrap();
        }
        _ => {
            app.emit_all(
                APP_EVENT_NAME,
                AppEventPayload {
                    event: format!("{}", "error"),
                    message: "Failed to download".to_string(),
                    timestamp: timestamp.clone(),
                },
            ).unwrap();
        }
    }
    Ok(download_dir)
}


