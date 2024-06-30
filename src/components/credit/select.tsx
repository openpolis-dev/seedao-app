import styled from 'styled-components';
import Select from 'react-select';

export default function SeeSelect(props: any) {
  return (
    <SelectStyle
      classNamePrefix="credit-select"
      isSearchable={false}
      theme={(theme: any) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: '#718EBF',
          primary: '#718EBF',
          neutral0: '#fafafa',
        },
      })}
      styles={{
        control: (baseStyles: any, state: any) => ({
          ...baseStyles,
          fontSize: '12px',
          backgroundColor: 'transparent',
          borderColor: '#718ebf',
        }),
        option: (
          styles: any,
          {
            data,
            isDisabled,
            isFocused,
            isSelected,
          }: {
            data: any;
            isDisabled: any;
            isFocused: any;
            isSelected: any;
          },
        ) => {
          return {
            ...styles,
            backgroundColor: isSelected ? '#718EBF' : '#fafafa',
            color: isSelected ? '#343C6A' : '#718EBF',
            fontSize: '12px',
          };
        },
      }}
      isClearable={false}
      {...props}
    />
  );
}

const SelectStyle = styled<any>(Select)`
  width: 150px;
  font-size: 14px;
  &:focus-visible {
    outline: none !important;
  }
  .credit-select__control {
    border-radius: 8px;
    height: 32px !important;
    min-height: unset;
    &:hover {
      border-color: #718ebf !important;
    }
    &.credit-select__control--is-focused {
      box-shadow: none !important;
    }
  }
  .credit-select__value-container {
    /* padding-block: 4px; */
  }
  .credit-select__input,
  .credit-select__single-value {
    color: #718ebf !important;
  }
  .credit-select__placeholder {
    color: rgba(113, 142, 191, 0.54);
  }
  .credit-select__indicator-separator {
    display: none;
  }
  .credit-select__indicator svg path {
    fill: #718ebf;
  }
  .credit-select__indicator.credit-select__dropdown-indicator {
    padding-block: 0;
  }
`;
