import styled from 'styled-components';
import Select from 'react-select';

export default function SeeSelect(props: any) {
  const { width, NotClear } = props;
  return (
    <SelectStyle
      className="react-select-container"
      classNamePrefix="react-select"
      width={width}
      theme={(theme: any) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'var(--bs-menu-hover)',
          primary: 'var(--bs-menu-hover)',
          neutral0: 'var(--bs-background)',
        },
      })}
      styles={{
        control: (baseStyles: any, state: any) => ({
          ...baseStyles,
          fontSize: '14px',
          backgroundColor: 'var(--bs-background)',
          borderColor: state.isFocused ? 'var(--bs-border-color-focus)' : 'var(--bs-border-color)',
        }),
      }}
      isClearable={!NotClear}
      {...props}
    />
  );
}

const SelectStyle = styled<any>(Select)`
  //min-width: 185px;
  min-width: ${(props) => (props.width ? props.width : '185px')};
  .react-select__input,
  .react-select__single-value {
    color: var(--bs-body-color_active) !important;
  }
  .react-select__menu,
  .react-select__option--is-selected {
    font-size: 14px;
    color: var(--bs-body-color_active) !important;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__indicator svg path {
    fill: var(--bs-svg-color);
  }
  .react-select__control {
    border-radius: 8px;
  }
`;
