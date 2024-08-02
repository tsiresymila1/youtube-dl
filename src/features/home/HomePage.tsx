import { useSearchStore } from "@/store/search.ts";
import { useQuery } from "react-query";
import { searchYoutube } from "@/api/command.ts";
import { Screen } from "@/components/Screen.tsx";
import { Stack } from "@mui/material";
import { MovieItem } from "@/components/MovieItem";
import { Loading } from "@/components/Loading.tsx";
import { GridList } from "@/components/GridList.tsx";
import { GridItem } from "@/components/GridItem.tsx";

export const HomePage = () => {

    const {keyword} = useSearchStore()
    const {data, isFetching} = useQuery({
        queryKey: ["search", keyword],
        queryFn: async () => {
            return await searchYoutube(keyword)
        },
        enabled: keyword != ""
    })
    return <Screen>
        <Stack height="100%" rowGap={5}>
            {isFetching ? <Loading/> : <GridList>
                {(data ?? []).map((movie) => {
                    return (
                        <GridItem
                            key={movie.Video.id}
                        >
                            <MovieItem key={`movie-${movie.Video.id}`} movie={movie}/>
                        </GridItem>)
                })}
            </GridList>
            }

        </Stack>
    </Screen>
}
