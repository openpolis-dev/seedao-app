import { createTheme } from '@paljs/theme';
import { DefaultTheme } from 'styled-components';

// color definited by https://paljs.com/ui/themes/cosmic
const colorTheme: Partial<DefaultTheme> = {
  colorPrimary100: '#faf7ff',
  colorPrimary200: '#ece3ff',
  colorPrimary300: '#d5bfff',
  colorPrimary400: '#b18aff',
  colorPrimary500: '#a16eff',
  colorPrimary600: '#7b51db',
  colorPrimary700: '#5a37b8',
  colorPrimary800: '#3e2494',
  colorPrimary900: '#29157a',

  colorPrimaryTransparent100: 'rgba(161, 110, 255, 0.08)',
  colorPrimaryTransparent200: 'rgba(161, 110, 255, 0.16)',
  colorPrimaryTransparent300: 'rgba(161, 110, 255, 0.24)',
  colorPrimaryTransparent400: 'rgba(161, 110, 255, 0.32)',
  colorPrimaryTransparent500: 'rgba(161, 110, 255, 0.4)',
  colorPrimaryTransparent600: 'rgba(161, 110, 255, 0.48)',
};

const shared: Partial<DefaultTheme> = {
  sidebarHeaderGap: '2rem',
  fontFamilyPrimary: `-apple-system,BlinkMacSystemFont,
          "Segoe UI",Roboto,"Helvetica Neue",
          Arial,sans-serif,"Apple Color Emoji",
          "Segoe UI Emoji","Segoe UI Symbol"`,
};

export default function themeService(theme: DefaultTheme['name'], dir: 'ltr' | 'rtl') {
  switch (theme) {
    case 'dark':
    case 'cosmic':
    case 'corporate':
    default:
      return createTheme(theme, { dir, ...shared, ...colorTheme });
  }
}
