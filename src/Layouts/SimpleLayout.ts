import { createGlobalStyle, css } from 'styled-components';
import GlobalStyle from '@paljs/ui/GlobalStyle';
import { breakpointDown } from '@paljs/ui/breakpoints';

const SimpleLayout = createGlobalStyle`
${({ theme }) => css`
  ${GlobalStyle}

  @font-face {
    font-family: 'Jost-ExtraBold';
    src: url('/fonts/Jost-ExtraBold.ttf');
  }
  @font-face {
    font-family: 'Jost-Bold';
    src: url('/fonts/Jost-Bold.ttf');
  }
  @font-face {
    font-family: 'Jost-SemiBold';
    src: url('/fonts/Jost-SemiBold.ttf');
  }
  @font-face {
    font-family: 'Barlow-Regular';
    src: url('/fonts/Barlow-Regular.ttf');
  }
  html {
    font-size: 16px;
    font-family: 'Barlow-Regular';
  }

  html,
  body {
    padding: 0;
    margin: 0;
  }
  * {
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .table {
    width: 100%;
  }
  th {
    background: #f5f5f5;
    font-weight: bold;
    padding: 20px;
    white-space: nowrap;
    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      padding-left: 30px;
    }
    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  td {
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    vertical-align: middle;
    &:first-child {
      padding-left: 30px;
    }
  }
  tr:hover {
    td {
      background: #f8f8f8;
      cursor: pointer;
    }
  }
  .column.small {
    flex: 0.15 !important;
  }

  .auth-layout {
    .main-content {
      padding: 2.5rem;
      ${breakpointDown('sm')`
        padding: 0;
      `}
    }
  }

  aside.settings-sidebar {
    transition: transform 0.3s ease;
    width: 19rem;
    overflow: hidden;
    transform: translateX(${theme.dir === 'rtl' && '-'}100%);
    &.start {
      transform: translateX(${theme.dir === 'ltr' && '-'}100%);
    }

    &.expanded,
    &.expanded.start {
      transform: translateX(0);
    }

    .scrollable {
      width: 19rem;
      padding: 3.4rem 0.25rem;
    }

    .main-container {
      width: 19rem;
      transition: width 0.3s ease;
      overflow: hidden;

      .scrollable {
        width: 19rem;
      }
    }
  }
  .sidebar-menu .menu-title {
    font-size: 14px !important;
  }

  ${breakpointDown('xs')`
    .main-content {
        padding: 0.75rem !important;
      }
  `}

  .with-margin {
    margin: 0 0.75rem 2rem 0;
  }
  .inline-block {
    display: inline-block;
  }
  .popover-card {
    margin-bottom: 0;
    width: 300px;
    box-shadow: none;
  }
  .btn {
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 500;
    border: 2px solid transparent;
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
  .ck-content {
    min-height: 20rem;
  }
`}
`;
export default SimpleLayout;
