import styled from 'styled-components';
import Select from 'react-select';

export default function SeeSelect(props: any) {
  return (
    <SelectStyle
      className="react-select-container"
      classNamePrefix="react-select"
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
        control: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: '14px',
          backgroundColor: 'var(--bs-background)',
          borderColor: state.isFocused ? 'var(--bs-border-color-focus)' : 'var(--bs-border-color)',
        }),
      }}
      isClearable
      {...props}
    />
  );
}

const SelectStyle = styled(Select)`
  min-width: 185px;
  .react-select__input,
  .react-select__single-value {
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
