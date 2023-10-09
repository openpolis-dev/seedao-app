import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";
import styled from 'styled-components';

const Box = styled.div`
    background: #fff;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
    .calendar-title{
        font-family: 'Jost-ExtraBold';
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
const API_KEY = "AIzaSyALdB9mkCt4WF-qk3wC8127n-s3qhVQdUs";
let calendars = [
    {
        calendarId: "c704ce5098512b0b0d70722e6430af4221e3c9ebc6d1e72aa70b82c80bb6999f@group.calendar.google.com",
        color: "#B241D1",
    },

];

let styles = {
    calendar: {
        borderWidth: "0",
        background:"#fff"
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
    today: css`
    color: var(--bs-primary);
    border: 1px solid var(--bs-primary);
  `,
};

const language = "EN";

export default function CalendarBox(){

return (
    <Box>
        <Calendar
            apiKey={API_KEY}
            calendars={calendars}
            styles={styles}
            language={language}
        />
    </Box>
);
}

