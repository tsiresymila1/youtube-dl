import { useHistoryStore } from "@/store/history.ts";
import { Screen } from "@/components/Screen.tsx";
import { IconButton, ListItem, ListItemText, Stack } from "@mui/material";
import { GridList } from "@/components/GridList";
import { GridItem } from "@/components/GridItem.tsx";
import { HistoryItem } from "./components/HistoryItem";
import { Backspace } from "@mui/icons-material";
import { useNavigate } from "react-router";

export const HistoryPage = () => {
    const {history} = useHistoryStore()
    const navigate = useNavigate()
    return <Screen>
        <Stack>
            <ListItem secondaryAction={
                <IconButton onClick={() => navigate(-1)}>
                    <Backspace/>
                </IconButton>
            }>
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
                {history.map((e, i) => {
                    return <GridItem key={`${e.video.videoId}-history-grid-${i}`}>
                        <HistoryItem key={`${e.video.videoId}-history`} history={e}/>
                    </GridItem>
                })}
            </GridList>
        </Stack>
    </Screen>
}
