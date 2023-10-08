import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";

const API_KEY = "AIzaSyALdB9mkCt4WF-qk3wC8127n-s3qhVQdUs";
let calendars = [
    {
        calendarId: "c704ce5098512b0b0d70722e6430af4221e3c9ebc6d1e72aa70b82c80bb6999f@group.calendar.google.com",
        color: "#B241D1",
    }, //add a color field to specify the color of a calendar

];

let styles = {
    //you can use object styles (no import required)
    calendar: {
        borderWidth: "3px", //make outer edge of calendar thicker
    },

    //you can also use emotion's string styles
    today: css`
    /* highlight today by making the text red and giving it a red border */
    color: red;
    border: 1px solid red;
  `,
};

const language = "ES";

export default function CalendarBox(){

return (
    <div>
        <Calendar
            apiKey={API_KEY}
            calendars={calendars}
            styles={styles}
            language={language}
        />
    </div>
);
}

