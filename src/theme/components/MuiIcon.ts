import type { Components } from '@mui/material/styles/components'
import type { Theme } from '@mui/material'

export const MuiIcon: Components<Theme>['MuiIcon'] = {
  defaultProps: {
    fontSize: 'small',
    color: 'secondary',
  },
  styleOverrides: {
    colorSecondary: ({ theme }) => ({
      color: theme.palette.primary.light,
    }),
  },
}
