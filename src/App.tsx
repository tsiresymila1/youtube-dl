import { Router } from '@/router'
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/api/client.ts";
import { Loader } from './components/Loader';
import { ToasterApp } from "@/components/Toaster.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, theme } from "@/theme";
import { useModeStore } from "@/store/mode.ts";


export default function App() {
    const {mode} = useModeStore()
    return <ThemeProvider theme={mode == "dark" ? darkTheme : theme}>
        <CssBaseline/>
        <QueryClientProvider client={queryClient}>
            <Router/>
            <Loader/>
            <ToasterApp/>
        </QueryClientProvider>
    </ThemeProvider>


}
