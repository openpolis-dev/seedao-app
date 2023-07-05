import { createTheme } from '@paljs/theme';
import { DefaultTheme } from 'styled-components';

// color definited by https://paljs.com/ui/themes/cosmic
const colorTheme: Partial<DefaultTheme> = {
  colorPrimary300: '#C9FB30',
  colorPrimary400: '#C9FB30',
  colorPrimary500: '#BFEF2D',
  colorPrimary600: '#A8E100',

  colorPrimaryTransparent100: 'rgba(195, 242, 55, 0.25)',
  colorPrimaryTransparent200: 'rgba(195, 242, 55, 0.15)',
  colorPrimaryTransparent300: 'rgba(195, 242, 55, 0.08)',
  colorPrimaryTransparent400: 'rgba(195, 242, 55, 0.32)',
  colorPrimaryTransparent500: 'rgba(195, 242, 55, 0.4)',
  colorPrimaryTransparent600: 'rgba(195, 242, 55, 0.48)',
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
