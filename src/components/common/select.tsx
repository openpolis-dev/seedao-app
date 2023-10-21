import styled from 'styled-components';
import Select from 'react-select';

export default function SeeSelect(props: any) {
  return (
    <SelectStyle
      theme={(theme: any) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'rgba(161, 110, 255, 0.1)',
          primary: '#a16eff',
        },
      })}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          fontSize: '14px',
          backgroundColor: 'rgb(247, 249, 252)',
          borderColor: 'rgb(238, 238, 238)',
        }),
      }}
      isClearable
      {...props}
    />
  );
}

const SelectStyle = styled(Select)`
  min-width: 150px;
  background-color: rgb(247, 249, 252);
`;
