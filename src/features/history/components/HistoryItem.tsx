import { useHistoryStore, VideoHistory } from "@/store/history.ts";
import { listen } from '@tauri-apps/api/event'

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    IconButton,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { Check, Delete, Folder, Refresh } from "@mui/icons-material";
import { checkDownload, downloadVideo, openInFolder } from "@/api/command.ts";
import { toast } from "react-hot-toast";

export type HistoryProps = {
    history: VideoHistory
}
export const HistoryItem = ({history}: HistoryProps) => {
    const {updateHistory, deleteHistory} = useHistoryStore()

    const openFolder = useCallback(() => {
        if (history.storage !== "") {
            openInFolder(history.storage).then()
        }

    }, [history])

    const restartVideo = useCallback(async () => {
        try {
            const canDownload = await checkDownload()
            if (canDownload) {
                const extension = history.format!.mimeType.split(";").shift()?.split('/').pop() ?? 'mp4'
                const promise = downloadVideo(history.video.videoId, history.format!.itag, `${history.video.title}.${extension}`)
                await toast.promise(promise, {
                    loading: `Downloading "${history.video.title}"`,
                    error: `Error downloading "${history.video.title}"`,
                    success: "Download success"
                }, {
                    position: "bottom-right"
                })
            } else {
                toast.error("FFMPEG not installed. Please install it.", {position: "bottom-right"});
            }
        } catch (e) {
            toast.error("Error when downloading video.", {position: "bottom-right"});
        }

    }, [history])

    useEffect(() => {
        listen<{
            id: string,
            progress: number,
            storage: string
        }>(`download_progress_${history.video.videoId}`, (event) => {
            if (event.payload.progress >= 100) {
                updateHistory(event.payload.id, "merging", true)
                updateHistory(event.payload.id, "storage", event.payload.storage)
            }
            updateHistory(event.payload.id, "progress", event.payload.progress)
        }).then(() => null)
        listen<string>(`merging_state_${history.video.videoId}`, (_) => {
            updateHistory(history.video.videoId, "merging", false)
        }).then(() => null)
    }, [])
    return <CardActionArea>
        <Card sx={({breakpoints}) => ({[breakpoints.down('md')]: {}, height: '100%'})} elevation={0}>
            <Stack>
                <CardContent component={Stack} alignItems="start" rowGap={1}>
                    <Typography fontWeight={700} variant="body1" component="div">
                        {history.video.title}
                    </Typography>
                </CardContent>
                <CardActions>
                    {history.progress < 100 || history.merging ?
                        <Stack width="100%">
                            <LinearProgress
                                variant={
                                    history.progress === 0 || history.merging ? "indeterminate" : "determinate"
                                }
                                value={history.progress}
                            />
                            {history.merging ?
                                <Typography variant="body1">
                                    Merging ....
                                </Typography> :
                                <Typography variant="body1">
                                    {history.progress} %
                                </Typography>}
                            {!history.merging ?
                                <Stack direction="row" justifyContent="space-between" rowGap={1}>
                                    <IconButton onClick={restartVideo}>
                                        <Refresh color="primary"/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteHistory(history.video.videoId)}>
                                        <Delete color="error"/>
                                    </IconButton>
                                </Stack> : null}
                        </Stack> :
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <Stack direction="row">
                                <IconButton onClick={openFolder}>
                                    <Folder/>
                                </IconButton>
                                <IconButton onClick={() => deleteHistory(history.video.videoId)}>
                                    <Delete color="error"/>
                                </IconButton>
                            </Stack>
                            <Check color="success"/>
                        </Stack>}

                </CardActions>
            </Stack>
        </Card>
    </CardActionArea>
}
