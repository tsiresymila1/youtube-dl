import { AppBar, Badge, IconButton, InputAdornment, Stack, TextField, Toolbar } from '@mui/material'

import { DarkMode, LightMode, LinkOutlined, Menu as MenuIcon, Refresh, Search } from '@mui/icons-material'
import { useDrawerContext } from '@/components/layout/DrawerProvider'
import { drawerWidth } from './Sidebar'
import { useSearchStore } from "@/store/search.ts";
import { debounce } from "lodash-es";
import { useCallback } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { DownloadLinkDialogModal } from "@/components/modal/DownloadLinkModal.tsx";
import { useModeStore } from "@/store/mode.ts";
import { useLocation, useNavigate } from "react-router";

export function AppHeader() {
    const {toggleDrawer, isMobile} = useDrawerContext()
    const {search} = useSearchStore()
    const {mode, toggleMode} = useModeStore()
    const location = useLocation()
    const navigate = useNavigate()

    const debouncedSearch = useCallback(
        debounce((value) => {
            if (value !== "" && location.pathname.endsWith("history")) {
                navigate('/');
            }
            search(value)
        }, 700), // 500ms debounce delay
        [location, navigate] // Empty dependency array ensures debounce function is created only once
    );
    const downloadLink = useCallback(async () => {
        await NiceModal.show(DownloadLinkDialogModal, {})
    }, [])
    return (
        <AppBar
            position="fixed"
            sx={({palette}) => ({
                ...(!isMobile
                    ? {
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                    }
                    : undefined),
                backgroundColor: palette.background.paper,
            })}
            elevation={0}
        >
            <Toolbar>
                <Stack
                    direction="row"
                    px={3}
                    py={1}
                    justifyContent="start"
                    alignItems="center"
                    width="100%"
                    display="flex"
                >
                    <Stack direction="row" display="flex" gap={2} alignItems="center" flex={1}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{mr: 2, display: isMobile ? 'block' : 'none'}}
                        >
                            <MenuIcon color="primary"/>
                        </IconButton>
                        <TextField
                            sx={{
                                px: 2,
                                py: 0
                            }}
                            variant='standard'
                            placeholder="Search"
                            margin="dense"
                            focused
                            fullWidth
                            InputProps={{
                                autoFocus: true,
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="disabled"/>
                                    </InputAdornment>
                                ),
                                disableUnderline: true,
                                sx: {
                                    px: 2,
                                    borderRadius: 1,
                                    py: 1
                                }
                            }}
                            onChange={e => debouncedSearch(e.target.value)}
                        />
                    </Stack>
                    <Stack direction="row" gap={3} alignItems="center">
                        <IconButton onClick={downloadLink}>
                            <Badge badgeContent={0} color="primary">
                                <LinkOutlined color="action"/>
                            </Badge>
                        </IconButton>
                        <IconButton onClick={toggleMode}>
                            <Badge badgeContent={0} color="primary">
                                {mode === "light" ? <LightMode color="action"/> : <DarkMode color="action"/>}
                            </Badge>
                        </IconButton>
                        <IconButton onClick={()=> window.location.reload()}>
                            <Badge badgeContent={0} color="primary">
                                <Refresh/>
                            </Badge>
                        </IconButton>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}
