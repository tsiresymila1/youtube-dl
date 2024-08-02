use rusty_ytdl::search::{Channel, Playlist, SearchResult, Video};
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
pub enum SerializableSearchResult {
    Video(Video),
    Playlist(Playlist),
    Channel(Channel),
}

impl From<SearchResult> for SerializableSearchResult {
    fn from(result: SearchResult) -> Self {
        match result {
            SearchResult::Video(video) => SerializableSearchResult::Video(video),
            SearchResult::Playlist(playlist) => SerializableSearchResult::Playlist(playlist),
            SearchResult::Channel(channel) => SerializableSearchResult::Channel(channel),
        }
    }
}
