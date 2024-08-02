import { useHistoryStore } from "@/store/history.ts";
import { Screen } from "@/components/Screen.tsx";
import { ListItem, ListItemText, Stack } from "@mui/material";
import { GridList } from "@/components/GridList";
import { GridItem } from "@/components/GridItem.tsx";
import { HistoryItem } from "./components/HistoryItem";

export const HistoryPage = () => {
    const {history} = useHistoryStore()
    return <Screen>
        <Stack>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={{fontWeight: 700, variant: 'h2'}}
                    primary="Download history"
                    secondaryTypographyProps={{
                        maxWidth: 300,
                        py: 3,
                        component: 'div',
                    }}
                />
            </ListItem>
            <GridList>
                {history.map(e => {
                    return <GridItem key={e.video.videoId}>
                        <HistoryItem history={e} />
                    </GridItem>
                })}
            </GridList>
        </Stack>
    </Screen>
}
