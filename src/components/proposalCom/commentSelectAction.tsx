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
  handleEdit: () => void;
  handleDelete: () => void;
}
export default function CommentSelectAction({ handleEdit, handleDelete }: IActionProps) {
  return (
    <Dropdown>
      <Dropdown.Toggle as={ActionToggle} id="dropdown-custom-components">
        ...
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="edit" onClick={handleEdit}>
          Edit
        </Dropdown.Item>
        <Dropdown.Item eventKey="delete" onClick={handleDelete}>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const ActionButton = styled.div`
  cursor: pointer;
  padding: 10px 16px;
  font-size: 18px;
`;
