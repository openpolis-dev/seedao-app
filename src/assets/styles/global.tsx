import { createGlobalStyle } from 'styled-components';
import './font.css';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Inter-Regular",-apple-system,BlinkMacSystemFont,
    "Segoe UI",Roboto,"Helvetica Neue",
    Arial,sans-serif,"Apple Color Emoji",
    "Segoe UI Emoji","Segoe UI Symbol" ;
    padding: 0;
    margin: 0;
  }
  
  body{
    background: #f0f3f8;
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
  .form-select,.btn{
    font-size: 14px;
  }
  .btn-primary{
    color:#fff;
    text-transform: uppercase;

  }
`;

export default GlobalStyle;
