import type { Components } from '@mui/material/styles/components'
import type { Theme } from '@mui/material'
import PublicSansRegular from '../fonts/PublicSans-Regular.ttf'
import PublicSansMedium from '../fonts/PublicSans-Medium.ttf'
import PublicSansSemiBold from '../fonts/PublicSans-SemiBold.ttf'
import PublicSansBold from '../fonts/PublicSans-Bold.ttf'

import MontserratRegular from '../fonts/Montserrat-Regular.ttf'
import MontserratMedium from '../fonts/Montserrat-Medium.ttf'
import MontserratSemiBold from '../fonts/Montserrat-SemiBold.ttf'
import MontserratBold from '../fonts/Montserrat-Bold.ttf'

export const MuiCssBaseline: Components<Theme>['MuiCssBaseline'] = {
  styleOverrides: `
        
        @font-face {
          font-family: 'Public Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('PublicSans'), local('PublicSans-Regular'), url(${PublicSansRegular}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Public Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('PublicSans'), local('PublicSans-Medium'), url(${PublicSansMedium}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Public Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 600;
          src: local('PublicSans'), local('PublicSans-SemiBold'), url(${PublicSansSemiBold}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Public Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('PublicSans'), local('PublicSans-Bold'), url(${PublicSansBold}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Montserrat'), local('Montserrat-Regular'), url(${MontserratRegular}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Montserrat'), local('Montserrat-Medium'), url(${MontserratMedium}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 600;
          src: local('Montserrat'), local('Montserrat-SemiBold'), url(${MontserratSemiBold}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('Montserrat'), local('Montserrat-Bold'), url(${MontserratBold}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        html,body,#root{
          min-height:100%;
          height:100%;
          font-family:'Public Sans', sans-serif;
          font-size: 14px;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
        }
      `,
}
