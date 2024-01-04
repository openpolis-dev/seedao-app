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
    <Box>
      <Dropdown>
        <Dropdown.Toggle as={ActionToggle}>...</Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((item) => (
            <Dropdown.Item
              className="lineBtm"
              eventKey={item.value}
              onClick={() => handleClickAction(item.value)}
              key={item.value}
            >
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Box>
  );
}

const ActionButton = styled.div`
  cursor: pointer;
  font-size: 18px;
`;

const Box = styled.div`
  .lineBtm {
    border-bottom: 1px solid var(--proposal-border) !important;
    color: #2f8fff;
    font-size: 14px;
    text-align: center;
    padding: 5px 0;
    &:last-child {
      border-bottom: 0 !important;
    }
    &:active,
    &:hover {
      background: none;
    }
  }
`;
