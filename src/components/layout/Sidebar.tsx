import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography
} from '@mui/material'
import { DashboardTwoTone, History } from '@mui/icons-material'
import { CustomNavLink } from '@/components/CustomNavLink'
import logo from '../../assets/youtube.png'

export const drawerWidth = 280

export function Sidebar() {
    return (
        <Box>
            <Toolbar>
                <Stack py={3} alignItems="center"  columnGap={2} flexDirection='row'>
                    <img style={{height: 40}} src={logo} alt="Logo"/>
                    <Typography variant='h4' color='primary' fontWeight={700}>Youtube DL</Typography>
                </Stack>
            </Toolbar>
            <Stack px="4px">
                <List
                    component={Stack}
                >
                    <ListItem
                        key="menu-dashboard"
                        sx={{paddingY: '8px', paddingX: '8px'}}
                        disablePadding
                    >
                        <ListItemButton
                            component={CustomNavLink}
                            to="/"
                            activeclass="Mui-selected"
                        >
                            <ListItemIcon sx={() => ({m: '4px', minWidth: 36})}>
                                <DashboardTwoTone/>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{variant: 'body2'}}
                                primary="Home"
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        key="menu-movies"
                        sx={{paddingY: '8px', paddingX: '8px'}}
                        disablePadding
                    >
                        <ListItemButton
                            component={CustomNavLink}
                            to="/history"
                            activeclass="Mui-selected"
                        >
                            <ListItemIcon sx={() => ({m: '4px', minWidth: 36})}>
                                <History/>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{variant: 'body2'}}
                                primary="History"
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Stack>
        </Box>
    )
}
