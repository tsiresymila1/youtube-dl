import { Box, Drawer } from '@mui/material'
import { Sidebar, drawerWidth } from './Sidebar'
import { useDrawerContext } from './DrawerProvider'

export function AppDrawer() {
  const { mobileOpen, isMobile, toggleDrawer } = useDrawerContext()
  return (
    <Box
      component="nav"
      sx={!isMobile ? { width: drawerWidth, flexShrink: 0 } : undefined}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? toggleDrawer : undefined}
        ModalProps={
                    isMobile
                      ? {
                          keepMounted: true,
                        }
                      : undefined
                }
        sx={({ palette }) => ({
          'display': isMobile
            ? { xs: 'block', sm: 'block', md: 'none' }
            : { sm: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            ...(!isMobile
              ? {
                  borderRightStyle: 'dashed',
                  backgroundColor: palette.background.default,
                }
              : { borderRightStyle: 'none' }),
          },
        })}
      >
        <Sidebar />
      </Drawer>
    </Box>
  )
}
