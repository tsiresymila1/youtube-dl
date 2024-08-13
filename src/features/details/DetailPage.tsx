import { Screen } from "@/components/Screen.tsx";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { getVideoInfo, Video } from "@/api/command.ts";
import ShowMoreText from "react-show-more-text";
import { Card, CardContent, CardMedia, IconButton, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import ReactPlayer from "react-player";
import { Backspace, FileDownload, ThumbDownTwoTone, ThumbUpTwoTone } from "@mui/icons-material";
import { Loading } from "@/components/Loading.tsx";
import { GridList } from "@/components/GridList.tsx";
import { GridItem } from "@/components/GridItem.tsx";
import { MovieItem } from "@/components/MovieItem.tsx";
import { useCallback } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { QualityDialogModal } from "@/components/modal/QualityModal.tsx";

export const DetailPage = () => {
    const params = useParams<{id: string}>()

    const {data, isFetching} = useQuery({
        queryKey: [params.id],
        queryFn: async () => {
            return await getVideoInfo(params.id!)
        },
        enabled: Boolean(params.id),
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true
    })

    const askQuality = useCallback(async () => {
        await NiceModal.show(QualityDialogModal, {
            info: data
        })
    }, [data])

    const navigate = useNavigate()
    return <Screen>

        <Stack height="100%" rowGap={3}>
            <ListItem secondaryAction={<IconButton onClick={
                () => navigate(-1)
            }><Backspace/></IconButton>}>
            </ListItem>
            {isFetching ? <Loading/> :
                <Stack>
                    <Card sx={({breakpoints}) => ({[breakpoints.down('md')]: {height: "100%"}, height: '100%'})}
                          elevation={0}>
                        <Stack position="relative">
                            <CardMedia
                                component={ReactPlayer}
                                url={data?.videoDetails.videoUrl}
                                controls
                                width='100%'
                                height='700px'
                                style={{ borderRadius: "20px", backgroundColor: "black"}}
                                config={{
                                    youtube: {
                                        playerVars: { showinfo: 1 }
                                    }
                                }}
                            />
                        </Stack>
                        <Stack>
                            <Stack display="flex" direction="row" columnGap={2} py={1}>
                                <CardContent flex={1} component={Stack} alignItems="start" rowGap={1}>
                                    <Typography fontWeight={700} variant="h3" component="div">
                                        {data?.videoDetails.title}
                                    </Typography>
                                </CardContent>
                                <Stack px={2} py={1}>
                                    <Stack direction="row" justifyContent="center">
                                        <IconButton color='secondary'>
                                            <ThumbUpTwoTone fontSize="large"/>
                                            <Typography
                                                pl={1}
                                                fontSize={18}
                                                variant="inherit">{data?.videoDetails.likes}</Typography>
                                        </IconButton>
                                        <IconButton color='secondary'>
                                            <ThumbDownTwoTone fontSize="large"/>
                                            <Typography pl={1} fontSize={18}
                                                        variant="inherit">{data?.videoDetails.dislikes}</Typography>
                                        </IconButton>
                                        <IconButton onClick={askQuality} color='primary'>
                                            <FileDownload color="error" fontSize="large"/>
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack display="flex" px={2} pb={2}>
                                <Typography variant="body2" component="div">
                                    <ShowMoreText
                                        lines={2}
                                        more="View more"
                                        less="View less">
                                        {data?.videoDetails.description}
                                    </ShowMoreText>
                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
            }
            <Stack>
                <ListItem>
                    <ListItemText
                        primaryTypographyProps={{fontWeight: 700, variant: 'h2'}}
                        primary="Related videos"
                        secondaryTypographyProps={{
                            maxWidth: 300,
                            py: 3,
                            component: 'div',
                        }}
                    />
                </ListItem>
                <GridList>
                    {data?.relatedVideos.map(r => {
                        return <GridItem>
                            <MovieItem showDetails={false} movie={{Video: r as unknown as Video}}/>
                        </GridItem>
                    })}
                </GridList>
            </Stack>
        </Stack>
    </Screen>
}
