import type { Palette, Theme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
    }
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }

  interface Palette {
    neutral: Palette['primary']
    primary: Palette['primary']
    bg: string
    bg2: string
    menu: string
  }
}

const greyScale: Palette['grey'] = {
  50: 'rgba(0,39,77,0.03)',
  100: 'rgba(0,39,77,0.06)',
  200: 'rgba(0,43,87,0.12)',
  300: 'rgba(9,38,67,0.18)',
  400: 'rgba(23,41,59,0.3)',
  500: 'rgba(12,29,46,0.45)',
  600: 'rgba(15,28,40,0.56)',
  700: '#61666B',
  800: '#494C50',
  900: '#252628',
  A100: 'rgba(0,39,77,0.06)',
  A200: 'rgba(0,43,87,0.12)',
  A400: 'rgba(23,41,59,0.3)',
  A700: '#61666B',
}
export const palette: Partial<Theme['palette']> = {
  mode: 'light',
  primary: {
    light: 'rgb(142,9,47)',
    main: 'rgb(142,9,47)',
    dark: 'rgb(142,9,47)',
    contrastText: 'FFE2EA',
  },
  neutral: {
    main: greyScale.A100,
    light: greyScale[100],
    dark: greyScale.A200,
    contrastText: greyScale[900],
  },
  background: {
    default: 'rgb(255,255,255)',
    paper: 'rgb(248,248,248)',
  },
  bg: 'rgb(255,255,255)',
  bg2: 'rgb(253,255,253)',
  menu: 'rgb(206,205,205)',
  grey: greyScale,
  text: {
    primary: 'rgb(51,51,51)',
    secondary: 'rgb(57,62,67)',
    disabled: 'rgba(239,241,241,0.55)',
  },
}
