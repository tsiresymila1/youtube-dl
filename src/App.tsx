import { Router } from '@/router'
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/api/client.ts";
import { Loader } from './components/Loader';
import { ToasterApp } from "@/components/Toaster.tsx";
import { ColorModeProvider } from "@/theme/ColorMode.tsx";
import { useState } from "react";
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { darkTheme, theme } from "@/theme";


export default function App() {
    const [mode, setMode] = useState<PaletteMode>("light")
    return <ColorModeProvider toggleColorMode={() => setMode(e => e === "light" ? "dark" : "light")}>
        <ThemeProvider theme={mode == "dark" ? darkTheme : theme}>
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                <Router/>
                <Loader/>
                <ToasterApp/>
            </QueryClientProvider>
        </ThemeProvider>

    </ColorModeProvider>

}
