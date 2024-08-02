import Grid2 from "@mui/material/Unstable_Grid2";
import { PropsWithChildren } from "react";

export const GridItem = ({children}: PropsWithChildren) => {
    return <Grid2
        xs={12}
        component="div"
        sm={6}
        md={6}
        lg={4}
        sx={{display: 'flex'}}
    >
        {children}
    </Grid2>
}
