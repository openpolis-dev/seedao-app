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
   
  ul, li, dl, dt, dd,p{
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
  .btn{
    border-radius: 0.25rem;
  }
  .btn-primary{
    color:#fff;
    text-transform: uppercase;
    &:hover, &:focus-visible, &:active {
      color:#fff !important;
    }
    &:disabled{
      background-color: rgb(230, 228, 235);
      border-color: transparent;
      color: rgba(143, 155, 179, 0.48);
    }

  }
  .btn-outline-primary {
    text-transform: uppercase;
    background-color: rgba(161, 100, 255, 0.25);
    font-weight: bold;
    &:hover, &:focus-visible, &:active {
      background-color: rgba(161, 100, 255, 0.15) !important;
      color: var(--bs-primary) !important;
    }
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
        background: transparent;
      }
      &.disabled{
        color:rgb(237, 241, 247);
      }
    }
    
  }

  .table {
    th {
      background: transparent;
      color: #6e6893;
      border: 1px solid #d9d5ec;
      border-left: none;
      border-right: none;
      border-radius: 0;
      white-space: nowrap;
      padding: 20px;
    }
    td {
      border-bottom-color: #d9d5ec;
      color: rgb(34, 43, 69);
      font-size: 14px;
      padding: 20px;
    }
    tr:hover td {
      background: #f2f0f9;
    }
  }
  .form-control,.form-select{
    background-color: rgb(247, 249, 252);
  }
  .dateBox{
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    
    color: var(--bs-body-color);
    appearance: none;
    background-color: rgb(247, 249, 252);
    background-clip: padding-box;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .form-control:focus {
    border-color: rgb(161, 100, 255);
    box-shadow: 0 0 0 0.25rem rgba(161, 100, 255, 0.25);
  }
  .form-check-input:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(161, 100, 255, 0.25);
  } 
  .form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(161, 100, 255, 0.25);
  }
`;

export default GlobalStyle;
