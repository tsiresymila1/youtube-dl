import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { FileDownload, YouTube, } from "@mui/icons-material";
import { getVideoInfo, Movie } from "@/api/command.ts";
import ReactPlayer from 'react-player'
import { useNavigate } from "react-router";
import { SyntheticEvent, useCallback } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { QualityDialogModal } from "@/components/modal/QualityModal.tsx";



export type MovieItemProps = {
    movie: Movie
    showDetails?: boolean
}

export const MovieItem = ({movie,showDetails = true}: MovieItemProps) => {
    const navigate = useNavigate()

    const viewDetail = useCallback(async(e: SyntheticEvent)=> {
        e.stopPropagation();
        navigate(`/video/${movie.Video.id}`)
    },[movie, navigate])

    const downloadVideo = useCallback(async(e: SyntheticEvent)=> {
        e.stopPropagation();
        const data = await getVideoInfo(movie.Video.id)
        await NiceModal.show(QualityDialogModal, {
            info: data,
            timestamp: Date.now().toString()
        })
    },[movie, navigate])

    return (
        <CardActionArea>
            <Card sx={({breakpoints}) => ({[breakpoints.down('md')]: {}, height: '100%'})} elevation={0}>
                <Stack position="relative">
                    <CardActionArea onClick={viewDetail}>
                        <CardMedia
                            component={ReactPlayer}
                            url={movie.Video.url}
                            style={{ borderRadius: "20px"}}
                            controls
                            light
                            playIcon={<YouTube fontSize="large" color="error" />}
                            width='100%'
                            height='200px'
                        />
                    </CardActionArea>
                    <Box position='absolute' right={3} top={3}>
                        <IconButton onClick={downloadVideo} color='primary'>
                            <FileDownload color="success" fontSize="large"/>
                        </IconButton>
                    </Box>
                </Stack>
                <CardActionArea onClick={viewDetail}>
                    <CardContent component={Stack} alignItems="start">
                        <Typography fontWeight={700} variant="body1" component="div">
                            {movie.Video.title} - {(new Date(movie.Video.duration)).toUTCString().match(/(\d\d:\d\d:\d\d)/)?.[0]}
                        </Typography>
                        {showDetails ? <>
                            <Typography variant="body2"  component="div">
                                {movie.Video.channel?.name} - Streamed {movie.Video.uploadedAt}
                            </Typography>
                            <Typography  variant="body2" component="div">
                                {movie.Video.views} views
                            </Typography>
                        </>: null}
                    </CardContent>
                </CardActionArea>
            </Card>
        </CardActionArea>

    );
};
