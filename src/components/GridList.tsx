import Grid2 from "@mui/material/Unstable_Grid2";
import { PropsWithChildren } from "react";


export const GridList = ({children}: PropsWithChildren) => {
    return <Grid2
        style={{padding: 0, margin: 0}}
        container
        rowSpacing={2}
        columnSpacing={1}
        justifyContent="start" alignItems='stretch'>
        {children}
    </Grid2>
}
