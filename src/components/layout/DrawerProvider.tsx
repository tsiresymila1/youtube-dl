import React, { useCallback } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'

interface DrawerContextType {
  mobileOpen: boolean
  toggleDrawer: () => void
  isMobile: boolean
}

const DrawerContext = React.createContext<DrawerContextType>({
  isMobile: false,
  mobileOpen: false,
  toggleDrawer: () => null,
})

export const useDrawerContext = () => React.useContext(DrawerContext)
interface DrawerProviderProps {
  children: React.ReactNode | null
}
export function DrawerProvider({ children }: DrawerProviderProps) {
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen, setMobileOpen])
  return (
    <DrawerContext.Provider
      value={{
        mobileOpen,
        isMobile,
        toggleDrawer: handleDrawerToggle,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}
