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
import { useEffect } from "react";
import { Check, Delete, Folder } from "@mui/icons-material";
import { openInFolder } from "@/api/command.ts";

export type HistoryProps = {
    history: VideoHistory
}
export const HistoryItem = ({history}: HistoryProps) => {
    const {updateHistory, deleteHistory} = useHistoryStore()
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
                        </Stack> :
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <Stack direction="row">
                                <IconButton onClick={() => openInFolder(history.storage)}>
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
