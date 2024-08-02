import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { DrawerProvider, useDrawerContext } from './DrawerProvider'
import { AppHeader } from './Header'
import { AppDrawer } from './Drawer'
import { drawerWidth } from './Sidebar'

export function Layout() {
  const { isMobile } = useDrawerContext()
  return (
    <DrawerProvider>
      <Box sx={{ display: 'flex' }}>
        <AppHeader />
        <AppDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: !isMobile ? `calc(100% - ${drawerWidth}px)` : '90%',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </DrawerProvider>
  )
}
