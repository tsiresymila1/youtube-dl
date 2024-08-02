import type { Theme } from '@mui/material'
import type React from 'react'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    overlineSmall: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    overlineSmall?: React.CSSProperties
  }
}
export function remToPx(value: any) {
  return Math.round(Number.parseFloat(value) * 16)
}

export function pxToRem(value: number) {
  return `${value / 16}rem`
}
const htmlFontSize = 16
export const typography: Partial<Theme['typography']> = {
  htmlFontSize,
  fontFamily: '\'Public Sans\'',
  h1: {
    fontSize: pxToRem(40),
    lineHeight: 80 / 64,
  },
  h2: {
    fontSize: pxToRem(32),
    lineHeight: 64 / 48,
  },
  h3: {
    fontSize: pxToRem(24),
    lineHeight: 1.5,
  },
  h4: {
    fontSize: pxToRem(20),
    lineHeight: 1.5,
  },
  h5: {
    fontSize: pxToRem(18),
    lineHeight: 1.5,
  },
  h6: {
    fontSize: pxToRem(17),
    lineHeight: 1.5,
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    fontSize: pxToRem(16),
    lineHeight: 1.5,
  },
  body2: {
    fontSize: pxToRem(14),
    lineHeight: 22 / 14,
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  overlineSmall: {
    fontSize: htmlFontSize * 0.625,
    lineHeight: 1.3,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  button: {
    textTransform: 'none',
    fontWeight: '500',
    fontSize: htmlFontSize * 1,
    lineHeight: 24 / 14,
  },
  caption: {
    fontSize: pxToRem(12),
    lineHeight: 1.5,
  },
}
