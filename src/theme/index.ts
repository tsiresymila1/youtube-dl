import { createTheme } from '@mui/material'
import { palette, paletteDark } from './palette'
import * as components from './components'
import { typography } from './typography'

export const theme = createTheme({
  palette,
  components,
  typography: {
    ...typography,
    allVariants: {
      color: palette.text?.primary,
      fontFamily: '"Public Sans"',
      letterSpacing: 0.1,
    },
  },
})

export const darkTheme = createTheme({
  palette: paletteDark,
  components,
  typography: {
    ...typography,
    allVariants: {
      color: paletteDark.text?.primary,
      fontFamily: '"Public Sans"',
      letterSpacing: 0.1,
    },
  },
})
