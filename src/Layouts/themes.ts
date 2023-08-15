import { createTheme } from '@paljs/theme';
import { DefaultTheme } from 'styled-components';

// color definited by https://paljs.com/ui/themes/cosmic
const colorTheme: Partial<DefaultTheme> = {
  colorPrimary300: '#a16eff',
  colorPrimary400: '#a16eff',
  colorPrimary500: '#a16eff',
  colorPrimary600: '#a16eff',

  colorPrimaryTransparent100: 'rgba(161, 100, 255, 0.25)',
  colorPrimaryTransparent200: 'rgba(161, 100, 255, 0.15)',
  colorPrimaryTransparent300: 'rgba(161, 100, 255, 0.08)',
  colorPrimaryTransparent400: 'rgba(161, 100, 255, 0.32)',
  colorPrimaryTransparent500: 'rgba(161, 100, 255, 0.4)',
  colorPrimaryTransparent600: 'rgba(161, 100, 255, 0.48)',

  buttonFilledPrimaryDisabledBackgroundColor: '#E6E4EB',
  buttonOutlinePrimaryDisabledBackgroundColor: '#FFFFFF',
  buttonOutlinePrimaryDisabledBorderColor: '#E6E4EB',
  buttonFilledPrimaryFocusBorderColor: '#c68cc1',
  buttonOutlinePrimaryActiveTextColor: '#6761fa',
  buttonOutlinePrimaryTextColor: '#6761fa',
  buttonOutlinePrimaryHoverTextColor: '#6761fa',
  buttonOutlinePrimaryFocusTextColor: '#6761fa',

  checkboxPrimaryBackgroundColor: 'transparent',
  checkboxPrimaryCheckedBackgroundColor: '#6e6893',
  checkboxPrimaryCheckedBorderColor: '#6e6893',
  checkboxPrimaryBorderColor: '#6e6893',
  checkboxPrimaryFocusCheckedBackgroundColor: '#6e6893',
  checkboxPrimaryFocusBorderColor: '#6e6893',
  checkboxPrimaryHoverBorderColor: '#6e6893',
  checkboxPrimaryHoverBackgroundColor: '#6e6893',
  checkboxPrimaryHoverCheckedBackgroundColor: '#6e6893',
  checkboxPrimaryHoverCheckedBorderColor: '#6e6893',
  checkboxPrimaryActiveBackgroundColor: '#6e6893',
  checkboxPrimaryFocusBackgroundColor: '#6e6893',
};

const shared: Partial<DefaultTheme> = {
  sidebarHeaderGap: '2rem',
  fontFamilyPrimary: `Inter-Regular,-apple-system,BlinkMacSystemFont,
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
