import { createGlobalStyle, css } from 'styled-components';
import './font.css';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins-Regular',-apple-system,BlinkMacSystemFont,
    "Segoe UI",Roboto,"Helvetica Neue",
    Arial,sans-serif,"Apple Color Emoji",
    "Segoe UI Emoji","Segoe UI Symbol" ;
    padding: 0;
    margin: 0;
  }

  w3m-modal{
    position: relative;
    z-index: 9999!important;
  }
  
  body{
    background: var(--bs-background);
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
  textarea{
    resize: none;
  }

  .form-select,.btn{
    font-size: 14px;
    
  }
  .btn-primary{
    color:#fff;
    height: 40px;
    background: var(--bs-primary);
    border-color: var(--bs-primary);
    &:hover, &:focus-visible, &:active {
      color:#fff !important;
      background: var(--bs-primary-hover)!important;
      border-color: var(--bs-primary) !important;
    }
    &:disabled{
      background: var(--bs-primary);
      border-color: transparent;
      opacity: 0.4;
    }

  }
  .btn-outline-primary {
    height: 40px;
    border-color: var(--bs-body-color);
    font-weight: bold;
    color: var(--bs-body-color);
    &:hover, &:focus-visible, &:active {
      background-color: transparent !important;
      color: var(--bs-body-color_active) !important;
      border-color: var(--bs-body-color_active) !important;
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
      background-color: var(--table-header);
      white-space: nowrap;
      padding: 20px 10px;
      color: var(--menu-color);
      font-family: Poppins-SemiBold, Poppins;
      font-size: 14px;
      &.chech-th {
        padding-inline: 10px;
      }
      &:first-child {
        padding-left: 24px !important;
        border-top-left-radius: 16px;
      }
      &:last-child {
        padding-right: 20px !important;
        border-top-right-radius: 16px;
      }
    }
    td {
      font-size: 14px;
      height: 74px;
      padding: 10px;
      box-sizing: border-box;
      color: var(--bs-body-color_a);
      background-color: var(--rht-bg);
    }
    th {
      border-style: none;
    }
    th, td {
      &.center {
        text-align: center;
      }
    }
    tr td {
      &:first-child {
        padding-left: 24px !important;
      }
      &:last-child {
        padding-right: 20px !important;
      }
    }
    tr:hover td {
      background: var(--bs-box--background);
      &:first-child {
        border-radius: 8px;
      }
      &:last-child {
        border-radius: 8px;
      }
    }

    tbody tr {
      border-top: 1px solid var(--table-border);
      &:first-child {
        border-style: none;
      }
      &:hover, &:hover+tr {
        border-style: none;
      }
    }
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
  .form-control {
    color: var(--bs-body-color_active);
    font-size: 14px;
  }
  .form-control:hover {
    border-color: var(--bs-border-color-focus);
  }
  .form-control:focus {
    border-color: var(--bs-primary);
    color: var(--bs-body-color_active);
    box-shadow: 0 0 0 0.25rem rgba(82, 0, 255, .25);
  }
  .form-check-input {
    width: 18px;
    height: 18px;
    border-color: var(--bs-svg-color);
  }
  .form-check-input:focus {
    border-color: var(--bs-primary);
    box-shadow: unset;
  } 
  .form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
  }

  /* svg color */
  .svg-stroke {
    stroke: var(--bs-svg-color) !important;
  }
  .svg-fill {
    fill: var(--bs-svg-color) !important;
  }
  .dropdown-item{
    border-bottom:0!important;
 
  }
  .dropdown-menu-show{
    border:1px solid var(--bs-border-color)!important;
    margin-top: 16px;
  }
`;

export default GlobalStyle;

export const ContainerPadding = css`
  padding: 24px 32px;
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;
