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
  .nav-tabs{
    font-size: 14px;
    .nav-item{
      &:focus-visible{
        border: 0!important;
        outline: none;
      }
    }

    .nav-link{
      text-transform: uppercase;
      color:rgb(143, 155, 179);
      padding:16px 32px;
      transition: none;
      &:focus-within,&:focus,&:focus-visible,&:hover{
        border-color: transparent;
        outline: none;
        box-shadow: none;
      }
      &.active{
        border: 0;
        outline: none;
        color:var(--bs-primary);
        border-bottom: 3px solid var(--bs-primary);
        font-weight: bold;
      }
      &.disabled{
        color:rgb(237, 241, 247);
      }
    }
    
  }
`;

export default GlobalStyle;
