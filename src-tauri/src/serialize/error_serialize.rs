use rusty_ytdl::{ VideoError};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum SerializableVideoError {
    VideoNotFound,
    VideoSourceNotFound,
    VideoIsPrivate,
    Reqwest(String),
    ReqwestMiddleware(String),
    URLParseError(String),
    BodyCannotParsed,
    FormatNotFound,
    InvalidIPv6Format,
    InvalidIPv6Subnet,
    M3U8ParseError(String),
    IsNotPlaylist(String),
    PlaylistBodyCannotParsed,
    DownloadError(String),
    EncryptionError(String),
    DecryptionError(String),
    HexError(String),
    ChildProcessError(String),
    LiveStreamNotSupported,
    CookieError,
    FFmpeg(String),
    VideoPlayerResponseError(String)
}

impl From<VideoError> for SerializableVideoError {
    fn from(error: VideoError) -> Self {
        match error {
            VideoError::VideoNotFound => SerializableVideoError::VideoNotFound,
            VideoError::VideoSourceNotFound => SerializableVideoError::VideoSourceNotFound,
            VideoError::VideoIsPrivate => SerializableVideoError::VideoIsPrivate,
            VideoError::Reqwest(err) => SerializableVideoError::Reqwest(err.to_string()),
            VideoError::ReqwestMiddleware(err) => SerializableVideoError::ReqwestMiddleware(err.to_string()),
            VideoError::URLParseError(err) => SerializableVideoError::URLParseError(err.to_string()),
            VideoError::BodyCannotParsed => SerializableVideoError::BodyCannotParsed,
            VideoError::FormatNotFound => SerializableVideoError::FormatNotFound,
            VideoError::InvalidIPv6Format => SerializableVideoError::InvalidIPv6Format,
            VideoError::InvalidIPv6Subnet => SerializableVideoError::InvalidIPv6Subnet,
            VideoError::M3U8ParseError(err) => SerializableVideoError::M3U8ParseError(err),
            VideoError::IsNotPlaylist(err) => SerializableVideoError::IsNotPlaylist(err),
            VideoError::PlaylistBodyCannotParsed => SerializableVideoError::PlaylistBodyCannotParsed,
            VideoError::DownloadError(err) => SerializableVideoError::DownloadError(err),
            VideoError::EncryptionError(err) => SerializableVideoError::EncryptionError(err),
            VideoError::DecryptionError(err) => SerializableVideoError::DecryptionError(err),
            VideoError::HexError(err) => SerializableVideoError::HexError(err.to_string()),
            VideoError::ChildProcessError(err) => SerializableVideoError::ChildProcessError(err),
            VideoError::LiveStreamNotSupported => SerializableVideoError::LiveStreamNotSupported,
            VideoError::CookieError => SerializableVideoError::CookieError,
            VideoError::VideoPlayerResponseError(err) => SerializableVideoError::VideoPlayerResponseError(err),
            // #[cfg(feature = "ffmpeg")]
            VideoError::FFmpeg(err) => SerializableVideoError::FFmpeg(err),
        }
    }
}
