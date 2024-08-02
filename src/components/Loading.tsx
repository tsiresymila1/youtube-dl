import { CircularProgress, Stack } from "@mui/material";

export const Loading = () => {
    return <Stack height="-webkit-fill-available" id="test" justifyContent="center" alignItems="center">
        <CircularProgress size={30}/>
    </Stack>
}
