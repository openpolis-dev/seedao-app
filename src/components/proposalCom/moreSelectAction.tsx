import styled from 'styled-components';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ActionToggle = React.forwardRef<HTMLDivElement, any>(({ children, onClick }, ref) => (
  <ActionButton
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </ActionButton>
));

interface IActionProps {
  options: ISelectItem[];
  handleClickAction: (value: any) => void;
}
export default function MoreSelectAction({ options, handleClickAction }: IActionProps) {
  return (
    <Dropdown>
      <Dropdown.Toggle as={ActionToggle}>...</Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((item) => (
          <Dropdown.Item eventKey={item.value} onClick={() => handleClickAction(item.value)}>
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const ActionButton = styled.div`
  cursor: pointer;
  font-size: 18px;
`;
