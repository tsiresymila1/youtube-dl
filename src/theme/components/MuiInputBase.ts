import type { Components } from '@mui/material/styles/components'
import type { Theme } from '@mui/material'

export const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  defaultProps: {
    size: 'small',
  },
  styleOverrides: {
    root: ({ theme }) => {
      return {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.neutral.main,
        fontWeight: '500',
      }
    },
  },
}
