// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rusty_ytdl::search::YouTube;

use command::video::{
    get_video_info,
    search_video,
    suggest_video,
    download_video
};

mod command;
mod serialize;

#[derive(Clone)]
struct AppState {
    youtube: YouTube,
}

#[tokio::main]
async fn main() {
    let yt = YouTube::new().unwrap();
    let state = AppState {
        youtube: yt
    };
    tauri::Builder::default()
        .manage(state.clone())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_video_info,
            search_video,
            suggest_video,
            download_video
        ])
        .run(tauri::generate_context!())
        .expect("error while running Youtube dl application");
}
