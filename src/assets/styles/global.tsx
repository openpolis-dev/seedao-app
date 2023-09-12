import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
  }
   
  ul, li, dl, dt, dd{
    list-style: none;
  }

  a {
    text-decoration: none;
    color: unset;
    &:hover {
      color: unset;
    }
  }
`;

export default GlobalStyle;
