import { createTheme } from '@mui/material'
import { palette } from './palette'
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
