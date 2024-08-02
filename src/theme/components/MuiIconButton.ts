import type { Components } from '@mui/material/styles/components'
import type { Theme } from '@mui/material'

export const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  defaultProps: {
    color: 'secondary',
  },
  styleOverrides: {
    colorSecondary: ({ theme }) => ({
      color: theme.palette.menu,
    }),
  },
}
