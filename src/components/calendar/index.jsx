import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";
import styled from 'styled-components';

import { useTranslation } from "react-i18next";

const Box = styled.div`
    background: var(--bs-background);
    .calendar-title{
        font-family: 'Poppins-Bold';
        font-size: 24px;
        font-weight: bold;
        color: var( --bs-body-color_active);
        line-height: 32px;

    }
    .calendar-footer{
        display: none;
    }
    .day{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding:7px 5px;
    }
    .tooltip{

        &>div>div:first-child{
            top:-36px;
        }
        h2{
            font-size: 20px;
            padding: 10px;
            background: #f0f3f8;
        }
        .display-linebreak{
            width: 100%;
            white-space: nowrap;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .location{
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .description{
            align-items: flex-start;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        .calendarName{
            border-bottom: 1px solid #eee;
            background: #f0f3f8;
            margin-top: -13px;
            padding: 10px;
        }
        a:hover{
            color: var(--bs-primary)
        }
        
    }
    
`

const API_KEY = "AIzaSyDyZO-Xhx71aD0Rpv8EcwY2N5rsdBWG8hA";
let calendars = [
    {
        calendarId: "seedao.tech@gmail.com",
        color: "#B241D1",
    },

];

let styles = {
    calendar: {
        borderWidth: "0",
        background:"var(--bs-background)"
    },
    today:{
        color:"#f00",
        "&>span":{
            background:"#ff0",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            textAlign:"center",
            borderRadius:32,
            lineHeight:32,
            padding:0,
            width:32,
            height:32
        }
    },
    event:{
        fontSize:"12px"
    },
    eventCircle:{
        top:0
    },
    tooltip:{
        width:"500px",
        padding:"40px 20px 20px",
        background: "#fff",
        boxShadow:"0 5px 10px rgba(0,0,0,0.2)",
        borderWidth: "1px"
    },
};

const language = "EN";

export default function CalendarBox(){
    const { t } = useTranslation();

return (
  <Box>
    <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} language={language} showFooter={false} />
  </Box>
);
}

