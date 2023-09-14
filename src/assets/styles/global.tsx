import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Inter-Regular,-apple-system,BlinkMacSystemFont,
    "Segoe UI",Roboto,"Helvetica Neue",
    Arial,sans-serif,"Apple Color Emoji",
    "Segoe UI Emoji","Segoe UI Symbol";
    padding: 0;
    margin: 0;
  }
   
  ul, li, dl, dt, dd{
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: unset;
    &:hover {
      color: unset;
    }
  }
  .btn{
    white-space: nowrap;
  }
`;

export default GlobalStyle;
