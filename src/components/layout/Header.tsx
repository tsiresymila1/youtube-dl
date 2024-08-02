import { AppBar, Badge, IconButton, InputAdornment, Stack, TextField, Toolbar } from '@mui/material'

import {FolderTwoTone, Menu as MenuIcon, Search } from '@mui/icons-material'
import { useDrawerContext } from '@/components/layout/DrawerProvider'
import { drawerWidth } from './Sidebar'
import { useSearchStore } from "@/store/search.ts";
import { debounce } from "lodash-es";
import { useCallback } from "react";
import { dialog } from "@tauri-apps/api";
import { tauriStore } from "@/store/tauri.ts";
import { StorageKey } from "@/types.ts";

export function AppHeader() {
    const {toggleDrawer, isMobile} = useDrawerContext()
    const {search} = useSearchStore()

    const debouncedSearch = useCallback(
        debounce((value) => {
            search(value)
        }, 500), // 500ms debounce delay
        [] // Empty dependency array ensures debounce function is created only once
    );
    const setDownloadDirectory = useCallback(() => {
        dialog.open({
            title: "Choose folder to save download",
            directory: true,
            multiple: false
        }).then(async (dir) => {
            if(dir){
                await tauriStore.set(StorageKey.DOWNLOAD_DIRECTORY, dir)
            }
        })
    },[])
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
                        <IconButton onClick={setDownloadDirectory}>
                            <Badge badgeContent={0} color="primary">
                                <FolderTwoTone color="action"/>
                            </Badge>
                        </IconButton>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}
