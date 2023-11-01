import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import styled from 'styled-components';
import CopyC from "../../assets/Imgs/dark/copyCalendar.svg";
import CopyCLight from "../../assets/Imgs/light/copyCalendar.svg";

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

    .event-text{
        padding-top: 0;
        padding-left: 14px;
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
        margin-left: 1px;
    }
    .innerDay{
        color:var(--bs-body-color_active) ;
    }
    .day-name{
        font-family: 'Poppins-SemiBold';
        background: var(--home-right);
        border: 0;
        color: #B0B0B0;
        min-height: 40px;
        height: 40px;
        justify-content: center;
        align-items: center;
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
        }
        .calendarName{
            //border-bottom: 1px solid var( --bs-border-color);
            background: var(--home-right);
            color: var(--bs-body-color_active);
            //margin-top: -13px;
            padding: 10px;
        }
        a{
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
        color: "#14FF00",
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
        marginTop:"-1px",
        marginLeft:"-1px",
        minHeight:"120px",
        color: "var(--bs-body-color_active)",
        fontFamily: 'Poppins-SemiBold'
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
        width:"6px",
        height:"6px"
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

