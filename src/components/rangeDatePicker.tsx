import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled, { css } from 'styled-components';

const Box = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 34px;
    .borderLess {
      width: 100%;
      height: 34px;
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
      background-color: ${theme.colorPrimary500} !important;
      color: #fff !important;
    }

    .react-datepicker__day--keyboard-selected,
    .react-datepicker__month-text--keyboard-selected,
    .react-datepicker__quarter-text--keyboard-selected,
    .react-datepicker__year-text--keyboard-selected {
      background-color: ${theme.colorPrimary500} !important;
      color: #fff;
    }

    .react-datepicker__day:hover,
    .react-datepicker__month-text:hover,
    .react-datepicker__quarter-text:hover,
    .react-datepicker__year-text:hover {
      color: #0c0d0d;
      background-color: ${theme.colorPrimary500} !important;
    }
    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list
      li.react-datepicker__time-list-item:hover {
      color: #0c0d0d;
      background-color: ${theme.colorPrimary500} !important;
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
    .react-datepicker__input-container input.borderLess {
      font-size: 1rem;
      background: transparent;
    }
  `}
`;
interface DateProps {
  placeholder: string;
  startDate?: Date;
  endDate?: Date;
  onChange: (a: any, b: string | undefined) => void;
  type?: string;
}

export default function RangeDatePickerStyle(props: DateProps) {
  const { placeholder, type, startDate, endDate, onChange } = props;
  const MyDate = DatePicker as any;

  const onChangeRange = (v: Date[] | null) => {
    onChange && onChange(v, type);
  };

  return (
    <Box>
      <MyDate
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={onChangeRange}
        isClearable={true}
        className="borderLess"
        placeholderText={placeholder}
      />
    </Box>
  );
}
