import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { FileDownload, } from "@mui/icons-material";
import { Movie } from "@/api/command.ts";
import ReactPlayer from 'react-player'
import { useNavigate } from "react-router";
import { useCallback } from "react";


export type MoviePaginate = {
    total_items: number,
    total_page: number,
    movies: Movie[],
}

export type MovieItemProps = {
    movie: Movie
    showDetails?: boolean
}

export const MovieItem = ({movie,showDetails = true}: MovieItemProps) => {
    const navigate = useNavigate()

    const viewDetail = useCallback(()=> {
        navigate(`/video/${movie.Video.id}`)
    },[movie, navigate])

    return (
        <CardActionArea onClick={viewDetail}>
            <Card sx={({breakpoints}) => ({[breakpoints.down('md')]: {}, height: '100%'})} elevation={0}>
                <Stack position="relative">
                    <CardMedia
                        component={ReactPlayer}
                        url={movie.Video.url}
                        controls
                        light
                        width='100%'
                        height='300px'
                    />
                    <Box position='absolute' right={3} top={3}>
                        <IconButton onClick={viewDetail} color='primary'>
                            <FileDownload color="error" fontSize="large"/>
                        </IconButton>
                    </Box>
                </Stack>
                <Stack>
                    <CardContent component={Stack} alignItems="start" rowGap={1}>
                        <Typography fontWeight={700} variant="body1" component="div">
                            {movie.Video.title}
                        </Typography>
                        {showDetails ? <>
                            <Typography variant="body2" component="div">
                                {movie.Video.channel?.name} - {movie.Video.duration} - {movie.Video.views} Views
                            </Typography>
                            <Typography  variant="body2" component="div">
                                {movie.Video.description}
                            </Typography>
                        </>: null}
                    </CardContent>
                </Stack>
            </Card>
        </CardActionArea>

    );
};
