import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  html,
  body {
    padding: 0;
    margin: 0;
  }
  * {
    padding: 0;
    margin: 0;
  }

  a{
    text-decoration: none;
  }

  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .table{
    width: 100%;
  }
    th{
      background: #f5f5f5;
      font-weight: bold;
      padding:20px;
      white-space: nowrap;
      &:first-child{
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        padding-left: 30px;
      }
      &:last-child{
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
    td{
      padding: 20px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      vertical-align: middle;
      &:first-child{
        padding-left: 30px;
      }

    }
    tr:hover{
      td{
        background: #f8f8f8;
        cursor: pointer;

      }
    }
  
`;
export default GlobalStyle
