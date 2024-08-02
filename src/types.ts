export interface VideoInfo {
    dashManifestUrl: null;
    hlsManifestUrl:  null;
    formats:         Format[];
    relatedVideos:   RelatedVideo[];
    videoDetails:    VideoDetails;
}

export interface Format {
    itag:             number;
    mimeType:         string;
    bitrate:          number;
    width:            number | null;
    height:           number | null;
    initRange:        Range | null;
    indexRange:       Range | null;
    lastModified:     string;
    contentLength:    string;
    quality:          string;
    fps:              number | null;
    qualityLabel:     null | string;
    projectionType:   ProjectionType;
    averageBitrate:   number;
    highReplication:  boolean | null;
    audioQuality:     null | string;
    colorInfo:        ColorInfo | null;
    approxDurationMs: string;
    audioSampleRate:  null | string;
    audioChannels:    number | null;
    audioBitrate:     null;
    loudnessDb:       number | null;
    url:              string;
    hasVideo:         boolean;
    hasAudio:         boolean;
    isLive:           boolean;
    isHLS:            boolean;
    isDashMPD:        boolean;
}

export interface ColorInfo {
    primaries:               Primaries;
    transferCharacteristics: TransferCharacteristics;
    matrixCoefficients:      MatrixCoefficients;
}

export enum MatrixCoefficients {
    ColorMatrixCoefficientsBt709 = "COLOR_MATRIX_COEFFICIENTS_BT709",
}

export enum Primaries {
    ColorPrimariesBt709 = "COLOR_PRIMARIES_BT709",
}

export enum TransferCharacteristics {
    ColorTransferCharacteristicsBt709 = "COLOR_TRANSFER_CHARACTERISTICS_BT709",
}

export interface Range {
    start: string;
    end:   string;
}

export enum ProjectionType {
    Rectangular = "RECTANGULAR",
}

export interface RelatedVideo {
    id:                 string;
    url:                string;
    title:              string;
    published:          string;
    author:             Author;
    shortViewCountText: string;
    viewCount:          string;
    lengthSeconds:      string;
    thumbnails:         Thumbnail[];
    is_live:            boolean;
}

export interface Author {
    id:                 string;
    name:               string;
    user:               string;
    channelUrl:         string;
    externalChannelUrl: string;
    userUrl:            string;
    thumbnails:         Thumbnail[];
    verified:           boolean;
    subscriberCount:    number;
}

export interface Thumbnail {
    width:  number;
    height: number;
    url:    string;
}

export interface VideoDetails {
    author:             Author;
    likes:              number;
    dislikes:           number;
    ageRestricted:      boolean;
    videoUrl:           string;
    storyboards:        Storyboard[];
    chapters:           Chapter[];
    embed:              Embed;
    title:              string;
    description:        string;
    lengthSeconds:      string;
    ownerProfileUrl:    string;
    externalChannelId:  string;
    isFamilySafe:       boolean;
    availableCountries: string[];
    isUnlisted:         boolean;
    hasYpcMetadata:     boolean;
    viewCount:          string;
    category:           string;
    publishDate:        Date;
    ownerChannelName:   string;
    uploadDate:         Date;
    videoId:            string;
    keywords:           string[];
    channel_id:         string;
    isOwnerViewing:     boolean;
    isCrawlable:        boolean;
    allowRatings:       boolean;
    isPrivate:          boolean;
    isUnpluggedCropus:  boolean;
    isLiveContent:      boolean;
    thumbnails:         Thumbnail[];
}

export interface Chapter {
    title:     string;
    startTime: number;
}

export interface Embed {
    flashSecureUrl: string;
    flashUrl:       string;
    iframeUrl:      string;
    height:         number;
    width:          number;
}

export interface Storyboard {
    templateUrl:     string;
    thumbnailWidth:  number;
    thumbnailHeight: number;
    thumbnailCount:  number;
    interval:        number;
    columns:         number;
    rows:            number;
    storyboardCount: number;
}

export enum Event {
    DOWNLOAD_PROGRESS = 'download_progress_',
}

export interface DownloadProgressEvent {
    id: string;
    progress: number;
}

export const enum StorageKey {
    DOWNLOAD_DIRECTORY = 'downloadDirectory',
    VIDEO_QUALITY = 'videoQuality',
}

export type Settings = {
    downloadDirectory: string
    videoQuality: string
}
