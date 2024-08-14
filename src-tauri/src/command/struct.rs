// use std::process::Command;
use std::time::Duration;

use reqwest_middleware::{ClientBuilder, reqwest};
use reqwest_middleware::reqwest::Client;
use reqwest_retry::RetryTransientMiddleware;
use retry_policies::policies::ExponentialBackoff;
use rusty_ytdl::{VideoError, VideoFormat};
use rusty_ytdl::stream::{LiveStream, LiveStreamOptions, NonLiveStream, NonLiveStreamOptions, Stream};

pub const DEFAULT_DL_CHUNK_SIZE: u64 = 1024 * 1024 * 5_u64;

fn custom_on_request_success(success: &reqwest::Response) -> Option<reqwest_retry::Retryable> {
    let status = success.status();
    if status.is_server_error() || status.is_client_error() {
        Some(reqwest_retry::Retryable::Transient)
    } else if status.is_success() {
        None
    } else {
        Some(reqwest_retry::Retryable::Fatal)
    }
}

pub struct CustomRetryableStrategy;

impl reqwest_retry::RetryableStrategy for CustomRetryableStrategy {
    fn handle(
        &self,
        res: &reqwest_middleware::Result<reqwest::Response>,
    ) -> Option<reqwest_retry::Retryable> {
        match res {
            // retry if 201
            Ok(success) => custom_on_request_success(success),
            Err(error) => reqwest_retry::default_on_request_failure(error),
        }
    }
}

pub async fn stream_with_format(format: VideoFormat) -> Result<Box<dyn Stream + Send + Sync>, VideoError> {
    let client_builder = Client::builder().build().map_err(VideoError::Reqwest)?;
    let max_retries = 3;
    let retry_policy = ExponentialBackoff::builder()
        .retry_bounds(Duration::from_millis(1000), Duration::from_millis(30000))
        .build_with_max_retries(max_retries);
    let client = ClientBuilder::new(client_builder)
        .with(RetryTransientMiddleware::new_with_policy_and_strategy(
            retry_policy,
            CustomRetryableStrategy,
        ))
        .build();
    let link = format.url;
    if link.is_empty() {
        return Err(VideoError::VideoSourceNotFound);
    }
    // Only check for HLS formats for live streams
    if format.is_hls {
        {
            let stream = LiveStream::new(LiveStreamOptions {
                client: Some(client.clone()),
                stream_url: link,
            })?;

            return Ok(Box::new(stream));
        }
    }

    let start = 0;
    let end = start + DEFAULT_DL_CHUNK_SIZE.clone();

    let mut content_length = format
        .content_length
        .unwrap_or("0".to_string())
        .parse::<u64>()
        .unwrap_or(0);

    if content_length == 0 {
        let content_length_response = client
            .get(&link)
            .send()
            .await
            .map_err(VideoError::ReqwestMiddleware)?
            .content_length()
            .ok_or(VideoError::VideoNotFound)?;

        content_length = content_length_response;
    }
    let stream = NonLiveStream::new(NonLiveStreamOptions {
        client: Some(client.clone()),
        link,
        content_length,
        dl_chunk_size: DEFAULT_DL_CHUNK_SIZE,
        start,
        end,
    })?;
    Ok(Box::new(stream))
}

pub fn get_ffmpeg_command() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        return Ok("ffmpeg.exe".to_string());
    }

    #[cfg(any(target_os = "macos", target_os = "linux"))]
    {
        return Ok("ffmpeg".to_string());
    }
}
