import { useHistoryStore, VideoHistory } from "@/store/history.ts";
import { listen } from '@tauri-apps/api/event'

import { Box, Card, CardActionArea, CardContent, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

export type HistoryProps = {
    history: VideoHistory
}
export const HistoryItem = ({history}: HistoryProps) => {
    const {updateProgress} = useHistoryStore()
    useEffect(() => {
        listen<{id: string, progress: number}>(`_${history.video.videoId}`, (event) => {
            updateProgress(event.payload.id, event.payload.progress)
        }).then(() => null)
    }, [])
    return <CardActionArea>
        <Card sx={({breakpoints}) => ({[breakpoints.down('md')]: {}, height: '100%'})} elevation={0}>
            <Stack>
                <CardContent component={Stack} alignItems="start" rowGap={1}>
                    <Typography fontWeight={700} variant="body1" component="div">
                        {history.video.title}
                    </Typography>
                    {history.progress < 100 ? <Box sx={{width: '100%'}}>
                        <LinearProgress variant="determinate" value={history.progress}/>
                    </Box> : null}
                </CardContent>
            </Stack>
        </Card>
    </CardActionArea>
}
