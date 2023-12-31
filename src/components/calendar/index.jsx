import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import styled from 'styled-components';
import CopyC from "../../assets/Imgs/dark/copyCalendar.svg";
import CopyCLight from "../../assets/Imgs/light/copyCalendar.svg";

import ArrLft from "../../assets/Imgs/dark/arrLft.svg";
import ArrRht from "../../assets/Imgs/dark/arrRht.svg";

import ArrLftLight from "../../assets/Imgs/light/arrLft.svg";
import ArrRhtLight from "../../assets/Imgs/light/arrRht.svg";


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

    .calendar-header{
        background: var(--push-border);
        .calendar-navigate{
            opacity: 1;
            width: 32px;
            height: 32px;
            overflow: hidden;
            cursor: pointer;
            overflow: hidden;
            position: relative;
        }
        &>div:first-child{
            &::after {
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                content: "";
                width: 32px;
                height: 32px;
                background: url(${props=>props.theme === "true"?ArrLft:ArrLftLight});
            }

        }
        &>div:last-child{
            &::after {
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                content: "";
                width: 32px;
                height: 32px;
                background: url(${props=>props.theme === "true"?ArrRht:ArrRhtLight});
            }
        }
    }
    .event-text{
        padding-top: 0;
        padding-left: 18px;
        color:var(--bs-body-color_active) ;
    
    }
    .event{
        &>div:first-child{
            padding:5px;
            &:hover{
                background: var(--home-right_hover);
            }
        }
    }
    .calendar-footer{
        display: none;
    }
    .calendar-body{
        background: var(--push-border);
    }
    .innerDay{
        color:var(--bs-body-color_active) ;
    }
    .day-name{
        font-family: 'Poppins-SemiBold';
        background: var(--bs-box--background);
        border: 1px solid var(--bs-border-color);
        color: #B0B0B0;
        min-height: 40px;
        height: 40px;
        justify-content: center;
        align-items: center;
        &:first-child{
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-right: 0;
        }
        &:nth-child(2), 
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6)
        {
            border-left: 0;
            border-right: 0;
        }
        
        &:nth-child(7){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            border-left: 0;
        }
    }
    .tooltip{

        &>div>div:first-child{
            top:-36px;
        }
        h2{
            font-size: 16px;
            padding: 9px 14px;
            background: var(--bs-primary);
            color: #Fff;
            border-radius: 8px;
        }
        .display-linebreak{
            color: var(--bs-body-color_active);
            width: 100%;
            white-space: nowrap;
            padding:16px 10px;
            background: var(--bs-background);
            border-bottom: 1px solid var( --bs-border-color);
        }
        .location{
            //border-bottom: 1px solid var( --bs-border-color);;
            padding-bottom: 10px;
            color: var(--bs-body-color_active);
           align-items: flex-start;
            border-bottom: 0;
            &>div:first-child{
                margin-top: 5px;
            }
            
        }
        .description{
            color: var(--bs-body-color_active);
            align-items: flex-start;
            padding-bottom: 20px;
            max-height:250px;
            overflow-y: auto;

            &>div:nth-child(2){
               white-space: pre-wrap;
            }
        }
        .calendarName{
            //border-bottom: 1px solid var( --bs-border-color);
            background: var(--home-right);
            color: var(--bs-body-color_active);
            //margin-top: -13px;
            padding: 10px;
        }
        .calendarName + a{
            text-align: right;
            width: 100%;
            display: inline-block;
            color: var(--bs-body-color_active);
            &::before{
               content: "";
              display: inline-block;
              width: 24px;
              height:24px;
              background-image: url(${props=>props.theme === "true"?CopyC:CopyCLight});
              background-size: cover;
              margin-right:9px;
              margin-bottom: -7px;
            }
            &:hover{
                color: var(--bs-primary);
            }
        }
        //a:hover{
        //    color: var(--bs-primary)
        //}
        
    }
    
`

const API_KEY = "AIzaSyDyZO-Xhx71aD0Rpv8EcwY2N5rsdBWG8hA";
let calendars = [
    {
        calendarId: "seedao.tech@gmail.com",
        color: "#1F9E14",
    },

];

let styles = {
    calendar: {
        borderWidth: "0",
        background:"var(--bs-background)"
    },
    day:{
        display: "flex",
        flexDirection: "column",
        alignItems:"flex-end",
        padding:"7px 0",
        border:"1px solid var(--bs-border-color)",
        background:"var(--bs-background)",
        marginTop:"-1px",
        marginLeft:"-1px",
        minHeight:"120px",
        color: "var(--bs-body-color_active)",
        fontFamily: 'Poppins-SemiBold',
        "&:nth-of-type(7n)":{
            borderRight:"1px solid var(--bs-border-color)"
        }
    },
    today:{
        color:"#fff",
        "&>span":{
            background:"var(--bs-primary)",
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
        top:0,
        width:"10px",
        height:"10px"
    },
    tooltip:{
        width:"560px",
        boxSizing:"border-box",
        padding:"40px 20px 20px",
        background: "var(--bs-background)",
        border: "1px solid var( --bs-border-color)"
    },
};

const language = "EN";

export default function CalendarBox({theme}){
    const { t } = useTranslation();
return (
  <Box theme={JSON.stringify(theme)}>
    <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} language={language} showFooter={false} />
  </Box>
);
}

