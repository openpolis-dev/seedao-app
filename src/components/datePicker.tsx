import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  .borderLess {
    width: 100%;
    border: 0;
    font-weight: 400;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }

  .react-datepicker {
    font-size: 14px;
    background-color: #fff;
    display: inline-block;
    position: relative;
    border: 1px solid #eee;
    border-radius: 6px;
  }
  .react-datepicker__header {
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
  }

  .react-datepicker__today-button {
    background: rgba(255, 255, 255, 0.05);
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-family: 'Barlow-Bold';
    color: #000;
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: #333;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range,
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: #a16eff !important;
    color: #fff !important;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: #a16eff !important;
    color: #fff;
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    color: #0c0d0d;
    background-color: #a16eff !important;
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    color: #0c0d0d;
    background-color: #a16eff !important;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: 84px;
  }
  .react-datepicker__time-list {
    background-color: #fff;
    li {
      font-size: 12px;
      line-height: 2.5em;
    }
  }
  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle::after {
    border-top-color: #eee;
  }
  .react-datepicker__time-container .react-datepicker__time {
    background: transparent;
  }
`;
interface DateProps {
  placeholder: string;
  dateTime: Date | null;
  onChange: Function;
  type?: string;
}

export default function DatePickerStyle(props: DateProps) {
  const { placeholder, type, dateTime, onChange } = props;
  const MyDate = DatePicker as any;

  const onChangeTime = (v: Date | null) => {
    onChange && onChange(v, type);
  };

  return (
    <Box>
      <MyDate
        showTimeSelect
        dateFormat="MM/dd/yyyy h:mm aa"
        selected={dateTime}
        onChange={onChangeTime}
        className="borderLess"
        placeholderText={placeholder}
      />
    </Box>
  );
}
